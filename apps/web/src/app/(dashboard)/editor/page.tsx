import { Button } from '@/components/ui/button';
import { Sparkles, Save, Download, ArrowLeft, Type, Image as ImageIcon, Layout } from 'lucide-react';
import Link from 'next/link';

export default function EditorPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -mt-4 -mx-4 md:-mx-8">
      {/* Toolbar do Editor */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 bg-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/posts"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div className="h-4 w-[1px] bg-slate-200" />
          <span className="font-medium text-sm">Post Sem Nome - Rascunho</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
            <Sparkles className="w-4 h-4" /> IA Mágica
          </Button>
          <Button variant="secondary" size="sm" className="gap-2 text-slate-600">
            <Save className="w-4 h-4" /> Salvar
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </header>

      {/* Área Principal de Edição */}
      <div className="flex flex-1 overflow-hidden">
        {/* Painel Esquerdo (Ferramentas) */}
        <aside className="w-64 border-r bg-slate-50 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Elementos</h3>
          </div>
          <div className="flex-1 p-4 space-y-2">
            <Button variant="outline" className="w-full justify-start gap-3 text-slate-600 bg-white">
              <Type className="w-4 h-4" /> Adicionar Texto
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 text-slate-600 bg-white">
              <ImageIcon className="w-4 h-4" /> Asset da Marca
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 text-slate-600 bg-white">
              <Layout className="w-4 h-4" /> Template Pronto
            </Button>
          </div>
        </aside>

        {/* Canvas Central */}
        <main className="flex-1 bg-slate-100 flex items-center justify-center p-8 overflow-auto">
          {/* Mock Canvas Área (Post Square 1080x1080 Aspect Ratio) */}
          <div className="w-[400px] h-[400px] bg-white shadow-xl flex items-center justify-center border-2 border-transparent hover:border-primary/20 transition-colors relative cursor-crosshair">
            <div className="text-center text-slate-400">
              <Layout className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Canvas em Branco</p>
              <p className="text-xs">Use a barra lateral para inserir elementos.</p>
            </div>
            
            {/* Outline delimitador */}
            <div className="absolute inset-x-8 inset-y-8 border-[1px] border-dashed border-slate-200 pointer-events-none" />
          </div>
        </main>

        {/* Painel Direito (Propriedades) */}
        <aside className="w-72 border-l bg-white flex flex-col">
          <div className="p-4 border-b">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Legenda (Para Redes)</h3>
          </div>
          <div className="flex-1 p-4">
            <textarea 
              className="w-full h-full min-h-32 text-sm p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Escreva a legenda do post aqui, ou use a IA Mágica no topo..."
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
