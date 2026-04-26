import { Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../types';

export class CommunicationController {
  // Posts
  async createPost(req: AuthenticatedRequest, res: Response) {
    try {
      const { content, category, imageUrl } = req.body;
      const authorId = req.userId!;

      const post = await prisma.post.create({
        data: {
          authorId,
          content,
          category,
          imageUrl,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          },
          likedBy: true,
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error('Create post error:', error);
      return res.status(500).json({ error: 'Erro ao criar post' });
    }
  }

  async listPosts(req: AuthenticatedRequest, res: Response) {
    try {
      const { category } = req.query;

      const posts = await prisma.post.findMany({
        where: category ? { category: category as string } : {},
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
          likedBy: true,
        },
        orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      });

      return res.json(posts);
    } catch (error) {
      console.error('List posts error:', error);
      return res.status(500).json({ error: 'Erro ao listar posts' });
    }
  }

  async likePost(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const existingLike = await prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: id,
            userId,
          },
        },
      });

      if (existingLike) {
        await prisma.like.delete({
          where: { id: existingLike.id },
        });

        await prisma.post.update({
          where: { id },
          data: { likes: { decrement: 1 } },
        });

        return res.json({ liked: false });
      } else {
        await prisma.like.create({
          data: {
            postId: id,
            userId,
          },
        });

        await prisma.post.update({
          where: { id },
          data: { likes: { increment: 1 } },
        });

        return res.json({ liked: true });
      }
    } catch (error) {
      console.error('Like post error:', error);
      return res.status(500).json({ error: 'Erro ao curtir post' });
    }
  }

  async createComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const authorId = req.userId!;

      const comment = await prisma.comment.create({
        data: {
          postId: id,
          authorId,
          content,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      return res.status(201).json(comment);
    } catch (error) {
      console.error('Create comment error:', error);
      return res.status(500).json({ error: 'Erro ao criar comentário' });
    }
  }

  // Messages (Chat)
  async sendMessage(req: AuthenticatedRequest, res: Response) {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.userId!;

      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      return res.status(201).json(message);
    } catch (error) {
      console.error('Send message error:', error);
      return res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
  }

  async getMessages(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId: otherUserId } = req.params;
      const currentUserId = req.userId!;

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: currentUserId },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      await prisma.message.updateMany({
        where: {
          senderId: otherUserId,
          receiverId: currentUserId,
          read: false,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      return res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      return res.status(500).json({ error: 'Erro ao buscar mensagens' });
    }
  }

  async getConversations(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId!;

      const messages = await prisma.message.findMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const conversationsMap = new Map();

      messages.forEach((message) => {
        const otherUser =
          message.senderId === userId ? message.receiver : message.sender;
        const otherUserId = otherUser.id;

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            user: otherUser,
            lastMessage: message,
            unreadCount: 0,
          });
        }

        if (message.receiverId === userId && !message.read) {
          const conversation = conversationsMap.get(otherUserId);
          conversation.unreadCount += 1;
        }
      });

      const conversations = Array.from(conversationsMap.values());

      return res.json(conversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      return res.status(500).json({ error: 'Erro ao buscar conversas' });
    }
  }
}
