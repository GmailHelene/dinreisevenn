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

// Sjekk kritiske miljøvariabler
if (!process.env.OPENAI_API_KEY) {
  console.error('⚠️  OPENAI_API_KEY mangler i miljøvariabler');
  console.log('Tilgjengelige miljøvariabler:', Object.keys(process.env).sort());
}

console.log('🚀 Starting server...');
console.log('📍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔧 Port:', port);
console.log('🤖 OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Found' : 'Missing');

// OpenAI konfigurasjon
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// CORS konfiguration - tillat både lokalt og produksjon
const allowedOrigins = [
  "https://simplifybiz.ai",
  "https://simplifybiz.ai/dinreisevenn",
  "https://dinreisevenn-production.up.railway.app",
  "http://localhost:3000",
  "http://localhost:8080"
];

app.use(cors({ 
  origin: function (origin, callback) {
    // Tillat forespørsler uten origin (f.eks. mobilapper)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

const budgetValidator = require('./middleware/budgetValidator');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: port,
    openai: process.env.OPENAI_API_KEY ? 'configured' : 'missing'
  });
});

// Root route - serve mobile.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

// Hoved-endepunkt for å generere reiseforslag
app.post('/api/generate-travel-suggestions', budgetValidator, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key ikke konfigurert',
        details: 'Kontakt administrator for å sette opp OpenAI API key'
      });
    }

    const prompt = constructTravelPrompt(req.body);
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Du er en ekspert norsk reiseguide med oppdatert kunnskap om priser i Norge i 2024/2025. Du må ALLTID gi realistiske og nøyaktige budsjettstimeringer basert på faktiske norske priser. Vær ekstremt nøyaktig med kostnadene og sørg for at alle forslag holder seg innenfor det oppgitte totalbudsjettet. Når budsjett er oppgitt, er det totalbudsjettet for hele reisen, ikke per dag. Regn ut daglig budsjett og tilpass alle forslag til dette. Inkluder alltid spesifikke priser i NOK og en totalsum som ikke overstiger budsjettet." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
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
  // Konverter budsjett til tall hvis det er en streng
  const budget = typeof userData.budget === 'string' ? parseInt(userData.budget.replace(/[^\d]/g, '')) : userData.budget;
  const budgetRange = getBudgetRange(budget);
  
  return `Lag en reiseplan for ${userData.duration} dager i ${userData.location} for ${userData.groupSize} personer. 
Interesser: ${userData.interests.join(", ")}. 
Budsjett: ${userData.budget} NOK totalt (${budgetRange.description}). 
Aldersgruppe: ${Array.isArray(userData.ageGroup) ? userData.ageGroup.join(", ") : userData.ageGroup}
Aktivitetsnivå: ${userData.activityLevel}
Transportmidler: ${userData.transport.join(", ")}

KRITISK VIKTIG: 
- Budsjettet på ${userData.budget} NOK er TOTALBUDSJETTET for hele reisen, IKKE per dag
- Regn ut daglig budsjett: ${Math.floor(budget / userData.duration)} NOK per dag for ${userData.groupSize} person(er)
- ${budgetRange.guidance}
- Gi spesifikke priser i NOK for hver aktivitet, måltid og transport
- Kontroller at total kostnad ikke overstiger ${userData.budget} NOK
- Bruk faktiske norske priser fra 2024/2025

Eksempel på realistiske priser i Norge:
- Museumsbillett: 100-200 NOK
- Busskort (1 dag): 50-80 NOK  
- Middag på restaurant: 200-400 NOK
- Kaffe: 30-50 NOK
- Hotell per natt: 800-2000 NOK
- Hostel per natt: 300-600 NOK

Svar kun med gyldig JSON på formatet: 
{
  "suggestions": [
    { "title": "Kort forslag", "description": "...", "estimatedCost": "X NOK" }
  ],
  "plans": [
    {
      "title": "Dag 1",
      "activities": [
        { "time": "09:00", "activity": "Frokost", "description": "...", "estimatedCost": "X NOK" }
      ]
    }
  ],
  "totalEstimatedCost": "X NOK",
  "budgetBreakdown": {
    "accommodation": "X NOK",
    "food": "X NOK", 
    "transport": "X NOK",
    "activities": "X NOK"
  }
}`;
}

