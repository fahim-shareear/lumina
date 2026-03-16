import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

const DB_NAME = process.env.MONGODB_DB || 'lumina';
const COLLECTION_NAME = 'orders';

/**
 * Shared helper for single order operations to handle auth failures gracefully.
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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const order = await runOrderQuery(async (col) => {
      return await col.findOne({ _id: new ObjectId(id) });
    });

    if (order === null) {
      // If runOrderQuery returns null, it's either an auth error or genuinely not found
      // We check if it's the specific case of not found inside the operation if we need to distinguish
      // but here we can assume null means unreachable/error from our wrapper.
      return NextResponse.json({ error: 'Order not found or database unreachable' }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Order Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const result = await runOrderQuery(async (col) => {
      return await col.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: data },
        { returnDocument: 'after' }
      );
    });
    
    if (!result) {
      return NextResponse.json({ error: 'Order not found or database unreachable' }, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Order Update Error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    const success = await runOrderQuery(async (col) => {
      const result = await col.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    });
    
    if (!success) {
      return NextResponse.json({ error: 'Order not found or database unreachable' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
