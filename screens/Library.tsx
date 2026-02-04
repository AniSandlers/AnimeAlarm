import React, { useState } from 'react';

import { Language, ScreenName } from '../types';
import { STRINGS, CHARACTERS } from '../constants';
import BottomNav from '../components/BottomNav';

interface LibraryProps {
  language: Language;
  onSelectCharacter: (id: string) => void;
  onNavigate: (screen: ScreenName) => void;
  streak: number;
}

const Library: React.FC<LibraryProps> = ({ language, onSelectCharacter, onNavigate, streak }) => {

  const [query, setQuery] = useState('');

  const filteredCharacters = CHARACTERS.filter(char =>
    char.name.toLowerCase().includes(query.toLowerCase()) ||
    char.trope.toLowerCase().includes(query.toLowerCase())
  );

  return (

    <div className="flex flex-col h-full bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/5 p-4">
        <h1 className="text-2xl font-bold">{STRINGS.nav_library[language]}</h1>
      </header>

      <div className="px-4 py-3">
        <div className="relative flex items-center w-full h-12 rounded-xl bg-surface-dark shadow-sm border border-white/5">
          <div className="grid place-items-center h-full w-12 text-slate-400">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="peer h-full w-full outline-none bg-transparent text-sm text-white placeholder-slate-500 font-normal pr-4"
            placeholder={STRINGS.search_placeholder[language]}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 no-scrollbar">
        {/* Free Packs Header */}
        <h2 className="text-lg font-bold mb-4">{STRINGS.free_pack[language]}</h2>

        <div className="grid grid-cols-2 gap-4">
          {filteredCharacters.map(char => {
            const isLocked = (char.unlockStreak || 0) > streak;

            return (
              <div key={char.id} onClick={() => !isLocked && onSelectCharacter(char.id)} className={`group relative flex flex-col justify-end overflow-hidden rounded-xl aspect-[3/4] bg-surface-dark shadow-lg ring-1 ring-white/5 active:scale-95 transition-transform ${isLocked ? 'opacity-70 grayscale' : 'cursor-pointer'}`}>

                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${char.image}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent opacity-90"></div>

                <div className="relative z-10 p-3 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 ${char.color} border border-white/20 backdrop-blur-md`}>
                      {char.trope}
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-bold leading-tight">{char.name}</h3>
                </div>

                {/* Lock Overlay */}
                {isLocked && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-2 z-20">
                    <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">lock</span>
                    <div className="bg-red-500/20 px-2 py-1 rounded text-red-300 text-xs font-bold border border-red-500/30">
                      Req {char.unlockStreak}d Streak
                    </div>
                  </div>
                )}
              </div>
            )
          })}

        </div>
      </div>

      <BottomNav current="LIBRARY" onNavigate={onNavigate} language={language} />
    </div>
  );
};

export default Library;
