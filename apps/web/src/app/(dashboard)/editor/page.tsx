'use client';

import { Button } from '@/components/ui/button';
import { Canvas } from '@/components/editor/canvas';
import { EditorToolbar } from '@/components/editor/toolbar';
import { useEditorStore } from '@/lib/editor-store';
import { Sparkles, Save, Download, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditorPage() {
  const { caption } = useEditorStore();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -mt-4 -mx-4 md:-mx-8">
      {/* Toolbar Principal */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 bg-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/posts">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="h-4 w-[1px] bg-slate-200" />
          <span className="font-medium text-sm">Novo Post</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
          >
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

      {/* Área de Edição */}
      <div className="flex flex-1 overflow-hidden">
        {/* Painel Esquerdo */}
        <aside className="w-64 border-r bg-slate-50 flex flex-col overflow-y-auto">
          <EditorToolbar />
        </aside>

        {/* Canvas */}
        <main className="flex-1 bg-slate-100 flex items-center justify-center p-8 overflow-auto">
          <Canvas className="w-full h-full" />
        </main>
      </div>
    </div>
  );
}