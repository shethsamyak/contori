import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'countori-super-secret-key-change-in-production';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('countori_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string; companyId: string };

    // Look up user in the real database
    const userResult = await query(
      'SELECT id, email, full_name, role FROM users WHERE id = $1',
      [payload.userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const user = userResult.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
        companyId: payload.companyId,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }
}
