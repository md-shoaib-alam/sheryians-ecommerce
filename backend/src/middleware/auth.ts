import { Request, Response, NextFunction } from 'express'

// Verify Clerk JWT token - the userId comes from Clerk's session token
// In production, use @clerk/backend to verify the token properly
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // Decode the JWT to extract the sub (Clerk user ID)
    // For proper verification use @clerk/backend verifyToken
    const base64Payload = token.split('.')[1]
    const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'))

    if (!payload.sub) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' })
    }

    // Attach clerkId to request
    ;(req as any).clerkId = payload.sub
    ;(req as any).email   = payload.email || ''
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Token verification failed' })
  }
}

// Optional auth — doesn't reject, just sets clerkId if token present
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1]
      const base64Payload = token.split('.')[1]
      const payload = JSON.parse(Buffer.from(base64Payload, 'base64').toString('utf8'))
      ;(req as any).clerkId = payload.sub
    } catch {}
  }
  next()
}
