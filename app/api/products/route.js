import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/products';

export async function GET() {
  const products = getProducts();
  return NextResponse.json(products);
}

export async function POST(request) {
  // For demo purposes, allowing unauthenticated access
  // In production, implement proper authentication

  const body = await request.json();
  const { title, shortDescription, fullDescription, price, category, imageUrl, priority } = body;

  if (!title || !shortDescription || !fullDescription || !price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const product = addProduct({
    title,
    shortDescription,
    fullDescription,
    price: parseFloat(price),
    category: category || 'Uncategorized',
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    priority: priority || 'Normal',
    addedBy: session.user.email,
  });

  return NextResponse.json(product, { status: 201 });
}
