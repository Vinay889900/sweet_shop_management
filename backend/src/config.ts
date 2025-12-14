import dotenv from 'dotenv';

dotenv.config();

// Consolidated Secret Logic
// 1. Try JWT_SECRET (Env)
// 2. Try SECRET_KEY (Env - Render style)
// 3. Fallback to hardcoded string (Safety net for Free Tier/Dev)
export const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET_KEY || 'sweet-shop-super-secret-key-fallback';

// Debug log to confirm which one is active (Masked for security)
const source = process.env.JWT_SECRET ? 'JWT_SECRET' : (process.env.SECRET_KEY ? 'SECRET_KEY' : 'FALLBACK');
console.log(`[Config] Loaded JWT Secret from: ${source} (Length: ${JWT_SECRET.length})`);
