const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateAiPoem = async (req, res) => {
  const { prompt, themes } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "A prompt context is required" });
  }

  try {
    const systemInstruction = 
      `You are a master traditional poet. Generate a beautiful, creative poem based on the user's prompt.
       Incorporate the following themes naturally: ${themes ? themes.join(', ') : 'General Poetry'}.
       You must provide a fitting, poetic title and the full poem content text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["title", "content"],
        },
      }
    });

    const resultData = JSON.parse(response.text);
    res.status(200).json(resultData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate AI poem" });
  }
};

module.exports = { generateAiPoem };