import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generatePoem(recipientName: string) {
  const prompt = `Write a short, romantic Valentine's Day poem for ${recipientName}. Keep it under 4 lines.`

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 100,
  })

  return response.choices[0].message.content?.trim()
}

