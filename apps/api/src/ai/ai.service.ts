import { Injectable, InternalServerErrorException, inject } from '@nestjs/common';
import { PrismaClient } from '@marcaflow/database';
import { OpenAiProvider } from './providers/openai.provider';
import { IAiProvider, AiRequest, AiResponse, AiFeature, BrandContext } from './interfaces.ai';

export interface CaptionRequest {
  topic: string;
  platform: string;
}

export interface ContentIdeasRequest {
  quantity?: number;
  contentType?: string;
}

@Injectable()
export class AiService {
  private readonly COST_PER_TOKEN = 0.001;

  private prisma = inject(PrismaClient);
  private openAiProvider = inject(OpenAiProvider);

  private getProvider(): IAiProvider {
    return this.openAiProvider;
  }

  private buildBrandContext(brand: {
    id: string;
    name: string;
    niche?: string | null;
    audience?: string | null;
    toneOfVoice?: string | null;
  }): BrandContext {
    return {
      id: brand.id,
      name: brand.name,
      niche: brand.niche || undefined,
      audience: brand.audience || undefined,
      toneOfVoice: brand.toneOfVoice || undefined,
    };
  }

  private async executeAiRequest(
    workspaceId: string,
    request: AiRequest,
  ): Promise<AiResponse> {
    const provider = this.getProvider();
    const response = await provider.generateText(request);

    const estimatedCost = Math.ceil(
      (response.usage.promptTokens + response.usage.completionTokens) *
        this.COST_PER_TOKEN *
        100,
    );

    await this.consumeCredits(workspaceId, estimatedCost, provider.getProviderName(), request.feature);

    return response;
  }

