const OpenAIProvider = require('./OpenAIProvider');
// const GeminiProvider = require('./GeminiProvider'); // Future support

class ProviderFactory {
  static getProvider(providerName = process.env.AI_PROVIDER || 'openai') {
    switch (providerName.toLowerCase()) {
      case 'openai':
        return new OpenAIProvider();
      case 'gemini':
        // return new GeminiProvider();
        throw new Error('Gemini provider not yet implemented');
      default:
        return new OpenAIProvider();
    }
  }
}

module.exports = ProviderFactory;
