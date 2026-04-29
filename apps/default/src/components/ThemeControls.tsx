import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Mountain, Waves, Grid3x3, Sparkles, Circle, Grid2x2, Hexagon, Ban } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface ThemeControlsProps {
  theme: 'orange' | 'cyan' | 'purple' | 'green';
  onThemeChange: (theme: 'orange' | 'cyan' | 'purple' | 'green') => void;
  backgroundShape: 'mountains' | 'waves' | 'particles' | 'none' | 'dots' | 'grid' | 'rings' | 'mesh';
  onBackgroundShapeChange: (shape: 'mountains' | 'waves' | 'particles' | 'none' | 'dots' | 'grid' | 'rings' | 'mesh') => void;
}

export function ThemeControls({
  theme,
  onThemeChange,
  backgroundShape,
  onBackgroundShapeChange,
}: ThemeControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const themes = [
    { id: 'orange' as const, name: 'Sunset', colors: 'from-orange-500 to-amber-500' },
    { id: 'cyan' as const, name: 'Ocean', colors: 'from-cyan-500 to-blue-500' },
    { id: 'purple' as const, name: 'Twilight', colors: 'from-purple-500 to-violet-500' },
    { id: 'green' as const, name: 'Forest', colors: 'from-green-500 to-emerald-500' },
  ];

  const shapes = [
    { id: 'mountains' as const, name: 'Mountains', icon: Mountain },
    { id: 'waves' as const, name: 'Waves', icon: Waves },
    { id: 'particles' as const, name: 'Particles', icon: Sparkles },
    { id: 'dots' as const, name: 'Dots', icon: Circle },
    { id: 'grid' as const, name: 'Grid', icon: Grid3x3 },
    { id: 'rings' as const, name: 'Rings', icon: Circle },
    { id: 'mesh' as const, name: 'Mesh', icon: Hexagon },
    { id: 'none' as const, name: 'None', icon: Ban },
  ];

  return (
    <div className="relative z-[10000]">
      {/* Toggle Button */}
      <button
        onClick={() => {
          console.log('Toggle clicked, current state:', isExpanded);
          setIsExpanded(!isExpanded);
        }}
        className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-3 shadow-lg hover:bg-white/10 transition-all"
      >
        <Palette className="w-5 h-5 text-white/70" />
      </button>

      {/* Expanded Panel */}
      {isExpanded && (
        <div
          className="absolute top-full right-0 mt-2 w-72 backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          style={{ zIndex: 10001 }}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Customize Appearance
              </h3>
            </div>

            {/* Theme Selection */}
            <div className="p-4 border-b border-white/10">
              <label className="text-xs text-white/50 mb-2 block">Color Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      console.log('Theme mousedown:', t.id);
                      onThemeChange(t.id);
                    }}
                    className={cn(
                      'relative px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer',
                      theme === t.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
                    )}
                    style={{ touchAction: 'manipulation' }}
                  >
                    <div className={cn('w-full h-1 rounded-full bg-gradient-to-r mb-2', t.colors)} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Shape Selection */}
            <div className="p-4">
              <label className="text-xs text-white/50 mb-2 block">Background Shape</label>
              <div className="grid grid-cols-2 gap-2">
                {shapes.map((shape) => {
                  const Icon = shape.icon;
                  return (
                    <button
                      key={shape.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        console.log('Shape mousedown:', shape.id);
                        onBackgroundShapeChange(shape.id);
                      }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer',
                        backgroundShape === shape.id
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-transparent'
                      )}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <Icon className="w-4 h-4" />
                      {shape.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/10">
              <p className="text-xs text-white/40 text-center">
                Customize your workspace aesthetic
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
