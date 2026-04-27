import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@marcaflow/database';

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaClient) {}

  // A abordagem MVP será salvar no disco local (pasta uploads/)
  // No futuro a provider S3 enviaria a URL.
  async uploadFile(workspaceId: string, file: Express.Multer.File) {
    if (!file) throw new InternalServerErrorException('Arquivo não enviado');

    // Simula a URL do "S3" localmente
    const url = `/uploads/${file.filename}`;

    return this.prisma.uploadFile.create({
      data: {
        workspaceId,
        url,
        fileType: file.mimetype,
        sizeBytes: file.size,
      },
    });
  }
}
