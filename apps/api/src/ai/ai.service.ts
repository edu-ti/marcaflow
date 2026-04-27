import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@marcaflow/database';
// import { OpenAI } from 'openai'; // Descomente para real implementacao (env via ConfigService)

@Injectable()
export class AiService {
  constructor(private prisma: PrismaClient) {}

  // Constante fictícia: custo de prompt e completion simulado (ex: gpt-3.5)
  private readonly COST_PER_1K_PROMPT = 1; // em "créditos" do app
  private readonly COST_PER_1K_COMP = 2; // em "créditos" do app

  private async checkAndDeductCredits(
    workspaceId: string,
    estimatedCost: number,
  ) {
    const wallet = await this.prisma.creditWallet.findUnique({
      where: { workspaceId },
    });

    if (!wallet || wallet.balance < estimatedCost) {
      throw new InternalServerErrorException(
        'Créditos insuficientes para gerar a IA.',
      );
    }

    // Retém fundos otimista
    await this.prisma.creditTransaction.create({
      data: {
        walletId: wallet.id,
        amount: -estimatedCost,
        description: 'Antecipação geração IA',
      },
    });

    await this.prisma.creditWallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: estimatedCost } },
    });

    return wallet;
  }

  // --- Função Base simulando chamada Real da OpenAI ---
  async generateText(
    workspaceId: string,
    prompt: string,
    feature: string,
  ): Promise<string> {
    // MVP Fake Cost (simulação: 50 creds por chamada)
    const cost = 50;
    await this.checkAndDeductCredits(workspaceId, cost);

    // TODO: Chamar `openai.chat.completions.create(...)`
    const fakeResponse = `Conteúdo Gerado pela IA para o prompt: ${prompt.substring(0, 20)}...`;

    // Loga o Uso via sistema
    await this.prisma.aIRequestLog.create({
      data: {
        workspaceId,
        provider: 'OPENAI',
        feature,
        promptTokens: 200, // mock
        completionTokens: 300, // mock
        costInCredits: cost,
      },
    });

    return fakeResponse;
  }

  // == Helpers de Construção de Prompts para o MarcaFlow ==

  async generateCaption(workspaceId: string, brandId: string, topic: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });
    if (!brand) throw new InternalServerErrorException('Marca não encontrada');

    const prompt = `Você é um social media manager.
      Para a marca: ${brand.name}.
      Nicho: ${brand.niche || 'Geral'}.
      Público Alvo: ${brand.audience || 'Todos'}.
      Tom de voz: ${brand.toneOfVoice || 'Profissional'}.
      Escreva uma legenda atraente para o Instagram sobre o tópico: "${topic}".
      Inclua 3 hashtags.
    `;

    return this.generateText(workspaceId, prompt, 'CAPTION_GENERATOR');
  }

  async generateContentIdeas(workspaceId: string, brandId: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });
    const prompt = `Gere 3 ideias curtas de conteúdo para a marca ${brand?.name} no nicho ${brand?.niche}.`;

    // Processar e quebrar a string de response num array
    const rawIds = await this.generateText(
      workspaceId,
      prompt,
      'IDEA_GENERATOR',
    );
    return rawIds.split('\\n');
  }
}
