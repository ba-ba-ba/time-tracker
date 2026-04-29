import { useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Clock, TrendingUp, Calendar } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useThemeColors } from '../hooks/useThemeColors';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from 'date-fns';

export function StatisticsTab() {
  const { timeLogs, projects } = useStore();
  const themeColors = useThemeColors();
  const chartColors = themeColors.chartColors;

  const stats = useMemo(() => {
    const totalMinutes = timeLogs.reduce(
      (sum, log) => sum + (log.fieldValues['/attributes/@dur01'] || 0),
      0
    );
    const totalHours = (totalMinutes / 60).toFixed(1);
    const totalSessions = timeLogs.length;

    // Project breakdown
    const projectData = projects.map((project) => {
      const projectName = project.fieldValues['/text'];
      const projectLogs = timeLogs.filter(
        (log) => log.fieldValues['/attributes/@proj1'] === projectName
      );
      const minutes = projectLogs.reduce(
        (sum, log) => sum + (log.fieldValues['/attributes/@dur01'] || 0),
        0
      );
      return {
        name: projectName,
        hours: Number((minutes / 60).toFixed(1)),
        color: project.fieldValues['/attributes/@colr1'] || 'cyan',
      };
    }).filter((p) => p.hours > 0);

    // Weekly breakdown
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const weeklyData = daysOfWeek.map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayLogs = timeLogs.filter((log) => {
        const startTime = log.fieldValues['/attributes/@strt1'];
        if (!startTime) return false;
        try {
          const logDate = format(parseISO(startTime), 'yyyy-MM-dd');
          return logDate === dayStr;
        } catch {
          return false;
        }
      });
      const minutes = dayLogs.reduce(
        (sum, log) => sum + (log.fieldValues['/attributes/@dur01'] || 0),
        0
      );
      return {
        day: format(day, 'EEE'),
        hours: Number((minutes / 60).toFixed(1)),
      };
    });

    return { totalHours, totalSessions, projectData, weeklyData };
  }, [timeLogs, projects]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Statistics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          className="backdrop-blur-lg bg-gradient-to-br border rounded-2xl p-6"
          style={{
            background: `linear-gradient(to bottom right, ${themeColors.primary}33, ${themeColors.primary}1A)`,
            borderColor: `${themeColors.primary}4D`,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5" style={{ color: themeColors.primary }} />
            <span className="text-sm text-white/60">Total Hours</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalHours}h</div>
        </div>

        <div 
          className="backdrop-blur-lg bg-gradient-to-br border rounded-2xl p-6"
          style={{
            background: `linear-gradient(to bottom right, ${themeColors.secondary}33, ${themeColors.secondary}1A)`,
            borderColor: `${themeColors.secondary}4D`,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5" style={{ color: themeColors.secondary }} />
            <span className="text-sm text-white/60">Sessions</span>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalSessions}</div>
        </div>

        <div 
          className="backdrop-blur-lg bg-gradient-to-br border rounded-2xl p-6"
          style={{
            background: `linear-gradient(to bottom right, ${themeColors.accent}33, ${themeColors.accent}1A)`,
            borderColor: `${themeColors.accent}4D`,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5" style={{ color: themeColors.accent }} />
            <span className="text-sm text-white/60">Avg per Session</span>
          </div>
          <div className="text-3xl font-bold text-white">
            {stats.totalSessions > 0
              ? (Number(stats.totalHours) / stats.totalSessions).toFixed(1)
              : '0'}
            h
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Distribution */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Time by Project</h3>
          {stats.projectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.projectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="hours"
                  labelLine={false}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationBegin={0}
                >
                  {stats.projectData.map((entry, index) => {
                    const color = chartColors[index % chartColors.length];
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={color}
                        stroke={color}
                        strokeWidth={2}
                        style={{
                          filter: `drop-shadow(0 0 8px ${color}80) drop-shadow(0 0 4px ${color}40)`,
                        }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      const total = stats.projectData.reduce((sum, p) => sum + p.hours, 0);
                      const percent = ((data.value as number / total) * 100).toFixed(0);
                      return (
                        <div className="backdrop-blur-lg bg-black/90 border border-white/20 rounded-lg px-3 py-2">
                          <p className="text-white font-medium text-sm">{data.name}</p>
                          <p className="text-white/80 text-xs">{data.value}h ({percent}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-white/40">
              No data yet
            </div>
          )}
          
          {/* Custom Legend */}
          {stats.projectData.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {stats.projectData.map((entry, index) => {
                const total = stats.projectData.reduce((sum, p) => sum + p.hours, 0);
                const percent = ((entry.hours / total) * 100).toFixed(0);
                return (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    <span className="text-xs text-white/70 truncate">{entry.name}</span>
                    <span className="text-xs text-white/40 ml-auto">{percent}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Weekly Trend */}
        <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">This Week</h3>
          {stats.weeklyData.some((d) => d.hours > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.weeklyData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartColors[0]} stopOpacity={1} />
                    <stop offset="100%" stopColor={chartColors[1]} stopOpacity={0.8} />
                  </linearGradient>
                  <filter id="barGlow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <XAxis
                  dataKey="day"
                  stroke="rgba(255, 255, 255, 0.2)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="rgba(255, 255, 255, 0.2)" 
                  tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                  tickLine={false}
                />
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="backdrop-blur-lg bg-black/90 border border-white/20 rounded-lg px-3 py-2">
                          <p className="text-white font-medium text-sm">{payload[0].payload.day}</p>
                          <p className="text-white/80 text-xs">{payload[0].value} hours</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="hours" 
                  fill="url(#barGradient)" 
                  radius={[12, 12, 0, 0]}
                  maxBarSize={60}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationBegin={0}
                  style={{ filter: 'url(#barGlow)' }}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-white/40">
              No data this week
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
