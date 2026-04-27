import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Brush, Image } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo(a) ao seu Workspace</h1>
        <p className="text-muted-foreground mt-2">Visão geral do seu espaço de trabalho MarcaFlow.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Marcas Ativas</CardTitle>
            <Brush className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Posts Gerados</CardTitle>
            <Image className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Créditos de IA</CardTitle>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">450 / 500</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Criação Rápida</h2>
          <Card className="bg-indigo-50 border-indigo-100">
            <CardContent className="p-6">
              <Sparkles className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Gerar novo Post com IA</h3>
              <p className="text-sm text-indigo-900/80 mb-4">Escolha uma de suas marcas e deixe a IA cuidar do resto.</p>
              <Button asChild>
                <Link href="/posts/new">
                  Começar agora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Atividades Recentes</h2>
          <Card>
            <CardContent className="p-0">
              <ul className="divide-y">
                <li className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-sm">Post Agendado</p>
                    <p className="text-xs text-muted-foreground">Campanha de Inverno</p>
                  </div>
                  <span className="text-xs text-slate-500">Há 2 horas</span>
                </li>
                <li className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-sm">IA Gerou Legenda</p>
                    <p className="text-xs text-muted-foreground">Consumiu 1 crédito</p>
                  </div>
                  <span className="text-xs text-slate-500">Ontem</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
