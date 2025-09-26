// controllers/proactiveAlertsController.js
require('dotenv').config();
const { OpenAI } = require("openai");
const employees = require("../data/employees");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


async function getProactiveAlerts(req, res) {
    try {
        const prompt = `
      You are analyzing a team's workload for proactive alerts.
      Input data (hours assigned vs weekly capacity of 40):
      ${JSON.stringify(employees, null, 2)}

      Tasks:
      1. For each employee, calculate utilization percentage (hours/capacity*100).
      2. Classify them as:
         - "Under-occupied" (<70% utilization),
         - "Perfectly occupied" (70–100%),
         - "Highly occupied" (>100%).
      3. Generate proactive alerts:
         - "Underutilized Talent" if <70% for 2+ weeks
         - "Burnout Risk" if >110% for 2+ weeks
         - "No Alert" if stable
      4. Each alert must include:
         { 
           "employee": "", 
           "type": "", 
           "severity": "low|medium|high", 
           "message": "", 
           "suggestedAction": "" 
         }
      5. Also include a "criticalSummary" if any HIGH severity alerts exist.
      6. Final response JSON:
         {
           "team": [ { "name": "", "utilization": %, "status": "", "skills": [] } ],
           "alerts": [ { "employee": "", "type": "", "severity": "", "message": "", "suggestedAction": "" } ],
           "criticalSummary": "short urgent summary if high severity exists, else empty string",
           "summary": "short overview of team workload"
         }
         dont write anything extra just give me the response in json format which can be parsed properly
         I dont want anything extra apart from the parsable json
    `;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3
        });

        const aiResponse = completion.choices[0].message.content;

        res.json({
            managerId: req.params.id,
            proactiveInsights: aiResponse
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI pipeline failed" });
    }
}

module.exports = { getProactiveAlerts };
