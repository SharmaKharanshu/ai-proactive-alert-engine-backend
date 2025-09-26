require('dotenv').config();
const express = require("express");
const cors = require("cors"); // ✅ Import cors
const { getProactiveAlerts } = require("./controllers/proactiveAlertsController");
const { chatWithBot } = require("./controllers/chatbotController");

const app = express();

// ✅ Use CORS middleware (allows all origins)
app.use(cors());

app.use(express.json());

app.get("/manager/:id/proactive-alerts", getProactiveAlerts);
app.post("/chatbot", chatWithBot);

app.listen(4000, () => console.log("🚀 Server running on port 4000"));
