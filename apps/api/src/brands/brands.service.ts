import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@marcaflow/database';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaClient) {}

  async create(workspaceId: string, data: Prisma.BrandCreateInput) {
    return this.prisma.brand.create({
      data: {
        ...data,
        workspace: { connect: { id: workspaceId } },
      },
    });
  }

  async findAllByWorkspace(workspaceId: string) {
    return this.prisma.brand.findMany({
      where: { workspaceId },
      include: { assets: true },
    });
  }

  async findOne(id: string, workspaceId: string) {
    const brand = await this.prisma.brand.findFirst({
      where: { id, workspaceId },
      include: { assets: true, socialAccounts: true },
    });
    if (!brand)
      throw new NotFoundException('Marca não encontrada neste workspace');
    return brand;
  }

  async update(id: string, workspaceId: string, data: Prisma.BrandUpdateInput) {
    await this.findOne(id, workspaceId); // Valida existência
    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }
}
