Quero que você atue como um arquiteto de software sênior, product engineer e desenvolvedor full-stack especialista em SaaS com IA.

Seu objetivo é criar o projeto completo de um sistema chamado MarcaFlow, uma plataforma web SaaS para criação de posts para redes sociais com inteligência artificial, semelhante à proposta do BestContent AI.

O sistema deve permitir:
- cadastro de usuários
- cadastro de marcas
- armazenamento de identidade visual da marca
- geração de ideias de conteúdo com IA
- geração de legendas com IA
- geração de posts com base em templates
- editor visual simples
- calendário editorial
- organização de posts por status
- exportação de imagem
- agendamento/publicação futura
- painel administrativo
- planos de assinatura
- controle de créditos de uso de IA

Quero que você desenvolva esse projeto com foco em MVP comercial escalável, código limpo, modularidade e facilidade de manutenção.

### Stack obrigatória

Use esta stack como padrão principal:

- Frontend: Next.js com TypeScript
- Backend: NestJS com TypeScript
- Banco de dados: PostgreSQL
- ORM: Prisma
- Autenticação: JWT com refresh token
- UI: Tailwind CSS + shadcn/ui
- Estado no frontend: Zustand ou React Query
- Filas e jobs: Redis + BullMQ
- Armazenamento de arquivos: S3 compatível
- Upload de imagens: via backend
- Geração de IA: camada abstrata para múltiplos provedores
- Logs: Pino
- Validação: Zod
- Containers: Docker + docker-compose
- Monorepo: Turborepo
- Versionamento: estrutura pronta para Git

### Regras de arquitetura

Quero uma arquitetura profissional, com separação clara entre camadas.

Organize o projeto em monorepo com apps e packages, por exemplo:
- apps/web
- apps/api
- packages/ui
- packages/config
- packages/types
- packages/utils

No backend, use arquitetura modular por domínio, por exemplo:
- auth
- users
- workspaces
- brands
- posts
- templates
- ai
- billing
- credits
- social
- scheduler
- uploads
- admin

Use princípios:
- SOLID
- DTOs
- services
- repositories
- guards
- interceptors
- configuração por ambiente
- tratamento global de erros
- rate limit
- logging estruturado
- background jobs desacoplados

### Linguagem e padrão de código

A linguagem principal deve ser TypeScript em todo o sistema.
Quando necessário, você pode sugerir Python somente para futuros microsserviços avançados de IA, mas o MVP deve ser 100% implementado com TypeScript.

Padrões:
- TypeScript estrito
- ESLint
- Prettier
- aliases de importação
- variáveis e funções com nomes claros
- componentes reutilizáveis
- sem código desorganizado
- sem hardcode desnecessário
- sem lógica de negócio dentro do controller
- sem acoplamento forte entre frontend e backend

### Objetivo do produto

O MarcaFlow é um sistema onde o usuário:
1. cria conta
2. cria uma ou mais marcas
3. define nome da marca, nicho, público, tom de voz, cores, fontes, logo e redes sociais
4. recebe sugestões de ideias de conteúdo com IA
5. gera uma legenda ou post a partir de prompt
6. escolhe um template visual
7. edita o post
8. salva como rascunho
9. agenda ou exporta
10. acompanha tudo em um calendário editorial

### Entidades principais

Projete o banco de dados com Prisma incluindo pelo menos estas entidades:

- User
- Workspace
- WorkspaceMember
- Brand
- BrandAsset
- SocialAccount
- Post
- PostVariant
- Caption
- Template
- TemplateElement
- ContentIdea
- CalendarItem
- CreditWallet
- CreditTransaction
- Subscription
- Plan
- Invoice
- AIRequestLog
- UploadFile
- ScheduledJob
- AuditLog

Inclua:
- relacionamentos
- índices
- enums
- campos de auditoria
- soft delete quando fizer sentido
- multi-tenant por workspace

### Funcionalidades do MVP

Implemente no MVP:

1. Autenticação
- cadastro
- login
- logout
- refresh token
- recuperação de senha
- perfil do usuário

2. Workspace
- criar workspace
- convidar membros
- permissões por papel: owner, admin, editor, viewer

3. Marcas
- criar marca
- editar identidade visual
- subir logo
- definir tom de voz
- salvar paleta de cores
- definir segmentos e objetivos

4. IA de conteúdo
- gerar ideias de posts
- gerar legenda
- gerar CTA
- gerar hashtags
- gerar variações de texto
- gerar conteúdo com base na voz da marca
- registrar consumo de créditos

5. Posts
- criar post
- salvar rascunho
- duplicar post
- alterar status: draft, scheduled, published, archived
- anexar caption
- exportar como imagem

6. Templates
- listar templates
- aplicar template ao post
- editar textos e blocos básicos
- sistema simples de camadas