  private async consumeCredits(
    workspaceId: string,
    cost: number,
    provider: string,
    feature: AiFeature,
  ) {
    const wallet = await this.prisma.creditWallet.findUnique({
      where: { workspaceId },
    });

    if (!wallet) {
      throw new InternalServerErrorException('Carteira de créditos não encontrada');
    }

    if (wallet.balance < cost) {
      throw new InternalServerErrorException(
        'Créditos insuficientes. Por favor, recarregue sua carteira.',
      );
    }

    await this.prisma.$transaction([
      this.prisma.creditTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -cost,
          description: `Geração ${feature}`,
        },
      }),
      this.prisma.creditWallet.update({
        where: { id: wallet.id },
        data: { balance: { decrement: cost } },
      }),
    ]);
  }

  async generateCaption(
    workspaceId: string,
    brandId: string,
    topic: string,
    platform: string = 'INSTAGRAM',
  ) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new InternalServerErrorException('Marca não encontrada');
    }

    const prompt = this.buildCaptionPrompt(topic, platform, brand);

    const request: AiRequest = {
      feature: AiFeature.CAPTION,
      prompt,
      brandContext: this.buildBrandContext(brand),
      maxTokens: 300,
      temperature: 0.7,
    };

    const response = await this.executeAiRequest(workspaceId, request);
    return this.parseCaptionResponse(response.text, platform);
  }

  private buildCaptionPrompt(topic: string, platform: string, brand: { name: string; niche?: string | null; audience?: string | null; toneOfVoice?: string | null }): string {
    const platformSpecific = this.getPlatformGuidelines(platform);

    return `Você é um copywriter especializado em conteúdo para redes sociais.

## IDENTIDADE DA MARCA
- Nome: ${brand.name}
- Nicho: ${brand.niche || 'Geral'}
- Público-alvo: ${brand.audience || 'Não definido'}
- Tom de voz: ${brand.toneOfVoice || 'Profissional e acessível'}

## REGRAS DE PLATAFORMA
${platformSpecific}

## TAREFA
Escreva uma legenda atraente para ${platform} sobre: "${topic}"

## FORMATO DA RESPOSTA
Retorne EXATAMENTE no formato:
---
TEXTO_PRINCIPAL: [legenda completa com emoji no início e emojis relevantes]
---
HASHTAGS: [3-5 hashtags separadas por espaço]
---
CTA: [call-to-action opcional]
---`;
  }

  private getPlatformGuidelines(platform: string): string {
    const guidelines: Record<string, string> = {
      INSTAGRAM: `- Limite de 2200 caracteres
- Use emojis estrategicamente
- Primeira linha deve ser impactante (corte antes do "mais")
- Inclua chamada para ação`,
      TWITTER: `- Limite de 280 caracteres
- Seja direto e conciso
- Use hashtags no final (máximo 2)`,
      LINKEDIN: `- Tom mais profissional
- Estrutura com parágrafos curtos
- Dados ou estatísticas aumentam engajamento
- Hashtags profissionais`,
    };
    return guidelines[platform] || guidelines.INSTAGRAM;
  }

  private parseCaptionResponse(text: string, platform: string) {
    const lines = text.split('\n');
    let caption = '';
    let hashtags = '';
    let cta = '';

    for (const line of lines) {
      if (line.startsWith('TEXTO_PRINCIPAL:')) {
        caption = line.replace('TEXTO_PRINCIPAL:', '').trim();
      } else if (line.startsWith('HASHTAGS:')) {
        hashtags = line.replace('HASHTAGS:', '').trim();
      } else if (line.startsWith('CTA:')) {
        cta = line.replace('CTA:', '').trim();
      }
    }

    if (!caption) {
      caption = text.trim();
    }

    return {
      caption,
      hashtags,
      cta,
      platform,
    };
  }

  async generateContentIdeas(
    workspaceId: string,
    brandId: string,
    quantity: number = 5,
    contentType?: string,
  ) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new InternalServerErrorException('Marca não encontrada');
    }

    const prompt = this.buildIdeasPrompt(brand, quantity, contentType);

    const request: AiRequest = {
      feature: AiFeature.IDEA,
      prompt,
      brandContext: this.buildBrandContext(brand),
      maxTokens: 500,
      temperature: 0.8,
    };

    const response = await this.executeAiRequest(workspaceId, request);
    return this.parseIdeasResponse(response.text, brandId);
  }

  private buildIdeasPrompt(
    brand: { name: string; niche?: string | null; audience?: string | null; toneOfVoice?: string | null },
    quantity: number,
    contentType?: string,
  ): string {
    const contentTypes = contentType
      ? `Foco em: ${contentType}`
      : 'Varie entre: tutoriais, dicas, histórias, promocional, engajamento';

    return `Você é um planejador de conteúdo especializado.

## IDENTIDADE DA MARCA
- Nome: ${brand.name}
- Nicho: ${brand.niche || 'Geral'}
- Público-alvo: ${brand.audience || 'Não definido'}
- Tom de voz: ${brand.toneOfVoice || 'Profissional e acessível'}

## REQUISITOS
- Gere exatamente ${quantity} ideias de conteúdo
- ${contentTypes}
- Cada ideia deve ser uma linha completa

## FORMATO DA RESPOSTA
Retorne EXATAMENTE neste formato (uma ideia por linha):
[TIPO] Título da ideia - Descrição breve do conteúdo`;
  }

  private parseIdeasResponse(text: string, brandId: string) {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const parts = line.split(' - ');
      return {
        brandId,
        topic: parts[0] || line,
        description: parts.slice(1).join(' - ') || '',
        isUsed: false,
      };
    });
  }

  async generateHashtags(
    workspaceId: string,
    brandId: string,
    topic: string,
  ) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new InternalServerErrorException('Marca não encontrada');
    }

    const prompt = `Gere 10 hashtags relevantes para um post sobre "${topic}" da marca ${brand.name} no nicho ${brand.niche || 'geral'}.
Retorne apenas as hashtags separadas por espaço, começando com #`;

    const request: AiRequest = {
      feature: AiFeature.HASHTAGS,
      prompt,
      maxTokens: 100,
      temperature: 0.5,
    };

    const response = await this.executeAiRequest(workspaceId, request);
    const hashtags = response.text
      .split(/[\s,#]+/)
      .filter(tag => tag.length > 2)
      .map(tag => (tag.startsWith('#') ? tag : `#${tag}`));

    return { hashtags };
  }

  async rewriteCaption(
    workspaceId: string,
    brandId: string,
    originalCaption: string,
    newStyle?: string,
  ) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new InternalServerErrorException('Marca não encontrada');
    }

    const styleInstruction = newStyle
      ? ` Reescreva no estilo: ${newStyle}`
      : ` Mantenha o tom da marca: ${brand.toneOfVoice || 'Profissional'}`;

    const prompt = `Você é um copywriter especializado.

## LEGENDA ORIGINAL
${originalCaption}

## IDENTIDADE DA MARCA
- Nome: ${brand.name}
- Tom de voz: ${brand.toneOfVoice || 'Profissional e acessível'}

## TAREFA
Reescreva a legenda acima de forma Engaging.${styleInstruction}

## RESTRIÇÕES
- Mantenha a essência da mensagem original
- Máximo 2200 caracteres
- Use emojis de forma natural`;

    const request: AiRequest = {
      feature: AiFeature.REWRITE,
      prompt,
      maxTokens: 400,
      temperature: 0.7,
    };

    const response = await this.executeAiRequest(workspaceId, request);
    return { caption: response.text };
  }

  async generateCta(
    workspaceId: string,
    brandId: string,
    context: string,
  ) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      throw new InternalServerErrorException('Marca não encontrada');
    }

    const prompt = `Gere 3 opções de call-to-action para o contexto: "${context}"
Marca: ${brand.name}
Tom de voz: ${brand.toneOfVoice || 'Profissional'}

Retorne no formato:
1. [CTA]
2. [CTA]
3. [CTA]`;

    const request: AiRequest = {
      feature: AiFeature.CTA,
      prompt,
      maxTokens: 150,
      temperature: 0.8,
    };

    const response = await this.executeAiRequest(workspaceId, request);
    const ctas = response.text
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim());

    return { ctas };
  }
}