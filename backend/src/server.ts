import { createServer } from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

const app = createApp();
const server = createServer(app);

const start = async () => {
  try {
    await pool.query('SELECT 1');
    server.listen(env.port, () => {
      console.log(`🚀 API running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

start();
