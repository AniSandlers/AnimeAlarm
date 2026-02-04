import React from 'react';
import { Language, ScreenName, LogEntry } from '../types';
import { STRINGS } from '../constants';

import BottomNav from '../components/BottomNav';

interface LogsProps {
  language: Language;
  onNavigate: (screen: ScreenName) => void;
  logs: LogEntry[];
}

const Logs: React.FC<LogsProps> = ({ language, onNavigate, logs }) => {

  return (
    <div className="flex flex-col h-full bg-background-dark">
      <header className="px-6 pt-8 pb-4">
        <h2 className="text-white text-2xl font-bold">{STRINGS.logs_title[language]}</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-4 space-y-3 no-scrollbar">
        <div className="sticky top-0 z-10 bg-background-dark/95 backdrop-blur-sm px-2 py-2 border-b border-white/5">
          <h3 className="text-primary text-xs font-bold uppercase tracking-widest">{STRINGS.today[language]}</h3>
        </div>

        {logs.map(log => (

          <div key={log.id} className="flex items-center gap-4 bg-surface-dark p-4 rounded-2xl border border-white/5">
            <div className="flex flex-col flex-1">
              <div className="flex items-baseline gap-2">
                <p className="text-white text-lg font-bold">{log.time}</p>
                <span className="text-slate-400 text-xs">{log.alarmLabel}</span>
              </div>
              <p className="text-slate-400 text-sm">{log.characterName}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${log.status === 'snoozed' ? 'bg-orange-500/10 text-orange-500' :
                log.status === 'woke_up' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'
                }`}>
                {log.status === 'snoozed' ? 'Snoozed' : log.status === 'woke_up' ? 'Woke Up' : 'Missed'}
              </span>
              <span className="text-[10px] text-slate-500">{log.details}</span>
            </div>
          </div>
        ))}
      </main>

      <BottomNav current="LOGS" onNavigate={onNavigate} language={language} />
    </div>
  );
};

export default Logs;
