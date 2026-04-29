import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useThemeColors } from '../hooks/useThemeColors';
import { agentApi } from '../services/api';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AgentChat() {
  const { isAgentOpen, toggleAgent } = useStore();
  const themeColors = useThemeColors();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (isAgentOpen && !conversationId) {
      initializeConversation();
    }
  }, [isAgentOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentResponse]);

  const initializeConversation = async () => {
    try {
      const convoId = await agentApi.createConversation();
      setConversationId(convoId);
      
      // Open SSE stream
      const eventSource = new EventSource(
        `/api/taskade/agents/01KQBEPW1PNYV6XNEC8SKM9N1E/public-conversations/${convoId}/stream`
      );
      
      eventSourceRef.current = eventSource;
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'text-delta') {
          setCurrentResponse((prev) => prev + data.delta);
        } else if (data.type === 'finish') {
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), role: 'assistant', content: currentResponse },
          ]);
          setCurrentResponse('');
          setIsLoading(false);
        } else if (data.type === 'error') {
          toast.error('Agent error: ' + data.errorText);
          setIsLoading(false);
        }
      };
      
      eventSource.onerror = () => {
        toast.error('Connection to agent lost');
        setIsLoading(false);
      };
    } catch (error) {
      toast.error('Failed to initialize agent');
      console.error(error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !conversationId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setCurrentResponse('');

    try {
      await agentApi.sendMessage(conversationId, input);
    } catch (error) {
      toast.error('Failed to send message');
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isAgentOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={toggleAgent}
            className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r ${themeColors.gradient} rounded-full shadow-lg flex items-center justify-center z-50`}
            style={{ boxShadow: `0 10px 40px ${themeColors.glow.replace('0.2', '0.4')}` }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isAgentOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] backdrop-blur-lg bg-black/80 border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse" 
                  style={{ backgroundColor: themeColors.primary }}
                />
                <span className="font-semibold text-white">Time Tracking Assistant</span>
              </div>
              <button
                onClick={toggleAgent}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !currentResponse && (
                <div className="space-y-4">
                  <div className="text-center text-white/40 mt-4">
                    <Sparkles 
                      className="w-12 h-12 mx-auto mb-3" 
                      style={{ color: themeColors.glow.replace('0.2', '0.4') }}
                    />
                    <p className="text-sm">
                      ✨ Ready to track your time brilliantly? I'm here to help you understand your
                      productivity patterns and make every moment count.
                    </p>
                  </div>
                  
                  {/* Conversation Starters */}
                  <div className="space-y-2 mt-6">
                    <p className="text-xs text-white/30 px-2">Try asking:</p>
                    {[
                      { title: 'Weekly summary', prompt: 'Show me a summary of my time tracking for this week with insights' },
                      { title: 'Top projects', prompt: 'Which projects have I spent the most time on and what does that tell me about my focus?' },
                      { title: 'Productivity tips', prompt: 'Based on my time tracking patterns, what tips do you have to improve my productivity?' },
                      { title: 'Time analysis', prompt: 'Analyze my recent time entries and tell me if I\'m balancing my workload well' },
                    ].map((starter, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setInput(starter.prompt);
                          setTimeout(() => handleSend(), 100);
                        }}
                        className={`w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 border ${themeColors.border} rounded-lg text-sm text-white/70 hover:text-white transition-all`}
                      >
                        {starter.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      message.role === 'user'
                        ? `bg-gradient-to-r ${themeColors.gradient} text-white`
                        : 'bg-white/5 text-white/90'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {currentResponse && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] px-4 py-2 rounded-2xl bg-white/5 text-white/90">
                    {currentResponse}
                  </div>
                </div>
              )}

              {isLoading && !currentResponse && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-2xl bg-white/5">
                    <div className="flex gap-1">
                      <div 
                        className="w-2 h-2 rounded-full animate-bounce" 
                        style={{ backgroundColor: themeColors.primary }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: themeColors.secondary,
                          animationDelay: '0.1s' 
                        }}
                      />
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ 
                          backgroundColor: themeColors.accent,
                          animationDelay: '0.2s' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2 bg-white/5 border ${themeColors.border} rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 disabled:opacity-50`}
                  style={{ 
                    '--tw-ring-color': themeColors.glow.replace('0.2', '0.5')
                  } as React.CSSProperties}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`px-4 py-2 bg-gradient-to-r ${themeColors.gradient} rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
