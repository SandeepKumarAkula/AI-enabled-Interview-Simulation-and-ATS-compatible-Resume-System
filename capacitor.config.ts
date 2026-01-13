import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aisars.app',
  appName: 'AI²SARS',
  webDir: '.next/standalone/public',
  android: {
    icon: 'public/logo.png'
  }
};

export default config;
