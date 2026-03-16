import { getAdminAuth } from '@/lib/firebase-admin';
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password, name, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const adminAuth = getAdminAuth();
    if (!adminAuth) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // 1. Create user in Firebase
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Add to MongoDB roles/admins collection
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'lumina_gadgets');
    
    // For now we store all non-customer users in 'admins' or a new 'staff' collection
    // The existing AuthProvider checks 'admins' collection
    await db.collection('admins').insertOne({
      email,
      name,
      role, // 'admin', 'staff', 'delivery'
      firebaseUid: userRecord.uid,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      uid: userRecord.uid,
      message: `User created with role: ${role}` 
    });

  } catch (error) {
    console.error('Create User Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