7. Calendário editorial
- visualização mensal/semanal
- filtro por marca
- arrastar e atualizar data
- status visual por cor

8. Administração
- painel de usuários
- painel de workspaces
- consumo de créditos
- métricas básicas
- logs de uso de IA

### Integração de IA

Crie uma camada de abstração para provedores de IA.
Não acople a aplicação a um único fornecedor.

Crie interfaces como:
- TextGenerationProvider
- ImageGenerationProvider
- PromptBuilder
- CreditCostCalculator

Implemente inicialmente apenas a estrutura com um provedor padrão de texto.
Prepare o sistema para:
- geração de legenda
- ideias de conteúdo
- reescrita
- tom de voz
- resumo
- CTA
- hashtags

Implemente prompts internos reutilizáveis com contexto de marca.

### Editor visual

Quero um editor simples no MVP, sem complexidade excessiva.
Ele deve permitir:
- editar texto
- mudar cor
- mudar fonte
- posicionar elementos
- trocar imagem
- aplicar template
- pré-visualizar post

Use estrutura JSON para armazenar o layout do post.
Crie base para no futuro suportar carrossel.

### Publicação e agendamento

No MVP, não precisa publicar em todas as redes de forma completa.
Implemente:
- estrutura de SocialAccount
- estrutura de agendamento
- worker de jobs
- status do agendamento
- simulação de publicação
- arquitetura pronta para integração futura com APIs oficiais

### Billing e créditos

Crie suporte a:
- planos Free, Pro e Agency
- limite de créditos por plano
- consumo por ação de IA
- histórico de transações
- middleware para bloquear geração sem saldo
- estrutura para integração futura com gateway de pagamento

### Segurança

Implemente:
- hash de senha
- refresh token seguro
- RBAC
- CORS configurável
- rate limit
- validação de input
- sanitização básica
- proteção de rotas
- logs de auditoria
- isolamento por workspace

### Entregáveis obrigatórios

Quero que você gere este projeto em etapas, sempre com código funcional e organizado.

Siga exatamente esta ordem:

ETAPA 1
- definir arquitetura
- explicar a estrutura de pastas
- listar decisões técnicas
- mapear módulos
- descrever fluxo do usuário
- descrever fluxo de dados

ETAPA 2
- criar a estrutura inicial do monorepo
- criar configuração base do Turborepo
- criar apps web e api
- configurar TypeScript, ESLint, Prettier
- configurar Tailwind no frontend
- configurar NestJS no backend

ETAPA 3
- modelar Prisma schema completo
- gerar migrations
- criar seed inicial com planos e usuário admin
- explicar cada entidade

ETAPA 4
- implementar autenticação completa
- implementar usuários, workspace e permissões

ETAPA 5
- implementar módulo de marcas
- upload de logo
- assets de marca
- tom de voz

ETAPA 6
- implementar módulo de IA
- providers
- prompts base
- consumo de créditos
- logs de uso

ETAPA 7
- implementar CRUD de posts
- captions
- templates
- estrutura JSON de layout

ETAPA 8
- implementar frontend
- páginas principais
- dashboard
- marcas
- posts
- calendário
- telas de autenticação
- editor básico

ETAPA 9
- implementar calendário editorial
- scheduler
- jobs com BullMQ
- mudança de status de post

ETAPA 10
- implementar admin
- métricas iniciais
- consumo de IA
- workspaces
- usuários

ETAPA 11
- dockerização
- variáveis de ambiente
- setup local
- scripts de desenvolvimento
- checklist de deploy

ETAPA 12
- revisar código
- melhorar organização
- identificar pendências para v2
- sugerir roadmap de evolução

### Como responder

Quero que você trabalhe como um agente executor e não apenas como consultor.
Portanto:

- sempre entregue código real
- sempre crie arquivos completos
- sempre informe o caminho do arquivo antes do conteúdo
- quando houver muitos arquivos, entregue em blocos organizados
- não resuma demais
- não pule etapas
- não responda apenas com explicação
- gere implementação utilizável
- quando precisar assumir algo, adote a opção mais profissional para um SaaS MVP
- preserve consistência entre backend, frontend e banco
- use nomes padronizados em inglês para código e português apenas nos textos visíveis ao usuário

### Interface do produto

Quero um visual moderno estilo SaaS premium.
Direção visual:
- nome: MarcaFlow
- slogan: Sua marca em movimento
- cores principais: azul e roxo
- interface clean
- dashboard profissional
- foco em produtividade e clareza

### Primeira tarefa agora

Comece pela ETAPA 1.
Me entregue:
1. visão geral da arquitetura
2. estrutura completa de pastas
3. escolha da stack com justificativa
4. módulos do sistema
5. modelagem conceitual inicial
6. fluxo do usuário
7. roadmap técnico do MVP

Depois disso, aguarde minha confirmação para continuar para a ETAPA 2.
