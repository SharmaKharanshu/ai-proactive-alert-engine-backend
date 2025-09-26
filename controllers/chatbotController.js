// controllers/chatbotController.js
require('dotenv').config();
const { OpenAI } = require("openai");
const employees = require("../data/employees");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function chatWithBot(req, res) {
    const { message } = req.body;

    // Prepare a system prompt with the employee data
    const systemPrompt = `
You are a helpful assistant in a manager portal.
Here is the current team data:
${JSON.stringify(employees, null, 2)}

Use this data to answer questions about resource availability, skills, workload, and role fit.
Answer concisely and clearly.
    `;

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
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
