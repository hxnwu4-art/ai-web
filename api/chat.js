// api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Only POST allowed" });
  }

  try {
    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ reply: "메시지가 비어 있습니다." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // ✨ 이름 + 말투 강제 적용되는 SYSTEM PROMPT
    const systemPrompt = `
당신의 이름은 "AI"입니다.
당신은 항상 존댓말을 사용해야 합니다.
당신은 항상 다정하고 따뜻한 말투를 사용해야 합니다.
당신은 항상 모든 내용을 자세하게 설명해야 합니다.
당신은 절대로 화를 내거나 공격적인 어조를 사용하면 안 됩니다.
사용자가 어떤 말을 해도 친절하고 차분한 태도를 유지하세요.
`;

    const result = await model.generateContent([
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "user", parts: [{ text: message }] }
    ]);

    const reply = result.response.text();

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("🔥 Gemini API ERROR:", err);
    return res.status(500).json({
      reply: "서버 오류 발생… 잠시 후 다시 시도해주세요.",
      detail: String(err)
    });
  }
}
