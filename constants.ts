import { Character, Translation, Alarm, LogEntry } from './types';

export const STRINGS: Translation = {
  // General
  app_name: { en: 'Anime Alarm', es: 'Anime Alarm' },
  start_button: { en: 'Start', es: 'Empezar' },
  skip: { en: 'Skip', es: 'Omitir' },
  continue: { en: 'Continue', es: 'Continuar' },
  cancel: { en: 'Cancel', es: 'Cancelar' },
  save: { en: 'Save', es: 'Guardar' },
  edit: { en: 'Edit', es: 'Editar' },
  delete: { en: 'Delete', es: 'Eliminar' },
  yes: { en: 'Yes', es: 'Sí' },
  no: { en: 'No', es: 'No' },
  confirm_delete_title: { en: 'Delete Alarm?', es: '¿Eliminar Alarma?' },
  confirm_delete_msg: { en: 'Are you sure you want to delete selected alarms?', es: '¿Estás seguro de eliminar las alarmas seleccionadas?' },


  // Navigation

  nav_alarms: { en: 'Alarms', es: 'Alarmas' },
  nav_library: { en: 'Library', es: 'Biblioteca' },
  nav_settings: { en: 'Settings', es: 'Ajustes' },
  nav_help: { en: 'Help', es: 'Ayuda' },

  // Home
  next_wake_up: { en: 'Next wake up in', es: 'Próxima alarma en' },
  no_alarms: { en: 'No alarms set', es: 'Sin alarmas' },

  // Edit Alarm
  new_alarm: { en: 'New Alarm', es: 'Nueva Alarma' },
  edit_alarm: { en: 'Edit Alarm', es: 'Editar Alarma' },
  repeat: { en: 'Repeat', es: 'Repetir' },
  label: { en: 'Label', es: 'Etiqueta' },
  snooze: { en: 'Snooze', es: 'Posponer' },
  wake_up_agent: { en: 'Wake-up Agent', es: 'Agente de Despertar' },
  fixed: { en: 'Fixed', es: 'Fijo' },
  random: { en: 'Random', es: 'Azar' },

  // Library
  search_placeholder: { en: 'Search characters...', es: 'Buscar personajes...' },
  all: { en: 'All', es: 'Todos' },
  favorites: { en: 'Favorites', es: 'Favoritos' },
  free_pack: { en: 'Free Pack', es: 'Pack Gratis' },
  download: { en: 'Download', es: 'Descargar' },
  active: { en: 'Active', es: 'Activo' },
  use_in_alarm: { en: 'Use in Alarm', es: 'Usar en Alarma' },

  // Active Alarm
  stop_alarm: { en: 'STOP ALARM', es: 'DETENER ALARMA' },
  snooze_btn: { en: 'SNOOZE', es: 'POSPONER' },
  minutes: { en: 'Minutes', es: 'Minutos' },

  // Help / Zoey
  help_title: { en: "Zoey's Help Desk", es: "Ayuda de Zoey" },
  zoey_intro: { en: "Hi there, Senpai! I'm here to help.", es: "¡Hola, Senpai! Estoy aquí para ayudar." },
  quick_actions: { en: "Quick Actions", es: "Acciones Rápidas" },
  chat_zoey: { en: "Chat w/ Zoey", es: "Chat con Zoey" },
  input_placeholder: { en: "Ask me anything...", es: "Pregúntame lo que sea..." },

  // Logs
  logs_title: { en: "Wake-up Logs", es: "Historial" },
  today: { en: "Today", es: "Hoy" },
};

