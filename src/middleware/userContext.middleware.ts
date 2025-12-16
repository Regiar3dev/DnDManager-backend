import { Request, Response, NextFunction } from 'express';
import UserService from '../services/User.service';

export default async function userContextMiddleware (
  req: Request,
  res: Response,
  next: NextFunction
) {
    const firebaseId = req.auth?.uid;

    if (!firebaseId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    await UserService.getUserByUid(firebaseId).then(user => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        req.user = user;
    }).catch(error => {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    });
    next();
};