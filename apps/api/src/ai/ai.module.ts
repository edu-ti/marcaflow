import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { OpenAiProvider } from './providers/openai.provider';

@Module({
  imports: [ConfigModule],
  providers: [AiService, OpenAiProvider],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
