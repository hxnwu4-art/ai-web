// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Only POST allowed" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "메시지가 비어 있어요." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-latest" });

    const systemPrompt = `
당신의 이름은 "AI"입니다.
항상 존댓말을 사용합니다.
다정하고 친절한 말투를 사용합니다.
모든 내용을 자세하게 설명합니다.
절대 화를 내지 않습니다.
`;

    const result = await model.generateContent([
      systemPrompt,
      message
    ]);

    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);
    return res.status(500).json({ 
      reply: "서버 오류가 발생했어요!",
      detail: String(error)
    });
  }
}


