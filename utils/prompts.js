const travelPrompts = {
    generateTravelPlan: (location, duration, interests, budget) => {
        const budgetValue = typeof budget === 'string' ? parseInt(budget.replace(/[^\d]/g, '')) : budget;
        const budgetRange = getBudgetRange(budgetValue);
        
        return `Create a travel plan for ${duration} days in ${location} focusing on ${interests.join(", ")} with a total budget of ${budget} NOK (${budgetRange.description}). 
        
KRITISK VIKTIG: 
- Budsjettet på ${budget} NOK er TOTALBUDSJETTET for hele reisen, IKKE per dag
- Regn ut daglig budsjett: ${Math.floor(budgetValue / duration)} NOK per dag
- ${budgetRange.guidance}
- Gi spesifikke priser i NOK for hver aktivitet, måltid og transport
- Kontroller at total kostnad ikke overstiger ${budget} NOK
- Bruk faktiske norske priser fra 2024/2025

Please provide detailed cost estimates for each activity and accommodation with specific NOK amounts.`;
    },
    suggestAttractions: (location, budget) => {
        const budgetValue = typeof budget === 'string' ? parseInt(budget.replace(/[^\d]/g, '')) : budget;
        const budgetRange = getBudgetRange(budgetValue);
        
        return `What are the top attractions to visit in ${location} within a total budget of ${budget} NOK (${budgetRange.description})? ${budgetRange.guidance}
        
Include specific prices in NOK for each attraction based on current 2024/2025 Norwegian prices.`;
    },
    recommendRestaurants: (location, cuisine, budget) => {
        const budgetValue = typeof budget === 'string' ? parseInt(budget.replace(/[^\d]/g, '')) : budget;
        const budgetRange = getBudgetRange(budgetValue);
        
        return `Can you recommend some ${cuisine} restaurants in ${location} within a total budget of ${budget} NOK (${budgetRange.description})? ${budgetRange.guidance}
        
Include specific meal prices in NOK based on current 2024/2025 Norwegian restaurant prices.`;
    },
    createBookingPrompt: (location, date, groupSize, budget) => {
        const budgetValue = typeof budget === 'string' ? parseInt(budget.replace(/[^\d]/g, '')) : budget;
        const budgetRange = getBudgetRange(budgetValue);
        
        return `Book a trip for ${groupSize} people to ${location} on ${date} with a total budget of ${budget} NOK (${budgetRange.description}). ${budgetRange.guidance}
        
Provide detailed cost breakdown in NOK for accommodation, food, transport, and activities based on current 2024/2025 Norwegian prices.`;
    }
};

// Hjelpefunksjon for å vurdere budsjett
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

module.exports = travelPrompts;