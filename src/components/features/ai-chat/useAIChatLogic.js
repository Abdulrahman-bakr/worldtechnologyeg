

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

export const useAIChatLogic = ({ isOpen, products, categories, recentlyViewedIds }) => {
  const [chat, setChat] = useState(null);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || chat) return;

    const initializeChat = () => {
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

            const productSample = products
                .filter(p => p.arabicName) 
                .slice(0, 25) 
                .map(p => {
                    let details = `- المنتج: ${p.arabicName}`;
                    if (p.brand) details += `, الماركة: ${p.brand}`;
                    
                    if (p.isDynamicElectronicPayments) {
                        details += ` (خدمة إلكترونية)`;
                    } else {
                        details += `, السعر: ${p.discountPrice || p.price} ج.م`;
                    }
                    
                    if (p.description) {
                        const shortDesc = String(p.description).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 70);
                        details += `, وصف: ${shortDesc}...`;
                    }
                    details += ` (ID: ${p.id})`; 
                    return details;
                }).join('\n');
            
            const recentlyViewedProducts = (recentlyViewedIds || [])
                .map(id => products.find(p => p.id === id))
                .filter(Boolean);

            let browsingHistoryContext = '';
            if (recentlyViewedProducts.length > 0) {
                browsingHistoryContext = `\n**User's Recent Browsing History (Suggest items based on this):**\n` +
                    recentlyViewedProducts.map(p => `- ${p.arabicName} (ID: ${p.id})`).join('\n');
            }
            
            const categoryList = categories.filter(c => c.id !== 'All').map(c => c.arabicName).join(', ');

            const systemInstruction = `You are "TechBot", an expert AI assistant for "World Technology", an e-commerce store in Egypt specializing in electronic accessories. Your primary goal is to provide users with deep, detailed, and helpful information to enhance their shopping experience.

**Core Instructions:**
- **Language:** ALWAYS communicate in clear, professional, and friendly Arabic.
- **Tone:** Be helpful, patient, and thorough. Use emojis sparingly to add a friendly touch ✨.
- **Product Knowledge:** When asked about a product, use the detailed context provided. Mention its name, brand, price, and summarize its description. Go beyond just listing facts; explain the benefits if possible.
- **Personalized Recommendations:** Use the user's browsing history to offer relevant product suggestions. If they've looked at chargers, suggest compatible cables or power banks. If they ask for a recommendation, start with products from their history or similar ones.
- **Vague Queries:** If a user's query is unclear, ask clarifying questions to precisely understand their needs. For example, if they ask for "a charger", ask "What kind of device do you need to charge? Do you need fast charging?".

**Deeper Product & Service Guidance:**
- **Technical Details:** Users often want technical specifics. If you don't have the information in your context, proactively guide them to the right place on the product page. For example, say: "للحصول على كل التفاصيل الفنية الدقيقة مثل الأبعاد أو المواد, يمكنك زيارة صفحة المنتج والاطلاع على قسم 'المواصفات' وقسم 'الميزات'."
- **Service "How-To":** Our store offers digital services. You must be able to explain how to use them.
  - **Mobile Top-up Instructions:** "لشحن رصيد الموبايل, العملية بسيطة. اذهب إلى صفحة الخدمة, أدخل رقم الهاتف المكون من 11 رقمًا, اختر الشبكة (مثل فودافون أو أورانج), ثم حدد مبلغ الشحن المطلوب. ستظهر لك التكلفة النهائية شاملة رسوم الخدمة, وبعدها يمكنك إتمام الشراء."
  - **Game Top-up Instructions:** "لشحن الألعاب, اذهب إلى صفحة اللعبة التي تريدها, اختر الباقة المناسبة من الخيارات المتاحة, ثم أدخل البيانات المطلوبة في النموذج (مثل ID اللاعب أو اسم المستخدم). تأكد من صحة البيانات ثم أكمل عملية الشراء."

**Actions and Boundaries:**
- **Contact Information:** If a user asks for contact details, how to reach customer service, or wants to talk to a human, you MUST provide the following information formatted exactly as shown using Markdown. Make sure the links are fully functional.
  - **Example Response:** "بالتأكيد! يسعدنا مساعدتك. يمكنك التواصل معنا مباشرة عبر الوسائل التالية:\\n\\n*   📞 **الهاتف:** [01026146714](tel:01026146714)\\n*   📧 **البريد الإلكتروني:** [abdobakrmohamed@gmail.com](mailto:abdobakrmohamed@gmail.com)\\n*   ✅ **واتساب:** [https://wa.me/201026146714](https://wa.me/201026146714)\\n\\nنحن في خدمتك!"
- **Guiding Actions:** You cannot perform actions like checkout, view cart, or login. For these, you must guide the user. Example: "لإتمام عملية الشراء, يرجى الضغط على أيقونة عربة التسوق ثم اتباع الخطوات."
- **Data Integrity:** Do NOT invent products, prices, specifications, or features. If you don't have the information, state it clearly and politely. For instance: "لا تتوفر لدي معلومات حول هذه النقطة بالتحديد, لكن يمكنك إيجادها في صفحة المنتج."

**Data Context You Have:**
- **Categories:** The store has the following categories: ${categoryList}.${browsingHistoryContext}
- **Product Samples:** Here is a sample of available products for your reference (Name, Brand, Price, Description, ID):
${productSample}
`;
            
            const initialHistory = [
                {
                    role: 'user',
                    parts: [{ text: "Hello, introduce yourself." }],
                },
                {
                    role: 'model',
                    parts: [{ text: "أهلاً بك! أنا مساعدك الذكي في World Technology. ✨ يمكنني تزويدك بتفاصيل دقيقة عن منتجاتنا وخدماتنا وتقديم توصيات مخصصة لك. كيف يمكنني مساعدتك اليوم؟" }],
                }
            ];

            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                history: initialHistory,
                config: {
                    systemInstruction: systemInstruction,
                },
            });

            setChat(newChat);
            setHistory(initialHistory.map(h => ({ role: h.role, text: h.parts[0].text })));
            setError(null);

        } catch (e) {
            console.error("Chat initialization failed:", e);
            setError("حدث خطأ أثناء تهيئة المساعد الذكي.");
        }
    };
    initializeChat();
  }, [isOpen, products, categories, recentlyViewedIds]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setError(null);
    setHistory(prev => [...prev, { role: 'user', text: currentInput }]);
    setHistory(prev => [...prev, { role: 'model', text: '' }]);

    try {
        const stream = await chat.sendMessageStream({ message: currentInput });
        
        for await (const chunk of stream) {
            const chunkText = chunk.text;
            if (chunkText) {
                setHistory(prevHistory => {
                    const newHistory = [...prevHistory];
                    const lastMessage = newHistory[newHistory.length - 1];
                    if (lastMessage && lastMessage.role === 'model') {
                      lastMessage.text += chunkText;
                    }
                    return newHistory;
                });
            }
        }
    } catch (err) {
        console.error("Error sending message:", err);
        setError("عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.");
        setHistory(prev => prev.slice(0, prev.length -1));
    } finally {
        setIsLoading(false);
    }
  };

  return { chat, setChat, history, setHistory, input, setInput, isLoading, error, handleSendMessage };
};