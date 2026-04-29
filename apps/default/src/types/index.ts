export interface TimeLog {
  id: string;
  fieldValues: {
    '/text': string;
    '/attributes/@proj1'?: string;
    '/attributes/@clnt1'?: string;
    '/attributes/@desc1'?: string;
    '/attributes/@dur01'?: number;
    '/attributes/@strt1'?: string;
    '/attributes/@end01'?: string;
  };
}

export interface Project {
  id: string;
  fieldValues: {
    '/text': string;
    '/attributes/@colr1'?: 'cyan' | 'magenta' | 'violet' | 'amber' | 'emerald';
    '/attributes/@clnt2'?: string;
    '/attributes/@budg1'?: number;
    '/attributes/@stat1'?: 'active' | 'paused' | 'completed';
  };
}

export interface Client {
  id: string;
  fieldValues: {
    '/text': string;
    '/attributes/@eml01'?: string;
    '/attributes/@phon1'?: string;
    '/attributes/@comp1'?: string;
    '/attributes/@proj2'?: number;
  };
}

export interface TimerSession {
  projectName: string;
  clientName: string;
  description: string;
  startTime: Date;
  isRunning: boolean;
}
