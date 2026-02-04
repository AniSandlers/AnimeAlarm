import React, { useState, useEffect, useRef } from 'react';
import { Language, ScreenName } from '../types';
import { STRINGS } from '../constants';
import BottomNav from '../components/BottomNav';
import { ZOEY_RESPONSES } from '../data/zoey_responses';

interface HelpProps {
   language: Language;
   onNavigate: (screen: ScreenName) => void;
}

interface Message {
   id: string;
   text: string;
   sender: 'user' | 'zoey';
}

const Help: React.FC<HelpProps> = ({ language, onNavigate }) => {
   const [messages, setMessages] = useState<Message[]>([
      { id: '1', text: STRINGS.zoey_intro[language], sender: 'zoey' }
   ]);
   const [inputText, setInputText] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const getZoeyResponse = (input: string): string => {
      const lower = input.toLowerCase();
      const responses = ZOEY_RESPONSES[language];

      if (lower.match(/hola|hi|hello|hey|yo|buenos|good|tardes|noches|morning|afternoon|evening/)) return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
      if (lower.match(/adios|adiós|bye|vemos|later|hasta|ciao/)) return responses.farewell[Math.floor(Math.random() * responses.farewell.length)];
      if (lower.match(/gracias|thanks|thank|agradezco/)) return responses.thanks[Math.floor(Math.random() * responses.thanks.length)];
      if (lower.match(/recomienda|recomiendas|sugiere|cual|mejor|recommend|suggest|best|which/)) return responses.recommendation[Math.floor(Math.random() * responses.recommendation.length)];


      // FAQ Matching using simple includes/regex
      if (lower.match(/crear|creo|nueva|nuevo|poner|pongo|agregar|create|new|add|set|make/)) return responses.create[Math.floor(Math.random() * responses.create.length)];
      if (lower.match(/editar|edito|cambiar|cambio|modificar|modifico|edit|change|modify/)) return responses.edit[Math.floor(Math.random() * responses.edit.length)];
      if (lower.match(/eliminar|elimino|borrar|borro|quitar|quito|delete|remove/)) return responses.delete[Math.floor(Math.random() * responses.delete.length)];
      if (lower.match(/repetir|repita|dias|días|diario|repeat|days|daily/)) return responses.repeat[Math.floor(Math.random() * responses.repeat.length)];
      if (lower.match(/personaje|waifu|elegir|elijo|cambiar|cambio|character|choose|select/)) return responses.character[Math.floor(Math.random() * responses.character.length)];
      if (lower.match(/historial|racha|fuego|log|record|streak|fire/)) return responses.logs[Math.floor(Math.random() * responses.logs.length)];

      return responses.default[Math.floor(Math.random() * responses.default.length)];
   };

   const handleSend = async () => {
      if (!inputText.trim() || isLoading) return;

      const userMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
      setMessages(prev => [...prev, userMsg]);
      setInputText('');
      setIsLoading(true);

      // Simulate network delay for realism
      setTimeout(() => {
         const responseText = getZoeyResponse(userMsg.text);
         const zoeyMsg: Message = { id: (Date.now() + 1).toString(), text: responseText, sender: 'zoey' };
         setMessages(prev => [...prev, zoeyMsg]);
         setIsLoading(false);
      }, 800);
   };

   return (
      <div className="flex flex-col h-full bg-background-dark">
         <header className="px-6 pt-8 pb-4 border-b border-white/5 bg-background-dark/95 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-white text-2xl font-bold">{STRINGS.help_title[language]}</h2>
         </header>

         <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar flex flex-col pb-48">
            {/* Zoey Avatar */}
            <div className="flex flex-col items-center py-4 shrink-0">
               <div className="relative">
                  <div className="bg-center bg-no-repeat bg-cover rounded-full h-24 w-24 border-2 border-primary shadow-[0_0_15px_rgba(13,166,242,0.3)]" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAhALyy_YBdQ2I7u3IkGaPC4BVTkZxh-EWyOHedipyD92hLz2hSJrxNB29N-DMwjP4MdiUoi1Kyw_bZnOhmosGUqb2fgeJTWH6ED9TU3PiX_V0kba8joyMzUeLEm_w0FiYuwhR3ftDR-jOXbHOaAtxQBGVVwZPsah86R0ACcyaRpevtsVDO-_JtsMbMtVkXkTmkiK_yvjTPuWKke6YAzmyuVnSJQQWuc4_imyaYokS_BnA49ykYWdJgV6CmihyL24VlG91PZDAr8SI")' }}></div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-background-dark"></div>
               </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col justify-end gap-3 min-h-[200px]">
               {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                     <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-surface-dark text-slate-200 border border-white/5 rounded-tl-none'
                        }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                     </div>
                  </div>
               ))}
               {isLoading && (
                  <div className="flex justify-start animate-pulse">
                     <div className="bg-surface-dark p-3 rounded-2xl rounded-tl-none border border-white/5">
                        <p className="text-sm text-slate-400">Thinking...</p>
                     </div>
                  </div>
               )}
               <div ref={messagesEndRef} />
            </div>
         </main>

         <div className="p-4 pb-24 bg-background-dark/95 backdrop-blur-md border-t border-white/5 fixed bottom-0 w-full max-w-md">
            <div className="flex items-center gap-2 bg-surface-dark rounded-full px-4 py-2 border border-white/10 focus-within:border-primary/50 transition-colors">
               <input
                  className="flex-1 bg-transparent outline-none text-white text-sm py-2"
                  placeholder={STRINGS.input_placeholder[language]}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={isLoading}
               />
               <button
                  onClick={handleSend}
                  disabled={isLoading || !inputText.trim()}
                  className={`p-2 rounded-full transition-colors ${!inputText.trim() ? 'text-slate-600' : 'text-primary bg-primary/10 hover:bg-primary/20'}`}
               >
                  <span className="material-symbols-outlined">send</span>
               </button>
            </div>
         </div>

         <BottomNav current="HELP" onNavigate={onNavigate} language={language} />
      </div>
   );
};

export default Help;
