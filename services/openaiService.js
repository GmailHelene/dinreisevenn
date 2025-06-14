const axios = require('axios');

class OpenAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v1/';
  }

  async generateTravelSuggestions(prompt) {
    try {
      const response = await axios.post(`${this.baseURL}completions`, {
        model: 'text-davinci-003',
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      throw new Error(`Error generating suggestions: ${error.message}`);
    }
  }
}

module.exports = new OpenAIService(process.env.OPENAI_API_KEY);