// Forbedret hjelpefunksjon for å vurdere budsjett basert på norske priser
function getBudgetRange(budget) {
  if (budget < 1000) {
    return {
      description: "Lavt budsjett (under 1000 NOK per dag)",
      guidance: "Fokuser på gratis aktiviteter som parker, strand, museums-frie dager, gåturer. Bruk kollektivtransport (ca 50-80 NOK/dag). Spis på gatekjøkken/kiosker (50-150 NOK/måltid). Overnatt på hostels/camping (200-400 NOK/natt). Estimerte daglige kostnader: Overnatting 300 NOK, mat 200 NOK, transport 60 NOK, aktiviteter 100 NOK."
    };
  } else if (budget < 3000) {
    return {
      description: "Moderat budsjett (1000-3000 NOK per dag)", 
      guidance: "Inkluder noen betalte attraksjoner (100-300 NOK/billett), middels restauranter (150-400 NOK/måltid), komfortabel overnatting som hoteller (500-1200 NOK/natt). Kombinér kollektivtransport med taxi ved behov. Estimerte daglige kostnader: Overnatting 800 NOK, mat 600 NOK, transport 200 NOK, aktiviteter 400 NOK."
    };
  } else if (budget < 6000) {
    return {
      description: "Høyt budsjett (3000-6000 NOK per dag)",
      guidance: "Kan inkludere premium opplevelser, fine restauranter (400-800 NOK/måltid), gode hoteller (1200-2500 NOK/natt), private turer/guider (500-1500 NOK). Bruk taxi/privatbil etter behov. Estimerte daglige kostnader: Overnatting 1800 NOK, mat 1200 NOK, transport 500 NOK, aktiviteter 1000 NOK."
    };
  } else {
    return {
      description: "Luksusbudsjett (over 6000 NOK per dag)",
      guidance: "Inkluder luksusopplevelser, michelin-restauranter (800-2000 NOK/måltid), 5-stjernes hoteller (2500+ NOK/natt), private guider og eksklusive aktiviteter. Privatbil/sjåfør tilgjengelig. Estimerte daglige kostnader: Overnatting 3500 NOK, mat 2000 NOK, transport 1000 NOK, aktiviteter 2000 NOK."
    };
  }
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../frontend')));
app.listen(port, () => {
  console.log(`TravelAI API server running on port ${port}`);
});

// Routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

// Use routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

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

// Nytt endepunkt for mobilskjema - alle felt på én side
app.post('/api/mobile-travel-form', budgetValidator, async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        error: 'OpenAI API key ikke konfigurert',
        details: 'Kontakt administrator for å sette opp OpenAI API key'
      });
    }

    // Valider at alle nødvendige felt er til stede
    const requiredFields = ['location', 'duration', 'groupSize', 'interests', 'budget', 'ageGroup', 'activityLevel', 'transport'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Mangler påkrevde felt: ${missingFields.join(', ')}` 
      });
    }

    // Konstruer prompt med alle dataene
    const prompt = constructTravelPrompt(req.body);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Du er en ekspert norsk reiseguide med oppdatert kunnskap om priser i Norge i 2024/2025. Du må ALLTID gi realistiske og nøyaktige budsjettstimeringer basert på faktiske norske priser. Vær ekstremt nøyaktig med kostnadene og sørg for at alle forslag holder seg innenfor det oppgitte totalbudsjettet. Når budsjett er oppgitt, er det totalbudsjettet for hele reisen, ikke per dag. Regn ut daglig budsjett og tilpass alle forslag til dette. Inkluder alltid spesifikke priser i NOK og en totalsum som ikke overstiger budsjettet." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
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
      console.error('JSON parse error:', e);
      // Hvis ikke JSON, send som tekst
      plan = content;
    }

    // Legg til metadata om forespørselen
    const responseData = {
      requestData: req.body,
      generatedAt: new Date().toISOString(),
      budgetAnalysis: getBudgetRange(
        typeof req.body.budget === 'string' ? 
        parseInt(req.body.budget.replace(/[^\d]/g, '')) : 
        req.body.budget
      )
    };

    if (suggestions && plans) {
      res.json({ 
        suggestions, 
        plans, 
        ...responseData 
      });
    } else if (plan) {
      res.json({ 
        plan, 
        ...responseData 
      });
    } else {
      res.status(500).json({ error: "Kunne ikke tolke OpenAI-respons." });
    }
  } catch (err) {
    console.error('Mobile form error:', err);
    res.status(500).json({ error: err.message });
  }
});
