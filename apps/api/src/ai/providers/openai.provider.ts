import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import {
  AiRequest,
  AiResponse,
  IAiProvider,
} from '../interfaces.ai';

@Injectable()
export class OpenAiProvider implements IAiProvider, OnModuleInit {
  private client: OpenAI;
  private apiKey: string;

  onModuleInit() {
    this.apiKey = this.getApiKey();
    this.client = new OpenAI({ apiKey: this.apiKey });
  }

  private getApiKey(): string {
    return process.env.OPENAI_API_KEY || '';
  }

  getProviderName(): string {
    return 'OPENAI';
  }

  async generateText(request: AiRequest): Promise<AiResponse> {
    const { prompt, maxTokens = 500, temperature = 0.7 } = request;

    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature,
      });

      const choice = completion.choices[0];
      const usage = completion.usage;

      return {
        text: choice.message.content || '',
        usage: {
          promptTokens: usage?.prompt_tokens || 0,
          completionTokens: usage?.completion_tokens || 0,
          totalTokens: usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      throw new Error(`OpenAI API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}