import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useThemeColors } from '../hooks/useThemeColors';
import { projectsApi } from '../services/api';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const colorMap = {
  cyan: { bg: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  magenta: { bg: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/30', text: 'text-pink-400' },
  violet: { bg: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  amber: { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
};

export function ProjectsTab() {
  const { projects, setProjects, clients, timeLogs } = useStore();
  const themeColors = useThemeColors();
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    color: 'cyan' as const,
    budget: 0,
  });

  const handleAdd = async () => {
    if (!newProject.name) {
      toast.error('Project name is required');
      return;
    }

    try {
      await projectsApi.create(newProject);
      const updatedProjects = await projectsApi.getAll();
      setProjects(updatedProjects);
      setIsAdding(false);
      setNewProject({ name: '', client: '', color: 'cyan', budget: 0 });
      toast.success('Project created');
    } catch (error) {
      toast.error('Failed to create project');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await projectsApi.delete(id);
      const updatedProjects = await projectsApi.getAll();
      setProjects(updatedProjects);
      toast.success('Project deleted');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  const calculateProjectTime = (projectName: string) => {
    const projectLogs = timeLogs.filter(
      (log) => log.fieldValues['/attributes/@proj1'] === projectName
    );
    const totalMinutes = projectLogs.reduce(
      (sum, log) => sum + (log.fieldValues['/attributes/@dur01'] || 0),
      0
    );
    return (totalMinutes / 60).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
        <motion.button
          onClick={() => setIsAdding(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "px-4 py-2 bg-gradient-to-r rounded-lg font-medium text-white shadow-lg flex items-center gap-2",
            `bg-gradient-to-r ${themeColors.buttonGradient}`
          )}
          style={{
            boxShadow: `0 10px 40px ${themeColors.glow}, 0 4px 12px ${themeColors.glowInactive}`
          }}
        >
          <Plus className="w-4 h-4" />
          New Project
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="space-y-4">
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Project name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 transition-all"
                style={{
                  '--tw-ring-color': themeColors.primary,
                } as React.CSSProperties}
              />

              <select
                value={newProject.client}
                onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 transition-all"
                style={{
                  '--tw-ring-color': themeColors.primary,
                } as React.CSSProperties}
              >
                <option value="">Select client (optional)</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.fieldValues['/text']}>
                    {client.fieldValues['/text']}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                {(['cyan', 'magenta', 'violet', 'amber', 'emerald'] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewProject({ ...newProject, color })}
                    className={cn(
                      'w-10 h-10 rounded-lg border-2 transition-all',
                      newProject.color === color ? 'scale-110 ring-2 ring-white/50' : 'opacity-50',
                      `bg-gradient-to-br ${colorMap[color].bg}`,
                      colorMap[color].border
                    )}
                  />
                ))}
              </div>

              <input
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                placeholder="Budget (hours)"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 transition-all"
                style={{
                  '--tw-ring-color': themeColors.primary,
                } as React.CSSProperties}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className={cn(
                    "flex-1 py-2 rounded-lg font-medium text-white transition-all",
                    `bg-gradient-to-r ${themeColors.gradient} border ${themeColors.border}`
                  )}
                  style={{
                    boxShadow: `0 0 20px ${themeColors.glow}`,
                  }}
                >
                  Create
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg font-medium text-white/60 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {projects.map((project) => {
            const color = project.fieldValues['/attributes/@colr1'] || 'cyan';
            const hoursLogged = calculateProjectTime(project.fieldValues['/text']);
            const budget = project.fieldValues['/attributes/@budg1'] || 0;
            const hasExceededBudget = Number(hoursLogged) > budget;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className={cn(
                  'backdrop-blur-lg bg-gradient-to-br rounded-2xl p-6 border shadow-lg transition-all',
                  colorMap[color].bg,
                  colorMap[color].border
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {project.fieldValues['/text']}
                  </h3>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {project.fieldValues['/attributes/@clnt2'] && (
                  <div className="text-sm text-white/60 mb-3">
                    {project.fieldValues['/attributes/@clnt2']}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Clock className={cn('w-4 h-4', colorMap[color].text)} />
                  <span className={cn('font-medium', colorMap[color].text)}>
                    {hoursLogged}h
                  </span>
                  <span className="text-white/40">/ {budget}h</span>
                  {hasExceededBudget && (
                    <span className="ml-auto text-xs text-red-400 font-medium">Over budget</span>
                  )}
                </div>

                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((Number(hoursLogged) / budget) * 100, 100)}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={cn(
                      'h-full rounded-full',
                      hasExceededBudget ? 'bg-red-500' : `bg-gradient-to-r ${colorMap[color].bg.replace('/20', '/80').replace('/10', '/60')}`
                    )}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
