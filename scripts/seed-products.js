require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}
const client = new MongoClient(uri);

const products = [
  {
    title: 'Noir Obsidian Watch',
    shortDescription: 'Swiss-made automatic timepiece with obsidian case and sapphire crystal glass.',
    fullDescription: 'The Noir Obsidian Watch represents the pinnacle of horological artistry. Crafted from genuine obsidian volcanic glass and powered by a Swiss ETA 2824-2 automatic movement, this timepiece offers 42 hours of power reserve. The case measures 42mm in diameter and features a hand-stitched alligator leather strap. Each piece is individually numbered and comes with a certificate of authenticity.',
    price: 4850,
    category: 'Timepieces',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    createdAt: '2024-01-15',
    priority: 'Featured',
    addedBy: 'admin@lumina.com',
  },
  {
    title: 'Velvet Aurora Perfume',
    shortDescription: 'A rare blend of aged oud, Tasmanian pepperberry, and white amber from the Malabar coast.',
    fullDescription: 'Velvet Aurora is an olfactory journey through the world\'s most exotic botanical regions. Opening with the bright zing of Tasmanian pepperberry and green cardamom, it evolves through a heart of Bulgarian rose absolute and night-blooming jasmine. The base is anchored by 30-year-aged Hindi oud, white amber from Kerala, and rare ambergris. Each 50ml flacon is hand-blown Murano glass.',
    price: 680,
    category: 'Fragrance',
    imageUrl: 'https://images.unsplash.com/photo-1594125355930-949659a56754?w=600&q=80',
    createdAt: '2024-02-03',
    priority: 'High',
    addedBy: 'admin@lumina.com',
  },
  {
    title: 'Espresso Ritual Set',
    shortDescription: 'Hand-thrown ceramic espresso set with 24k gold detailing and matching tray.',
    fullDescription: 'The Espresso Ritual Set transforms your daily coffee routine into a meditative ceremony. Each piece is individually hand-thrown by master ceramicist Kenji Yamazaki in his Kyoto studio. The 80ml cups feature walls of precisely 3mm thickness for optimal heat retention. The 24k gold banding is applied using traditional fire-gilding techniques. Set includes 4 cups, 4 saucers, and a carrying tray of Hinoki cypress wood.',
    price: 340,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=600&q=80',
    createdAt: '2024-02-18',
    priority: 'Normal',
    addedBy: 'admin@lumina.com',
  },
  {
    title: 'Cashmere Cloud Throw',
    shortDescription: 'Grade A Mongolian cashmere throw, hand-loomed in a traditional Scottish mill.',
    fullDescription: 'Sourced from the underbelly fleece of free-range Mongolian cashmere goats at altitude exceeding 3,000 meters, this throw represents cashmere at its finest. The 2-ply yarn is hand-loomed at the historic Johnstons of Elgin mill, established 1797. Measuring 180×130cm and weighing just 380g, it drapes with extraordinary softness. Available in 12 natural, undyed colorways.',
    price: 890,
    category: 'Textiles',
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80',
    createdAt: '2024-03-01',
    priority: 'High',
    addedBy: 'admin@lumina.com',
  },
  {
    title: 'Botanical Serum Collection',
    shortDescription: 'Four-phase skin renewal system with rare Alpine botanicals and fermented actives.',
    fullDescription: 'The Botanical Serum Collection is formulated around the concept of chronobiology — delivering different active compounds in alignment with the skin\'s natural circadian rhythm. The AM phase features trans-resveratrol from French Pinot Noir and broad-spectrum protection. The PM phase combines retinaldehyde with Bakuchiol for accelerated cell turnover. The weekly treatment uses 14% glycolic acid derived from sugarcane.',
    price: 420,
    category: 'Beauty',
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80',
    createdAt: '2024-03-12',
    priority: 'Featured',
    addedBy: 'admin@lumina.com',
  },
  {
    title: 'Architect\'s Notebook',
    shortDescription: 'Full-grain vegetable-tanned leather journal with handmade cotton rag paper.',
    fullDescription: 'The Architect\'s Notebook is produced in collaboration with Florence\'s oldest bindery, Giulio Giannini e Figlio, founded in 1856. The cover is Hermann Oak leather, vegetable-tanned over 14 months and hand-burnished. Inside, 240 pages of 120gsm cotton rag paper — acid-free and fountain-pen friendly — are Smyth sewn to lie perfectly flat. A ribbon marker and leather pen loop complete the piece.',
    price: 195,
    category: 'Stationery',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80',
    createdAt: '2024-03-20',
    priority: 'Normal',
    addedBy: 'admin@lumina.com',
  },
];

async function run() {
  try {
    await client.connect();
    const db = client.db("lumina_gadgets");
    const collection = db.collection("products");

    // Optional: Clear existing products
    // await collection.deleteMany({});

    for (const product of products) {
      const result = await collection.updateOne(
        { title: product.title },
        { $set: product },
        { upsert: true }
      );
      if (result.upsertedCount > 0) {
        console.log(`Added: ${product.title}`);
      } else {
        console.log(`Updated: ${product.title}`);
      }
    }
    console.log("Product seeding complete!");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
