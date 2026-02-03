import { cookies } from 'next/headers'
import { prisma } from './db'

const SESSION_COOKIE_NAME = 'hvac_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

interface SessionPayload {
  userId: string
  email: string
}

function encodeSession(payload: SessionPayload): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('SESSION_SECRET is not set')

  const data = JSON.stringify({
    ...payload,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  })

  // Simple base64 encoding with HMAC-like signature
  const encoded = Buffer.from(data).toString('base64')
  const signature = Buffer.from(
    `${encoded}.${secret}`
  ).toString('base64').slice(0, 32)

  return `${encoded}.${signature}`
}

function decodeSession(token: string): SessionPayload | null {
  const secret = process.env.SESSION_SECRET
  if (!secret) return null

  try {
    const [encoded, signature] = token.split('.')

    // Verify signature
    const expectedSignature = Buffer.from(
      `${encoded}.${secret}`
    ).toString('base64').slice(0, 32)

    if (signature !== expectedSignature) return null

    const data = JSON.parse(Buffer.from(encoded, 'base64').toString())

    // Check expiration
    if (data.exp < Date.now()) return null

    return {
      userId: data.userId,
      email: data.email,
    }
  } catch {
    return null
  }
}

export async function createSession(userId: string, email: string): Promise<void> {
  const token = encodeSession({ userId, email })
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  return decodeSession(token)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.superAdmin.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, createdAt: true },
  })

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
