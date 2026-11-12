import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthTokenPayload {
  id: number;
  username: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.AUTH_SECRET ||
  'surfplay_neon_vercel_secret_jwt_key_2026';

/**
 * Signs a cryptographic JWT token for authenticated users.
 */
export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
}

/**
 * Middleware that strictly verifies the JWT token from the Authorization header.
 * Rejects requests without valid tokens.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Sessão não autenticada. Por favor, faça login para continuar.',
    });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return res.status(401).json({
      error: 'Token de autenticação vazio.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({
      error: 'Token inválido ou expirado. Faça login novamente.',
    });
  }
}

/**
 * Middleware that ensures the authenticated user is an administrator.
 * Does NOT trust client-submitted custom headers (x-admin-role, etc.).
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        error: 'Acesso restrito: somente administradores autorizados podem acessar este recurso.',
      });
    }
    next();
  });
}
