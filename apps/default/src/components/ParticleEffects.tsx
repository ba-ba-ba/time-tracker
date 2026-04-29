import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useThemeColors } from '../hooks/useThemeColors';
import { Star } from 'lucide-react';

export function ParticleEffects() {
  const themeColors = useThemeColors();
  
  // Memoize all star generation to prevent regeneration on every render
  const smallStars = useMemo(() => 
    Array.from({ length: 80 }, (_, i) => ({
      id: `small-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
    }))
  , []);

  const mediumStars = useMemo(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: `medium-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 3,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 5,
    }))
  , []);

  const largeStars = useMemo(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: `large-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 6,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 5,
    }))
  , []);

  // Constellation patterns - static, no need to memoize
  const constellations = [
    [
      { x: 15, y: 20 }, { x: 20, y: 18 }, { x: 25, y: 20 }, { x: 30, y: 22 },
      { x: 32, y: 28 }, { x: 28, y: 32 }, { x: 24, y: 30 }
    ],
    [
      { x: 70, y: 40 }, { x: 75, y: 42 }, { x: 80, y: 40 }
    ],
    [
      { x: 50, y: 70 }, { x: 55, y: 75 }, { x: 45, y: 75 }
    ],
  ];

  // Memoize color-dependent values
  const glowColors = useMemo(() => ({
    full: themeColors.glow.replace('0.2', '1'),
    half: themeColors.glow.replace('0.2', '0.4'),
    strong: themeColors.glow.replace('0.2', '0.8'),
    medium: themeColors.glow.replace('0.2', '0.6'),
    light: themeColors.glow.replace('0.2', '0.3'),
  }), [themeColors.glow]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Small twinkling stars */}
      {smallStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: `radial-gradient(circle, ${glowColors.full} 0%, ${glowColors.half} 50%, transparent 100%)`,
            boxShadow: `0 0 ${star.size * 4}px ${glowColors.strong}, 0 0 ${star.size * 8}px ${glowColors.half}`,
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Medium stars */}
      {mediumStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.9, 1.2, 0.9],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        >
          <Star 
            className="text-white" 
            size={star.size}
            fill="currentColor"
            style={{
              filter: `drop-shadow(0 0 ${star.size * 2}px ${glowColors.full}) drop-shadow(0 0 ${star.size * 4}px ${glowColors.medium})`,
            }}
          />
        </motion.div>
      ))}

      {/* Large prominent stars */}
      {largeStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [0.9, 1.4, 0.9],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        >
          <Star 
            className="text-white" 
            size={star.size}
            fill="currentColor"
            style={{
              filter: `drop-shadow(0 0 ${star.size * 3}px ${glowColors.full}) drop-shadow(0 0 ${star.size * 6}px ${glowColors.strong}) drop-shadow(0 0 ${star.size * 10}px ${glowColors.half})`,
            }}
          />
        </motion.div>
      ))}

      {/* Constellation lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        {constellations.map((constellation, cIndex) => (
          <g key={`constellation-${cIndex}`}>
            {constellation.map((point, pIndex) => {
              if (pIndex === constellation.length - 1) return null;
              const nextPoint = constellation[pIndex + 1];
              return (
                <motion.line
                  key={`line-${pIndex}`}
                  x1={`${point.x}%`}
                  y1={`${point.y}%`}
                  x2={`${nextPoint.x}%`}
                  y2={`${nextPoint.y}%`}
                  stroke={glowColors.light}
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0.2, 0.5, 0.2] }}
                  transition={{
                    pathLength: { duration: 2, delay: cIndex * 0.5 },
                    opacity: { duration: 4, repeat: Infinity, delay: cIndex * 0.5 },
                  }}
                />
              );
            })}
            {/* Constellation star points */}
            {constellation.map((point, pIndex) => (
              <motion.circle
                key={`point-${pIndex}`}
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r="2"
                fill={glowColors.strong}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  r: [2, 3, 2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: pIndex * 0.2,
                }}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
