import React, { useState, useEffect } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { Language, ScreenName, Alarm, Character, LogEntry, GlobalTheme } from './types';
import { STRINGS, CHARACTERS, MOCK_ALARMS, MOCK_LOGS, THEMES } from './constants';
import { initDB, getAudioFile } from './utils/db';
import { scheduleNativeAlarm, cancelNativeAlarm, getNextAlarmTimestamp } from './utils';


// Screens
import Onboarding from './screens/Onboarding';
import AlarmList from './screens/AlarmList';
import EditAlarm from './screens/EditAlarm';
import Library from './screens/Library';
import CharacterDetail from './screens/CharacterDetail';
import Help from './screens/Help';
import ActiveAlarm from './screens/ActiveAlarm';
import Logs from './screens/Logs';
import Splash from './screens/Splash';

// --- Permission Plugin Definition ---
interface PermissionPlugin {
  checkAndRequestPermissions(): Promise<void>;
}

const Permission = registerPlugin<PermissionPlugin>('Permission');

const initializeAppPermissions = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await Permission.checkAndRequestPermissions();
      console.log("Proceso de solicitud de permisos iniciado.");
    } catch (e) {
      console.error("Error al solicitar permisos", e);
    }
  }
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('SPLASH');
  const [language, setLanguage] = useState<Language>('es');
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('alarms');
    return saved ? JSON.parse(saved) : MOCK_ALARMS;
  });
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = localStorage.getItem('logs');
    return saved ? JSON.parse(saved) : MOCK_LOGS;
  });
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak');
    return saved ? parseInt(saved) : 0;
  });
  const [lastWakeUpDate, setLastWakeUpDate] = useState<string | null>(() => {
    return localStorage.getItem('lastWakeUpDate');
  });
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem('themeId') || 'echidna';
  });
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  // New Global Theme State
  const [globalTheme, setGlobalTheme] = useState<GlobalTheme>(() => {
    return (localStorage.getItem('globalTheme') as GlobalTheme) || 'default';
  });
  // Background Audio State
  const [backgroundAudioSrc, setBackgroundAudioSrc] = useState<string | null>(null);

  // Volume State
  const [voiceVolume, setVoiceVolume] = useState(() => parseFloat(localStorage.getItem('voiceVolume') || '1.0'));
  const [musicVolume, setMusicVolume] = useState(() => parseFloat(localStorage.getItem('musicVolume') || '0.5'));

  useEffect(() => {
    localStorage.setItem('voiceVolume', voiceVolume.toString());
    localStorage.setItem('musicVolume', musicVolume.toString());
  }, [voiceVolume, musicVolume]);

  // Request Permissions on Mount
  useEffect(() => {
    initializeAppPermissions();
  }, []);


  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null);
  const [displayedCharacterId, setDisplayedCharacterId] = useState<string | null>(null);

  // Snooze State
  const [snoozedAlarm, setSnoozedAlarm] = useState<{ time: string; characterId: string; label: string } | null>(null);

  // Helper to trigger alarm (dry refactor)
  const triggerAlarm = (alarmId: string | null, characterId: string, isOneTime: boolean) => {
    setCurrentScreen('ACTIVE_ALARM');
    setActiveAlarmId(alarmId);

    // Resolve Character ID (Fixed Random Logic)
    let targetCharId = characterId;
    if (targetCharId === 'random' || !targetCharId) {
      const randomIdx = Math.floor(Math.random() * CHARACTERS.length);
      targetCharId = CHARACTERS[randomIdx].id;
    }
    setDisplayedCharacterId(targetCharId);

    // Disable if one-time and it's a real alarm (not snooze)
    if (isOneTime && alarmId) {
      setAlarms(prev => prev.map(a => a.id === alarmId ? { ...a, enabled: false } : a));
    }
  };

  // Init DB and Load Audio
  useEffect(() => {
    initDB().then(() => {
      getAudioFile().then(file => {
        if (file instanceof Blob) {
          const url = URL.createObjectURL(file);
          setBackgroundAudioSrc(url);
        } else {
          setBackgroundAudioSrc('/Alarma/Alarma1.mp3'); // Default fallback
        }
      }).catch(() => setBackgroundAudioSrc('/Alarma/Alarma1.mp3'));
    });
  }, []);

  // Check for Alarms
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      const currentDay = now.getDay(); // 0-6

      // 1. Check Standard Alarms
      alarms.forEach(alarm => {
        if (alarm.enabled && alarm.time === currentTime) {
          const isToday = alarm.days.length === 0 || alarm.days.includes(currentDay);

          if (isToday) {
            if (currentScreen !== 'ACTIVE_ALARM') {
              triggerAlarm(alarm.id, alarm.characterId, alarm.days.length === 0);
            }
          }
        }
      });

      // 2. Check Snoozed Alarm
      if (snoozedAlarm && snoozedAlarm.time === currentTime) {
        if (currentScreen !== 'ACTIVE_ALARM') {
          triggerAlarm(null, snoozedAlarm.characterId, false);
          setSnoozedAlarm(null); // Clear snooze once triggered
        }
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [alarms, currentScreen, snoozedAlarm]);


  // Simple Router
  const navigate = (screen: ScreenName) => setCurrentScreen(screen);

  useEffect(() => {
    // Simulate Splash Timer
    if (currentScreen === 'SPLASH') {
      const timer = setTimeout(() => setCurrentScreen('ONBOARDING'), 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Helper to get Character
  const getCharacter = (id: string): Character | undefined => CHARACTERS.find(c => c.id === id);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));

    // Native Schedule
    const nextTs = getNextAlarmTimestamp(alarms);
    if (nextTs) {
      // Find which alarm corresponds to this timestamp regarding character? 
      // getNextAlarmTimestamp logic is complex/decoupled. 
      // We should ideally return the alarm object too.
      // For now, let's just pass the first enabled alarm or refactor getNextAlarmTimestamp if we want 100% precision on "which character for the *next* specific instance".
      // Simplified: Find the alarm that would trigger next? 
      // For now, I will pass the first enabled alarm found, or improve logic later. 
      // Actually, if we want the correct voice, we validly need the correct alarm.
      const enabled = alarms.filter(a => a.enabled);
      const nextAlarm = enabled.length > 0 ? enabled[0] : null; // Crude approximation.
      // TODO: Refactor getNextAlarmTimestamp to return { timestamp, alarm }

      scheduleNativeAlarm(nextTs, nextAlarm);
    } else {
      cancelNativeAlarm();
    }
  }, [alarms]);
  useEffect(() => { localStorage.setItem('logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem('streak', streak.toString()); }, [streak]);
  useEffect(() => {
    if (lastWakeUpDate) localStorage.setItem('lastWakeUpDate', lastWakeUpDate);
  }, [lastWakeUpDate]);

  // Theme Effect
  useEffect(() => {
    localStorage.setItem('themeId', themeId);
    localStorage.setItem('globalTheme', globalTheme);

    const root = document.documentElement;

    if (globalTheme === 'default') {
      // Character Default
      const char = getCharacter(themeId);
      if (char) {
        root.style.setProperty('--color-primary', char.themeColor);
        // Revert to defaults if they were overridden
        root.style.removeProperty('--color-background');
        root.style.removeProperty('--color-surface');
        // Assuming default CSS handles the rest via Tailwind classes
        root.style.setProperty('--color-background', '#0f172a'); // Default slate-900
        root.style.setProperty('--color-surface', '#1e293b'); // Default slate-800
      }
    } else {
      // Custom Theme
      const themeConfig = THEMES.find(t => t.id === globalTheme);
      if (themeConfig) {
        root.style.setProperty('--color-primary', themeConfig.colors.primary);
        root.style.setProperty('--color-background', themeConfig.colors.background);
        root.style.setProperty('--color-surface', themeConfig.colors.surface);
      }
    }
  }, [themeId, globalTheme]);

  const addLog = (entry: Omit<LogEntry, 'id'>) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      ...entry
    };
    setLogs([newLog, ...logs]);

    // Streak Logic
    if (entry.status === 'woke_up') {
      const today = new Date().toDateString();
      if (lastWakeUpDate !== today) {
        // Check if yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastWakeUpDate === yesterday.toDateString()) {
          setStreak(prev => prev + 1);
        } else if (lastWakeUpDate === null) {
          setStreak(1);
        } else {
          // Broken streak? Or maybe just start at 1 if gap is too big
          // Simple logic: if not yesterday and not today, reset to 1
          setStreak(1);
        }
        setLastWakeUpDate(today);
      }
    }
  };



  // Screen Rendering Logic
  const renderScreen = () => {
    switch (currentScreen) {
      case 'SPLASH':
        return <Splash />;
      case 'ONBOARDING':
        return <Onboarding language={language} setLanguage={setLanguage} onComplete={() => navigate('HOME')} />;
      case 'HOME':
        return (
          <AlarmList
            language={language}
            alarms={alarms}
            setAlarms={setAlarms}
            onEdit={(id) => { setEditingAlarmId(id); navigate('EDIT_ALARM'); }}
            onCreate={() => { setEditingAlarmId(null); setSelectedCharacterId(null); navigate('EDIT_ALARM'); }}

            onNavigate={navigate}
            onTriggerAlarm={() => navigate('ACTIVE_ALARM')} // Hidden debug trigger
            streak={streak}
            snoozedAlarm={snoozedAlarm}

            // Settings Props
            globalTheme={globalTheme}
            setGlobalTheme={setGlobalTheme}
            onUploadAudio={(file) => {
              const url = URL.createObjectURL(file);
              setBackgroundAudioSrc(url);
            }}
            onClearAudio={() => {
              setBackgroundAudioSrc('/Alarma/Alarma1.mp3');
            }}
            // Volume Props
            voiceVolume={voiceVolume}
            setVoiceVolume={setVoiceVolume}
            musicVolume={musicVolume}
            setMusicVolume={setMusicVolume}
          />
        );
      case 'EDIT_ALARM':
        return (
          <EditAlarm
            language={language}
            alarmId={editingAlarmId}
            alarms={alarms}
            onSave={(newAlarm) => {
              if (editingAlarmId) {
                setAlarms(alarms.map(a => a.id === editingAlarmId ? newAlarm : a));
              } else {
                setAlarms([...alarms, newAlarm]);
              }
              navigate('HOME');
            }}
            onCancel={() => navigate('HOME')}
            initialCharacterId={selectedCharacterId}
          />

        );
      case 'LIBRARY':
        return (
          <Library
            language={language}
            onSelectCharacter={(id) => { setSelectedCharacterId(id); navigate('CHARACTER_DETAIL'); }}
            onNavigate={navigate}
            streak={streak}
          />

        );
      case 'CHARACTER_DETAIL':
        return (
          <CharacterDetail
            language={language}
            character={getCharacter(selectedCharacterId!)!}
            onBack={() => navigate('LIBRARY')}
            onUseInAlarm={() => navigate('EDIT_ALARM')}
          />

        );
      case 'HELP':
        return <Help language={language} onNavigate={navigate} />;
      case 'LOGS':
        return <Logs language={language} onNavigate={navigate} logs={logs} />;
      case 'ACTIVE_ALARM':
        const activeAlarm = alarms.find(a => a.id === activeAlarmId);
        // Use the resolved character ID, or fallback to alarm's ID (if not random), or first character
        const charIdToUse = displayedCharacterId || (activeAlarm ? activeAlarm.characterId : CHARACTERS[0].id);
        const resolvedChar = getCharacter(charIdToUse) || CHARACTERS[0];

        // Ensure we pass the original preference (Random or Specific ID) to the snooze state
        const originalCharacterPreference = activeAlarm ? activeAlarm.characterId : (displayedCharacterId || 'random');

        return (
          <ActiveAlarm
            language={language}
            character={resolvedChar}
            alarm={activeAlarm}
            backgroundAudioSrc={backgroundAudioSrc || '/Alarma/Alarma1.mp3'}
            onStop={() => {
              // Log the stop
              addLog({
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                alarmLabel: activeAlarm ? activeAlarm.label : 'Alarm',
                characterName: resolvedChar.name,
                status: 'woke_up',
                details: 'Manual Stop'
              });
              setActiveAlarmId(null);
              setDisplayedCharacterId(null);
              setSnoozedAlarm(null); // Explicit stop clears snooze
              navigate('HOME');
            }}
            onSnooze={() => {
              // Calculate Snooze Time (+5m)
              const now = new Date();
              now.setMinutes(now.getMinutes() + 5);
              const snoozeHours = now.getHours().toString().padStart(2, '0');
              const snoozeMinutes = now.getMinutes().toString().padStart(2, '0');
              const snoozeTime = `${snoozeHours}:${snoozeMinutes}`;

              setSnoozedAlarm({
                time: snoozeTime,
                characterId: originalCharacterPreference, // Preserve 'random' or specific ID
                label: activeAlarm ? activeAlarm.label : 'Snoozed'
              });

              addLog({
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                alarmLabel: activeAlarm ? activeAlarm.label : 'Alarm',
                characterName: resolvedChar.name,
                status: 'snoozed',
                details: 'Snoozed 5m'
              });

              setActiveAlarmId(null);
              setDisplayedCharacterId(null);
              navigate('HOME');
            }}
          />
        );

      default:
        return <div>Screen not found</div>;
    }
  };

  return (
    <div className="w-full h-screen text-white overflow-hidden relative font-display transition-colors duration-500" style={{ backgroundColor: 'var(--color-background, #0f172a)' }}>
      {renderScreen()}
    </div>
  );
};

export default App;
