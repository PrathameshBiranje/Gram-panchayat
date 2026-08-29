import React, { useState } from 'react';
import { Language } from '../types';
import { UI_TRANSLATIONS } from '../data/translations';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  Globe, 
  HelpCircle,
  MessageSquare
} from 'lucide-react';

interface AiGramMitraProps {
  lang: Language;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const AiGramMitra: React.FC<AiGramMitraProps> = ({ lang, onClose }) => {
  const t = UI_TRANSLATIONS[lang];

  const initialMsg = lang === 'kn'
    ? 'ನಮಸ್ಕಾರ! ನಾನು ಹಳಸಿ ಗ್ರಾಮ ಪಂಚಾಯತಿಯ "ಗ್ರಾಮ ಮಿತ್ರ" AI ಸಹಾಯಕ್. ಇ-ಸ್ವತ್ತು, ಸಕಾಲ ಸೇವೆಗಳು, ಆಸ್ತಿ ತೆರಿಗೆ, ಉದ್ಯೋಗ ಖಾತರಿ ಅಥವಾ ಗ್ರಾಮದ ಇತಿಹಾಸದ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.'
    : 'Namaste! I am "Gram Mitra", the official AI Assistant for Halashi Gram Panchayat. Ask me any question about e-Swathu Form 9/11, Sakala certificates, Property Tax, MGNREGS or Halashi heritage.';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: initialMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    lang === 'kn' ? 'ಇ-ಸ್ವತ್ತು ನಮೂನೆ 9 ಪಡೆಯಲು ಏನೇನು ದಾಖಲೆಗಳು ಬೇಕು?' : 'What documents are required for e-Swathu Form 9?',
    lang === 'kn' ? 'ಮನೆ ಆಸ್ತಿ ತೆರಿಗೆ ಪಾವತಿಸುವುದು ಹೇಗೆ?' : 'How to pay property tax online?',
    lang === 'kn' ? 'ಹಳಸಿ ಭೂವರಾಹ ದೇವಸ್ಥಾನದ ಇತಿಹಾಸವೇನು?' : 'What is the history of Bhuvaraha Temple in Halashi?',
    lang === 'kn' ? 'ಉದ್ಯೋಗ ಖಾತರಿ ದಿನಗೂಲಿ ಎಷ್ಟು?' : 'What is the daily wage rate under NREGA?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-gram-mitra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          language: lang,
        }),
      });

      const data = await response.json();
      const botReply = data.reply || (lang === 'kn'
        ? 'ಕ್ಷಮಿಸಿ, ಮಾಹಿತಿಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಗ್ರಾಮ ಪಂಚಾಯತಿ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.'
        : 'Sorry, unable to process the query. Please contact PDO office at +91 94808 32100.');

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: lang === 'kn'
            ? 'ಸೇವೆ ಲಭ್ಯವಿದೆ. ಇ-ಸ್ವತ್ತು ಮತ್ತು ಸಕಾಲ ಸೇವೆಗಳಿಗಾಗಿ ಮುಖ್ಯ ಪೋರ್ಟಲ್ ಬಳಸಬಹುದು.'
            : 'Gram Mitra is active. For e-Swathu Form 9 & Property Tax, please use the Bapuji Seva Kendra portal tab.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full h-[85vh] flex flex-col overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white p-4 flex items-center justify-between border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white">{t.aiTitle}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[10px] text-amber-300 font-medium">{t.aiSub}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-indigo-800 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggested Quick Questions */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-amber-600" /> Quick:
          </span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="bg-white border border-slate-200 hover:border-indigo-400 text-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap shadow-xs transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Stream Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-100/60 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-indigo-900 text-amber-400 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 shadow-xs space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                }`}
              >
                <p className="leading-relaxed whitespace-pre-line text-xs font-medium">
                  {msg.text}
                </p>
                <span
                  className={`text-[9px] block text-right font-mono ${
                    msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-sm mt-0.5 font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs italic bg-white p-3 rounded-2xl border w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>Gram Mitra AI is fetching official details...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder={t.askAiPlaceholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 p-2.5 rounded-xl font-bold transition shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
