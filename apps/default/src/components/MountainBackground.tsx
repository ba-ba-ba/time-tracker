import { motion } from 'framer-motion';

interface MountainBackgroundProps {
  theme: 'orange' | 'cyan' | 'purple' | 'green';
}

export function MountainBackground({ theme }: MountainBackgroundProps) {
  const themeColors = {
    orange: {
      front: 'rgba(249, 115, 22, 0.25)',
      mid: 'rgba(251, 146, 60, 0.18)',
      back: 'rgba(253, 186, 116, 0.12)',
      stroke: 'rgba(249, 115, 22, 0.3)',
    },
    cyan: {
      front: 'rgba(6, 182, 212, 0.25)',
      mid: 'rgba(34, 211, 238, 0.18)',
      back: 'rgba(103, 232, 249, 0.12)',
      stroke: 'rgba(6, 182, 212, 0.3)',
    },
    purple: {
      front: 'rgba(139, 92, 246, 0.25)',
      mid: 'rgba(167, 139, 250, 0.18)',
      back: 'rgba(196, 181, 253, 0.12)',
      stroke: 'rgba(139, 92, 246, 0.3)',
    },
    green: {
      front: 'rgba(34, 197, 94, 0.25)',
      mid: 'rgba(74, 222, 128, 0.18)',
      back: 'rgba(134, 239, 172, 0.12)',
      stroke: 'rgba(34, 197, 94, 0.3)',
    },
  };

  const colors = themeColors[theme];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 w-full h-2/3"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back mountain range */}
        <motion.path
          d="M0,600 L0,350 L150,280 L250,320 L350,250 L450,290 L550,220 L650,270 L750,200 L850,250 L950,180 L1050,230 L1150,160 L1200,200 L1200,600 Z"
          fill={colors.back}
          stroke="none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ filter: 'blur(3px)' }}
        />

        {/* Middle mountain range */}
        <motion.path
          d="M0,600 L0,400 L100,350 L200,380 L300,320 L400,360 L500,280 L600,330 L700,260 L800,310 L900,240 L1000,290 L1100,220 L1200,270 L1200,600 Z"
          fill={colors.mid}
          stroke="none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ filter: 'blur(2px)' }}
        />

        {/* Front mountain range */}
        <motion.path
          d="M0,600 L0,450 L80,420 L160,440 L240,390 L320,430 L400,360 L480,410 L560,340 L640,390 L720,320 L800,370 L880,300 L960,350 L1040,280 L1120,330 L1200,310 L1200,600 Z"
          fill={colors.front}
          stroke="none"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          style={{ filter: 'blur(1px)' }}
        />
      </svg>
    </div>
  );
}
