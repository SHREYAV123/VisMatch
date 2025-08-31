// server.ts - Main Express Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";

// Import routes
import productRoutes from './routes/productRoutes';
import searchRoutes from './routes/searchRoutes';
import DataService from './services/dataService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Database info
console.log('🗄️ Using MongoDB Atlas cloud database');

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Use route modules
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);

// Get categories endpoint (moved from productRoutes to maintain API structure)
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await DataService.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get brands endpoint (moved from productRoutes to maintain API structure)
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await DataService.distinct('brand');
    res.json({ brands });
  } catch (error) {
    console.error('Brands error:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large" });
  }

  if (err.message && err.message.includes("Only image files")) {
    return res.status(400).json({ error: "Only image files are allowed" });
  }

  return res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

export default app;