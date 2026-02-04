import React from 'react';
import { Language, Character } from '../types';
import { STRINGS } from '../constants';

interface CharacterDetailProps {
   language: Language;
   character: Character;
   onBack: () => void;
   onUseInAlarm: () => void;
}


const CharacterDetail: React.FC<CharacterDetailProps> = ({ language, character, onBack, onUseInAlarm }) => {

   const [isPlaying, setIsPlaying] = React.useState(false);
   const audioRef = React.useRef<HTMLAudioElement | null>(null);

   const toggleAudio = () => {
      if (!character.voiceFolder) return;

      if (isPlaying) {
         audioRef.current?.pause();
         audioRef.current = null;
         setIsPlaying(false);
      } else {
         const audioPath = `/Voces/${character.voiceFolder}/${character.voiceFolder}_voz1.mp3`;
         const audio = new Audio(audioPath);
         audioRef.current = audio;
         audio.play().catch(e => console.error("Audio play error", e));
         audio.onended = () => setIsPlaying(false);
         setIsPlaying(true);
      }
   };

   // cleanup
   React.useEffect(() => {
      return () => {
         if (audioRef.current) {
            audioRef.current.pause();
         }
      };
   }, []);

   return (
      <div className="relative flex h-full w-full flex-col bg-background-dark">
         <div className="absolute top-0 left-0 right-0 h-[70vh] z-0 bg-black">
            {/* Layer 1: Blurred Background (Atmosphere) */}
            <div className="absolute inset-0 h-full w-full bg-cover bg-center opacity-50 blur-xl scale-110" style={{ backgroundImage: `url('${character.image}')` }}></div>

            {/* Layer 2: Main Image */}
            <div className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat md:bg-contain md:bg-top" style={{ backgroundImage: `url('${character.image}')` }}></div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-60% to-background-dark"></div>
         </div>

         <div className="relative z-20 flex items-center justify-between p-4 pt-4 w-full">
            <button onClick={onBack} className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white">
               <span className="material-symbols-outlined">arrow_back_ios_new</span>
            </button>
         </div>

         <div className="relative z-10 flex-1 flex flex-col justify-end w-full pb-8">
            <div className="px-6 pb-2 w-full flex flex-col gap-6">
               <div className="space-y-3">
                  <h1 className="text-white text-[40px] font-bold leading-none drop-shadow-lg">{character.name}</h1>
                  <div className="flex gap-2 flex-wrap">
                     <div className="flex h-8 items-center justify-center px-4 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/20">
                        <span className="text-primary text-sm font-semibold tracking-wide">{character.trope}</span>
                     </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-sm drop-shadow-md">{character.description[language]}</p>
               </div>

               <div className="rounded-xl bg-surface-dark/90 backdrop-blur-md border border-white/5 p-4 shadow-xl">
                  <div className="flex items-center gap-4">
                     <button onClick={toggleAudio} disabled={!character.voiceFolder} className={`flex shrink-0 items-center justify-center rounded-full size-12 text-white shadow-lg transition-all ${!character.voiceFolder ? 'bg-gray-600 opacity-50' : 'bg-primary shadow-primary/30 active:scale-95'}`}>
                        <span className="material-symbols-outlined fill-current">{isPlaying ? 'stop' : 'play_arrow'}</span>
                     </button>
                     <div className="flex-1 flex flex-col justify-center gap-1 overflow-hidden">
                        <div className={`flex items-end gap-1 h-5 w-full ${isPlaying ? 'opacity-100' : 'opacity-80'}`}>
                           {isPlaying ? (
                              <>
                                 <div className="w-1 bg-primary rounded-full h-2 animate-[bounce_1s_infinite]"></div>
                                 <div className="w-1 bg-primary rounded-full h-4 animate-[bounce_1.2s_infinite]"></div>
                                 <div className="w-1 bg-primary rounded-full h-3 animate-[bounce_0.8s_infinite]"></div>
                              </>
                           ) : (
                              <>
                                 <div className="w-1 bg-primary rounded-full h-2"></div>
                                 <div className="w-1 bg-primary rounded-full h-4"></div>
                                 <div className="w-1 bg-primary rounded-full h-3"></div>
                              </>
                           )}
                        </div>
                        <p className="text-slate-400 text-sm font-medium leading-tight truncate">"{character.voiceLines.greeting[language]}"</p>
                     </div>
                  </div>
               </div>

               <div className="pt-2">
                  <button onClick={onUseInAlarm} className="flex w-full h-14 items-center justify-center gap-2 rounded-xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                     <span className="material-symbols-outlined">alarm_add</span>
                     <span>{STRINGS.use_in_alarm[language]}</span>
                  </button>
               </div>

            </div>
         </div>
      </div>
   );
};

export default CharacterDetail;
