/**
 * server.js - Entry point
 *
 *
 * Responsibilities:
 *   - Bootstrap Express with middleware
 *   - Mount all route modules
 *   - Start HTTP server
 *
 * Everything else lives in routes/.
 */
import 'dotenv/config';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import http from 'http';
import express from 'express';

import { fileURLToPath } from 'url';

import professionalRoute from './routes/professional.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);



////////////////////////////////////////
// Middleware
////////////////////////////////////////
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


////////////////////////////////////////
// Routes
////////////////////////////////////////
app.use(express.static(path.join(__dirname, 'public')));
app.use('/professional', professionalRoute);
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});


////////////////////////////////////////
// Server
////////////////////////////////////////
http.createServer(app).listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});


process.on('SIGINT', () => {
  console.log('\nGoodbye!');
  process.exit(0);
});