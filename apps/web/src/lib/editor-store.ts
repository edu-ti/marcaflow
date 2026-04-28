import { create } from 'zustand';

export type ElementType = 'text' | 'image' | 'shape' | 'background';

export interface EditorElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  style: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    backgroundColor?: string;
    borderRadius?: number;
    opacity?: number;
    objectFit?: 'cover' | 'contain' | 'fill';
  };
  zIndex: number;
}

export interface EditorState {
  elements: EditorElement[];
  selectedElementId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  caption: string;
  
  addElement: (element: Omit<EditorElement, 'id' | 'zIndex'>) => void;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  removeElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElement: (id: string, x: number, y: number) => void;
  resizeElement: (id: string, width: number, height: number) => void;
  setCaption: (caption: string) => void;
  setCanvasSize: (width: number, height: number) => void;
  setZoom: (zoom: number) => void;
  clearCanvas: () => void;
  duplicateElement: (id: string) => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  elements: [],
  selectedElementId: null,
  canvasWidth: 1080,
  canvasHeight: 1080,
  zoom: 0.4,
  caption: '',

  addElement: (element) => {
    const { elements } = get();
    const newElement: EditorElement = {
      ...element,
      id: crypto.randomUUID(),
      zIndex: elements.length,
    };
    set({ elements: [...elements, newElement] });
  },

  updateElement: (id, updates) => {
    set({
      elements: get().elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    });
  },

  removeElement: (id) => {
    set({
      elements: get().elements.filter((el) => el.id !== id),
      selectedElementId: get().selectedElementId === id ? null : get().selectedElementId,
    });
  },

  selectElement: (id) => {
    set({ selectedElementId: id });
  },

  moveElement: (id, x, y) => {
    set({
      elements: get().elements.map((el) =>
        el.id === id ? { ...el, x, y } : el
      ),
    });
  },

  resizeElement: (id, width, height) => {
    set({
      elements: get().elements.map((el) =>
        el.id === id ? { ...el, width, height } : el
      ),
    });
  },

  setCaption: (caption) => {
    set({ caption });
  },

  setCanvasSize: (width, height) => {
    set({ canvasWidth: width, canvasHeight: height });
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(0.1, Math.min(2, zoom)) });
  },

  clearCanvas: () => {
    set({ elements: [], selectedElementId: null, caption: '' });
  },

  duplicateElement: (id) => {
    const element = get().elements.find((el) => el.id === id);
    if (element) {
      const newElement: EditorElement = {
        ...element,
        id: crypto.randomUUID(),
        x: element.x + 20,
        y: element.y + 20,
        zIndex: get().elements.length,
      };
      set({ elements: [...get().elements, newElement] });
    }
  },
}));