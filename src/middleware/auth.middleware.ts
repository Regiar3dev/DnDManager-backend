// Extend Express Request type to include 'user' property
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
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
  console.log('Auth Header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'No token provided' });


  const token = authHeader.split('Bearer ')[1];
  console.log('Token length:', token?.length);
  console.log('Token preview:', token?.substring(0, 50) + '...');

  if (!token) {
    return res.status(401).json({ error: 'Token extraction failed' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Decoded Token:', decodedToken);
    
    req.user = { uid: decodedToken.uid };
    // console.log('Request Body after attaching decoded token:', req.body);
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
