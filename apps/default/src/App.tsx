import { useEffect, useState, useMemo } from 'react';
import { Toaster } from 'sonner';
import { Timer, FolderKanban, Users, Clock, BarChart3, Palette, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { useStore } from './store/useStore';
import { projectsApi, clientsApi, timeLogsApi } from './services/api';
import { APP_VERSION } from './utils/version';
import { CircularTimer } from './components/CircularTimer';
import { TimerControls } from './components/TimerControls';
import { ProjectsTab } from './components/ProjectsTab';
import { ClientsTab } from './components/ClientsTab';
import { TimeLogsTab } from './components/TimeLogsTab';
import { StatisticsTab } from './components/StatisticsTab';
import { ParticleEffects } from './components/ParticleEffects';
import { AmbientParticles } from './components/AmbientParticles';
import { MountainBackground } from './components/MountainBackground';
import { WavesBackground } from './components/WavesBackground';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { useThemeColors } from './hooks/useThemeColors';
import { cn } from './lib/utils';

function App() {
  const { 
    activeTab, 
    setActiveTab, 
    setProjects, 
    setClients, 
    setTimeLogs,
    theme,
    setTheme,
    backgroundShape,
    setBackgroundShape
  } = useStore();
  
  const themeColors = useThemeColors();
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [bubbleCount, setBubbleCount] = useState(() => 
    typeof window !== 'undefined' ? Math.floor((window.innerWidth * window.innerHeight) / 25000) : 20
  );

  // Memoize color calculations to prevent background shifting
  const glowColors = useMemo(() => ({
    border: themeColors.glow.replace('0.2', '0.4'),
    shadow1: themeColors.glow.replace('0.2', '0.3'),
    shadow2: themeColors.glow.replace('0.2', '0.15'),
    grid: themeColors.glow.replace('0.2', '0.3'),
    gridDot: themeColors.glow.replace('0.2', '0.7'),
    gridShadow: themeColors.glow.replace('0.2', '0.8'),
    mesh: themeColors.glow.replace('0.2', '0.35'),
    meshDot: themeColors.glow.replace('0.2', '0.6'),
    meshShadow: themeColors.glow.replace('0.2', '0.8'),
  }), [themeColors.glow]);

  // Memoize circle positions and properties to prevent regeneration
  const circleElements = useMemo(() => {
    return Array.from({ length: bubbleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 120 + 60,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 10,
    }));
  }, [bubbleCount, backgroundShape]);

  // Memoize grid dots
  const gridDots = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: (i % 10) * 10 + 5,
      y: Math.floor(i / 10) * 10 + 5,
    }));
  }, [backgroundShape]);

  useEffect(() => {
    loadData();
    
    // Update bubble count on resize
    const handleResize = () => {
      setBubbleCount(Math.floor((window.innerWidth * window.innerHeight) / 25000));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    
    // Check if user has seen the tooltip before
    const hasSeenTooltip = localStorage.getItem('hasSeenThemeTooltip');
    if (!hasSeenTooltip) {
      // Show tooltip after a short delay
      setTimeout(() => {
        setShowTooltip(true);
      }, 1000);
      
      // Auto-hide after 8 seconds
      setTimeout(() => {
        setShowTooltip(false);
        localStorage.setItem('hasSeenThemeTooltip', 'true');
      }, 9000);
    }
  }, []);

  const loadData = async () => {
    try {
      const [projects, clients, logs] = await Promise.all([
        projectsApi.getAll(),
        clientsApi.getAll(),
        timeLogsApi.getAll(),
      ]);
      setProjects(projects);
      setClients(clients);
      setTimeLogs(logs);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const tabs = [
    { id: 'timer' as const, label: 'Timer', icon: Timer },
    { id: 'projects' as const, label: 'Projects', icon: FolderKanban },
    { id: 'clients' as const, label: 'Clients', icon: Users },
    { id: 'logs' as const, label: 'Time Logs', icon: Clock },
    { id: 'statistics' as const, label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Pulsing Duotone Splash */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, ${themeColors.splashPrimary} 0%, transparent 70%)`,
            filter: 'blur(120px)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, ${themeColors.splashSecondary} 0%, transparent 70%)`,
            filter: 'blur(120px)',
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.25, 0.15, 0.25],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
        />
      </div>

      {/* Ambient Floating Particles - Always visible */}
      <AmbientParticles />

      {/* Mountain Background */}
      {backgroundShape === 'mountains' && <MountainBackground theme={theme} />}

      {/* Waves Background */}
      {backgroundShape === 'waves' && <WavesBackground theme={theme} />}

      {/* Circles Pattern */}
      {backgroundShape === 'circles' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {circleElements.map((circle) => (
            <motion.div
              key={circle.id}
              className="absolute rounded-full border-2"
              style={{
                left: `${circle.x}%`,
                top: `${circle.y}%`,
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                borderColor: glowColors.border,
                boxShadow: `0 0 30px ${glowColors.shadow1}, 0 0 60px ${glowColors.shadow2}`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: circle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: circle.id * 0.2,
              }}
            />
          ))}
        </div>
      )}

      {/* Grid Pattern */}
      {backgroundShape === 'grid' && (
        <div className="fixed inset-0 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke={glowColors.grid}
                  strokeWidth="1.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {gridDots.map((dot) => (
              <motion.circle
                key={dot.id}
                cx={`${dot.x}%`}
                cy={`${dot.y}%`}
                r="2"
                fill={glowColors.gridDot}
                style={{
                  filter: `drop-shadow(0 0 4px ${glowColors.gridShadow})`
                }}
                animate={{
                  opacity: [0.4, 0.9, 0.4],
                  r: [2, 3.5, 2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: dot.id * 0.05,
                }}
              />
            ))}
          </svg>
        </div>
      )}

      {/* Mesh Pattern */}
      {backgroundShape === 'mesh' && (
        <div className="fixed inset-0 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mesh" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path
                  d="M 0 40 L 40 0 L 80 40 L 40 80 Z"
                  fill="none"
                  stroke={glowColors.mesh}
                  strokeWidth="2"
                />
                <circle cx="40" cy="0" r="4" fill={glowColors.meshDot} 
                  style={{ filter: `drop-shadow(0 0 6px ${glowColors.meshShadow})` }} />
                <circle cx="80" cy="40" r="4" fill={glowColors.meshDot} 
                  style={{ filter: `drop-shadow(0 0 6px ${glowColors.meshShadow})` }} />
                <circle cx="40" cy="80" r="4" fill={glowColors.meshDot} 
                  style={{ filter: `drop-shadow(0 0 6px ${glowColors.meshShadow})` }} />
                <circle cx="0" cy="40" r="4" fill={glowColors.meshDot} 
                  style={{ filter: `drop-shadow(0 0 6px ${glowColors.meshShadow})` }} />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mesh)" />
          </svg>
        </div>
      )}

      {/* Particle Effects */}
      {backgroundShape === 'particles' && <ParticleEffects />}



      {/* Content */}
      <div className="relative z-10">
        {/* Mobile-Responsive Header */}
        <header className="border-b border-white/10 backdrop-blur-lg bg-black/20">
          <div className="max-w-7xl mx-auto px-3 py-2.5 sm:px-6 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Animated Logo */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex-shrink-0"
                >
                  {/* Outer glow ring */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `radial-gradient(circle, ${themeColors.glow} 0%, transparent 70%)`,
                      filter: 'blur(20px)',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Logo container */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      rotate: {
                        duration: 4,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }
                    }}
                    className="relative p-2 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 cursor-pointer"
                    style={{
                      boxShadow: `0 0 30px ${themeColors.glow}, inset 0 0 20px ${themeColors.glow.replace('0.2', '0.1')}`,
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Timer 
                        className="w-6 h-6" 
                        style={{ 
                          color: themeColors.primary,
                          filter: `drop-shadow(0 0 8px ${themeColors.glow})`
                        }} 
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Title and Subtitle */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="hidden md:block min-w-0"
                >
                  {/* Main Title - Always White */}
                  <motion.h1 
                    className="text-xl lg:text-2xl font-bold tracking-tight text-white whitespace-nowrap"
                    style={{
                      textShadow: `
                        0 0 10px ${themeColors.glow.replace('0.2', '0.8')},
                        0 0 20px ${themeColors.glow.replace('0.2', '0.6')},
                        0 0 30px ${themeColors.glow.replace('0.2', '0.4')},
                        0 0 40px ${themeColors.glow.replace('0.2', '0.2')},
                        0 2px 4px rgba(0, 0, 0, 0.3)
                      `,
                    }}
                  >
                    <motion.span
                      animate={{
                        opacity: [1, 0.95, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Time Tracker
                    </motion.span>
                  </motion.h1>
                  
                  {/* Subtitle - Always White with lower opacity */}
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-xs lg:text-sm font-medium tracking-wide text-white/60 whitespace-nowrap"
                    style={{
                      textShadow: `
                        0 0 15px ${themeColors.glow.replace('0.2', '0.3')},
                        0 0 25px ${themeColors.glow.replace('0.2', '0.15')},
                        0 1px 2px rgba(0, 0, 0, 0.2)
                      `,
                    }}
                  >
                    <motion.span
                      animate={{
                        opacity: [0.6, 0.8, 0.6],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    >
                      Track time brilliantly
                    </motion.span>
                  </motion.p>
                </motion.div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Navigation */}
                <nav className="flex gap-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'p-2.5 rounded-lg font-medium transition-all flex items-center justify-center',
                        'md:px-4 md:py-2',
                        isActive
                          ? `bg-gradient-to-r ${themeColors.gradient} text-white border ${themeColors.border}`
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hidden md:inline text-sm ml-2">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Theme Toggle Button with Tooltip */}
              <Tooltip.Provider>
                <Tooltip.Root open={showTooltip} onOpenChange={setShowTooltip}>
                  <Tooltip.Trigger asChild>
                    <motion.button
                      onClick={() => {
                        setShowThemeCustomizer(!showThemeCustomizer);
                        setShowTooltip(false);
                        localStorage.setItem('hasSeenThemeTooltip', 'true');
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        'p-2.5 rounded-lg border transition-all relative flex-shrink-0',
                        showThemeCustomizer
                          ? `bg-gradient-to-r ${themeColors.gradient} border-white/20`
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      )}
                    >
                      <Palette className="w-5 h-5 text-white" />
                      {showTooltip && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" style={{
                            filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))'
                          }} />
                        </motion.div>
                      )}
                    </motion.button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="bottom"
                      align="end"
                      sideOffset={8}
                      className="z-50 hidden sm:block"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="max-w-xs p-4 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20"
                        style={{
                          boxShadow: `0 0 30px ${themeColors.glow}, 0 8px 32px rgba(0, 0, 0, 0.4)`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white mb-1">
                              ✨ Customize Your Experience
                            </p>
                            <p className="text-xs text-white/70 leading-relaxed">
                              Click here to choose your favorite theme and background style!
                            </p>
                          </div>
                        </div>
                      </motion.div>
                      <Tooltip.Arrow className="fill-white/10" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center">
            {/* Main Content Area - Centered */}
            <div className="w-full max-w-4xl">
              {activeTab === 'timer' && (
                <div className="space-y-12">
                  <CircularTimer />
                  <TimerControls />
                </div>
              )}

              {activeTab === 'projects' && <ProjectsTab />}
              {activeTab === 'clients' && <ClientsTab />}
              {activeTab === 'logs' && <TimeLogsTab />}
              {activeTab === 'statistics' && <StatisticsTab />}
            </div>
          </div>
        </main>

        {/* Theme Customizer - Floating Sidebar */}
        <AnimatePresence>
          {showThemeCustomizer && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block fixed right-6 top-32 z-50"
            >
              <ThemeCustomizer onClose={() => setShowThemeCustomizer(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
