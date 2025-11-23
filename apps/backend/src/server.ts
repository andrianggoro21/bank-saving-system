import dotenv from 'dotenv';
import app from './app';
import { Server } from 'http';

dotenv.config();

const PORT = process.env.PORT || 8000;

const server: Server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API v1: http://localhost:${PORT}/api/v1`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    console.log('HTTP server closed');
    console.log('Process terminated gracefully');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
