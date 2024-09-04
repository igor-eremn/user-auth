const express = require('express');
const UserModel = require('./model');

module.exports = (client) => {
  const router = express.Router();
  const userModel = new UserModel(client);

  // (1) Create new user
  router.post('/sign-up', async (req, res) => {
    try {
      await client.connect();
      const result = await userModel.createUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    } finally {
      await client.close();
    }
  });

  // (2) Get all users
  router.get('/get-users', async (req, res) => {
    try {
      await client.connect();
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      await client.close();
    }
  });

  // (3) Delete user
  router.delete('/delete/:id', async (req, res) => {
    try {
      await client.connect();
      const result = await userModel.deleteUser(req.params.id);
      if (result.deletedCount === 0) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      await client.close();
    }
  });

  // (4) Change password
  router.put('/update-password/:id', async (req, res) => {
    try {
      await client.connect();
      const result = await userModel.updateUserPassword(req.params.id, req.body.password);
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      await client.close();
    }
  });

  // (5) Search by email
  router.get('/search-by-email/:email', async (req, res) => {
    try {
      await client.connect();
      const user = await userModel.findUserByEmail(req.params.email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      await client.close();
    }
  });

  // (6) Show total users
  router.get('/total-users', async (req, res) => {
    try {
      await client.connect();
      const totalUsers = await userModel.countTotalUsers();
      res.json({ totalUsers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      await client.close();
    }
  });

  // (7) Show active users
  router.get('/active-users', async (req, res) => {
    try {
      await client.connect();
      const activeUsers = await userModel.countActiveUsers();
      res.json({ activeUsers });
    } catch (error) {
      res.status(500).json({ message: error.message });
    } finally {
      await client.close();
    }
  });

  return router;
};
