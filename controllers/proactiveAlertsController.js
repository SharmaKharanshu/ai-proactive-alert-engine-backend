// controllers/proactiveAlertsController.js
const { OpenAI } = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const employees = [
    { name: "Alice", estimatedHours: 20, capacity: 40, skills: ["React", "Node.js"] },
    { name: "Bob", estimatedHours: 38, capacity: 40, skills: ["Java", "Spring Boot"] },
    { name: "Charlie", estimatedHours: 55, capacity: 40, skills: ["Python", "ML"] },
    { name: "David", estimatedHours: 10, capacity: 40, skills: ["UI/UX", "Figma"] },
    { name: "Eva", estimatedHours: 45, capacity: 40, skills: ["AWS", "DevOps"] },
    { name: "Frank", estimatedHours: 25, capacity: 40, skills: ["Go", "Kubernetes"] },
    { name: "Grace", estimatedHours: 60, capacity: 40, skills: ["Ruby", "Rails"] },
    { name: "Helen", estimatedHours: 15, capacity: 40, skills: ["QA", "Selenium"] },
    { name: "Ian", estimatedHours: 40, capacity: 40, skills: ["C++", "Embedded"] },
    { name: "Jack", estimatedHours: 42, capacity: 40, skills: ["PHP", "Laravel"] },
    { name: "Karen", estimatedHours: 30, capacity: 40, skills: ["Scala", "Akka"] },
    { name: "Leo", estimatedHours: 50, capacity: 40, skills: ["Swift", "iOS"] }
];

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
