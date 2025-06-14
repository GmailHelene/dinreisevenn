const axios = require('axios');

class GeocodingService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.opencagedata.com/geocode/v1/json';
    }

    async getCoordinates(location) {
        try {
            const response = await axios.get(this.baseURL, {
                params: {
                    q: location,
                    key: this.apiKey
                }
            });
            if (response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry;
                return { lat, lng };
            } else {
                throw new Error('No results found');
            }
        } catch (error) {
            throw new Error(`Geocoding error: ${error.message}`);
        }
    }
}

module.exports = new GeocodingService(process.env.GEOCODING_API_KEY);