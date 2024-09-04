const { ObjectId } = require('mongodb');

class UserModel {
  constructor(client) {
    this.userInfoCollection = client.db('DB1').collection('users-info');
    this.userStatsCollection = client.db('DB1').collection('user-stats');
  }

  async initializeUserStats() {
    const stats = await this.userStatsCollection.findOne({});
    if (!stats) {
      await this.userStatsCollection.insertOne({ "totalUsers": 0, "activeUsers": 0 });
    }
  }

  async createUser(userData) {
    await this.initializeUserStats();
    const result = await this.userInfoCollection.insertOne(userData);
    await this.userStatsCollection.updateOne(
        {},
        {
          $inc: {
            "totalUsers": +1,
            "activeUsers": +1,
          },
        }
    );
    return result;
  }

  async deleteUser(_id) {
    await this.initializeUserStats();
    const result = await this.userInfoCollection.deleteOne({ _id: new ObjectId(_id) });
    if (result.deletedCount === 1) {
      await this.userStatsCollection.updateOne(
        {},
        {
          $inc: {
            "activeUsers": -1,
          },
        }
      );
    }
    return result;
  }

  async findUserByEmail(email) {
    return await this.userInfoCollection.findOne({ email });
  }

  async getAllUsers() {
    return await this.userInfoCollection.find().toArray();
  }

  async updateUserPassword(_id, newPassword) {
    return await this.userInfoCollection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: { password: newPassword } }
    );
  }

  async getUserStats() {
    await this.initializeUserStats();
    return await this.userStatsCollection.findOne({});
  }

  async countTotalUsers() {
    await this.initializeUserStats();
    const stats = await this.userStatsCollection.findOne({});
    return stats ? stats.totalUsers : 0;
  }

  async countActiveUsers() {
    await this.initializeUserStats();
    const stats = await this.userStatsCollection.findOne({});
    return stats ? stats.activeUsers : 0;
  }
}

module.exports = UserModel;
