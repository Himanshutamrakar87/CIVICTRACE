import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Zap,
  Minimize2,
  Maximize2,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api';
import { starkSound } from '../../services/sound';

interface CivicAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

export const CivicAIAssistant: React.FC<CivicAIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: 'Greetings. I am CIVIC AI — STARK INTELLIGENCE. Municipal telemetry channels for Satna, Madhya Pradesh are synchronized. How can I assist your civic investigation?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'stark-core',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'What are the most critical issues currently active?',
    'Which areas have the highest number of complaints?',
    'Which reports are flagged as duplicates?',
    'What issues have remained unresolved for the longest time?',
    'Which department has the largest pending workload?',
    "Summarize today's civic activity in Satna.",
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    starkSound.playClick();
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    starkSound.playScan();

    try {
      const res = await api.chatAssistant(text);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source,
      };
      setMessages((prev) => [...prev, aiMsg]);
      starkSound.playAlert();
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'assistant',
          text: 'Telemetry link interrupted. Local offline fallback: Monitoring active reports across Satna Municipal network.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] stark-panel rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col h-[560px] max-h-[85vh] animate-fadeIn overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/90 border-b border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wider">
              CIVIC AI — STARK INTELLIGENCE
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Grounded in Satna Live Telemetry</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            starkSound.playClick();
            onClose();
          }}
          className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs font-mono">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                m.sender === 'user'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-100 rounded-br-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs">
                {m.text}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500 font-mono">
              <span>{m.timestamp}</span>
              {m.source && <span className="text-cyan-500/80">· {m.source}</span>}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono py-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Consulting S.T.A.R.K. neural telemetry...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-2 bg-slate-950/80 border-t border-slate-900 flex gap-1.5 overflow-x-auto text-[11px] font-mono">
        {quickPrompts.slice(0, 3).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-950 border-t border-cyan-900/30 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask CIVIC AI about hotspots, backlog, or dockets..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isLoading}
          className="p-2 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 disabled:opacity-40 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
