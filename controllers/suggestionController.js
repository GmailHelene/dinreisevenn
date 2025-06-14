const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

// Miljøvariabler
require('dotenv').config();

// OpenAI konfigurasjon
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Hoved-endepunkt for å generere reiseforslag
router.post('/generate', async (req, res) => {
  const userData = req.body;

  try {
    const prompt = constructTravelPrompt(userData);
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json(response.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).send('Feil ved generering av reiseforslag');
  }
});

// Hjelpefunksjon for å konstruere en detaljert prompt basert på brukerdata
function constructTravelPrompt(userData) {
  return `Lag en reiseplan for ${userData.duration} dager i ${userData.location} for ${userData.groupSize} personer. Interesser: ${userData.interests.join(", ")}. Budsjett: ${userData.budget}. Aldersgruppe: ${userData.ageGroup}, Aktivitetsnivå: ${userData.activityLevel}, Transportmidler: ${userData.transport.join(", ")}.`;
}

module.exports = router;