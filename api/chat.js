// api/chat.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default {
  async fetch(request) {
    // POST만 허용
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST allowed" }),
        {
          status: 405,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    try {
      const { message } = await request.json();

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "당신의 이름은 AI입니다. 항상 존댓말을 사용하고, 다정하게, 자세하게 설명하며, 절대 화내지 않습니다.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

      const reply = completion.choices[0]?.message?.content ?? "";

      return new Response(
        JSON.stringify({ reply }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (err) {
      // 디버깅용으로 에러도 같이 보내줌
      return new Response(
        JSON.stringify({
          error: "server_error",
          detail: String(err),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  },
};
