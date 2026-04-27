import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function BrandsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marcas</h1>
          <p className="text-muted-foreground mt-1">Gerencie a identidade visual e o tom de voz dos seus projetos.</p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nova Marca
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Fake Brand Card for MVP View */}
        <Card className="hover:border-primary/50 cursor-pointer transition-colors pt-6">
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center font-bold text-xl text-slate-400">
              MF
            </div>
            <div>
              <h3 className="font-bold text-lg">Acme Corp</h3>
              <p className="text-sm text-muted-foreground">Tecnologia e Vendas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
