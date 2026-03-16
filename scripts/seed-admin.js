require('dotenv').config({ path: '.env.local' });
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcryptjs');

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

async function run() {
  try {
    await client.connect();
    const db = client.db("lumina_gadgets");
    const admins = db.collection("admins");

    const email = "admin@lumina.com";
    const plainPassword = "Lumina@1122";
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const adminData = {
      email,
      password: hashedPassword,
      name: "Lumina Admin",
      role: "admin",
      updatedAt: new Date()
    };

    const result = await admins.updateOne(
      { email },
      { $set: adminData },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log("Admin user created and seeded successfully with hashed password!");
    } else {
      console.log("Admin user already exists, details and hashed password updated.");
    }

  } catch (error) {
    console.error("Seeding operation failed:", error);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
