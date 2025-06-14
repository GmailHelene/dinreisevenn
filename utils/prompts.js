const travelPrompts = {
    generateTravelPlan: (location, duration, interests, budget) => {
        return `Create a travel plan for ${duration} days in ${location} focusing on ${interests.join(", ")} with a budget of ${budget}.`;
    },
    suggestAttractions: (location) => {
        return `What are the top attractions to visit in ${location}?`;
    },
    recommendRestaurants: (location, cuisine) => {
        return `Can you recommend some ${cuisine} restaurants in ${location}?`;
    },
    createBookingPrompt: (location, date, groupSize) => {
        return `Book a trip for ${groupSize} people to ${location} on ${date}.`;
    }
};

module.exports = travelPrompts;