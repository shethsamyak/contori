import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { query } from './db';
import type { AuthPayload, User } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'countori-super-secret-key-change-in-production';
const JWT_EXPIRY = '7d';
const COOKIE_NAME = 'countori_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<(User & { company_id?: string }) | null> {
  const token = await getAuthCookie();
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const result = await query('SELECT id, email, full_name, role, avatar_url, created_at FROM users WHERE id = $1', [payload.userId]);
    if (result.rows.length === 0) return null;

    // Get default company
    const companyResult = await query(
      'SELECT company_id FROM user_companies WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC LIMIT 1',
      [payload.userId]
    );

    return {
      ...result.rows[0],
      company_id: payload.companyId || companyResult.rows[0]?.company_id,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<User & { company_id: string }> {
  const user = await getCurrentUser();
  if (!user || !user.company_id) {
    throw new Error('Unauthorized');
  }
  return user as User & { company_id: string };
}
