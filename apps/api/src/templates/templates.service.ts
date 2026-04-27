import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@marcaflow/database';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaClient) {}

  async findAll() {
    return this.prisma.template.findMany({
      include: { elements: true },
    });
  }

  async findOne(id: string) {
    const tpl = await this.prisma.template.findUnique({
      where: { id },
      include: { elements: true },
    });
    if (!tpl) throw new NotFoundException('Template não encontrado');
    return tpl;
  }

  // Apenas para testes MVP via API (No SaaS real, Admin gerenciaria isso)
  async create(data: Prisma.TemplateCreateInput) {
    return this.prisma.template.create({ data });
  }
}
