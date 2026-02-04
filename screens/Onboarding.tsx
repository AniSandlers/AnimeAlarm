import React from 'react';
import { Language } from '../types';
import { STRINGS } from '../constants';

interface OnboardingProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ language, setLanguage, onComplete }) => {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden max-w-md mx-auto">
      <div className="absolute inset-0 z-0 bg-background-dark">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]"></div>
      </div>

      <div className="w-full grow flex items-end justify-center px-4 relative pb-6 z-10">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqwU84PNRJ-KZfHfaOpZBhaHRin6hoW0WV3ezYK8OEoXd-KqbC8dq9ueVY9Iq5VFm0VsRF3L3voyglRabJY06V_5H7cGWOFFbs2Jzh0qXJV6A-oMrzkrt7H2DjPsZl8Uxh5er5aTtaJEVetWcWyT0NbPMi0IB27PJkeN-GYdVqAmeF5xa9f-jFLHFyr04cIJ0ywTgzoTcnqlA0Fjfy-_l4UvUMiPoWmMtc-mn7N8Bud5zLfUxFaodzO06B0CLxwarf1jY2sBrD-Is" alt="Zoey" className="w-full max-w-[340px] drop-shadow-[0_0_15px_rgba(13,166,242,0.3)]" />
      </div>

      <div className="w-full flex flex-col items-center px-6 pt-4 pb-12 space-y-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent z-20">
        <div className="space-y-3 text-center max-w-[320px]">
          <h1 className="text-white text-[32px] font-bold leading-tight">
            {STRINGS.app_name[language]}
          </h1>
          <p className="text-slate-400 text-base">
            ¡Soy Zoey! Estoy aquí para despertarte (o al menos intentarlo).
          </p>
        </div>

        <div className="flex w-full gap-4 opacity-50 pointer-events-none hidden">
          {/* Language selection removed - Spanish enforced */}
        </div>

        <button onClick={onComplete} className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary h-14 px-5 text-white shadow-[0_0_20px_rgba(13,166,242,0.3)] transition-all hover:shadow-[0_0_30px_rgba(13,166,242,0.5)] active:scale-[0.98]">
          <span className="text-lg font-bold tracking-wide mr-2">{STRINGS.continue[language]}</span>
          <span className="material-symbols-outlined text-xl font-bold">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
