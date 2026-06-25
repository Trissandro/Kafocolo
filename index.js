import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';                                   // NOVO (servidor HTTP partilhado)
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import stationsRoutes from './routes/stationsRoutes.js';   // NOVO
import streamRoutes from './routes/streamRoutes.js';       // NOVO (streaming VOD)
import { initLiveServer } from './live/liveServer.js';     // NOVO (live por WebSocket)

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stations', stationsRoutes);                  // NOVO
app.use('/api/stream', streamRoutes);                      // NOVO (streaming sob demanda - VOD)

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'TV Corporativa - Grupo 23' }));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({ error: err.message });
});

const PORT = process.env.PORT || 4000;

// NOVO: cria um servidor HTTP partilhado entre o Express (HTTP/REST) e o WebSocket (Live)
const server = http.createServer(app);

// NOVO: arranca o servidor de transmissao ao vivo (WebSocket) no MESMO servidor HTTP
initLiveServer(server);

server.listen(PORT, () =>
  console.log(`Servidor TV Corporativa a correr em http://localhost:${PORT}`)
);
