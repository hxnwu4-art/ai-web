// api/chat.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ reply: "Only POST allowed" });
    return;
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { message } = req.body || {};

    if (!message) {
      res.status(400).json({ reply: "메시지가 비어 있어요." });
      return;
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "당신의 이름은 AI입니다. 항상 존댓말을 사용하고 다정하며 자세하게 설명하며 절대로 화내지 않습니다.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion.choices?.[0]?.message?.content ??
      "응답을 생성하지 못했습니다.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("🔥 API ERROR:", err);
    res.status(500).json({
      reply: "서버 오류가 발생했어요!",
      detail: String(err),
    });
  }
}
