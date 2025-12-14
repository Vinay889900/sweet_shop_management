import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/authRoutes';
import sweetsRoutes from './routes/sweetsRoutes';

import cartRoutes from './routes/cartRoutes';

import path from 'path';

const app: Express = express();

app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for local dev/imagedelivery compatibility
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);
app.use('/api/cart', cartRoutes);

// Helper to find frontend dist
const frontendDist = path.join(__dirname, '../../frontend/dist');

// Serve static files from frontend/dist
app.use(express.static(frontendDist));

// API root message
app.get('/api', (req: Request, res: Response) => {
    res.send('Sweet Shop API is running');
});

// Catch-all to serve React app for non-API routes
app.get('*', (req: Request, res: Response) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
});

export default app;