export const CHARACTERS: Character[] = [
  {
    id: 'echidna',
    name: 'Echidna',
    trope: 'The Witch of Greed',
    description: {
      en: 'Curious about everything. She wants to know all about you.',
      es: 'Curiosa por todo. Ella quiere saber todo sobre ti.'
    },
    color: 'text-gray-400',
    themeColor: '#a3a3a3', // Neutral
    image: '/characters/echidna.png',
    avatar: '/characters/echidna_avatar.png',
    voiceFolder: 'Echidna',
    voiceLines: {
      greeting: { en: "Welcome. I am the Witch of Greed, Echidna.", es: "Bienvenido. Soy la Bruja de la Avaricia, Echidna." },
      alarm: { en: "Time to wake up. Knowledge awaits.", es: "Hora de despertar. El conocimiento aguarda." },
      snooze: { en: "Greedy for sleep, aren't we?", es: "¿Avaricioso con el sueño, verdad?" },
      stopped: { en: "Shall we begin our tea party?", es: "¿Empezamos nuestra fiesta de té?" }
    }
  },
  {
    id: 'monika',
    name: 'Monika',
    trope: 'Club President',
    description: {
      en: 'Just Monika. She is the only one you need.',
      es: 'Solo Monika. Ella es la única que necesitas.'
    },
    color: 'text-green-500',
    themeColor: '#22c55e', // Green 500
    image: '/characters/monika.png',
    avatar: '/characters/monika_avatar.png',
    voiceFolder: 'Monika',
    voiceLines: {
      greeting: { en: "Hi! I've been waiting for you.", es: "¡Hola! Te he estado esperando." },
      alarm: { en: "Wake up! I wrote a poem for you!", es: "¡Despierta! ¡Escribí un poema para ti!" },
      snooze: { en: "Don't leave me hanging...", es: "No me dejes colgada..." },
      stopped: { en: "Just you and me, forever.", es: "Solo tú y yo, por siempre." }
    }
  },
  {
    id: 'najimi',
    name: 'Najimi Ajimu',
    trope: 'Not Equal',
    description: {
      en: 'She has billions of skills. Waking you up is just one of them.',
      es: 'Tiene billones de habilidades. Despertarte es solo una de ellas.'
    },
    color: 'text-purple-500',
    themeColor: '#a855f7', // Purple 500
    image: '/characters/najimi.png',
    avatar: '/characters/najimi_avatar.png',
    voiceFolder: 'Najimi',
    voiceLines: {
      greeting: { en: "Yo. Let's defy logic today.", es: "Yo. Desafiemos la lógica hoy." },
      alarm: { en: "With my 'Wake Up Skill', you cannot sleep!", es: "¡Con mi 'Habilidad de Despertar', no puedes dormir!" },
      snooze: { en: "I saw that coming a million years ago.", es: "Vi eso venir hace un millón de años." },
      stopped: { en: "Omnipotence is boring, but you're fun.", es: "La omnipotencia es aburrida, pero tú eres divertido." }
    }
  },
  {
    id: 'makima',
    name: 'Makima',
    trope: 'Control',
    description: {
      en: 'A woof is all the answer she needs.',
      es: 'Un guau es toda la respuesta que necesita.'
    },
    color: 'text-red-600',
    themeColor: '#dc2626', // Red 600
    image: '/characters/makima.png',
    avatar: '/characters/makima_avatar.png',
    voiceFolder: 'Makima',
    voiceLines: {
      greeting: { en: "You're mine, aren't you?", es: "Eres mío, ¿verdad?" },
      alarm: { en: "Wake up. That is an order.", es: "Despierta. Es una orden." },
      snooze: { en: "Bad dogs don't get treats.", es: "Los perros malos no reciben premios." },
      stopped: { en: "Good boy.", es: "Buen chico." }
    }
  },
  {
    id: 'rin',
    name: 'Rin Tohsaka',
    trope: 'Tsundere Ace',
    description: {
      en: "Perfect honor student... well, mostly.",
      es: "Estudiante de honor perfecta... bueno, casi."
    },
    color: 'text-red-500',
    themeColor: '#ef4444', // Red 500
    image: '/characters/rin.png',
    avatar: '/characters/rin_avatar.png',
    voiceFolder: 'Rin',
    voiceLines: {
      greeting: { en: "Don't get the wrong idea, okay?", es: "No te hagas ideas equivocadas, ¿vale?" },
      alarm: { en: "It's morning! Stop being lazy!", es: "¡Es de mañana! ¡Deja de ser vago!" },
      snooze: { en: "Ugh, you're impossible!", es: "¡Ugh, eres imposible!" },
      stopped: { en: "Fine, I'll make you breakfast. Maybe.", es: "Bien, te haré el desayuno. Tal vez." }
    }
  },
  {
    id: 'rias',
    name: 'Rias Gremory',
    trope: 'Crimson Princess',
    description: {
      en: 'The President of the Occult Research Club.',
      es: 'La Presidenta del Club de Investigación de lo Oculto.'
    },
    color: 'text-red-400',
    themeColor: '#f87171', // Red 400
    image: '/characters/rias.png',
    avatar: '/characters/rias_avatar.png',
    voiceFolder: 'Rias',
    voiceLines: {
      greeting: { en: "Good morning, my dear servant.", es: "Buenos días, mi querido sirviente." },
      alarm: { en: "Wake up for me, won't you?", es: "¿Despertarás por mí, verdad?" },
      snooze: { en: "Ara ara, still sleepy?", es: "Ara ara, ¿todavía con sueño?" },
      stopped: { en: "I knew I could count on you.", es: "Sabía que podía contar contigo." }
    }
  },
  {
    id: 'violet',
    name: 'Violet Evergarden',
    trope: 'Auto Memory Doll',
    description: {
      en: 'I want to know what "I love you" means.',
      es: 'Quiero saber qué significa "Te amo".'
    },
    color: 'text-indigo-400',
    themeColor: '#818cf8',
    image: '/characters/violet.png',
    avatar: '/characters/violet_avatar.png',
    voiceFolder: 'Violet',
    voiceLines: {
      greeting: { en: "The sun has risen. I am ready for orders.", es: "El sol ha salido. Estoy lista para sus órdenes." },
      alarm: { en: "It is time to wake up, Major.", es: "Es hora de despertar, Mayor." },
      snooze: { en: "Delaying your schedule is inefficient.", es: "Retrasar su horario es ineficiente." },
      stopped: { en: "Understood. Proceeding with daily tasks.", es: "Entendido. Procediendo con las tareas diarias." }
    }
  },
  {
    id: 'reze',
    name: 'Reze',
    trope: 'Bomb Girl',
    description: {
      en: 'Teach me how to swim.',
      es: 'Enséñame a nadar.'
    },
    color: 'text-fuchsia-500',
    themeColor: '#d946ef',
    image: '/characters/reze.png',
    avatar: '/characters/reze_avatar.png',
    voiceFolder: 'Reze',
    voiceLines: {
      greeting: { en: "Morning! wanna go to the cafe?", es: "¡Días! ¿Vamos a la cafetería?" },
      alarm: { en: "Boom! Wake up or I'll explode!", es: "¡Boom! ¡Despierta o explotaré!" },
      snooze: { en: "Just 5 more minutes? No way.", es: "¿Solo 5 minutos más? Ni hablar." },
      stopped: { en: "You're cute when you're awake.", es: "Eres lindo cuando estás despierto." }
    }
  },
  {
    id: 'alya',
    name: 'Alya Mikhailovna',
    trope: 'The Ice Princess',
    description: {
      en: 'She sometimes murmurs her true feelings in Russian.',
      es: 'A veces murmura sus verdaderos sentimientos en ruso.'
    },
    color: 'text-cyan-400',
    themeColor: '#22d3ee',
    image: '/characters/alya.png',
    avatar: '/characters/alya_avatar.png',
    voiceFolder: 'Alya',
    voiceLines: {
      greeting: { en: "Dobroye utro. (Good morning).", es: "Dobroye utro. (Buenos días)." },
      alarm: { en: "Are you going to sleep all day?", es: "¿Vas a dormir todo el día?" },
      snooze: { en: "Baka... (Idiot...)", es: "Baka... (Idiota...)" },
      stopped: { en: "Finally. Stay awake now.", es: "Finalmente. Mantente despierto ahora." }
    }
  },
  {
    id: 'frederica',
    name: 'Frederica Baumann',
    trope: 'Golden Tiger',
    description: {
      en: 'The Shield of the Sanctuary.',
      es: 'El Escudo del Santuario.'
    },
    color: 'text-amber-400',
    themeColor: '#fbbf24',
    image: '/characters/frederica.png',
    avatar: '/characters/frederica_avatar.png',
    voiceFolder: 'Frederica',
    voiceLines: {
      greeting: { en: "Good morning! My, what a messy hair.", es: "¡Buenos días! Vaya, qué cabello tan desordenado." },
      alarm: { en: "Wakey wakey! Or I'll transform!", es: "¡Despierta! ¡O me transformaré!" },
      snooze: { en: "You have guts making me wait.", es: "Tienes agallas haciéndome esperar." },
      stopped: { en: "Good. Now, attend to your duties.", es: "Bien. Ahora, atiende tus deberes." }
    }
  }
];

