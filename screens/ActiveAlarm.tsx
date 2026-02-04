import React, { useState, useEffect } from 'react';
import { Language, Alarm, Character } from '../types';
import { STRINGS } from '../constants';


interface ActiveAlarmProps {
   language: Language;
   character: Character;
   alarm?: Alarm;
   onStop: () => void;
   onSnooze: () => void;
   backgroundAudioSrc?: string;
   voiceVolume?: number; // 0.0 to 1.0
   musicVolume?: number;
}


const ActiveAlarm: React.FC<ActiveAlarmProps> = ({ language, onStop, onSnooze, character, alarm, backgroundAudioSrc, voiceVolume = 1.0, musicVolume = 0.5 }) => {
   // Fallback text if no alarm (test mode)
   const timeText = alarm ? alarm.time : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

   const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

   const voiceRef = React.useRef<HTMLAudioElement>(null);
   const musicRef = React.useRef<HTMLAudioElement>(null);

   // Volume Effect
   useEffect(() => {
      if (voiceRef.current) voiceRef.current.volume = voiceVolume;
      if (musicRef.current) musicRef.current.volume = musicVolume;
   }, [voiceVolume, musicVolume]);

   // Vibration Effect (Mobile Only)
   useEffect(() => {
      if (navigator.vibrate) {
         // Vibrate pattern: 500ms on, 300ms off, loop handled by interval
         const vibeInterval = setInterval(() => {
            navigator.vibrate([500, 300, 500, 1000]);
         }, 2500);
         return () => clearInterval(vibeInterval);
      }
   }, []);


   // Memoize the random voice selection so it stays constant during this alarm session
   const voicePath = React.useMemo(() => {
      if (!character?.voiceFolder) return undefined;
      const randomVoice = Math.floor(Math.random() * 3) + 2;
      return `/Voces/${character.voiceFolder}/${character.voiceFolder}_voz${randomVoice}.mp3`;
   }, [character?.voiceFolder]);

   return (
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-background-dark">
         {/* Declarative Audio - React handles mounting/unmounting */}
         {voicePath && (
            <>
               <audio
                  ref={voiceRef}
                  src={voicePath}
                  autoPlay
                  loop
                  onError={(e) => console.warn("Voice playback failed", e)}
               />
               <audio
                  ref={musicRef}
                  src={backgroundAudioSrc || "/Alarma/Alarma1.mp3"}
                  autoPlay
                  loop
                  onError={(e) => console.warn("Background alarm playback failed", e)}
               />
            </>
         )}

         <div className="absolute inset-0 z-0 bg-black">
            {/* Layer 1: Blurred Background (Atmosphere) */}
            <div className="absolute inset-0 h-full w-full bg-cover bg-center opacity-50 blur-xl scale-110" style={{ backgroundImage: `url('${character.image}')` }}></div>

            {/* Layer 2: Main Image */}
            <div className="absolute inset-0 h-full w-full bg-cover bg-center md:bg-contain md:bg-no-repeat" style={{ backgroundImage: `url('${character.image}')` }}></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background-dark/95"></div>
         </div>

         <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8">
            <div className="flex flex-col items-center justify-center pt-12">
               <h1 className="text-white text-[80px] leading-none font-bold tracking-tighter drop-shadow-xl animate-pulse">{timeText}</h1>
               <p className="text-white/80 text-lg font-medium mt-2">{alarm ? alarm.label : STRINGS.app_name[language]}</p>
            </div>

            <div className="flex flex-col gap-6 pb-12 w-full max-w-md mx-auto">
               <div className="relative">
                  <div className="flex w-full flex-col gap-3 p-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg" style={{ borderColor: character.themeColor }}>
                     <div className="flex items-center gap-3">
                        <div className="bg-center bg-cover rounded-full h-10 w-10 border border-primary" style={{ backgroundImage: `url('${character.avatar}')`, borderColor: character.themeColor }}></div>
                        <p className="font-bold" style={{ color: character.themeColor }}>{character.name}</p>
                     </div>
                     <p className="text-white text-lg font-medium leading-snug">"{character.voiceLines.alarm[language]}"</p>
                  </div>
               </div>

               <div className="flex flex-col gap-3 w-full items-center">
                  <button onClick={onSnooze} className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-20 bg-primary text-white shadow-[0_0_20px_rgba(13,166,242,0.5)] animate-pulse" style={{ backgroundColor: character.themeColor, boxShadow: `0 0 20px ${character.themeColor}80` }}>
                     <div className="flex flex-col items-center">
                        <span className="text-2xl font-bold tracking-wide">{STRINGS.snooze_btn[language]}</span>
                        <span className="text-xs font-semibold opacity-80 tracking-widest uppercase">5 {STRINGS.minutes[language]}</span>
                     </div>
                  </button>
                  <button onClick={onStop} className="mt-2 flex w-full cursor-pointer items-center justify-center rounded-xl h-14 bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all">
                     <span className="text-base font-bold tracking-wider">{STRINGS.stop_alarm[language]}</span>
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ActiveAlarm;
