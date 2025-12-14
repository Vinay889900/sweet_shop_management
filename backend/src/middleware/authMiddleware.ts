import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const verified = jwt.verify(token, (process.env.JWT_SECRET || process.env.SECRET_KEY) as string);
        req.user = verified;
        next();
    } catch (err: any) {
        console.error('Token verification failed:', err.message);
        res.status(403).json({ error: 'Invalid token: ' + err.message });
    }
};
