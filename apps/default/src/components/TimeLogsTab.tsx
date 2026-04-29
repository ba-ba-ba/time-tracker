import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Trash2, Filter, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useThemeColors } from '../hooks/useThemeColors';
import { timeLogsApi } from '../services/api';
import { toast } from 'sonner';
import { cn } from '../lib/utils';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

type FilterType = 'all' | 'today' | 'week' | 'month';

const colorMap = {
  cyan: { bg: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400', dot: 'bg-cyan-400' },
  magenta: { bg: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/30', text: 'text-pink-400', dot: 'bg-pink-400' },
  violet: { bg: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/30', text: 'text-violet-400', dot: 'bg-violet-400' },
  amber: { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
};

export function TimeLogsTab() {
  const { timeLogs, setTimeLogs, projects } = useStore();
  const themeColors = useThemeColors();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(5);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(5);
  }, [filter, selectedProject]);

  const handleDelete = async (id: string) => {
    try {
      await timeLogsApi.delete(id);
      const updatedLogs = await timeLogsApi.getAll();
      setTimeLogs(updatedLogs);
      toast.success('Time log deleted');
    } catch (error) {
      toast.error('Failed to delete time log');
      console.error(error);
    }
  };

  const filteredLogs = useMemo(() => {
    let filtered = [...timeLogs];

    // Filter by project
    if (selectedProject !== 'all') {
      filtered = filtered.filter(
        (log) => log.fieldValues['/attributes/@proj1'] === selectedProject
      );
    }

    // Filter by time period
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    if (filter === 'today') {
      filtered = filtered.filter((log) => {
        try {
          const dateField = log.fieldValues['/attributes/@date1'];
          if (!dateField) return false;
          
          // Handle both string and DateTime object formats
          let dateStr: string;
          if (typeof dateField === 'object' && dateField.dateTime?.date) {
            dateStr = dateField.dateTime.date;
          } else if (typeof dateField === 'string') {
            dateStr = dateField;
          } else {
            return false;
          }
          
          const logDate = parseISO(dateStr);
          return logDate >= todayStart;
        } catch {
          return false;
        }
      });
    } else if (filter === 'week') {
      filtered = filtered.filter((log) => {
        try {
          const dateField = log.fieldValues['/attributes/@date1'];
          if (!dateField) return false;
          
          // Handle both string and DateTime object formats
          let dateStr: string;
          if (typeof dateField === 'object' && dateField.dateTime?.date) {
            dateStr = dateField.dateTime.date;
          } else if (typeof dateField === 'string') {
            dateStr = dateField;
          } else {
            return false;
          }
          
          const logDate = parseISO(dateStr);
          return isWithinInterval(logDate, { start: weekStart, end: weekEnd });
        } catch {
          return false;
        }
      });
    } else if (filter === 'month') {
      filtered = filtered.filter((log) => {
        try {
          const dateField = log.fieldValues['/attributes/@date1'];
          if (!dateField) return false;
          
          // Handle both string and DateTime object formats
          let dateStr: string;
          if (typeof dateField === 'object' && dateField.dateTime?.date) {
            dateStr = dateField.dateTime.date;
          } else if (typeof dateField === 'string') {
            dateStr = dateField;
          } else {
            return false;
          }
          
          const logDate = parseISO(dateStr);
          return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
        } catch {
          return false;
        }
      });
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      try {
        // Handle both string and DateTime object formats
        const dateFieldA = a.fieldValues['/attributes/@date1'];
        const dateFieldB = b.fieldValues['/attributes/@date1'];
        
        let dateStrA: string;
        if (typeof dateFieldA === 'object' && dateFieldA?.dateTime?.date) {
          dateStrA = dateFieldA.dateTime.date;
        } else if (typeof dateFieldA === 'string') {
          dateStrA = dateFieldA;
        } else {
          dateStrA = new Date().toISOString();
        }
        
        let dateStrB: string;
        if (typeof dateFieldB === 'object' && dateFieldB?.dateTime?.date) {
          dateStrB = dateFieldB.dateTime.date;
        } else if (typeof dateFieldB === 'string') {
          dateStrB = dateFieldB;
        } else {
          dateStrB = new Date().toISOString();
        }
        
        const dateA = parseISO(dateStrA);
        const dateB = parseISO(dateStrB);
        return dateB.getTime() - dateA.getTime();
      } catch {
        return 0;
      }
    });

    return filtered;
  }, [timeLogs, filter, selectedProject]);

  const totalHours = useMemo(() => {
    return filteredLogs.reduce(
      (sum, log) => sum + (log.fieldValues['/attributes/@dur01'] || 0),
      0
    ) / 60;
  }, [filteredLogs]);

  const visibleLogs = useMemo(() => {
    return filteredLogs.slice(0, visibleCount);
  }, [filteredLogs, visibleCount]);

  const hasMore = filteredLogs.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const handleShowLess = () => {
    setVisibleCount(5);
  };

  const getProjectColor = (projectName: string) => {
    const project = projects.find((p) => p.fieldValues['/text'] === projectName);
    const colorKey = project?.fieldValues['/attributes/@colr1'] || 'cyan';
    return colorMap[colorKey as keyof typeof colorMap] || colorMap.cyan;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Time Logs</h2>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className={cn('w-4 h-4', themeColors.text)} />
            <span className={cn('text-lg font-semibold', themeColors.text)}>
              {totalHours.toFixed(1)}h
            </span>
            <span className="text-white/40 text-sm">
              {filter === 'all' ? 'total' : filter === 'today' ? 'today' : `this ${filter}`}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Time Period Filter */}
        <div className="flex gap-2">
          {(['all', 'today', 'week', 'month'] as FilterType[]).map((f) => (
            <motion.button
              key={f}
              onClick={() => setFilter(f)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all capitalize',
                filter === f
                  ? `bg-gradient-to-r ${themeColors.gradient} text-white border ${themeColors.border}`
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              )}
              style={
                filter === f
                  ? {
                      boxShadow: `0 0 20px ${themeColors.glow}`,
                    }
                  : undefined
              }
            >
              {f}
            </motion.button>
          ))}
        </div>

        {/* Project Filter */}
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 transition-all"
          style={{
            '--tw-ring-color': themeColors.primary,
          } as React.CSSProperties}
        >
          <option value="all">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.fieldValues['/text']}>
              {project.fieldValues['/text']}
            </option>
          ))}
        </select>
      </div>

      {/* Time Logs List */}
      {filteredLogs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
        >
          <Clock className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-lg">No time logs found</p>
          <p className="text-white/30 text-sm mt-2">
            {filter !== 'all' || selectedProject !== 'all'
              ? 'Try adjusting your filters'
              : 'Start tracking time to see your sessions here'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {visibleLogs.map((log, index) => {
              const projectName = log.fieldValues['/attributes/@proj1'] || 'Unknown Project';
              const colors = getProjectColor(projectName);
              const duration = log.fieldValues['/attributes/@dur01'] || 0;
              
              // Handle both string and DateTime object formats
              const dateField = log.fieldValues['/attributes/@date1'];
              let date: Date;
              try {
                if (typeof dateField === 'object' && dateField?.dateTime?.date) {
                  date = parseISO(dateField.dateTime.date);
                } else if (typeof dateField === 'string') {
                  date = parseISO(dateField);
                } else {
                  date = new Date();
                }
              } catch {
                date = new Date();
              }
              
              const notes = log.fieldValues['/text'] || 'No notes';

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  className={cn(
                    'backdrop-blur-lg bg-gradient-to-br border rounded-xl p-4 shadow-lg transition-all group',
                    colors.bg,
                    colors.border
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Project & Notes */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn('w-2 h-2 rounded-full', colors.dot)} />
                        <h3 className="text-white font-semibold truncate">
                          {projectName}
                        </h3>
                      </div>
                      <p className="text-white/60 text-sm line-clamp-2">{notes}</p>
                    </div>

                    {/* Middle: Duration */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <Clock className={cn('w-4 h-4', colors.text)} />
                        <span className={cn('text-lg font-bold', colors.text)}>
                          {formatDuration(duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-white/40 text-xs">
                        <Calendar className="w-3 h-3" />
                        {format(date, 'MMM d, yyyy')}
                      </div>
                    </div>

                    {/* Right: Delete */}
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((duration / 480) * 100, 100)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.05 }}
                      className={cn('h-full rounded-full', `bg-gradient-to-r ${colors.bg.replace('/20', '/80').replace('/10', '/60')}`)}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Show More/Less Buttons */}
          {(hasMore || visibleCount > 5) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center gap-3 pt-4"
            >
              {hasMore && (
                <motion.button
                  onClick={handleShowMore}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'px-6 py-3 rounded-lg font-medium transition-all',
                    `bg-gradient-to-r ${themeColors.gradient} text-white border ${themeColors.border}`
                  )}
                  style={{
                    boxShadow: `0 0 20px ${themeColors.glow}`,
                  }}
                >
                  Show More ({filteredLogs.length - visibleCount} remaining)
                </motion.button>
              )}
              {visibleCount > 5 && (
                <motion.button
                  onClick={handleShowLess}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg font-medium transition-all bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                >
                  Show Less
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Summary Footer */}
      {filteredLogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">
              {filteredLogs.length} session{filteredLogs.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-white/60">Total:</span>
              <span className={cn('text-lg font-bold', themeColors.text)}>
                {totalHours.toFixed(1)}h
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
