import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { container } from './config';
import { errorHandler, notFoundHandler, requestLogger } from './middleware';
import apiRoutes from './routes';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;


const prisma = container.prisma;


app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


if (process.env.NODE_ENV === 'development') {
  app.use(requestLogger);
}


app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.get('/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'OK',
      message: 'Database connection is healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});


app.use('/api', apiRoutes);


app.get('/api', (req, res) => {
  res.json({ 
    status: 'SUCCESS',
    message: 'API is working!',
    version: '1.0.0'
  });
});


app.use(notFoundHandler);


app.use(errorHandler);


process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await container.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await container.disconnect();
  process.exit(0);
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;