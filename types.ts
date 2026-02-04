export type Language = 'en' | 'es';

export interface Translation {
  [key: string]: {
    en: string;
    es: string;
  };
}

export interface Character {
  id: string;
  name: string;
  trope: string; // e.g., Tsundere, Genki
  description: {
    en: string;
    es: string;
  };
  image: string;
  avatar: string;
  color: string;
  themeColor: string;
  unlockStreak?: number;
  voiceFolder?: string; // Optional: Folder name in public/Voces if different or present
  voiceLines: {
    greeting: { en: string; es: string };
    alarm: { en: string; es: string };
    snooze: { en: string; es: string };
    stopped: { en: string; es: string };
  };
}

export interface Alarm {
  id: string;
  time: string; // HH:mm
  label: string;
  enabled: boolean;
  days: number[]; // 0-6, 0 = Sunday
  characterId: string | 'random';
}

export interface LogEntry {
  id: string;
  time: string;
  alarmLabel: string;
  characterName: string;
  status: 'woke_up' | 'snoozed' | 'missed';
  details?: string;
}

export type GlobalTheme = 'default' | 'midnight' | 'sakura' | 'royal';

export interface ThemeConfig {
  id: GlobalTheme;
  name: { en: string; es: string };
  colors: {
    primary: string; // The main accent color
    background: string; // Main background
    surface: string; // Cards/Modals
  };
}

export type ScreenName =
  | 'SPLASH'
  | 'ONBOARDING'
  | 'HOME'
  | 'EDIT_ALARM'
  | 'LIBRARY'
  | 'CHARACTER_DETAIL'
  | 'HELP'
  | 'ACTIVE_ALARM'
  | 'LOGS';
