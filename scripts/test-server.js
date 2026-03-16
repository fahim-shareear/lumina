const express = require("express");
const cors = require("cors");
// Use port 5000 to avoid conflict with Next.js on 3000
const port = 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const app = express();
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is up and running");
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    
    // Choose the database name from user's request
    const database = client.db("lumina_gadgets");
    
    // Fix the 'db' vs 'database' reference error
    const userCollection = database.collection("users");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    
    // Test endpoint to verify data access
    app.get("/test-data", async (req, res) => {
      try {
        const products = await productCollection.find({}).limit(1).toArray();
        res.json({ success: true, message: "Connected!", database: "lumina_gadgets", sampleProduct: products });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

  } catch (err) {
    console.error("Connection Error:", err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Lumina Test Server running on http://localhost:${port}`);
  console.log(`Visit http://localhost:${port}/test-data to verify connection`);
});
