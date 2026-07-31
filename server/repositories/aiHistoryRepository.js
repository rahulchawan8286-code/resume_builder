const AiHistory = require('../models/AiHistory');

class AiHistoryRepository {
  constructor() {
    this.memoryHistory = [];
  }

  _isDev() {
    return process.env.DEVELOPMENT_MODE === 'true';
  }

  async log(userId, resumeId, prompt, response, model, tokensUsed) {
    if (this._isDev()) {
      const history = {
        _id: `mock-ai-history-${Date.now()}`,
        user: userId,
        resume: resumeId,
        prompt,
        response,
        model,
        tokensUsed,
        createdDate: new Date()
      };
      this.memoryHistory.push(history);
      return history;
    }
    const history = new AiHistory({
      user: userId,
      resume: resumeId,
      prompt,
      response,
      model,
      tokensUsed
    });
    return await history.save();
  }

  async getHistoryByUser(userId) {
    if (this._isDev()) {
      return this.memoryHistory
        .filter(h => h.user === userId)
        .sort((a, b) => b.createdDate - a.createdDate);
    }
    return await AiHistory.find({ user: userId }).sort({ createdDate: -1 });
  }

  async deleteHistory(id, userId) {
    if (this._isDev()) {
      const index = this.memoryHistory.findIndex(h => h._id === id && h.user === userId);
      if (index !== -1) {
        return this.memoryHistory.splice(index, 1)[0];
      }
      return null;
    }
    return await AiHistory.findOneAndDelete({ _id: id, user: userId });
  }
}

module.exports = new AiHistoryRepository();
