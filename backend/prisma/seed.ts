import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Limpar dados existentes
  await prisma.message.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.onboardingProgress.deleteMany();
  await prisma.onboardingTask.deleteMany();
  await prisma.onboardingTrack.deleteMany();
  await prisma.onboarding.deleteMany();
  await prisma.document.deleteMany();
  await prisma.admission.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  const hashedPassword = await bcrypt.hash('123456', 10);

  const colaborador = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'colaborador@teamhub.com',
      password: hashedPassword,
      role: 'COLABORADOR',
    },
  });

  const rh = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'rh@teamhub.com',
      password: hashedPassword,
      role: 'RH',
    },
  });

  const gestor = await prisma.user.create({
    data: {
      name: 'Carlos Oliveira',
      email: 'gestor@teamhub.com',
      password: hashedPassword,
      role: 'GESTOR',
    },
  });

  console.log('✅ Users created');

  // Criar admissão para o colaborador
  const admission = await prisma.admission.create({
    data: {
      userId: colaborador.id,
      department: 'Tecnologia',
      position: 'Desenvolvedor Frontend',
      startDate: new Date('2026-04-15'),
      status: 'in_progress',
      docsTotal: 7,
      docsApproved: 3,
    },
  });

  // Criar documentos
  await prisma.document.createMany({
    data: [
      {
        admissionId: admission.id,
        userId: colaborador.id,
        name: 'RG (Frente e Verso)',
        status: 'APPROVED',
        uploadDate: new Date('2026-04-12'),
        approvalDate: new Date('2026-04-13'),
      },
      {
        admissionId: admission.id,
        userId: colaborador.id,
        name: 'CPF',
        status: 'APPROVED',
        uploadDate: new Date('2026-04-12'),
        approvalDate: new Date('2026-04-13'),
      },
      {
        admissionId: admission.id,
        userId: colaborador.id,
        name: 'Comprovante de Residência',
        status: 'UPLOADED',
        uploadDate: new Date('2026-04-15'),
      },
      {
        admissionId: admission.id,
        userId: colaborador.id,
        name: 'Carteira de Trabalho',
        status: 'PENDING',
      },
    ],
  });

  console.log('✅ Admissions and documents created');

  // Criar onboarding
  const onboarding = await prisma.onboarding.create({
    data: {
      userId: colaborador.id,
      status: 'IN_PROGRESS',
      progress: 60,
    },
  });

  // Criar trilha de onboarding
  const track = await prisma.onboardingTrack.create({
    data: {
      onboardingId: onboarding.id,
      title: 'Integração Inicial',
      description: 'Conhecendo a empresa e a cultura',
      order: 1,
      progress: 80,
    },
  });

  // Criar tarefas
  await prisma.onboardingTask.createMany({
    data: [
      {
        trackId: track.id,
        title: 'Vídeo de Boas-vindas',
        description: 'Mensagem do CEO e visão geral da empresa',
        type: 'video',
        duration: '15 min',
        order: 1,
        completed: true,
      },
      {
        trackId: track.id,
        title: 'História e Cultura',
        description: 'Conheça nossa história, missão e valores',
        type: 'reading',
        duration: '20 min',
        order: 2,
        completed: true,
      },
      {
        trackId: track.id,
        title: 'Código de Conduta',
        description: 'Leia e assine o código de conduta',
        type: 'task',
        duration: '30 min',
        order: 3,
        completed: false,
      },
    ],
  });

  console.log('✅ Onboarding created');

  // Criar posts
  await prisma.post.createMany({
    data: [
      {
        authorId: rh.id,
        content:
          '🎉 Bem-vindos aos novos colaboradores que iniciaram esta semana! Estamos muito felizes em tê-los conosco.',
        category: 'Anúncio',
        pinned: true,
        likes: 24,
      },
      {
        authorId: gestor.id,
        content:
          'Equipe, estou muito orgulhoso do trabalho que fizemos neste sprint! Conseguimos entregar todas as features planejadas. 🚀',
        category: 'Reconhecimento',
        likes: 42,
      },
      {
        authorId: colaborador.id,
        content:
          'Meu primeiro dia foi incrível! A equipe me recebeu super bem e já me sinto parte do time. 💙',
        category: 'Geral',
        likes: 56,
      },
    ],
  });

  console.log('✅ Posts created');

  console.log('🌱 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
