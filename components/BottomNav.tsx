import React from 'react';
import { ScreenName, Language } from '../types';
import { STRINGS } from '../constants';

interface BottomNavProps {
  current: ScreenName;
  onNavigate: (screen: ScreenName) => void;
  language: Language;
}

const BottomNav: React.FC<BottomNavProps> = ({ current, onNavigate, language }) => {
  const getIconClass = (screen: ScreenName) => 
    `material-symbols-outlined text-[26px] ${current === screen ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`;
    
  const getTextClass = (screen: ScreenName) => 
    `text-[10px] font-medium ${current === screen ? 'text-primary font-bold' : 'text-slate-400 group-hover:text-primary'}`;

  return (
    <nav className="absolute bottom-0 w-full bg-surface-dark/95 backdrop-blur-xl border-t border-white/5 pb-5 pt-3 px-6 z-30">
      <div className="flex justify-between items-center">
        <button onClick={() => onNavigate('HOME')} className="flex flex-col items-center gap-1 group w-16">
          <span className={getIconClass('HOME')}>alarm</span>
          <span className={getTextClass('HOME')}>{STRINGS.nav_alarms[language]}</span>
        </button>
        
        <button onClick={() => onNavigate('LIBRARY')} className="flex flex-col items-center gap-1 group w-16">
          <span className={getIconClass('LIBRARY')}>face</span>
          <span className={getTextClass('LIBRARY')}>{STRINGS.nav_library[language]}</span>
        </button>
        
        <button onClick={() => onNavigate('LOGS')} className="flex flex-col items-center gap-1 group w-16">
          <span className={getIconClass('LOGS')}>history</span>
          <span className={getTextClass('LOGS')}>{STRINGS.logs_title[language]}</span>
        </button>

        <button onClick={() => onNavigate('HELP')} className="flex flex-col items-center gap-1 group w-16">
          <div className="relative">
            <span className={getIconClass('HELP')}>help</span>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-background-dark"></span>
          </div>
          <span className={getTextClass('HELP')}>{STRINGS.nav_help[language]}</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
