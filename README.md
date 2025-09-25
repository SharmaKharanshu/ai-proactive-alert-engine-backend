# Proactive Alerts Node.js Project

This project provides an Express API integrated with OpenAI for team workload analysis.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. Start the server:
   ```bash
   npm start
   ```

## API Endpoint

- `GET /manager/:id/ai-workload`
  - Returns AI-generated analysis of team workload and suggestions.

## Files
- `index.js`: Main server and API logic
- `.env`: Environment variables
- `package.json`: Project metadata

You can extend this project to integrate with Jira or other data sources.