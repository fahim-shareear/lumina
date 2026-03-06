import { NextResponse } from 'next/server';
import { getProductById, deleteProduct } from '@/lib/products';

export async function GET(request, { params }) {
  const product = getProductById(params.id);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function DELETE(request, { params }) {
  // For demo purposes, allowing unauthenticated access
  // In production, implement proper authentication

  const deleted = deleteProduct(params.id);
  if (!deleted) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
