// In-memory product store (in production, use a database)
// This module acts as a simple server-side store

let products = [
  {
    id: '1',
    title: 'Noir Obsidian Watch',
    shortDescription: 'Swiss-made automatic timepiece with obsidian case and sapphire crystal glass.',
    fullDescription: 'The Noir Obsidian Watch represents the pinnacle of horological artistry. Crafted from genuine obsidian volcanic glass and powered by a Swiss ETA 2824-2 automatic movement, this timepiece offers 42 hours of power reserve. The case measures 42mm in diameter and features a hand-stitched alligator leather strap. Each piece is individually numbered and comes with a certificate of authenticity.',
    price: 4850,
    category: 'Timepieces',
    imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80',
    createdAt: '2024-01-15',
    priority: 'Featured',
    addedBy: 'demo@lumina.com',
  },
  {
    id: '2',
    title: 'Velvet Aurora Perfume',
    shortDescription: 'A rare blend of aged oud, Tasmanian pepperberry, and white amber from the Malabar coast.',
    fullDescription: 'Velvet Aurora is an olfactory journey through the world\'s most exotic botanical regions. Opening with the bright zing of Tasmanian pepperberry and green cardamom, it evolves through a heart of Bulgarian rose absolute and night-blooming jasmine. The base is anchored by 30-year-aged Hindi oud, white amber from Kerala, and rare ambergris. Each 50ml flacon is hand-blown Murano glass.',
    price: 680,
    category: 'Fragrance',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80',
    createdAt: '2024-02-03',
    priority: 'High',
    addedBy: 'demo@lumina.com',
  },
  {
    id: '3',
    title: 'Espresso Ritual Set',
    shortDescription: 'Hand-thrown ceramic espresso set with 24k gold detailing and matching tray.',
    fullDescription: 'The Espresso Ritual Set transforms your daily coffee routine into a meditative ceremony. Each piece is individually hand-thrown by master ceramicist Kenji Yamazaki in his Kyoto studio. The 80ml cups feature walls of precisely 3mm thickness for optimal heat retention. The 24k gold banding is applied using traditional fire-gilding techniques. Set includes 4 cups, 4 saucers, and a carrying tray of Hinoki cypress wood.',
    price: 340,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    createdAt: '2024-02-18',
    priority: 'Normal',
    addedBy: 'demo@lumina.com',
  },
  {
    id: '4',
    title: 'Cashmere Cloud Throw',
    shortDescription: 'Grade A Mongolian cashmere throw, hand-loomed in a traditional Scottish mill.',
    fullDescription: 'Sourced from the underbelly fleece of free-range Mongolian cashmere goats at altitude exceeding 3,000 meters, this throw represents cashmere at its finest. The 2-ply yarn is hand-loomed at the historic Johnstons of Elgin mill, established 1797. Measuring 180×130cm and weighing just 380g, it drapes with extraordinary softness. Available in 12 natural, undyed colorways.',
    price: 890,
    category: 'Textiles',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    createdAt: '2024-03-01',
    priority: 'High',
    addedBy: 'user@test.com',
  },
  {
    id: '5',
    title: 'Botanical Serum Collection',
    shortDescription: 'Four-phase skin renewal system with rare Alpine botanicals and fermented actives.',
    fullDescription: 'The Botanical Serum Collection is formulated around the concept of chronobiology — delivering different active compounds in alignment with the skin\'s natural circadian rhythm. The AM phase features trans-resveratrol from French Pinot Noir and broad-spectrum protection. The PM phase combines retinaldehyde with Bakuchiol for accelerated cell turnover. The weekly treatment uses 14% glycolic acid derived from sugarcane.',
    price: 420,
    category: 'Beauty',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    createdAt: '2024-03-12',
    priority: 'Featured',
    addedBy: 'demo@lumina.com',
  },
  {
    id: '6',
    title: 'Architect\'s Notebook',
    shortDescription: 'Full-grain vegetable-tanned leather journal with handmade cotton rag paper.',
    fullDescription: 'The Architect\'s Notebook is produced in collaboration with Florence\'s oldest bindery, Giulio Giannini e Figlio, founded in 1856. The cover is Hermann Oak leather, vegetable-tanned over 14 months and hand-burnished. Inside, 240 pages of 120gsm cotton rag paper — acid-free and fountain-pen friendly — are Smyth sewn to lie perfectly flat. A ribbon marker and leather pen loop complete the piece.',
    price: 195,
    category: 'Stationery',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80',
    createdAt: '2024-03-20',
    priority: 'Normal',
    addedBy: 'user@test.com',
  },
];

export function getProducts() {
  return [...products];
}

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function addProduct(product) {
  const newProduct = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
  };
  products.push(newProduct);
  return newProduct;
}

export function deleteProduct(id) {
  const index = products.findIndex((p) => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    return true;
  }
  return false;
}
