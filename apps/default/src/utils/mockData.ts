import { projectsApi, clientsApi, timeLogsApi } from '../services/api';

export async function initializeMockData() {
  try {
    // Create clients
    const clients = [
      {
        name: 'Acme Corporation',
        email: 'contact@acmecorp.com',
        phone: '+1 (555) 123-4567',
        company: 'Acme Corporation',
      },
      {
        name: 'TechStart Inc',
        email: 'hello@techstart.io',
        phone: '+1 (555) 234-5678',
        company: 'TechStart Inc',
      },
      {
        name: 'Global Ventures',
        email: 'info@globalventures.com',
        phone: '+1 (555) 345-6789',
        company: 'Global Ventures LLC',
      },
      {
        name: 'Creative Studios',
        email: 'team@creativestudios.design',
        phone: '+1 (555) 456-7890',
        company: 'Creative Studios',
      },
    ];

    for (const client of clients) {
      await clientsApi.create(client);
    }

    // Create projects
    const projects = [
      {
        name: 'Website Redesign',
        client: 'Acme Corporation',
        color: 'cyan' as const,
        budget: 120,
      },
      {
        name: 'Mobile App Development',
        client: 'TechStart Inc',
        color: 'magenta' as const,
        budget: 200,
      },
      {
        name: 'Brand Identity',
        client: 'Creative Studios',
        color: 'violet' as const,
        budget: 80,
      },
      {
        name: 'E-commerce Platform',
        client: 'Acme Corporation',
        color: 'amber' as const,
        budget: 150,
      },
      {
        name: 'Marketing Campaign',
        client: 'Global Ventures',
        color: 'emerald' as const,
        budget: 60,
      },
      {
        name: 'API Integration',
        client: 'TechStart Inc',
        color: 'cyan' as const,
        budget: 90,
      },
    ];

    for (const project of projects) {
      await projectsApi.create(project);
    }

    // Create some time logs
    const timeLogs = [
      {
        project: 'Website Redesign',
        client: 'Acme Corporation',
        description: 'Initial design mockups',
        duration: 180,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      },
      {
        project: 'Mobile App Development',
        client: 'TechStart Inc',
        description: 'Backend API development',
        duration: 240,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      },
      {
        project: 'Brand Identity',
        client: 'Creative Studios',
        description: 'Logo concepts',
        duration: 120,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
      },
    ];

    for (const log of timeLogs) {
      await timeLogsApi.create(log);
    }

    console.log('Mock data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize mock data:', error);
    throw error;
  }
}
