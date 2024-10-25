import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas
app.use('/api/auth', authRoutes);

// Crear un servidor HTTP
const server = createServer(app);
const io = new Server(server);

// Manejar conexiones de Socket.io
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Escuchar mensajes del cliente
  socket.on('chat message', (msg) => {
    console.log('Mensaje recibido:', msg);
    // Emitir el mensaje a todos los clientes conectados
    io.emit('chat message', msg);
  });

  // Manejar desconexiones
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Escuchar en el puerto definido
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
