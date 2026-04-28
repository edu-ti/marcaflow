export enum AiFeature {
  CAPTION = 'CAPTION',
  IDEA = 'IDEA',
  CTA = 'CTA',
  HASHTAGS = 'HASHTAGS',
  REWRITE = 'REWRITE',
  SUMMARY = 'SUMMARY',
}

export interface AiRequest {
  feature: AiFeature;
  prompt: string;
  brandContext?: BrandContext;
  maxTokens?: number;
  temperature?: number;
}

export interface BrandContext {
  id: string;
  name: string;
  niche?: string;
  audience?: string;
  toneOfVoice?: string;
}

export interface AiResponse {
  text: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface IAiProvider {
  generateText(request: AiRequest): Promise<AiResponse>;
  getProviderName(): string;
}