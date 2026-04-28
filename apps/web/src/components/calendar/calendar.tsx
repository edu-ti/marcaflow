'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@marcaflow/utils';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  brandId: string;
  brandName: string;
  status: 'draft' | 'scheduled' | 'published';
}

interface CalendarProps {
  events?: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export function Calendar({ events = [], onDateClick, onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const getStatusColor = (status: CalendarEvent['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'scheduled':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'published':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="font-semibold text-lg w-40 text-center">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentDate(new Date())}
        >
          Hoje
        </Button>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-slate-50">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-slate-500 border-r last:border-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-slate-100">
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={i}
                className={cn(
                  'min-h-32 bg-white p-2 flex flex-col border-r border-b last:border-r-0 transition-colors cursor-pointer hover:bg-slate-50',
                  !isCurrentMonth && 'bg-slate-50'
                )}
                onClick={() => onDateClick?.(day)}
              >
                <div
                  className={cn(
                    'text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1',
                    isToday && 'bg-primary text-white',
                    !isToday && isCurrentMonth && 'text-slate-700',
                    !isToday && !isCurrentMonth && 'text-slate-400'
                  )}
                >
                  {format(day, 'd')}
                </div>

                <div className="flex-1 space-y-1 overflow-hidden">
                  {dayEvents.slice(0, 3).map((event) => (
                    <button
                      key={event.id}
                      className={cn(
                        'w-full text-xs p-1 rounded border truncate font-medium flex items-center gap-1 hover:opacity-80 transition-opacity text-left',
                        getStatusColor(event.status)
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      <span className="truncate">{event.title}</span>
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-xs text-slate-500 pl-1">
                      +{dayEvents.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}