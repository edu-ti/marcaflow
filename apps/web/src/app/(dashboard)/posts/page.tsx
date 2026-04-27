import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LayoutTemplate, PlusCircle, PenTool } from 'lucide-react';
import Link from 'next/link';

export default function PostsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts e Templates</h1>
          <p className="text-muted-foreground mt-1">Crie conteúdo usando IA ou inicie com templates prontos.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <LayoutTemplate className="h-4 w-4" />
            Galeria de Templates
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/editor">
              <PlusCircle className="h-4 w-4" />
              Novo Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Fake Post MVP Map */}
        <Card className="overflow-hidden group cursor-pointer border-slate-200">
          <div className="aspect-square bg-slate-100 flex items-center justify-center relative border-b">
            <LayoutTemplate className="w-12 h-12 text-slate-300" />
            <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="secondary" size="sm" className="gap-2">
                <PenTool className="w-4 h-4" /> Editar
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold truncate">Campanha Promocional</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-md">Rascunho</span>
              <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">Acme Corp</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
