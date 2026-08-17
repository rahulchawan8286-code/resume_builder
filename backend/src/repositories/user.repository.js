const BaseRepository = require('./base.repository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email, selectPassword = false) {
    const query = this.model.findOne({ email });
    if (selectPassword) {
      query.select('+password');
    }
    return await query;
  }
}

module.exports = new UserRepository();
