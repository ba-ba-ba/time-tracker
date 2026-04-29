import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Square } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useThemeColors } from '../hooks/useThemeColors';
import { cn } from '../lib/utils';

export function CircularTimer() {
  const { currentSession, elapsedSeconds, setElapsedSeconds } = useStore();
  const themeColors = useThemeColors();
  const intervalRef = useRef<number>();

  useEffect(() => {
    if (currentSession?.isRunning) {
      intervalRef.current = window.setInterval(() => {
        setElapsedSeconds(elapsedSeconds + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSession, elapsedSeconds, setElapsedSeconds]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isRunning = currentSession?.isRunning || false;
  const circumference = 2 * Math.PI * 140;
  const progress = (elapsedSeconds % 60) / 60;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center">
      {/* SVG Timer Ring */}
      <svg 
        className="relative w-80 h-80 -rotate-90" 
        viewBox="0 0 320 320"
        style={{ overflow: 'visible' }}
      >
        {/* Background circle */}
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="8"
        />

        {/* Spinning neon ring when NOT running (empty state) */}
        {!isRunning && elapsedSeconds === 0 && (
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
            filter="url(#glow)"
            animate={{
              strokeDashoffset: [0, circumference],
            }}
            transition={{
              duration: 2.9,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        )}

        {/* Progress circle with neon glow (when running) */}
        {(isRunning || elapsedSeconds > 0) && (
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            filter="url(#glow-subtle)"
            animate={{
              strokeDashoffset: isRunning ? strokeDashoffset : circumference,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}

        {/* Gradient and Filter definitions */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={themeColors.gradientArray[0]} />
            <stop offset="50%" stopColor={themeColors.gradientArray[1]} />
            <stop offset="100%" stopColor={themeColors.gradientArray[2]} />
          </linearGradient>
          
          {/* Intense glow for spinning ring */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Subtle glow for progress ring */}
          <filter id="glow-subtle" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 160 + 130 * Math.cos(angle);
          const y1 = 160 + 130 * Math.sin(angle);
          const x2 = 160 + 140 * Math.cos(angle);
          const y2 = 160 + 140 * Math.sin(angle);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-20">
        <motion.div
          className={cn(
            'text-5xl font-bold tracking-wider mb-4',
            isRunning
              ? 'bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent'
              : 'text-white/60'
          )}
          animate={{
            scale: isRunning ? [1, 1.02, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isRunning ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {formatTime(elapsedSeconds)}
        </motion.div>

        {currentSession && (
          <div className="text-center px-12 max-w-xs">
            <div className="text-sm text-white/40 mb-1">Current Session</div>
            <div className="text-lg font-medium text-white/80 truncate">
              {currentSession.projectName}
            </div>
            {currentSession.description && (
              <div className="text-sm text-white/50 truncate mt-1">
                {currentSession.description}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
