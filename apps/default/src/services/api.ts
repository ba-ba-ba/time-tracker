import axios from 'axios';
import type { TimeLog, Project, Client } from '../types';

const api = axios.create({
  baseURL: '/api/taskade',
});

// Time Logs API
export const timeLogsApi = {
  getAll: async () => {
    const response = await api.get<{ ok: boolean; payload: { nodes: TimeLog[] } }>(
      '/projects/Ar18RwPFTfAVoUJM/nodes'
    );
    return response.data.payload.nodes;
  },

  create: async (data: {
    project: string;
    client: string;
    description: string;
    duration: number;
    startTime: string;
    endTime: string;
  }) => {
    const response = await api.post('/projects/Ar18RwPFTfAVoUJM/nodes', {
      '/text': `${data.project} - ${data.description || 'No description'}`,
      '/attributes/@proj1': data.project,
      '/attributes/@clnt1': data.client,
      '/attributes/@desc1': data.description,
      '/attributes/@dur01': data.duration,
    });
    return response.data;
  },

  delete: async (nodeId: string) => {
    await api.delete(`/projects/Ar18RwPFTfAVoUJM/nodes/${nodeId}`);
  },
};

// Projects API
export const projectsApi = {
  getAll: async () => {
    const response = await api.get<{ ok: boolean; payload: { nodes: Project[] } }>(
      '/projects/Ng69ogdfjTwzrrE9/nodes'
    );
    return response.data.payload.nodes;
  },

  create: async (data: {
    name: string;
    client: string;
    color: 'cyan' | 'magenta' | 'violet' | 'amber' | 'emerald';
    budget: number;
  }) => {
    const response = await api.post('/projects/Ng69ogdfjTwzrrE9/nodes', {
      '/text': data.name,
      '/attributes/@clnt2': data.client,
      '/attributes/@colr1': data.color,
      '/attributes/@budg1': data.budget,
      '/attributes/@stat1': 'active',
    });
    return response.data;
  },

  update: async (
    nodeId: string,
    data: {
      name?: string;
      client?: string;
      color?: 'cyan' | 'magenta' | 'violet' | 'amber' | 'emerald';
      budget?: number;
      status?: 'active' | 'paused' | 'completed';
    }
  ) => {
    const payload: Record<string, unknown> = {};
    if (data.name !== undefined) payload['/text'] = data.name;
    if (data.client !== undefined) payload['/attributes/@clnt2'] = data.client;
    if (data.color !== undefined) payload['/attributes/@colr1'] = data.color;
    if (data.budget !== undefined) payload['/attributes/@budg1'] = data.budget;
    if (data.status !== undefined) payload['/attributes/@stat1'] = data.status;

    const response = await api.patch(`/projects/Ng69ogdfjTwzrrE9/nodes/${nodeId}`, payload);
    return response.data;
  },

  delete: async (nodeId: string) => {
    await api.delete(`/projects/Ng69ogdfjTwzrrE9/nodes/${nodeId}`);
  },
};

// Clients API
export const clientsApi = {
  getAll: async () => {
    const response = await api.get<{ ok: boolean; payload: { nodes: Client[] } }>(
      '/projects/DD5qYUFnkcuCtAqY/nodes'
    );
    return response.data.payload.nodes;
  },

  create: async (data: { name: string; email: string; phone: string; company: string }) => {
    const response = await api.post('/projects/DD5qYUFnkcuCtAqY/nodes', {
      '/text': data.name,
      '/attributes/@eml01': data.email,
      '/attributes/@phon1': data.phone,
      '/attributes/@comp1': data.company,
      '/attributes/@proj2': 0,
    });
    return response.data;
  },

  delete: async (nodeId: string) => {
    await api.delete(`/projects/DD5qYUFnkcuCtAqY/nodes/${nodeId}`);
  },
};

// Agent API
export const agentApi = {
  createConversation: async () => {
    const response = await api.post<{ ok: boolean; conversationId: string }>(
      '/agents/01KQBEPW1PNYV6XNEC8SKM9N1E/public-conversations'
    );
    return response.data.conversationId;
  },

  sendMessage: async (conversationId: string, text: string) => {
    await api.post(
      `/agents/01KQBEPW1PNYV6XNEC8SKM9N1E/public-conversations/${conversationId}/messages`,
      { text }
    );
  },
};
