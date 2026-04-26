import { Response } from 'express';
import prisma from '../config/database';
import { AuthenticatedRequest } from '../types';

export class AdmissionController {
  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { department, position, startDate } = req.body;
      const userId = req.userId!;

      const admission = await prisma.admission.create({
        data: {
          userId,
          department,
          position,
          startDate: new Date(startDate),
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

      return res.status(201).json(admission);
    } catch (error) {
      console.error('Create admission error:', error);
      return res.status(500).json({ error: 'Erro ao criar admissão' });
    }
  }

  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const userRole = req.userRole;
      const userId = req.userId!;

      let admissions;

      if (userRole === 'RH' || userRole === 'GESTOR') {
        admissions = await prisma.admission.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            documents: true,
          },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        admissions = await prisma.admission.findMany({
          where: { userId },
          include: {
            documents: true,
          },
          orderBy: { createdAt: 'desc' },
        });
      }

      return res.json(admissions);
    } catch (error) {
      console.error('List admissions error:', error);
      return res.status(500).json({ error: 'Erro ao listar admissões' });
    }
  }

  async show(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const admission = await prisma.admission.findUnique({
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
          documents: true,
        },
      });

      if (!admission) {
        return res.status(404).json({ error: 'Admissão não encontrada' });
      }

      return res.json(admission);
    } catch (error) {
      console.error('Show admission error:', error);
      return res.status(500).json({ error: 'Erro ao buscar admissão' });
    }
  }

  async uploadDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { admissionId, documentName } = req.body;
      const userId = req.userId!;
      const file = req.files?.file as any;

      if (!file) {
        return res.status(400).json({ error: 'Arquivo não fornecido' });
      }

      const fileUrl = `/uploads/${file.name}`;
      await file.mv(`./uploads/${file.name}`);

      const document = await prisma.document.create({
        data: {
          admissionId,
          userId,
          name: documentName,
          status: 'UPLOADED',
          fileUrl,
          uploadDate: new Date(),
        },
      });

      await prisma.admission.update({
        where: { id: admissionId },
        data: {
          docsApproved: {
            increment: 0,
          },
        },
      });

      return res.status(201).json(document);
    } catch (error) {
      console.error('Upload document error:', error);
      return res.status(500).json({ error: 'Erro ao fazer upload do documento' });
    }
  }

  async approveDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      const document = await prisma.document.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvalDate: new Date(),
        },
      });

      await prisma.admission.update({
        where: { id: document.admissionId },
        data: {
          docsApproved: {
            increment: 1,
          },
        },
      });

      return res.json(document);
    } catch (error) {
      console.error('Approve document error:', error);
      return res.status(500).json({ error: 'Erro ao aprovar documento' });
    }
  }
}
