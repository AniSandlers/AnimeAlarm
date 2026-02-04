import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.animealarm.app',
  appName: 'Anime Alarm',
  webDir: 'dist',
  android: {
    webContentsDebuggingEnabled: true
  }
};

export default config;
