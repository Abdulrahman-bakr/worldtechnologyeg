const admin = require('firebase-admin');

// Self-contained function to initialize Firebase Admin SDK and return instances.
// This pattern is more resilient in serverless environments with hot-reloading.
function getFirebaseAdmin() {
  if (typeof getFirebaseAdmin.admin === 'undefined') {
    console.log('Initializing Firebase Admin SDK...');
    try {
      if (!admin.apps.length) {
        // نُفَضِّل الآن استخدام متغيرات البيئة دائماً، ولكننا نعدل أسماء الخصائص
        // إلى camelCase (projectId, clientEmail, privateKey) لأن هذه هي الطريقة الصحيحة
        // التي تتوقعها مكتبة firebase-admin.
        
        const serviceAccountConfig = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // نتأكد من معالجة فواصل الأسطر في المفتاح الخاص
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        };

        // إذا فشل تحميل أي متغير بيئي رئيسي، نعود إلى المسار الآمن: تحميل ملف JSON
        if (!serviceAccountConfig.projectId || !serviceAccountConfig.privateKey || process.env.NODE_ENV === 'development') {
           console.log('Falling back to JSON file for local DEV/Missing ENV VARS...');
           const serviceAccount = require('./firebase-credentials.json');
           admin.initializeApp({
             credential: admin.credential.cert(serviceAccount)
           });
           console.log('Firebase Admin SDK initialized successfully using JSON file.');

        } else {
          // مسار الإنتاج/المتغيرات البيئية
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccountConfig)
          });
          console.log('Firebase Admin SDK initialized successfully using ENV VARS for PROD/Local.');
        }

      } else {
        console.log('Firebase Admin SDK already initialized.');
      }
      getFirebaseAdmin.admin = admin;
      getFirebaseAdmin.db = admin.firestore();
    } catch (error) {
      console.error('Firebase admin initialization error:', error.message);
      console.error('Stack Trace:', error.stack); // أضفنا هذا لمزيد من التفاصيل
      getFirebaseAdmin.admin = null;
      getFirebaseAdmin.db = null;
    }
  }
  return { admin: getFirebaseAdmin.admin, db: getFirebaseAdmin.db };
}


// Helper to remove undefined properties before saving to Firestore
const removeUndefinedProperties = (obj, adminInstance) => {
    // Firestore FieldValue objects (like serverTimestamp, increment, etc.) should be passed through directly
    if (adminInstance && obj instanceof adminInstance.firestore.FieldValue) {
        return obj;
    }
    if (obj instanceof Date || obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(item => removeUndefinedProperties(item, adminInstance)).filter(v => v !== undefined);
    if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (value !== undefined) {
                    newObj[key] = removeUndefinedProperties(value, adminInstance);
                }
            }
        }
        return newObj;
    }
    return obj;
};

