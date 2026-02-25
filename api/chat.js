import Groq from "groq-sdk";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Only POST allowed" });
    }

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ reply: "메시지가 비어 있어요." });
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: "llama3-70b",
      messages: [
        {
          role: "system",
          content: `
당신의 이름은 "AI"입니다.
항상 존댓말을 사용합니다.
다정하고 친절한 톤으로 답변합니다.
설명은 자세하게 합니다.
절대 화내거나 무례하게 행동하지 않습니다.
`
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("🔥 GROQ SERVER ERROR:", error);
    return res.status(500).json({
      reply: "서버 오류가 발생했어요!",
      detail: String(error)
    });
  }
}
