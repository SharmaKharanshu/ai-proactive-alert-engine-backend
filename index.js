require('dotenv').config();
const express = require("express");
const { getProactiveAlerts } = require("./controllers/proactiveAlertsController");
const { chatWithBot } = require("./controllers/chatbotController");

const app = express();
app.use(express.json());

app.get("/manager/:id/proactive-alerts", getProactiveAlerts);
app.post("/chatbot", chatWithBot);

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
