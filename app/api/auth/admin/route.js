import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, checkOnly } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Wrap DB connection and query in a try block for safety
    let admin;
    try {
      const client = await clientPromise;
      const DB_NAME = process.env.MONGODB_DB || 'lumina_gadgets';
      const db = client.db(DB_NAME);
      admin = await db.collection('admins').findOne({ email: email });
    } catch (dbError) {
      console.error('Database query failed:', dbError.message);
      return NextResponse.json({ message: 'Database connection error' }, { status: 503 });
    }

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid admin credentials', success: false },
        { status: 401 }
      );
    }

    // If checkOnly is true, we just verify the user exists in admins collection
    if (checkOnly) {
      return NextResponse.json({
        success: true,
        user: {
          email: admin.email,
          role: 'admin'
        }
      });
    }

    if (!password) {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      );
    }

    // Check hashed password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid admin credentials', success: false },
        { status: 401 }
      );
    }

    // Success
    return NextResponse.json({
      success: true,
      user: {
        email: admin.email,
        displayName: admin.name || 'Admin',
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('MongoDB Auth Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
