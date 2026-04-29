import { useState, useRef, useEffect } from 'react';
import { Palette, Mountain, Waves, Sparkles, Circle, Grid3x3, Hexagon, Ban, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ThemeControlsProps {
  theme: 'orange' | 'cyan' | 'purple' | 'green';
  onThemeChange: (theme: 'orange' | 'cyan' | 'purple' | 'green') => void;
  backgroundShape: 'mountains' | 'waves' | 'particles' | 'none' | 'dots' | 'grid' | 'rings' | 'mesh';
  onBackgroundShapeChange: (shape: 'mountains' | 'waves' | 'particles' | 'none' | 'dots' | 'grid' | 'rings' | 'mesh') => void;
}

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

export function ThemeControls({
  theme,
  onThemeChange,
  backgroundShape,
  onBackgroundShapeChange,
}: ThemeControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-3 shadow-lg hover:bg-white/10 transition-all"
        aria-label="Customize appearance"
      >
        <Palette className="w-5 h-5 text-white/70" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-white/70" />
              <h3 className="text-sm font-semibold text-white">Customize Appearance</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Color Theme Section */}
          <div className="p-4 border-b border-white/10">
            <label className="text-xs font-medium text-white/50 mb-3 block">Color Theme</label>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      onThemeChange(t.id);
                    }}
                    className={cn(
                      'relative px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-white/15 text-white border-2 border-white/30 shadow-lg'
                        : 'bg-white/5 text-white/70 border-2 border-transparent hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <div className={cn('w-full h-1.5 rounded-full bg-gradient-to-r mb-2', t.colors)} />
                    <span>{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Background Shape Section */}
          <div className="p-4">
            <label className="text-xs font-medium text-white/50 mb-3 block">Background Shape</label>
            <div className="grid grid-cols-2 gap-2">
              {shapes.map((shape) => {
                const Icon = shape.icon;
                const isActive = backgroundShape === shape.id;
                return (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() => {
                      onBackgroundShapeChange(shape.id);
                    }}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-white/15 text-white border-2 border-white/30 shadow-lg'
                        : 'bg-white/5 text-white/70 border-2 border-transparent hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{shape.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-white/5 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              Customize your workspace aesthetic
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
