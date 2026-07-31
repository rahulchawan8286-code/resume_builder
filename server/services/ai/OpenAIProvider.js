const OpenAI = require('openai');
const ErrorResponse = require('../../utils/errorResponse');

class OpenAIProvider {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy_key_to_prevent_crash_on_boot'
    });
    this.defaultModel = process.env.OPENAI_DEFAULT_MODEL || 'gpt-3.5-turbo';
  }

  async generate(prompt, isJson = false) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new ErrorResponse('AI Provider is not configured.', 503);
      }
      const start = Date.now();
      const response = await this.client.chat.completions.create({
        model: this.defaultModel,
        messages: [{ role: 'user', content: prompt }],
        response_format: isJson ? { type: 'json_object' } : { type: 'text' },
        temperature: 0.7,
      });
      const timeMs = Date.now() - start;

      const content = response.choices[0].message.content;
      const tokens = response.usage.total_tokens;

      return {
        content: isJson ? JSON.parse(content) : content.trim(),
        tokens,
        timeMs,
        model: this.defaultModel
      };
    } catch (error) {
      if (error.status === 401) throw new ErrorResponse('Invalid AI Provider API Key', 500);
      if (error.status === 429) throw new ErrorResponse('AI Provider Rate Limit Exceeded', 429);
      throw new ErrorResponse('AI Generation Failed: ' + error.message, 502);
    }
  }
}

module.exports = OpenAIProvider;
