const ProviderFactory = require('./ai/ProviderFactory');
const aiHistoryRepository = require('../repositories/aiHistoryRepository');
const prompts = require('../prompts/resumePrompts');
const cache = require('../utils/cache');
const logger = require('../utils/logger');

class AiService {
  constructor() {
    this.provider = ProviderFactory.getProvider();
  }

  async _executeWithCacheAndLog(userId, resumeId, promptText, isJson = false) {
    if (process.env.DEVELOPMENT_MODE === 'true') {
      logger.info(`AI Mock Hit for user: ${userId}`);
      if (isJson) {
        return {
          score: 85,
          objectives: ["Mock Objective 1", "Mock Objective 2", "Mock Objective 3"],
          missingKeywords: ["Leadership", "Agile"],
          matchingKeywords: ["JavaScript", "React", "Node.js"],
          improvements: ["Add more quantifiable results."]
        };
      }
      return "This is a highly professional, mock AI-generated summary or enhanced text for your resume. It highlights key achievements and skills.";
    }

    // 1. Check Cache
    const cachedResponse = cache.get(promptText, this.provider.defaultModel);
    if (cachedResponse) {
      logger.info(`AI Cache Hit for user: ${userId}`);
      return cachedResponse;
    }

    // 2. Execute AI
    const result = await this.provider.generate(promptText, isJson);

    // 3. Log History
    await aiHistoryRepository.log(
      userId,
      resumeId,
      promptText,
      isJson ? JSON.stringify(result.content) : result.content,
      result.model,
      result.tokens
    );

    // 4. Set Cache
    cache.set(promptText, result.model, result.content);

    return result.content;
  }

  async generateObjective(userId, resumeId, userData, role, experienceLevel) {
    const prompt = prompts.generateObjective(userData, role, experienceLevel);
    return await this._executeWithCacheAndLog(userId, resumeId, prompt, true);
  }

  async generateSummary(userId, resumeId, resumeData) {
    const prompt = prompts.generateSummary(resumeData);
    return await this._executeWithCacheAndLog(userId, resumeId, prompt, false);
  }

  async enhanceExperience(userId, resumeId, company, role, description) {
    const prompt = prompts.enhanceExperience(company, role, description);
    return await this._executeWithCacheAndLog(userId, resumeId, prompt, false);
  }

  async analyzeAts(userId, resumeId, resumeText, jobDescription) {
    const prompt = prompts.analyzeAts(resumeText, jobDescription);
    return await this._executeWithCacheAndLog(userId, resumeId, prompt, true);
  }

  async grammarCheck(userId, resumeId, text) {
    const prompt = prompts.grammarCheck(text);
    return await this._executeWithCacheAndLog(userId, resumeId, prompt, false);
  }

  async generateCoverLetter(userId, resumeId, resumeData, jobDescription, companyName) {
    const prompt = prompts.generateCoverLetter(resumeData, jobDescription, companyName);
    return await this._executeWithCacheAndLog(userId, resumeId, prompt, false);
  }

  async getHistory(userId) {
    return await aiHistoryRepository.getHistoryByUser(userId);
  }

  async deleteHistory(id, userId) {
    return await aiHistoryRepository.deleteHistory(id, userId);
  }
}

module.exports = new AiService();
