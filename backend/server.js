const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const userRoutes = require('./routes');

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use('/user-auth', userRoutes(client));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
