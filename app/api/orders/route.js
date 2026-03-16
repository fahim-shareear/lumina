import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

const DB_NAME = process.env.MONGODB_DB || 'lumina';
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

export async function POST(request) {
  try {
    const orderData = await request.json();
    
    const result = await runOrderQuery(async (col) => {
      const newOrder = {
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      return await col.insertOne(newOrder);
    });

    if (!result) {
      return NextResponse.json({ error: 'Database authentication failed' }, { status: 503 });
    }
    
    return NextResponse.json({
      success: true,
      orderId: result.insertedId.toString(),
      message: 'Order created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Order Creation Error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const orders = await runOrderQuery(async (col) => {
      return await col.find({ 'customer.email': email })
        .sort({ createdAt: -1 })
        .toArray();
    });

    if (orders === null) {
      return NextResponse.json({ error: 'Database authentication failed' }, { status: 503 });
    }
      
    return NextResponse.json(orders);
    
  } catch (error) {
    console.error('Order Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
