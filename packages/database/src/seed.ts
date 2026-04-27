import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Adicionar planos
  const freePlan = await prisma.plan.create({
    data: {
      name: 'FREE',
      price: 0.0,
      aiCreditLimit: 10,
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: 'PRO',
      price: 29.9,
      aiCreditLimit: 500,
    },
  });

  console.log('✅ Planos criados:', { freePlan, proPlan });

  // Criar Usuário Admin
  // Nota: o hash ideal em produção seria com bcrypt/argon2.
  const hashObj = crypto.createHash('sha256');
  hashObj.update('senha123'); // senha padrão local
  const hashedPassword = hashObj.digest('hex');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@marcaflow.com',
      name: 'Admin MarcaFlow',
      passwordHash: hashedPassword,
    },
  });

  // Criar Workspace inicial para o Admin
  const adminWorkspace = await prisma.workspace.create({
    data: {
      name: 'Admin Workspace',
      slug: 'admin-workspace',
    },
  });

  // Conectar Admin ao Workspace
  await prisma.workspaceMember.create({
    data: {
      userId: adminUser.id,
      workspaceId: adminWorkspace.id,
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuário Admin e Workspace inicial criados:', {
    adminUser,
    adminWorkspace,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
