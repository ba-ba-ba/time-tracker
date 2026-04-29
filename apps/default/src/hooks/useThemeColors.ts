import { useStore } from '../store/useStore';

export const themeColors = {
  orange: {
    glow: 'rgba(249, 115, 22, 0.2)',
    glowInactive: 'rgba(251, 146, 60, 0.1)',
    gradientArray: ['#f97316', '#fb923c', '#fdba74'],
    text: 'from-orange-400 via-amber-400 to-yellow-400',
    shadow: 'rgba(249, 115, 22, 0.8)',
    dotPattern: 'rgba(249, 115, 22, 0.15)',
    splashPrimary: 'rgba(249, 115, 22, 0.08)',
    splashSecondary: 'rgba(251, 146, 60, 0.08)',
    // New properties for buttons, tabs, and charts
    gradient: 'from-orange-500/20 to-amber-500/20',
    border: 'border-orange-500/30',
    buttonGradient: 'from-orange-500 to-amber-500',
    chartColors: ['#f97316', '#fb923c', '#fdba74', '#fcd34d', '#fde68a'],
  },
  cyan: {
    glow: 'rgba(6, 182, 212, 0.2)',
    glowInactive: 'rgba(34, 211, 238, 0.1)',
    gradientArray: ['#06b6d4', '#22d3ee', '#67e8f9'],
    text: 'from-cyan-400 via-blue-400 to-sky-400',
    shadow: 'rgba(6, 182, 212, 0.8)',
    dotPattern: 'rgba(6, 182, 212, 0.15)',
    splashPrimary: 'rgba(6, 182, 212, 0.08)',
    splashSecondary: 'rgba(34, 211, 238, 0.08)',
    // New properties for buttons, tabs, and charts
    gradient: 'from-cyan-500/20 to-blue-500/20',
    border: 'border-cyan-500/30',
    buttonGradient: 'from-cyan-500 to-blue-500',
    chartColors: ['#06b6d4', '#22d3ee', '#67e8f9', '#3b82f6', '#60a5fa'],
  },
  purple: {
    glow: 'rgba(139, 92, 246, 0.2)',
    glowInactive: 'rgba(167, 139, 250, 0.1)',
    gradientArray: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
    text: 'from-purple-400 via-violet-400 to-indigo-400',
    shadow: 'rgba(139, 92, 246, 0.8)',
    dotPattern: 'rgba(139, 92, 246, 0.15)',
    splashPrimary: 'rgba(139, 92, 246, 0.08)',
    splashSecondary: 'rgba(167, 139, 250, 0.08)',
    // New properties for buttons, tabs, and charts
    gradient: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30',
    buttonGradient: 'from-purple-500 to-pink-500',
    chartColors: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ec4899', '#f472b6'],
  },
  green: {
    glow: 'rgba(34, 197, 94, 0.2)',
    glowInactive: 'rgba(74, 222, 128, 0.1)',
    gradientArray: ['#22c55e', '#4ade80', '#86efac'],
    text: 'from-green-400 via-emerald-400 to-teal-400',
    shadow: 'rgba(34, 197, 94, 0.8)',
    dotPattern: 'rgba(34, 197, 94, 0.15)',
    splashPrimary: 'rgba(34, 197, 94, 0.08)',
    splashSecondary: 'rgba(74, 222, 128, 0.08)',
    // New properties for buttons, tabs, and charts
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    buttonGradient: 'from-emerald-500 to-teal-500',
    chartColors: ['#22c55e', '#4ade80', '#86efac', '#14b8a6', '#5eead4'],
  },
};

export function useThemeColors() {
  const { theme } = useStore();
  return themeColors[theme];
}