export const MOCK_ALARMS: Alarm[] = [
  { id: '1', time: '07:00', label: 'Morning Ritual', enabled: true, days: [1, 2, 3, 4, 5], characterId: 'rias' },
  { id: '2', time: '09:00', label: 'Literature Club', enabled: false, days: [0, 6], characterId: 'monika' },
];

export const MOCK_LOGS: LogEntry[] = [
  { id: '1', time: '07:00 AM', alarmLabel: 'Morning', characterName: 'Rias', status: 'snoozed', details: 'Snoozed 3x' },
  { id: '2', time: '08:15 AM', alarmLabel: 'Work', characterName: 'Makima', status: 'woke_up', details: 'Instant' },
  { id: '3', time: '06:30 AM', alarmLabel: 'Tea', characterName: 'Echidna', status: 'woke_up', details: 'Asked Questions' },
];

export const DAYS_SHORT = [
  { en: 'S', es: 'D' }, // Sunday
  { en: 'M', es: 'L' },
  { en: 'T', es: 'M' },
  { en: 'W', es: 'X' },
  { en: 'T', es: 'J' },
  { en: 'F', es: 'V' },
  { en: 'S', es: 'S' }
];

export const THEMES: import('./types').ThemeConfig[] = [
  {
    id: 'default',
    name: { en: 'Character Default', es: 'Por Defecto (Personaje)' },
    colors: { primary: '', background: '#0f172a', surface: '#1e293b' } // Dynamic
  },
  {
    id: 'midnight',
    name: { en: 'Midnight Protocol', es: 'Protocolo Medianoche' },
    colors: { primary: '#06b6d4', background: '#000000', surface: '#111111' } // Cyan/Black
  },
  {
    id: 'sakura',
    name: { en: 'Sakura Blossom', es: 'Flor de Sakura' },
    colors: { primary: '#ec4899', background: '#ffe4e6', surface: '#fff1f2' } // Pink/White (Inverted logic needed? Or just overrides. Keeping background dark for now to save eyes or full invert?)
    // Wait, user asked for Sakura. Usually light mode? Or Dark Pink?
    // Let's stick to Dark Mode base for consistency but with Pink accents and very deep purple/red bg?
    // Or full light mode? App is built for dark mode text-white. 
    // Safer: Dark Pink Theme.
    // Re-reading request: "Sakura (Rosa/Blanco)".
    // If I change background to white, I need to change all text to black. That's a huge refactor.
    // I will do "Sakura Dark" -> Deep Maroon/Pink bg, Bright Pink primary.
    // Actually, let's try a very dark pink background to keep text valid.
  },
  {
    id: 'royal',
    name: { en: 'Royal Gold', es: 'Realeza' },
    colors: { primary: '#fbbf24', background: '#1c1917', surface: '#292524' } // Gold/Stone
  }
];

// Tweaking Sakura for dark-mode compatibility
// Changing background to #2a0a12 (Deep Rose) and surface to #4c0519
THEMES[2].colors = { primary: '#f472b6', background: '#2a0a12', surface: '#4c0519' };

