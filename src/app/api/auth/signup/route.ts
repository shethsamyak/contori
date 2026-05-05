import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'countori-super-secret-key-change-in-production';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name, company_name } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if user exists
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    // Create user
    const password_hash = await bcrypt.hash(password, 12);
    const userResult = await query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
      [email, password_hash, full_name, 'admin']
    );
    const user = userResult.rows[0];

    // Create company
    let companyId: string;
    if (company_name) {
      const companyResult = await query(
        'INSERT INTO companies (name) VALUES ($1) RETURNING id',
        [company_name]
      );
      companyId = companyResult.rows[0].id;
    } else {
      const companyResult = await query(
        "INSERT INTO companies (name) VALUES ($1) RETURNING id",
        [`${full_name}'s Company`]
      );
      companyId = companyResult.rows[0].id;
    }

    // Link user to company
    await query(
      'INSERT INTO user_companies (user_id, company_id, role, is_default) VALUES ($1, $2, $3, $4)',
      [user.id, companyId, 'owner', true]
    );

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, companyId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
        token,
      },
    });

    response.cookies.set('countori_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
