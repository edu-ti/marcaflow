import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendário Editorial</h1>
          <p className="text-muted-foreground mt-1">Visão geral do planejamento mensal da sua marca.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon"><ChevronLeft className="w-4 h-4" /></Button>
          <span className="font-medium text-sm w-32 text-center">Novembro 2024</span>
          <Button variant="outline" size="icon"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        {/* Cabeçalho da Semana MVP */}
        <div className="grid grid-cols-7 border-b bg-slate-50 relative">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-slate-500 border-r last:border-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Estrutura Fake do Mês MVP */}
        <div className="grid grid-cols-7 grid-rows-5 bg-slate-100 gap-[1px]">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="min-h-32 bg-white p-2 flex flex-col group hover:bg-slate-50 transition-colors">
              <div className={`text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full ${i === 15 ? 'bg-primary text-white' : 'text-slate-500'}`}>
                {(i % 30) + 1}
              </div>
              
              {/* Exemplo Mockado de Post Agendado MVP */}
              {i === 15 && (
                <div className="mt-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs p-1.5 rounded truncate font-medium flex items-center gap-1 cursor-pointer">
                  <CalendarDays className="w-3 h-3" />
                  Promo Fim de Ano
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
