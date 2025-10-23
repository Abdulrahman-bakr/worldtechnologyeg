const admin = require('firebase-admin');

// --- Firebase Admin Initialization ---
// Ensure initialization only happens once.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines for Vercel environment variables
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error.message);
  }
}

const db = admin.firestore();

// Helper to remove undefined properties before saving to Firestore
const removeUndefinedProperties = (obj) => {
    // Firestore FieldValue objects (like serverTimestamp, increment, etc.) should be passed through directly
    // as they have special meaning to the SDK and should not be recursed into.
    if (obj instanceof admin.firestore.FieldValue) {
        return obj;
    }
    if (obj instanceof Date || obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(removeUndefinedProperties).filter(v => v !== undefined);
    if (typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (value !== undefined) {
                    newObj[key] = removeUndefinedProperties(value);
                }
            }
        }
        return newObj;
    }
    return obj;
};

// --- Serverless Function Handler ---
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { orderData, clientTotalAmount } = req.body;
    
    if (!orderData || !orderData.userId) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }
    if (!orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    // Use a Firestore transaction for atomicity (order creation + stock update)
    const orderId = await db.runTransaction(async (transaction) => {
      // 1. Fetch all necessary documents within the transaction
      const productIdsToFetch = [...new Set(orderData.items.filter(item => item.productId).map(item => item.productId))];
      const productRefs = productIdsToFetch.map(id => db.collection('products').doc(id));
      const productDocs = productRefs.length > 0 ? await transaction.getAll(...productRefs) : [];
      
      const userRef = db.collection('users').doc(orderData.userId);
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) throw new Error('User not found.');

      // 2. Validate products, calculate server-side price, and update stock
      let serverSubtotalAfterProductDiscounts = 0;
      const productsMap = new Map(productDocs.map(doc => [doc.id, doc.data()]));

      for (const item of orderData.items) {
        if (item.serviceDetails) {
            serverSubtotalAfterProductDiscounts += Number(item.price) * item.quantity;
        } else {
            const productRef = db.collection('products').doc(item.productId);
            const productData = productsMap.get(item.productId);
            if (!productData) throw new Error(`Product ${item.productId} not found.`);

            let price;
            if (item.variant) {
                const variantIndex = (productData.variants || []).findIndex(v => v.colorName === item.variant.colorName);
                if (variantIndex === -1) throw new Error(`Variant for ${item.productId} not found.`);
                
                const variant = productData.variants[variantIndex];
                price = variant.discountPrice || variant.price;
                
                if (variant.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${item.name}.`);
                }

                const newVariants = [...productData.variants];
                newVariants[variantIndex].stock -= item.quantity;
                transaction.update(productRef, { 
                  variants: newVariants,
                  stock: admin.firestore.FieldValue.increment(-item.quantity)
                });
            } else {
                price = productData.discountPrice || productData.price;
                if (productData.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${item.name}.`);
                }
                transaction.update(productRef, { 
                  stock: admin.firestore.FieldValue.increment(-item.quantity) 
                });
            }
            serverSubtotalAfterProductDiscounts += Number(price || 0) * item.quantity;
        }
      }

      // 3. Calculate server-side discounts and final total
      let serverCouponDiscount = 0;
      if (orderData.couponCode) {
        const couponQuery = await db.collection('discounts').where('code', '==', orderData.couponCode).limit(1).get();
        if (!couponQuery.empty) {
            const couponData = couponQuery.docs[0].data();
            const cartValueForCoupon = serverSubtotalAfterProductDiscounts;
            if (!couponData.minPurchase || cartValueForCoupon >= couponData.minPurchase) {
                 if (couponData.type === 'percentage') {
                    serverCouponDiscount = (cartValueForCoupon * couponData.value) / 100;
                 } else if (couponData.type === 'fixed') {
                    serverCouponDiscount = Math.min(couponData.value, cartValueForCoupon);
                 }
            }
        }
      }
      
      const subtotalAfterCoupon = serverSubtotalAfterProductDiscounts - serverCouponDiscount;
      const serverPointsDiscount = Math.min(orderData.pointsDiscount || 0, subtotalAfterCoupon);
      
      const finalAmountBeforeRounding = subtotalAfterCoupon - serverPointsDiscount;
      const serverFinalAmount = Math.round(finalAmountBeforeRounding);

      if (Math.abs(serverFinalAmount - clientTotalAmount) > 1.01) {
        throw new Error(`Price mismatch. Client: ${clientTotalAmount}, Server: ${serverFinalAmount}.`);
      }

      // 4. Securely calculate points to earn
      const serverPointsToEarn = Math.floor(serverFinalAmount);

      // 5. Prepare and set the order document
      const finalOrderData = { ...orderData };
      finalOrderData.totalAmount = serverFinalAmount;
      finalOrderData.couponDiscount = serverCouponDiscount;
      finalOrderData.pointsDiscount = serverPointsDiscount;
      finalOrderData.pointsToEarn = serverPointsToEarn; // Overwrite client value
      finalOrderData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      finalOrderData.statusHistory = [{ status: orderData.status, timestamp: admin.firestore.FieldValue.serverTimestamp(), updatedBy: 'customer' }];
      delete finalOrderData.clientCreatedAt;
      
      const orderRef = db.collection('orders').doc(finalOrderData.displayOrderId);
      transaction.set(orderRef, removeUndefinedProperties(finalOrderData));

      // 6. Update user's loyalty points if redeemed
      if (orderData.pointsRedeemed > 0) {
        transaction.update(userRef, {
            loyaltyPoints: admin.firestore.FieldValue.increment(-orderData.pointsRedeemed)
        });
      }
      
      return finalOrderData.displayOrderId;
    });

    // Transaction successful
    res.status(200).json({ success: true, orderId });

  } catch (error) {
    console.error('Create order serverless function error:', error);
    res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
  }
}