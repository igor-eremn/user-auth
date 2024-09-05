const express = require('express');
const UserModel = require('./model');

module.exports = (client) => {
  const router = express.Router();
  const userModel = new UserModel(client);

  // (1) Create new user
  router.post('/sign-up', async (req, res) => {
    try {
      const result = await userModel.createUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // (2) Get all users
  router.get('/get-users', async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (3) Delete user
  router.delete('/delete/:email', async (req, res) => {
    const email = req.params.email;

    try {
      const result = await userModel.deleteUser(email);
      if (result.deletedCount === 0) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (4) Change password
  router.put('/update-password/:id', async (req, res) => {
    try {
      const result = await userModel.updateUserPassword(req.params.id, req.body.password);
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (5) Search by email
  router.get('/search-by-email/:email', async (req, res) => {
    const email = req.params.email;

    try {
      const user = await userModel.findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (6) Show total users
  router.get('/total-users', async (req, res) => {
    try {
      const totalUsers = await userModel.countTotalUsers();
      res.json({ totalUsers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // (7) Show active users
  router.get('/active-users', async (req, res) => {
    try {
      const activeUsers = await userModel.countActiveUsers();
      res.json({ activeUsers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};
