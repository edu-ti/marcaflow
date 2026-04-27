import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@marcaflow/database';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaClient) {}

  async create(workspaceId: string, brandId: string, data: any) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        status: data.status || 'DRAFT',
        layoutState: data.layoutState || {},
        brand: { connect: { id: brandId } },
      },
    });
  }

  async findAllByBrand(brandId: string) {
    return this.prisma.post.findMany({
      where: { brandId },
      include: { captions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { captions: true },
    });
    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }

  async update(id: string, data: Prisma.PostUpdateInput) {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async addCaption(
    postId: string,
    text: string,
    isAiGenerated: boolean = false,
  ) {
    return this.prisma.caption.create({
      data: {
        text,
        isAiGenerated,
        post: { connect: { id: postId } },
      },
    });
  }
}
