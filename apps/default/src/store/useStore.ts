import { create } from 'zustand';
import type { TimerSession, Project, Client, TimeLog } from '../types';

interface AppState {
  // Timer state
  currentSession: TimerSession | null;
  elapsedSeconds: number;
  
  // Data state
  projects: Project[];
  clients: Client[];
  timeLogs: TimeLog[];
  
  // UI state
  activeTab: 'timer' | 'projects' | 'clients' | 'logs' | 'statistics';
  isAgentOpen: boolean;
  theme: 'orange' | 'cyan' | 'purple' | 'green';
  backgroundShape: 'mountains' | 'waves' | 'particles' | 'none' | 'circles' | 'mesh' | 'grid';
  
  // Actions
  startTimer: (projectName: string, clientName: string, description: string) => void;
  stopTimer: () => void;
  setElapsedSeconds: (seconds: number) => void;
  setProjects: (projects: Project[]) => void;
  setClients: (clients: Client[]) => void;
  setTimeLogs: (logs: TimeLog[]) => void;
  setActiveTab: (tab: 'timer' | 'projects' | 'clients' | 'logs' | 'statistics') => void;
  toggleAgent: () => void;
  setTheme: (theme: 'orange' | 'cyan' | 'purple' | 'green') => void;
  setBackgroundShape: (shape: 'mountains' | 'waves' | 'particles' | 'none' | 'circles' | 'mesh' | 'grid') => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  currentSession: null,
  elapsedSeconds: 0,
  projects: [],
  clients: [],
  timeLogs: [],
  activeTab: 'timer',
  isAgentOpen: false,
  theme: 'green',
  backgroundShape: 'circles',
  
  // Actions
  startTimer: (projectName, clientName, description) =>
    set({
      currentSession: {
        projectName,
        clientName,
        description,
        startTime: new Date(),
        isRunning: true,
      },
      elapsedSeconds: 0,
    }),
    
  stopTimer: () =>
    set({
      currentSession: null,
      elapsedSeconds: 0,
    }),
    
  setElapsedSeconds: (seconds) => set({ elapsedSeconds: seconds }),
  
  setProjects: (projects) => set({ projects }),
  
  setClients: (clients) => set({ clients }),
  
  setTimeLogs: (logs) => set({ timeLogs: logs }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  toggleAgent: () => set((state) => ({ isAgentOpen: !state.isAgentOpen })),
  
  setTheme: (theme) => set({ theme }),
  
  setBackgroundShape: (shape) => set({ backgroundShape: shape }),
}));
