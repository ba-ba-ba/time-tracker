import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, StopCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { timeLogsApi } from '../services/api';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { useThemeColors } from '../hooks/useThemeColors';

export function TimerControls() {
  const { currentSession, elapsedSeconds, startTimer, stopTimer, projects, clients, timeLogs, setTimeLogs } = useStore();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [description, setDescription] = useState('');
  const themeColors = useThemeColors();

  const handleStart = () => {
    if (!selectedProject) {
      toast.error('Please select a project');
      return;
    }

    startTimer(selectedProject, selectedClient, description);
    toast.success('Timer started');
  };

  const handleStop = async () => {
    if (!currentSession) return;

    const endTime = new Date();
    const durationMinutes = Math.floor(elapsedSeconds / 60);

    try {
      const logData = {
        project: currentSession.projectName,
        client: currentSession.clientName || '',
        description: currentSession.description || '',
        duration: durationMinutes,
        startTime: currentSession.startTime.toISOString(),
        endTime: endTime.toISOString(),
      };

      console.log('Creating time log:', logData);
      await timeLogsApi.create(logData);

      // Refresh time logs
      const logs = await timeLogsApi.getAll();
      setTimeLogs(logs);

      stopTimer();
      setSelectedProject('');
      setSelectedClient('');
      setDescription('');
      
      toast.success(`Session logged: ${durationMinutes} minutes`);
    } catch (error) {
      console.error('Failed to log time session:', error);
      if (error instanceof Error) {
        toast.error(`Failed to log: ${error.message}`);
      } else {
        toast.error('Failed to log time session');
      }
    }
  };

  const isRunning = currentSession?.isRunning || false;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="p-6">
        {!isRunning ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Project *
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              >
                <option value="" className="bg-gray-900 text-white">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.fieldValues['/text']} className="bg-gray-900 text-white">
                    {project.fieldValues['/text']}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Client
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              >
                <option value="" className="bg-gray-900 text-white">Select a client (optional)</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.fieldValues['/text']} className="bg-gray-900 text-white">
                    {client.fieldValues['/text']}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you working on?"
                className="w-full px-4 py-3 bg-gray-900 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              />
            </div>

            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full py-4 bg-gradient-to-r rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2",
                `bg-gradient-to-r ${themeColors.buttonGradient}`
              )}
              style={{
                boxShadow: `0 10px 40px ${themeColors.glow}, 0 4px 12px ${themeColors.glowInactive}`
              }}
            >
              <Play className="w-5 h-5" />
              Start Timer
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={handleStop}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full py-4 bg-gradient-to-r rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2",
              `bg-gradient-to-r ${themeColors.buttonGradient}`
            )}
            style={{
              boxShadow: `0 10px 40px ${themeColors.glow}, 0 4px 12px ${themeColors.glowInactive}`
            }}
          >
            <StopCircle className="w-5 h-5 fill-white" />
            Stop & Save
          </motion.button>
        )}
      </div>
    </div>
  );
}
