const budgetValidator = (req, res, next) => {
    const { budget } = req.body;
    
    if (!budget) {
        return res.status(400).json({ 
            error: 'Budsjett er påkrevd' 
        });
    }
    
    // Normaliser budsjett til tall
    let budgetValue;
    if (typeof budget === 'string') {
        // Fjern alle tegn som ikke er tall
        budgetValue = parseInt(budget.replace(/[^\d]/g, ''));
    } else {
        budgetValue = budget;
    }
    
    // Valider at budsjett er et gyldig tall
    if (isNaN(budgetValue) || budgetValue <= 0) {
        return res.status(400).json({ 
            error: 'Budsjett må være et gyldig tall større enn 0' 
        });
    }
    
    // Sett normalisert budsjett tilbake til request
    req.body.budget = budgetValue;
    req.body.originalBudget = budget;
    
    next();
};

module.exports = budgetValidator;
