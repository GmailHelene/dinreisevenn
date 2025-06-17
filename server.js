const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Miljøvariabler
require('dotenv').config();

// OpenAI konfigurasjon
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
app.use(cors({ origin: ["https://simplifybiz.ai", "https://simplifybiz.ai/dinreisevenn"] }));
app.use(express.json());

// Hoved-endepunkt for å generere reiseforslag
app.post('/api/generate-travel-suggestions', async (req, res) => {
  try {
    const prompt = constructTravelPrompt(req.body);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });
    let content = completion.choices[0].message.content;

    // Prøv å parse JSON fra responsen
    let suggestions = null, plans = null, plan = null;
    try {
      // Finn første { og siste } for å rydde bort evt. tekst rundt JSON
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        content = content.substring(jsonStart, jsonEnd + 1);
      }
      const parsed = JSON.parse(content);

      if (Array.isArray(parsed.plans) && Array.isArray(parsed.suggestions)) {
        suggestions = parsed.suggestions;
        plans = parsed.plans;
      } else if (parsed.plan) {
        plan = parsed.plan;
      }
    } catch (e) {
      // Hvis ikke JSON, send som tekst
      plan = content;
    }

    if (suggestions && plans) {
      res.json({ suggestions, plans });
    } else if (plan) {
      res.json({ plan });
    } else {
      res.status(500).json({ error: "Kunne ikke tolke OpenAI-respons." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endepunkt for å hente attraksjoner basert på plassering
app.get('/api/attractions/:location', async (req, res) => {
  const location = req.params.location;
  // Logikk for å hente attraksjoner
});

// Endepunkt for å hente restauranter
app.get('/api/restaurants/:location', async (req, res) => {
  const location = req.params.location;
  // Logikk for å hente restauranter
});

// Hjelpefunksjon for å konstruere en detaljert prompt basert på brukerdata
function constructTravelPrompt(userData) {
  return `Lag en reiseplan for ${userData.duration} dager i ${userData.location} for ${userData.groupSize} personer. Interesser: ${userData.interests.join(", ")}. Budsjett: ${userData.budget}. Aldersgruppe: ${Array.isArray(userData.ageGroup) ? userData.ageGroup.join(", ") : userData.ageGroup}, Aktivitetsnivå: ${userData.activityLevel}, Transportmidler: ${userData.transport.join(", ")}. 
Svar kun med gyldig JSON på formatet: 
{
  "suggestions": [
    { "title": "Kort forslag", "description": "..." }
  ],
  "plans": [
    {
      "title": "Dag 1",
      "activities": [
        { "time": "09:00", "activity": "Frokost", "description": "..." }
      ]
    }
  ]
}`;
}

// Anmeldelser
let reviews = []; // I produksjon: bruk database!

const db = require('./services/db');

app.post('/api/reviews', (req, res) => {
  const { review } = req.body;
  if (review) {
    db.addReview(review, (err) => {
      if (err) return res.status(500).json({ error: "DB-feil" });
      res.json({ status: "ok" });
    });
  } else {
    res.status(400).json({ error: "Mangler anmeldelse" });
  }
});

app.get('/api/reviews', (req, res) => {
  db.getReviews((err, rows) => {
    if (err) return res.status(500).json({ error: "DB-feil" });
    res.json(rows);
  });
});

// Endepunkt for bildeanalyse (AI-bildegjenkjenning)
app.post('/api/recognize-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Ingen fil lastet opp" });
  }
  try {
    // Les bildet som base64
    const imagePath = path.join(__dirname, '..', req.file.path);
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    // Kall OpenAI Vision (GPT-4o)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Du er en reiseguide. Gjenkjenn severdigheter på bilder og gi kort info." },
        {
          role: "user",
          content: [
            { type: "text", text: "Hva er dette? Gi kort info for turist." },
            { type: "image_url", image_url: { "url": `data:image/jpeg;base64,${base64Image}` } }
          ]
        }
      ],
      max_tokens: 200
    });
    const info = completion.choices[0].message.content;
    // Slett bildet etter bruk
    fs.unlinkSync(imagePath);
    res.json({ info });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use(express.static(path.join(__dirname, '../frontend')));
app.listen(port, () => {
  console.log(`TravelAI API server running on port ${port}`);
});

// Disse endepunktene ser ut til å være nye (sammenlignet med tidligere versjon):
app.post('/api/save-plan', (req, res) => {
  const { userId, plan } = req.body;
  if (userId && plan) {
    db.addPlan(userId, plan, (err) => {
      if (err) return res.status(500).json({ error: "DB-feil" });
      res.json({ status: "Plan lagret" });
    });
  } else {
    res.status(400).json({ error: "Mangler bruker eller plan" });
  }
});

app.get('/api/my-plans/:userId', (req, res) => {
  db.getPlansByUser(req.params.userId, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB-feil" });
    const plans = rows.map(row => ({
      ...row,
      plan: JSON.parse(row.plan)
    }));
    res.json(plans);
  });
});

app.delete('/api/plan/:planId', (req, res) => {
  const userId = req.query.userId;
  db.deletePlan(req.params.planId, userId, (err) => {
    if (err) return res.status(500).json({ error: "DB-feil" });
    res.json({ status: "Plan slettet" });
  });
});