// --- Serverless Function Handler ---
module.exports = async function handler(req, res) {
  console.log('--- createOrder function handler started ---');
  const { admin: adminInstance, db } = getFirebaseAdmin();
  
  if (!db || !adminInstance) {
    console.error('CRITICAL: Firestore DB instance is not available. Check Firebase Admin initialization logs.');
    return res.status(500).json({ error: 'Server configuration error.', details: 'Failed to initialize Firebase Admin.' });
  }

  if (req.method !== 'POST') {
    console.log(`[INFO] Method not allowed: ${req.method}`);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log('[INFO] Received POST request to /api/createOrder.');
  
  try {
    const { orderData, clientTotalAmount } = req.body;
    
    if (!orderData || !orderData.userId) {
      console.warn('[VALIDATION] Failed: User not authenticated.');
      return res.status(401).json({ error: 'User not authenticated.' });
    }
    if (!orderData.items || orderData.items.length === 0) {
      console.warn('[VALIDATION] Failed: Cart is empty.');
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    console.log(`[INFO] Starting transaction for order display ID: ${orderData.displayOrderId}`);

    const orderId = await db.runTransaction(async (transaction) => {
      console.log('[TX] Transaction started.');
      
      // 0. Check for existing order ID to prevent duplicates
      const orderRefForCheck = db.collection('orders').doc(orderData.displayOrderId);
      const existingOrderDoc = await transaction.get(orderRefForCheck);
      if (existingOrderDoc.exists) {
        console.warn(`[TX-ABORT] Order with display ID ${orderData.displayOrderId} has already been created.`);
        // Return the existing order ID instead of throwing an error,
        // as the client might be retrying a successful but timed-out request.
        return orderData.displayOrderId;
      }

      // 1. ALL READS FIRST
      console.log('[TX] Starting reads...');
      const productIdsToFetch = [...new Set(orderData.items.filter(item => item && item.productId).map(item => item.productId))];
      const productRefs = productIdsToFetch.map(id => db.collection('products').doc(id));
      const productDocs = productRefs.length > 0 ? await transaction.getAll(...productRefs) : [];
      const productsMap = new Map(productDocs.map(doc => [doc.id, doc.data()]));
      console.log(`[TX] Fetched ${productDocs.length} product documents.`);

      const userRef = db.collection('users').doc(orderData.userId);
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
          console.error(`[TX-ERROR] User not found with ID: ${orderData.userId}`);
          throw new Error('User not found.');
      }
      const userData = userDoc.data();
      console.log(`[TX] Fetched user data for ${orderData.userId}.`);
      
      let couponData = null;
      if (orderData.couponCode) {
        console.log(`[TX] Coupon code found: ${orderData.couponCode}. Querying...`);
        const couponQuery = db.collection('discounts').where('code', '==', orderData.couponCode).limit(1);
        const couponSnapshot = await transaction.get(couponQuery);
        if (!couponSnapshot.empty) {
            couponData = couponSnapshot.docs[0].data();
            console.log('[TX] Coupon data fetched.');
        } else {
            console.log('[TX] Coupon code not found in database.');
        }
      }
      console.log('[TX] All reads completed.');

      // 2. ALL CALCULATIONS
      console.log('[TX] Starting calculations...');
      let serverSubtotalAfterProductDiscounts = 0;
      for (const item of orderData.items) {
        if (!item || (!item.serviceDetails && !item.productId)) continue;

        if (item.serviceDetails) {
            serverSubtotalAfterProductDiscounts += Number(item.price || 0) * item.quantity;
        } else {
            const productData = productsMap.get(item.productId);
            if (!productData) throw new Error(`Product ${item.productId} not found.`);
            const variants = productData.variants || [];
            let price = item.variant 
                ? (variants.find(v => v.colorName === item.variant.colorName)?.discountPrice || variants.find(v => v.colorName === item.variant.colorName)?.price) 
                : (productData.discountPrice || productData.price);
            serverSubtotalAfterProductDiscounts += Number(price || 0) * item.quantity;
        }
      }
      console.log(`[TX] Calculated serverSubtotalAfterProductDiscounts: ${serverSubtotalAfterProductDiscounts}`);

      let serverCouponDiscount = 0;
      if (couponData) {
          const cartValueForCoupon = serverSubtotalAfterProductDiscounts;
          if (!couponData.minPurchase || cartValueForCoupon >= couponData.minPurchase) {
               if (couponData.type === 'percentage') {
                  serverCouponDiscount = (cartValueForCoupon * couponData.value) / 100;
               } else if (couponData.type === 'fixed') {
                  serverCouponDiscount = Math.min(couponData.value, cartValueForCoupon);
               }
               console.log(`[TX] Calculated coupon discount: ${serverCouponDiscount}`);
          } else {
              console.log(`[TX] Coupon not applied, cart value ${cartValueForCoupon} is less than min purchase ${couponData.minPurchase}`);
          }
      }
      
      const subtotalAfterCoupon = serverSubtotalAfterProductDiscounts - serverCouponDiscount;
      
      let serverPointsDiscount = 0;
      let serverPointsToRedeem = 0;
      if (orderData.redeemPoints && (userData.loyaltyPoints || 0) > 0) {
          const maxDiscountFromPoints = Math.floor(userData.loyaltyPoints / 100); 
          serverPointsDiscount = Math.min(maxDiscountFromPoints, subtotalAfterCoupon);
          serverPointsToRedeem = serverPointsDiscount * 100;
          console.log(`[TX] Calculated points discount: ${serverPointsDiscount} (redeeming ${serverPointsToRedeem} points).`);
      }

      const finalAmountBeforeRounding = subtotalAfterCoupon - serverPointsDiscount;
      const serverFinalAmount = Math.round(finalAmountBeforeRounding);
      console.log(`[TX] Final server amount calculated: ${serverFinalAmount} (from ${finalAmountBeforeRounding})`);

      if (Math.abs(serverFinalAmount - clientTotalAmount) > 1.01) {
        console.error(`[TX-ERROR] Price mismatch. Client: ${clientTotalAmount}, Server: ${serverFinalAmount}.`);
        throw new Error(`Price mismatch. Client: ${clientTotalAmount}, Server: ${serverFinalAmount}.`);
      }
      console.log('[TX] Price match confirmed.');

      const serverPointsToEarn = Math.floor(serverFinalAmount);
      console.log(`[TX] Points to earn for this order: ${serverPointsToEarn}`);

      // 3. ALL WRITES
      console.log('[TX] Preparing writes...');
      for (const item of orderData.items) {
        if (item && !item.serviceDetails && item.productId) {
            const productRef = db.collection('products').doc(item.productId);
            const productData = productsMap.get(item.productId);
            if (!productData) continue; 

            if (item.variant) {
                const variants = productData.variants || [];
                const variantIndex = variants.findIndex(v => v.colorName === item.variant.colorName);
                if (variantIndex > -1) {
                    const variant = variants[variantIndex];
                    if (variant.stock < item.quantity) throw new Error(`Insufficient stock for ${item.name} (${variant.colorName}).`);
                    
                    const newVariants = variants.map((v, index) => {
                        if (index === variantIndex) {
                            return { ...v, stock: v.stock - item.quantity };
                        }
                        return v;
                    });
                    
                    console.log(`[TX-WRITE] Updating stock for variant ${variant.colorName} of product ${item.productId}`);
                    transaction.update(productRef, { 
                        variants: newVariants,
                        stock: adminInstance.firestore.FieldValue.increment(-item.quantity)
                    });
                } else {
                    throw new Error(`Variant ${item.variant.colorName} for product ${item.name} not found.`);
                }
            } else {
                if (productData.stock < item.quantity) throw new Error(`Insufficient stock for ${item.name}.`);
                console.log(`[TX-WRITE] Updating stock for product ${item.productId}`);
                transaction.update(productRef, { 
                  stock: adminInstance.firestore.FieldValue.increment(-item.quantity) 
                });
            }
        }
      }
      
      if (serverPointsToRedeem > 0) {
        console.log(`[TX-WRITE] Updating user points by -${serverPointsToRedeem}`);
        transaction.update(userRef, {
            loyaltyPoints: adminInstance.firestore.FieldValue.increment(-serverPointsToRedeem)
        });
      }
      
      const finalOrderData = { ...orderData };
      finalOrderData.totalAmount = serverFinalAmount;
      finalOrderData.couponDiscount = serverCouponDiscount;
      finalOrderData.pointsDiscount = serverPointsDiscount;
      finalOrderData.pointsRedeemed = serverPointsToRedeem; 
      finalOrderData.pointsToEarn = serverPointsToEarn;
      finalOrderData.createdAt = adminInstance.firestore.FieldValue.serverTimestamp();
      finalOrderData.statusHistory = [{ status: orderData.status, timestamp: adminInstance.firestore.Timestamp.now(), updatedBy: 'customer' }];
      delete finalOrderData.clientCreatedAt;
      delete finalOrderData.redeemPoints;
      
      const orderRef = db.collection('orders').doc(finalOrderData.displayOrderId);
      console.log(`[TX-WRITE] Creating order document ${finalOrderData.displayOrderId}`);
      transaction.set(orderRef, removeUndefinedProperties(finalOrderData, adminInstance));
      
      return finalOrderData.displayOrderId;
    });

    console.log(`[INFO] Transaction successful. Created order ID: ${orderId}`);
    res.status(200).json({ success: true, orderId });

  } catch (error) {
    console.error('--- Create order function caught an error ---');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
  }
}