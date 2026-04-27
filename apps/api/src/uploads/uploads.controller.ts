import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from '../auth/guards/workspace-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@marcaflow/database';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

// Configuração do multer p/ salvar em disco local no MVP
const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const filename: string = uuidv4() + path.extname(file.originalname);
    cb(null, filename);
  },
});

@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
@Controller('workspaces/:workspaceId/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage }))
  uploadFile(
    @Param('workspaceId') workspaceId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadsService.uploadFile(workspaceId, file);
  }
}
