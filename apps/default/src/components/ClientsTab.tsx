import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Mail, Phone, Building2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useThemeColors } from '../hooks/useThemeColors';
import { clientsApi } from '../services/api';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

const clientColors = [
  { bg: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/30', icon: 'text-orange-400', glow: 'shadow-orange-500/20' },
  { bg: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30', icon: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  { bg: 'from-purple-500/20 to-violet-500/20', border: 'border-purple-500/30', icon: 'text-purple-400', glow: 'shadow-purple-500/20' },
  { bg: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', icon: 'text-green-400', glow: 'shadow-green-500/20' },
  { bg: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', icon: 'text-pink-400', glow: 'shadow-pink-500/20' },
  { bg: 'from-yellow-500/20 to-orange-500/20', border: 'border-yellow-500/30', icon: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
];

const getClientColor = (index: number) => clientColors[index % clientColors.length];

export function ClientsTab() {
  const { clients, setClients } = useStore();
  const themeColors = useThemeColors();
  const [isAdding, setIsAdding] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });

  const handleAdd = async () => {
    if (!newClient.name) {
      toast.error('Client name is required');
      return;
    }

    try {
      await clientsApi.create(newClient);
      const updatedClients = await clientsApi.getAll();
      setClients(updatedClients);
      setIsAdding(false);
      setNewClient({ name: '', email: '', phone: '', company: '' });
      toast.success('Client created');
    } catch (error) {
      toast.error('Failed to create client');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await clientsApi.delete(id);
      const updatedClients = await clientsApi.getAll();
      setClients(updatedClients);
      toast.success('Client deleted');
    } catch (error) {
      toast.error('Failed to delete client');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Clients</h2>
        <motion.button
          onClick={() => setIsAdding(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "px-4 py-2 bg-gradient-to-r rounded-lg font-medium text-white shadow-lg flex items-center gap-2",
            `bg-gradient-to-r ${themeColors.buttonGradient}`
          )}
          style={{
            boxShadow: `0 10px 40px ${themeColors.glow}, 0 4px 12px ${themeColors.glowInactive}`
          }}
        >
          <Plus className="w-4 h-4" />
          New Client
        </motion.button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="space-y-4">
              <input
                type="text"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Client name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 transition-all"
                style={{
                  '--tw-ring-color': themeColors.primary,
                } as React.CSSProperties}
              />

              <input
                type="email"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 transition-all"
                style={{
                  '--tw-ring-color': themeColors.primary,
                } as React.CSSProperties}
              />

              <input
                type="tel"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                placeholder="Phone"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 transition-all"
                style={{
                  '--tw-ring-color': themeColors.primary,
                } as React.CSSProperties}
              />

              <input
                type="text"
                value={newClient.company}
                onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                placeholder="Company"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 transition-all"
                style={{
                  '--tw-ring-color': themeColors.primary,
                } as React.CSSProperties}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className={cn(
                    "flex-1 py-2 rounded-lg font-medium text-white transition-all",
                    `bg-gradient-to-r ${themeColors.gradient} border ${themeColors.border}`
                  )}
                  style={{
                    boxShadow: `0 0 20px ${themeColors.glow}`,
                  }}
                >
                  Create
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-2 bg-white/5 border border-white/10 rounded-lg font-medium text-white/60 hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {clients.map((client, index) => {
            const colors = getClientColor(index);
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className={cn(
                  "backdrop-blur-lg bg-gradient-to-br border rounded-2xl p-6 shadow-lg transition-all",
                  colors.bg,
                  colors.border,
                  colors.glow
                )}
              >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {client.fieldValues['/text']}
                </h3>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="text-white/40 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {client.fieldValues['/attributes/@comp1'] && (
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Building2 className={cn("w-4 h-4", colors.icon)} />
                    {client.fieldValues['/attributes/@comp1']}
                  </div>
                )}

                {client.fieldValues['/attributes/@eml01'] && (
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Mail className={cn("w-4 h-4", colors.icon)} />
                    {client.fieldValues['/attributes/@eml01']}
                  </div>
                )}

                {client.fieldValues['/attributes/@phon1'] && (
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Phone className={cn("w-4 h-4", colors.icon)} />
                    {client.fieldValues['/attributes/@phon1']}
                  </div>
                )}
              </div>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
