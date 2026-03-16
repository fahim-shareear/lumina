import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

const DB_NAME = process.env.MONGODB_DB || 'lumina_gadgets';
const COLLECTION_NAME = 'orders';

/**
 * Shared helper for order operations to handle auth failures gracefully.
 */
async function runOrderQuery(operation) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    return await operation(collection);
  } catch (error) {
    console.error("Order DB Error:", error.message);
    if (error.message.includes('auth') || error.message.includes('Authentication')) {
      return null;
    }
    throw error;
  }
}

export async function GET() {
  try {
    const orders = await runOrderQuery(async (col) => {
      return await col.find({})
        .sort({ createdAt: -1 })
        .toArray();
    });

    if (orders === null) {
      return NextResponse.json({ error: 'Database authentication failed' }, { status: 503 });
    }
      
    return NextResponse.json(orders);
    
  } catch (error) {
    console.error('Fetch All Orders Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
