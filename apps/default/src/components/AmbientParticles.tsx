import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useThemeColors } from '../hooks/useThemeColors';

export function AmbientParticles() {
  const themeColors = useThemeColors();

  // Generate ambient particles with varied properties - fully memoized to prevent re-generation
  const particles = useMemo(() => Array.from({ length: 15 }, (_, i) => {
    const opacity = Math.random() * 0.08 + 0.03;
    const xMove = Math.random() * 60 - 30;
    const yMove = Math.random() * 60 - 30;
    
    return {
      id: i,
      size: Math.random() * 50 + 30, // 30-80px
      x: Math.random() * 100, // 0-100%
      y: Math.random() * 100, // 0-100%
      duration: Math.random() * 25 + 20, // 20-45s (slower)
      delay: Math.random() * 10, // 0-10s
      opacity,
      xMove,
      yMove,
    };
  }), []);

  // Memoize particle styles based on theme
  const particleStyles = useMemo(() => 
    particles.map(particle => ({
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: particle.size,
      height: particle.size,
      background: `radial-gradient(circle, ${themeColors.glow.replace('0.2', String(particle.opacity * 2))} 0%, transparent 70%)`,
      filter: 'blur(25px)',
    }))
  , [particles, themeColors.glow]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={particleStyles[index]}
          animate={{
            x: [0, particle.xMove, 0],
            y: [0, particle.yMove, 0],
            scale: [1, 1.1, 1],
            opacity: [particle.opacity, particle.opacity * 1.3, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
