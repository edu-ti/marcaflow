'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore, EditorElement } from '@/lib/editor-store';
import { cn } from '@marcaflow/utils';

interface CanvasProps {
  className?: string;
}

export function Canvas({ className }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { 
    elements, 
    selectedElementId, 
    canvasWidth, 
    canvasHeight, 
    zoom, 
    selectElement,
    moveElement,
    resizeElement,
  } = useEditorStore();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 });
  const [currentResizeHandle, setCurrentResizeHandle] = useState<string | null>(null);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      selectElement(null);
    }
  }, [selectElement]);

  const handleElementMouseDown = useCallback((e: React.MouseEvent, element: EditorElement) => {
    e.stopPropagation();
    selectElement(element.id);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.x * zoom,
      y: e.clientY - element.y * zoom,
    });
  }, [selectElement, zoom]);

  const handleResizeMouseDown = useCallback((
    e: React.MouseEvent, 
    element: EditorElement, 
    handle: string
  ) => {
    e.stopPropagation();
    selectElement(element.id);
    setIsResizing(true);
    setCurrentResizeHandle(handle);
    setResizeStart({
      width: element.width,
      height: element.height,
      x: e.clientX,
      y: e.clientY,
    });
  }, [selectElement]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && selectedElementId) {
        const newX = (e.clientX - dragStart.x) / zoom;
        const newY = (e.clientY - dragStart.y) / zoom;
        moveElement(selectedElementId, newX, newY);
      }
      
      if (isResizing && selectedElementId && currentResizeHandle) {
        const deltaX = (e.clientX - resizeStart.x) / zoom;
        const deltaY = (e.clientY - resizeStart.y) / zoom;
        const element = elements.find(el => el.id === selectedElementId);
        
        if (element) {
          let newWidth = resizeStart.width;
          let newHeight = resizeStart.height;
          
          if (currentResizeHandle.includes('e')) {
            newWidth = Math.max(50, resizeStart.width + deltaX);
          }
          if (currentResizeHandle.includes('w')) {
            newWidth = Math.max(50, resizeStart.width - deltaX);
          }
          if (currentResizeHandle.includes('s')) {
            newHeight = Math.max(50, resizeStart.height + deltaY);
          }
          if (currentResizeHandle.includes('n')) {
            newHeight = Math.max(50, resizeStart.height - deltaY);
          }
          
          resizeElement(selectedElementId, newWidth, newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setCurrentResizeHandle(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDragging, 
    isResizing, 
    selectedElementId, 
    dragStart, 
    resizeStart, 
    zoom, 
    moveElement, 
    resizeElement,
    elements,
    currentResizeHandle
  ]);

  return (
    <div 
      ref={canvasRef}
      className={cn('relative overflow-hidden bg-slate-200 flex items-center justify-center', className)}
      onClick={handleCanvasClick}
    >
      <div
        className="relative bg-white shadow-2xl"
        style={{
          width: canvasWidth * zoom,
          height: canvasHeight * zoom,
          transform: `scale(1)`,
        }}
      >
        {elements
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((element) => (
            <EditorElementRenderer
              key={element.id}
              element={element}
              zoom={zoom}
              isSelected={selectedElementId === element.id}
              onMouseDown={(e) => handleElementMouseDown(e, element)}
              onResizeMouseDown={(e, handle) => handleResizeMouseDown(e, element, handle)}
            />
          ))}
      </div>
    </div>
  );
}

interface ElementRendererProps {
  element: EditorElement;
  zoom: number;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onResizeMouseDown: (e: React.MouseEvent, handle: string) => void;
}

function EditorElementRenderer({
  element,
  zoom,
  isSelected,
  onMouseDown,
  onResizeMouseDown,
}: ElementRendererProps) {
  const { removeElement } = useEditorStore();

  const style: React.CSSProperties = {
    position: 'absolute',
    left: element.x * zoom,
    top: element.y * zoom,
    width: element.width * zoom,
    height: element.height * zoom,
    transform: `rotate(${element.rotation}deg)`,
    zIndex: element.zIndex,
    opacity: element.style.opacity ?? 1,
  };

  const renderElement = () => {
    switch (element.type) {
      case 'text':
        return (
          <div
            style={{
              ...style,
              color: element.style.color || '#000000',
              fontSize: (element.style.fontSize || 16) * zoom,
              fontFamily: element.style.fontFamily || 'Inter, sans-serif',
              backgroundColor: element.style.backgroundColor || 'transparent',
              borderRadius: (element.style.borderRadius || 0) * zoom,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: 8 * zoom,
              cursor: 'move',
              userSelect: 'none',
              overflow: 'hidden',
            }}
            onMouseDown={onMouseDown}
          >
            {element.content || 'Texto'}
          </div>
        );

      case 'image':
        return (
          <div
            style={{
              ...style,
              overflow: 'hidden',
              cursor: 'move',
            }}
            onMouseDown={onMouseDown}
          >
            <img
              src={element.content || '/placeholder.png'}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: element.style.objectFit || 'cover',
              }}
              draggable={false}
            />
          </div>
        );

      case 'shape':
        return (
          <div
            style={{
              ...style,
              backgroundColor: element.style.backgroundColor || '#3b82f6',
              borderRadius: element.type === 'shape' ? (element.style.borderRadius || 50) * zoom : 0,
              cursor: 'move',
            }}
            onMouseDown={onMouseDown}
          />
        );

      case 'background':
        return (
          <div
            style={{
              ...style,
              backgroundColor: element.style.backgroundColor || '#ffffff',
              cursor: 'default',
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="group relative">
      {renderElement()}
      
      {isSelected && (
        <>
          <div
            className="absolute border-2 border-blue-500 pointer-events-none"
            style={{
              left: element.x * zoom - 2,
              top: element.y * zoom - 2,
              width: element.width * zoom + 4,
              height: element.height * zoom + 4,
            }}
          />
          
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-nw-resize"
            style={{
              left: element.x * zoom - 4,
              top: element.y * zoom - 4,
            }}
            onMouseDown={(e) => onResizeMouseDown(e, 'nw')}
          />
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-ne-resize"
            style={{
              left: element.x * zoom + element.width * zoom - 2,
              top: element.y * zoom - 4,
            }}
            onMouseDown={(e) => onResizeMouseDown(e, 'ne')}
          />
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-sw-resize"
            style={{
              left: element.x * zoom - 4,
              top: element.y * zoom + element.height * zoom - 2,
            }}
            onMouseDown={(e) => onResizeMouseDown(e, 'sw')}
          />
          <div
            className="absolute w-2 h-2 bg-blue-500 border border-white rounded-sm cursor-se-resize"
            style={{
              left: element.x * zoom + element.width * zoom - 2,
              top: element.y * zoom + element.height * zoom - 2,
            }}
            onMouseDown={(e) => onResizeMouseDown(e, 'se')}
          />
          
          <button
            className="absolute w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              left: element.x * zoom + element.width * zoom + 4,
              top: element.y * zoom - 4,
            }}
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
}