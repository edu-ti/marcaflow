import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Workspace {
  id: string;
  name: string;
  slug: string;
}

interface AppState {
  user: User | null;
  activeWorkspace: Workspace | null;
  setUser: (user: User | null) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  activeWorkspace: null,
  setUser: (user) => set({ user }),
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
}));
