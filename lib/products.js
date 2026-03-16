import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.MONGODB_DB || 'lumina_gadgets';
const COLLECTION_NAME = 'products';

/**
 * Generic handler to run MongoDB operations safely.
 * Returns empty/null on auth failure during build or dev to prevent server crashes.
 */
async function runQuery(operation) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    return await operation(collection);
  } catch (error) {
    console.error("Query Error:", error.message);
    // If it's a bad auth error, we gracefully return fallback data 
    // to prevent the entire Next.js server from returning 500.
    if (error.message.includes('auth') || error.message.includes('Authentication')) {
      return null;
    }
    throw error;
  }
}

export async function getProducts() {
  const result = await runQuery(async (col) => {
    const products = await col.find({}).toArray();
    return products.map(p => ({
      ...p,
      id: p._id.toString(),
      _id: undefined
    }));
  });
  return result || [];
}

export async function getProductById(id) {
  return await runQuery(async (col) => {
    let product;
    try {
      product = await col.findOne({ _id: new ObjectId(id) });
    } catch {
      product = await col.findOne({ id: id });
    }
    if (!product) return null;
    return {
      ...product,
      id: product._id.toString(),
      _id: undefined
    };
  });
}

export async function addProduct(product) {
  return await runQuery(async (col) => {
    const newProduct = {
      ...product,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const result = await col.insertOne(newProduct);
    return {
      ...newProduct,
      id: result.insertedId.toString()
    };
  });
}

export async function updateProduct(id, updatedData) {
  return await runQuery(async (col) => {
    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { id: id };
    }
    const result = await col.findOneAndUpdate(
      query,
      { $set: updatedData },
      { returnDocument: 'after' }
    );
    if (!result) return null;
    return {
      ...result,
      id: result._id ? result._id.toString() : result.id,
      _id: undefined
    };
  });
}

export async function deleteProduct(id) {
  const success = await runQuery(async (col) => {
    let query;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { id: id };
    }
    const result = await col.deleteOne(query);
    return result.deletedCount > 0;
  });
  return !!success;
}
