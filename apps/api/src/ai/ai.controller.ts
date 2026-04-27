import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from '../auth/guards/workspace-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@marcaflow/database';

@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
@Controller('workspaces/:workspaceId/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post('generate-caption')
  async generateCaption(
    @Param('workspaceId') workspaceId: string,
    @Body('brandId') brandId: string,
    @Body('topic') topic: string,
  ) {
    const text = await this.aiService.generateCaption(
      workspaceId,
      brandId,
      topic,
    );
    return { caption: text };
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post('generate-ideas')
  async generateIdeas(
    @Param('workspaceId') workspaceId: string,
    @Body('brandId') brandId: string,
  ) {
    const ideas = await this.aiService.generateContentIdeas(
      workspaceId,
      brandId,
    );
    return { ideas };
  }
}
