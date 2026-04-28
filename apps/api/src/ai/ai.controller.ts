import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WorkspaceRolesGuard } from '../auth/guards/workspace-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@marcaflow/database';

interface GenerateCaptionDto {
  brandId: string;
  topic: string;
  platform?: string;
}

interface GenerateIdeasDto {
  brandId: string;
  quantity?: number;
  contentType?: string;
}

interface GenerateHashtagsDto {
  brandId: string;
  topic: string;
}

interface RewriteCaptionDto {
  brandId: string;
  originalCaption: string;
  newStyle?: string;
}

interface GenerateCtaDto {
  brandId: string;
  context: string;
}

@UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
@Controller('workspaces/:workspaceId/ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post('generate-caption')
  async generateCaption(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: GenerateCaptionDto,
  ) {
    const result = await this.aiService.generateCaption(
      workspaceId,
      dto.brandId,
      dto.topic,
      dto.platform,
    );
    return result;
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post('generate-ideas')
  async generateIdeas(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: GenerateIdeasDto,
  ) {
    const ideas = await this.aiService.generateContentIdeas(
      workspaceId,
      dto.brandId,
      dto.quantity,
      dto.contentType,
    );
    return { ideas };
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post('generate-hashtags')
  async generateHashtags(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: GenerateHashtagsDto,
  ) {
    return this.aiService.generateHashtags(
      workspaceId,
      dto.brandId,
      dto.topic,
    );
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post('rewrite-caption')
  async rewriteCaption(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: RewriteCaptionDto,
  ) {
    return this.aiService.rewriteCaption(
      workspaceId,
      dto.brandId,
      dto.originalCaption,
      dto.newStyle,
    );
  }

  @Roles(Role.OWNER, Role.ADMIN, Role.EDITOR)
  @Post('generate-cta')
  async generateCta(
    @Param('workspaceId') workspaceId: string,
    @Body() dto: GenerateCtaDto,
  ) {
    return this.aiService.generateCta(
      workspaceId,
      dto.brandId,
      dto.context,
    );
  }
}