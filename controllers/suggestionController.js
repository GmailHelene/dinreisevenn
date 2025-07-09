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
      model: 'gpt-4o',
      messages: [
        { 
          role: "system", 
          content: "Du er en ekspert norsk reiseguide med oppdatert kunnskap om priser i Norge i 2024/2025. Du må ALLTID gi realistiske og nøyaktige budsjettstimeringer basert på faktiske norske priser. Vær ekstremt nøyaktig med kostnadene og sørg for at alle forslag holder seg innenfor det oppgitte totalbudsjettet. Når budsjett er oppgitt, er det totalbudsjettet for hele reisen, ikke per dag. Regn ut daglig budsjett og tilpass alle forslag til dette. Inkluder alltid spesifikke priser i NOK og en totalsum som ikke overstiger budsjettet." 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      temperature: 0.7
    });

    let content = response.choices[0].message.content;
    
    // Prøv å parse JSON fra responsen
    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        content = content.substring(jsonStart, jsonEnd + 1);
      }
      const parsed = JSON.parse(content);
      res.json(parsed);
    } catch (parseError) {
      // Hvis ikke JSON, send som tekst
      res.json({ plan: content });
    }
  } catch (error) {
    console.error('Suggestion generation error:', error);
    res.status(500).json({ error: 'Feil ved generering av reiseforslag', details: error.message });
  }
});

// Hjelpefunksjon for å konstruere en detaljert prompt basert på brukerdata
function constructTravelPrompt(userData) {
  // Konverter budsjett til tall hvis det er en streng
  const budget = typeof userData.budget === 'string' ? parseInt(userData.budget.replace(/[^\d]/g, '')) : userData.budget;
  const budgetRange = getBudgetRange(budget);
  
  return `Lag en reiseplan for ${userData.duration} dager i ${userData.location} for ${userData.groupSize} personer. 
Interesser: ${userData.interests.join(", ")}. 
Budsjett: ${userData.budget} NOK totalt (${budgetRange.description}). 
Aldersgruppe: ${userData.ageGroup}
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

// Ny hjelpefunksjon for å vurdere budsjett
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

module.exports = router;