import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useThemeColors } from '../hooks/useThemeColors';
import { cn } from '../lib/utils';

const themeGradients = {
  orange: 'from-orange-500 to-amber-500',
  cyan: 'from-cyan-500 to-blue-500',
  purple: 'from-purple-500 to-violet-500',
  green: 'from-green-500 to-emerald-500',
};

export function AnimatedLogo() {
  const { theme } = useStore();
  const themeColors = useThemeColors();
  
  return (
    <div 
      className={cn(
        "relative w-10 h-10 bg-gradient-to-br rounded-xl flex items-center justify-center overflow-hidden",
        themeGradients[theme]
      )}
      style={{
        boxShadow: `0 0 20px ${themeColors.glow}, 0 0 40px ${themeColors.glowInactive}`
      }}
    >
      {/* Clock face */}
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        {/* Clock circle */}
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" opacity="0.6" />
        
        {/* Hour markers */}
        <circle cx="12" cy="5" r="0.5" fill="white" opacity="0.4" />
        <circle cx="12" cy="19" r="0.5" fill="white" opacity="0.4" />
        <circle cx="5" cy="12" r="0.5" fill="white" opacity="0.4" />
        <circle cx="19" cy="12" r="0.5" fill="white" opacity="0.4" />
        
        {/* Center dot */}
        <circle cx="12" cy="12" r="1" fill="white" />
        
        {/* Animated hand */}
        <motion.line
          x1="12"
          y1="12"
          x2="12"
          y2="6"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ transformOrigin: '12px 12px' }}
        />
      </svg>
    </div>
  );
}
