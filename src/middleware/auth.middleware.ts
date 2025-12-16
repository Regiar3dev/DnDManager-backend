// Extend Express Request type to include 'user' property
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      auth?: any;
      user?: any;
    }
  }
}
import { Response, NextFunction } from 'express';
import admin from '../config/firebase.config';

export default async function authMiddleware (
  req: Request,
  res: Response,
  next: NextFunction
) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });


  const token = authHeader.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token extraction failed' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.auth = { uid: decodedToken.uid };
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
