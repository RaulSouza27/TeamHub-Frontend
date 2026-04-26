import { Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../types';

export class OnboardingController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.userId!;

      const existingOnboarding = await prisma.onboarding.findFirst({
        where: {
          userId,
          status: { in: ['NOT_STARTED', 'IN_PROGRESS'] },
        },
      });

      if (existingOnboarding) {
        return res.status(400).json({ error: 'Onboarding já existe para este usuário' });
      }

      const onboarding = await prisma.onboarding.create({
        data: {
          userId,
          status: 'IN_PROGRESS',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return res.status(201).json(onboarding);
    } catch (error) {
      console.error('Create onboarding error:', error);
      return res.status(500).json({ error: 'Erro ao criar onboarding' });
    }
  }

  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const userRole = req.userRole;
      const userId = req.userId!;

      let onboardings;

      if (userRole === 'RH' || userRole === 'GESTOR') {
        onboardings = await prisma.onboarding.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            tracks: {
              include: {
                tasks: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        onboardings = await prisma.onboarding.findMany({
          where: { userId },
          include: {
            tracks: {
              include: {
                tasks: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      }

      return res.json(onboardings);
    } catch (error) {
      console.error('List onboardings error:', error);
      return res.status(500).json({ error: 'Erro ao listar onboardings' });
    }
  }

  async show(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const onboarding = await prisma.onboarding.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          tracks: {
            include: {
              tasks: true,
            },
            orderBy: { order: 'asc' },
          },
        },
      });

      if (!onboarding) {
        return res.status(404).json({ error: 'Onboarding não encontrado' });
      }

      return res.json(onboarding);
    } catch (error) {
      console.error('Show onboarding error:', error);
      return res.status(500).json({ error: 'Erro ao buscar onboarding' });
    }
  }

  async updateProgress(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { taskId, completed } = req.body;
      const userId = req.userId!;

      const progress = await prisma.onboardingProgress.upsert({
        where: {
          onboardingId_taskId: {
            onboardingId: id,
            taskId,
          },
        },
        update: {
          completed,
          completedAt: completed ? new Date() : null,
        },
        create: {
          onboardingId: id,
          userId,
          taskId,
          completed,
          completedAt: completed ? new Date() : null,
        },
      });

      const onboarding = await prisma.onboarding.findUnique({
        where: { id },
        include: {
          tracks: {
            include: {
              tasks: true,
            },
          },
          progress: true,
        },
      });

      if (onboarding) {
        const totalTasks = onboarding.tracks.reduce(
          (acc, track) => acc + track.tasks.length,
          0
        );
        const completedTasks = onboarding.progress.filter((p) => p.completed).length;
        const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

        await prisma.onboarding.update({
          where: { id },
          data: {
            progress: progressPercentage,
            status: progressPercentage === 100 ? 'COMPLETED' : 'IN_PROGRESS',
          },
        });
      }

      return res.json(progress);
    } catch (error) {
      console.error('Update progress error:', error);
      return res.status(500).json({ error: 'Erro ao atualizar progresso' });
    }
  }
}
