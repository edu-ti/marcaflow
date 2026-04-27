import Link from 'next/link';
import { Button } from '@marcaflow/ui';
import { Sparkles, ArrowRight, LayoutTemplate, Share2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 lg:px-12 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <Sparkles className="w-5 h-5" />
          MarcaFlow
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Button asChild>
            <Link href="/auth/register">Começar Grátis</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900">
                Sua marca em movimento com o <span className="text-primary">Poder da IA</span>
              </h1>
              <p className="text-lg text-slate-600 md:text-xl">
                Gere conteúdo, design e planeje suas postagens sociais em segundos. O MarcaFlow é seu assistente virtual de Social Media e Design.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="w-full sm:w-auto gap-2" asChild>
                  <Link href="/auth/register">
                    Crie sua conta agora <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Ver como funciona
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Tudo que você precisa em um só lugar</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <Sparkles className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Ideias com IA</h3>
                <p className="text-slate-500">Gere centenas de ideias de conteúdo adaptadas ao tom de voz da sua marca.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <LayoutTemplate className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Editor Intuitivo</h3>
                <p className="text-slate-500">Crie posts belíssimos em minutos usando nossos templates visuais arrastar e soltar.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <Share2 className="w-12 h-12 text-indigo-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Calendário Editorial</h3>
                <p className="text-slate-500">Se organize com uma visão clara de longo prazo para suas campanhas nas redes sociais.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 bg-slate-900 border-t mt-auto text-slate-300">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">© 2024 MarcaFlow. Todos os direitos reservados.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm hover:text-white">Termos</Link>
            <Link href="#" className="text-sm hover:text-white">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
