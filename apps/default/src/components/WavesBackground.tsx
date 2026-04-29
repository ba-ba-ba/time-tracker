import { motion } from 'framer-motion';

interface WavesBackgroundProps {
  theme: 'orange' | 'cyan' | 'purple' | 'green';
}

export function WavesBackground({ theme }: WavesBackgroundProps) {
  const waveColors = {
    orange: ['rgba(249, 115, 22, 0.15)', 'rgba(251, 146, 60, 0.12)', 'rgba(253, 186, 116, 0.08)'],
    cyan: ['rgba(6, 182, 212, 0.15)', 'rgba(34, 211, 238, 0.12)', 'rgba(103, 232, 249, 0.08)'],
    purple: ['rgba(139, 92, 246, 0.15)', 'rgba(167, 139, 250, 0.12)', 'rgba(196, 181, 253, 0.08)'],
    green: ['rgba(34, 197, 94, 0.15)', 'rgba(74, 222, 128, 0.12)', 'rgba(134, 239, 172, 0.08)'],
  };

  const colors = waveColors[theme];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <svg 
        className="absolute bottom-0 left-0 w-full h-full" 
        viewBox="0 0 1440 800" 
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`waveGradient1-${theme}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id={`waveGradient2-${theme}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors[1]} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id={`waveGradient3-${theme}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors[2]} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Wave 1 - Back layer */}
        <motion.path
          d="M0,400 C320,300 420,500 720,450 C1020,400 1120,350 1440,400 L1440,800 L0,800 Z"
          fill={`url(#waveGradient1-${theme})`}
          animate={{
            d: [
              "M0,400 C320,300 420,500 720,450 C1020,400 1120,350 1440,400 L1440,800 L0,800 Z",
              "M0,450 C320,350 420,450 720,400 C1020,350 1120,400 1440,450 L1440,800 L0,800 Z",
              "M0,400 C320,300 420,500 720,450 C1020,400 1120,350 1440,400 L1440,800 L0,800 Z",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 2 - Middle layer */}
        <motion.path
          d="M0,500 C360,400 480,550 720,500 C960,450 1080,480 1440,520 L1440,800 L0,800 Z"
          fill={`url(#waveGradient2-${theme})`}
          animate={{
            d: [
              "M0,500 C360,400 480,550 720,500 C960,450 1080,480 1440,520 L1440,800 L0,800 Z",
              "M0,520 C360,450 480,500 720,480 C960,500 1080,450 1440,500 L1440,800 L0,800 Z",
              "M0,500 C360,400 480,550 720,500 C960,450 1080,480 1440,520 L1440,800 L0,800 Z",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Wave 3 - Front layer */}
        <motion.path
          d="M0,600 C400,520 500,620 720,580 C940,540 1040,600 1440,620 L1440,800 L0,800 Z"
          fill={`url(#waveGradient3-${theme})`}
          animate={{
            d: [
              "M0,600 C400,520 500,620 720,580 C940,540 1040,600 1440,620 L1440,800 L0,800 Z",
              "M0,620 C400,580 500,600 720,560 C940,600 1040,580 1440,600 L1440,800 L0,800 Z",
              "M0,600 C400,520 500,620 720,580 C940,540 1040,600 1440,620 L1440,800 L0,800 Z",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </svg>
    </div>
  );
}
