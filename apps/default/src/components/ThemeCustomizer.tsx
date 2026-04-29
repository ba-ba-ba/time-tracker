import { motion } from 'framer-motion';
import { Palette, Mountain, Waves, Sparkles, Circle, Grid3x3, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const themes = [
  { id: 'orange', name: 'Sunset', icon: '🌅', color: 'from-orange-500 to-amber-500' },
  { id: 'cyan', name: 'Ocean', icon: '🌊', color: 'from-cyan-500 to-blue-500' },
  { id: 'purple', name: 'Twilight', icon: '🌆', color: 'from-purple-500 to-pink-500' },
  { id: 'green', name: 'Forest', icon: '🌲', color: 'from-emerald-500 to-teal-500' },
] as const;

const backgrounds = [
  { id: 'mountains', name: 'Mountains', icon: Mountain },
  { id: 'waves', name: 'Waves', icon: Waves },
  { id: 'circles', name: 'Circles', icon: Circle },
  { id: 'grid', name: 'Grid', icon: Grid3x3 },
] as const;

interface ThemeCustomizerProps {
  onClose?: () => void;
}

export function ThemeCustomizer({ onClose }: ThemeCustomizerProps) {
  const { theme, backgroundShape, setTheme, setBackgroundShape } = useStore();

  return (
    <div className="w-72 backdrop-blur-xl bg-gradient-to-br from-black/40 to-black/20 border border-white/10 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10">
        <div className="p-2 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-xl">
          <Palette className="w-5 h-5 text-orange-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">Theme Studio</h2>
          <p className="text-xs text-white/50">Customize appearance</p>
        </div>
        {onClose && (
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </motion.button>
        )}
      </div>

      {/* Color Themes */}
      <div>
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
          Color Theme
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((t) => {
            const isActive = theme === t.id;
            return (
              <motion.button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'border-white/40 bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {/* Color Preview */}
                <div
                  className={`w-full h-10 rounded-lg bg-gradient-to-r ${t.color} mb-2 shadow-lg`}
                />
                
                {/* Theme Info */}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-lg">{t.icon}</div>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </motion.div>
                  )}
                </div>
                <div className="text-xs font-medium text-white mt-1">{t.name}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Background Patterns */}
      <div>
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">
          Background Pattern
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {backgrounds.map((bg) => {
            const isActive = backgroundShape === bg.id;
            const Icon = bg.icon;
            return (
              <motion.button
                key={bg.id}
                onClick={() => setBackgroundShape(bg.id as any)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 rounded-lg border transition-all ${
                  isActive
                    ? 'border-white/40 bg-white/10'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
                title={bg.name}
              >
                <Icon className="w-5 h-5 text-white mx-auto" />
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Live Preview Info */}
      <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold text-white mb-1">Live Preview</h4>
            <p className="text-xs text-white/60 leading-relaxed">
              Changes apply instantly across the entire app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
