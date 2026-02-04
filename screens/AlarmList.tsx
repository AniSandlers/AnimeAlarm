import React, { useState } from 'react';
import { Language, Alarm, ScreenName, GlobalTheme } from '../types';
import { STRINGS, CHARACTERS, THEMES } from '../constants';
import { getNextAlarmDiff } from '../utils';
import { saveAudioFile, deleteAudioFile } from '../utils/db'; // Import DB utils
import BottomNav from '../components/BottomNav';


interface AlarmListProps {
  language: Language;
  alarms: Alarm[];
  setAlarms: (alarms: Alarm[]) => void;
  onEdit: (id: string) => void;
  onCreate: () => void;
  onNavigate: (screen: ScreenName) => void;
  onTriggerAlarm: () => void;
  streak: number;
  snoozedAlarm: { time: string; label: string } | null;
  globalTheme: GlobalTheme;
  setGlobalTheme: (theme: GlobalTheme) => void;
  onUploadAudio: (file: File) => void;
  onClearAudio: () => void;
  voiceVolume?: number;
  setVoiceVolume?: (vol: number) => void;
  musicVolume?: number;
  setMusicVolume?: (vol: number) => void;
}

const AlarmList: React.FC<AlarmListProps> = ({
  language, alarms, setAlarms, onEdit, onCreate, onNavigate, onTriggerAlarm, streak, snoozedAlarm,
  globalTheme, setGlobalTheme, onUploadAudio, onClearAudio,
  voiceVolume, setVoiceVolume, musicVolume, setMusicVolume
}) => {

  const [isEditing, setIsEditing] = useState(false);
  const [selectedAlarms, setSelectedAlarms] = useState<Set<string>>(new Set());
  const [showSettings, setShowSettings] = useState(false); // Settings Modal State

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedAlarms);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedAlarms(newSelected);
  };

  const handleDelete = () => {
    if (window.confirm(STRINGS.confirm_delete_msg[language])) {
      setAlarms(alarms.filter(a => !selectedAlarms.has(a.id)));
      setIsEditing(false);
      setSelectedAlarms(new Set());
    }
  };


  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const getCharacter = (id: string) => {
    if (id === 'random') return { name: STRINGS.random[language], avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeRalVxHZNXs4qr-rk_3wPjhWcyUHduLUxhk25cBi2kur4JKt38aFWAJ32ZTUvbEwAxeD5s1u6vEtGzI_dWVYrSYRluUJTHLQkHoMHSt0ewd0OQikDNnTn-nzY5932rgEGHgLAvxqzzGT8rlVRxaZdWoTb_Nn-4C5uIn_MMFmoLPfu_HJCyStlCn2JaBjXPW1wRwYvrUX-GOiMdgNLMUb_TxRYcy6f_SEUjD5ed4udKT-ftwERF30bkSxEMEpPyL3jdjiycK-gLMk' };
    const char = CHARACTERS.find(c => c.id === id);
    return char ? { name: char.name, avatar: char.avatar } : { name: 'Unknown', avatar: '' };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await saveAudioFile(file);
        onUploadAudio(file);
        alert("Audio guardado correctamente / Audio saved successfully");
      } catch (err) {
        console.error("Error saving audio", err);
        alert("Error al guardar audio");
      }
    }
  };

  const handleClearAudio = async () => {
    if (confirm("¿Restaurar audio por defecto? / Restore default audio?")) {
      try {
        await deleteAudioFile();
        onClearAudio();
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Settings Modal */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-background-dark/95 backdrop-blur-xl p-6 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Ajustes / Settings</h2>
            <button onClick={() => setShowSettings(false)} className="bg-white/10 p-2 rounded-full">
              <span className="material-symbols-outlined text-white">close</span>
            </button>
          </div>

          <div className="space-y-8 overflow-y-auto pb-10">
            {/* Theme Section */}
            <section>
              <h3 className="text-primary font-bold mb-4 uppercase text-sm tracking-wider">Tema / Theme</h3>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setGlobalTheme(theme.id)}
                    className={`p-4 rounded-xl border-2 flex flex-col gap-2 transition-all ${globalTheme === theme.id ? 'border-primary bg-primary/10' : 'border-white/10 bg-surface-dark hover:bg-white/5'}`}
                  >
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full shadow-lg" style={{ background: theme.colors.primary || '#94a3b8' }}></div>
                      <div className="w-6 h-6 rounded-full shadow-lg" style={{ background: theme.colors.background }}></div>
                    </div>
                    <span className="text-left font-medium text-sm text-slate-200">{theme.name[language]}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Audio Section */}
            <section>
              <h3 className="text-primary font-bold mb-4 uppercase text-sm tracking-wider">Audio de Fondo / Background Audio</h3>
              <div className="bg-surface-dark rounded-xl p-4 border border-white/10 space-y-4">
                <p className="text-sm text-slate-400">Sube tu propio MP3 para que suene de fondo en la alarma.</p>

                <div className="flex gap-2">
                  <label className="flex-1 bg-primary text-white font-bold py-3 px-4 rounded-lg text-center cursor-pointer active:scale-95 transition-transform">
                    Subir MP3
                    <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                  <button onClick={handleClearAudio} className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg font-bold border border-red-500/30">
                    Reset
                  </button>
                </div>
                <p className="text-xs text-slate-500 text-center">Recomendado: Archivos &lt; 2MB</p>

                {/* Volume Sliders */}
                <div className="mt-6 space-y-4 border-t border-white/5 pt-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">Volumen de Voz / Voice</span>
                      <span className="text-primary font-bold">{Math.round((voiceVolume || 1) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0" max="1" step="0.05"
                      value={voiceVolume}
                      onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">Volumen de Música / Music</span>
                      <span className="text-primary font-bold">{Math.round((musicVolume || 0.5) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0" max="1" step="0.05"
                      value={musicVolume}
                      onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>

              </div>
            </section>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-10 bg-background-dark/95 backdrop-blur-md pt-4 pb-2 px-4 border-b border-white/5">
        <div className="flex items-center justify-between h-12">
          <h1 className="text-white text-[32px] font-bold leading-tight" onClick={onTriggerAlarm}>{STRINGS.nav_alarms[language]}</h1>
          <div className="flex gap-4">
            <button onClick={() => setShowSettings(true)} className="text-slate-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[28px]">settings</span>
            </button>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setSelectedAlarms(new Set());
              }}
              className="text-primary font-bold"
            >
              {isEditing ? STRINGS.continue[language] : STRINGS.edit[language]}
            </button>
          </div>
        </div>

        {/* Snoozed Alarm Banner */}
        {snoozedAlarm && (
          <div className="mx-1 mt-2 mb-1 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2 animate-pulse">
            <span className="material-symbols-outlined text-yellow-500 text-sm">snooze</span>
            <p className="text-yellow-500 text-sm font-semibold">
              💤 Próxima alarma a las {snoozedAlarm.time}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 pb-2 mt-1">
          <span className="material-symbols-outlined text-primary text-sm">schedule</span>
          <p className="text-slate-400 text-sm font-medium">
            {alarms.some(a => a.enabled)
              ? `${STRINGS.next_wake_up[language]} ${getNextAlarmDiff(alarms)}`
              : STRINGS.no_alarms[language]}
          </p>
          <div className="flex-1"></div>
          {streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
              <span className="text-sm">🔥</span>
              <span className="text-orange-500 text-sm font-bold">{streak}</span>
            </div>
          )}


        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 no-scrollbar">
        {alarms.map(alarm => {
          const charInfo = getCharacter(alarm.characterId);
          return (
            <div key={alarm.id}
              onClick={() => isEditing ? toggleSelection(alarm.id) : onEdit(alarm.id)}
              className={`group relative overflow-hidden rounded-xl bg-surface-dark shadow-sm border border-white/5 transition-all active:scale-[0.98] ${!alarm.enabled && !isEditing ? 'opacity-60' : ''}`}
              style={{ backgroundColor: 'var(--color-surface, #1e293b)' }}
            >
              <div className="flex gap-4 p-4 justify-between items-center">
                {isEditing && (
                  <div className="shrink-0 flex items-center justify-center">
                    <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedAlarms.has(alarm.id) ? 'bg-primary border-primary' : 'border-slate-500'}`}>
                      {selectedAlarms.has(alarm.id) && <span className="material-symbols-outlined text-white text-[18px]">check</span>}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 flex-1">
                  <div className="relative shrink-0">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full h-[60px] w-[60px] border-2 border-primary/30"
                      style={{ backgroundImage: `url('${charInfo.avatar}')` }}></div>
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <div className="flex items-baseline gap-2">
                      <p className="text-white text-[32px] font-bold leading-none">{alarm.time}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        {charInfo.name}
                      </span>
                      <p className="text-slate-500 text-sm">{alarm.label}</p>
                    </div>
                  </div>
                </div>
                <div className="shrink-0" onClick={(e) => { e.stopPropagation(); if (!isEditing) toggleAlarm(alarm.id); else toggleSelection(alarm.id); }}>
                  {!isEditing && (
                    <div className={`w-[51px] h-[31px] rounded-full relative transition-colors ${alarm.enabled ? 'bg-primary' : 'bg-[#223c49]'}`}>
                      <div className={`absolute top-[2px] start-[2px] bg-white rounded-full h-[27px] w-[27px] transition-transform ${alarm.enabled ? 'translate-x-full' : ''}`}></div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </main>

      {!isEditing ? (
        <button onClick={onCreate} className="absolute bottom-24 right-6 z-20 h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary/90 transition-all active:scale-90">
          <span className="material-symbols-outlined text-white text-3xl">add</span>
        </button>
      ) : selectedAlarms.size > 0 && (
        <div className="absolute bottom-24 left-0 right-0 z-20 px-4 flex justify-center">
          <button onClick={handleDelete} className="bg-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-red-500/30 active:scale-95 animate-in slide-in-from-bottom-4">
            {STRINGS.delete[language]} ({selectedAlarms.size})
          </button>
        </div>
      )}


      <BottomNav current="HOME" onNavigate={onNavigate} language={language} />
    </div>
  );
};

export default AlarmList;
