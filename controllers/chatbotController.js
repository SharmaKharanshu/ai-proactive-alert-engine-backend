require('dotenv').config();
const { OpenAI } = require("openai");
const employees = require("../data/employees");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// In-memory session-based message store
const conversationHistory = {}; // { sessionId: [ { role, content } ] }

async function chatWithBot(req, res) {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
        return res.status(400).json({ error: "Missing message or sessionId" });
    }

    const systemPrompt = `
You are a helpful assistant in a manager portal.
Here is the current team data:
${JSON.stringify(employees, null, 2)}

Use this data to answer questions about resource availability, skills, workload, and role fit.
Answer concisely and clearly.
If you don't find the data in the team data that I provided, then don't assume things at all, please.
Also, I will set the response in dangerouslySetInnerHTML={{ __html: msg.text }} />
so please make the response in that presentable format only.
Like if I'm asking you to list items, then make proper indentations. Do not do anything fancy.
If a list comes, make use of line separators to differentiate between items.
`.trim();

    // Initialize conversation history
    if (!conversationHistory[sessionId]) {
        conversationHistory[sessionId] = [
            { role: "system", content: systemPrompt }
        ];
    }

    // Append user's message
    conversationHistory[sessionId].push({ role: "user", content: message });

    try {
        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: conversationHistory[sessionId],
            temperature: 0.5,
        });

        const answer = completion.choices[0].message.content;

        // Append assistant's response
        conversationHistory[sessionId].push({ role: "assistant", content: answer });

        // Optional: Limit memory size
        const MAX_HISTORY = 20;
        if (conversationHistory[sessionId].length > MAX_HISTORY) {
            conversationHistory[sessionId] = [
                conversationHistory[sessionId][0], // keep system prompt
                ...conversationHistory[sessionId].slice(-MAX_HISTORY)
            ];
        }

        res.json({ answer });
    } catch (err) {
        console.error("OpenAI error:", err);
        res.status(500).json({ error: "AI chat failed" });
    }
}

module.exports = { chatWithBot };
