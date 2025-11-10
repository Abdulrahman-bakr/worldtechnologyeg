const { GoogleGenAI } = require("@google/genai");

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { productName, brand, category, specs } = req.body;

    if (!productName) {
      return res.status(400).json({ error: 'Product name is required.' });
    }
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error('API_KEY environment variable not set.');
      return res.status(500).json({ error: 'API key not configured on server.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const specsText = specs
      ? specs.map(([key, value]) => key && value ? `${key}: ${value}` : '')
          .filter(Boolean)
          .join(', ')
      : 'لا توجد مواصفات';
      
    const systemInstruction = `أنت خبير في كتابة وصف المنتجات للمتاجر الإلكترونية باللغة العربية.
اكتب وصفًا جذابًا ومقنعًا ومناسبًا لمحركات البحث (SEO) للمنتج.
اجعل الوصف واضحًا وسهل القراءة وركز على الفوائد الرئيسية للمستخدم.
ابدأ مباشرة بالوصف دون أي مقدمات.`;

    const userPrompt = `اكتب وصفًا للمنتج التالي:
- الاسم: ${productName}
- الماركة: ${brand || 'غير محددة'}
- الفئة: ${category || 'غير محددة'}
- المواصفات: ${specsText}
    `;
    
    const fullPrompt = `${systemInstruction}\n\n${userPrompt}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });
    
    const text = response.text;

    res.status(200).json({ description: text });

  } catch (error) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: 'Failed to generate description.', details: error.message });
  }
};