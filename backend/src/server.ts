import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import prisma from './config/database';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
  limits: { fileSize: env.MAX_FILE_SIZE },
  abortOnLimit: true,
  createParentPath: true,
}));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', routes);

// Error Handler
app.use(errorHandler);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io - Chat em Tempo Real
const connectedUsers = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register', (userId: string) => {
    connectedUsers.set(userId, socket.id);
    io.emit('user-online', userId);
  });

  socket.on('send-message', async (data: {
    senderId: string;
    receiverId: string;
    content: string;
  }) => {
    try {
      const message = await prisma.message.create({
        data: {
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive-message', message);
      }

      socket.emit('message-sent', message);
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('message-error', { error: 'Erro ao enviar mensagem' });
    }
  });

  socket.on('typing', (data: { receiverId: string }) => {
    const receiverSocketId = connectedUsers.get(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user-typing', { userId: socket.id });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const userId = Array.from(connectedUsers.entries()).find(
      ([, socketId]) => socketId === socket.id
    )?.[0];

    if (userId) {
      connectedUsers.delete(userId);
      io.emit('user-offline', userId);
    }
  });
});

// Start Server
const PORT = env.PORT;
const HOST = env.HOST;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📡 Socket.io running on http://${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});
