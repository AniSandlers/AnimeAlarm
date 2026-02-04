import React from 'react';

const Splash: React.FC = () => {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-background-dark">
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[30%] bg-primary/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute top-[40%] right-[-20%] w-[60%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-6 z-10 animate-pulse-slow">
        <div className="relative w-40 h-40 bg-surface-dark rounded-xl overflow-hidden shadow-2xl border border-white/5 flex items-center justify-center mb-8">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtw6tm1lBbEGYFfTpmm9fKO-zKRM7MrKcz_xuc8DtwecaKXl_4BTXMjSfF_NZYJ9Cv-X5ON0a6ba82R37htHFMk8tLZJynyB6xG6GS50ktfZaBITMk_1KPVdb3oi4IypYO3zZHsEDcH5BI4PY9lCsTmFm1MkEgupVV6tRRhHPK5Kw72yKVSzQa41KgPZLR7INnzJc5Zp1DLfWW0Cxb61DcCQjQJIaZqn_ytUVz4fyjd8nkQLquP9Qbsi68AU3TiBdRvKUekY6MnEI" alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-sm mb-2">
          Anime Alarm
        </h1>
        <p className="text-slate-400 text-base font-medium">Despierta con tu personaje favorito.</p>
      </div>
    </div>
  );
};

export default Splash;
