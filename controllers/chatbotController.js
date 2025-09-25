// controllers/chatbotController.js
const { OpenAI } = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function chatWithBot(req, res) {
    const { message } = req.body;

    // You can customize this prompt per your chatbot needs
    const prompt = `
    You are a helpful assistant in a manager portal.
    Answer the following question concisely:

    ${message}
  `;

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.5,
        });

        const answer = completion.choices[0].message.content;

        res.json({ answer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI chat failed" });
    }
}

module.exports = { chatWithBot };
