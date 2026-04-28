'use client';

import { useEditorStore } from '@/lib/editor-store';
import { Button } from '@/components/ui/button';
import {
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Copy,
  Undo,
  Redo,
} from 'lucide-react';

export function EditorToolbar() {
  const { 
    selectedElementId, 
    elements,
    addElement,
    updateElement,
    removeElement,
    duplicateElement,
    setCaption,
    caption,
  } = useEditorStore();

  const selectedElement = elements.find(el => el.id === selectedElementId);

  const handleAddText = () => {
    addElement({
      type: 'text',
      x: 240,
      y: 240,
      width: 200,
      height: 60,
      rotation: 0,
      content: 'Seu Texto Aqui',
      style: {
        color: '#000000',
        fontSize: 24,
        fontFamily: 'Inter, sans-serif',
      },
    });
  };

  const handleAddImage = () => {
    addElement({
      type: 'image',
      x: 240,
      y: 240,
      width: 300,
      height: 300,
      rotation: 0,
      content: '',
      style: {
        objectFit: 'cover',
      },
    });
  };

  const handleAddShape = (shapeType: 'rectangle' | 'circle') => {
    addElement({
      type: 'shape',
      x: 240,
      y: 240,
      width: 150,
      height: 150,
      rotation: 0,
      content: '',
      style: {
        backgroundColor: shapeType === 'circle' ? '#3b82f6' : '#10b981',
        borderRadius: shapeType === 'circle' ? 50 : 8,
      },
    });
  };

  const handleColorChange = (color: string) => {
    if (selectedElementId) {
      updateElement(selectedElementId, {
        style: { ...selectedElement?.style, backgroundColor: color },
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Ferramentas de Adição */}
      <div className="p-4 border-b">
        <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
          Adicionar
        </h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-slate-600 bg-white"
            onClick={handleAddText}
          >
            <Type className="w-4 h-4" /> Texto
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-slate-600 bg-white"
            onClick={handleAddImage}
          >
            <ImageIcon className="w-4 h-4" /> Imagem
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-slate-600 bg-white"
            onClick={() => handleAddShape('rectangle')}
          >
            <Square className="w-4 h-4" /> Retângulo
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-slate-600 bg-white"
            onClick={() => handleAddShape('circle')}
          >
            <Circle className="w-4 h-4" /> Círculo
          </Button>
        </div>
      </div>

      {/* Propriedades do Elemento Selecionado */}
      {selectedElement && (
        <div className="p-4 border-b">
          <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
            Propriedades
          </h3>
          
          {selectedElement.type === 'text' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Conteúdo</label>
                <input
                  type="text"
                  value={selectedElement.content}
                  onChange={(e) => updateElement(selectedElementId!, { content: e.target.value })}
                  className="w-full text-sm p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Cor</label>
                <input
                  type="color"
                  value={selectedElement.style.color || '#000000'}
                  onChange={(e) => updateElement(selectedElementId!, {
                    style: { ...selectedElement.style, color: e.target.value }
                  })}
                  className="w-full h-9 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Tamanho</label>
                <input
                  type="number"
                  value={selectedElement.style.fontSize || 16}
                  onChange={(e) => updateElement(selectedElementId!, {
                    style: { ...selectedElement.style, fontSize: Number(e.target.value) }
                  })}
                  className="w-full text-sm p-2 border rounded"
                />
              </div>
            </div>
          )}

          {selectedElement.type === 'shape' && (
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Cor</label>
              <div className="flex flex-wrap gap-2">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#000000', '#ffffff'].map(color => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border-2"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ações do Elemento */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => selectedElementId && duplicateElement(selectedElementId)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-red-500"
              onClick={() => selectedElementId && removeElement(selectedElementId)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
          Legenda
        </h3>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="flex-1 w-full text-sm p-3 border rounded-md resize-none"
          placeholder="Escreva a legenda do post..."
        />
      </div>
    </div>
  );
}