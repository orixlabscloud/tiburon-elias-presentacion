// ============================================================
// DATOS DE LA HISTORIA — Tiburoncito Elías
// ============================================================

export const storyScenes = [
  // ── ESCENA 0 ── Portada ────────────────────────────────────
  {
    id: "cover",
    type: "cover",
    title: "La aventura del",
    titleBig: "Tiburoncito Elías",
    subtitle: "🌊 Mes del Mar 🌊",
    text: "Hoy Elías viaja por el mar para contarnos sobre su amigo: el tiburón.",
    // 🎬 VIDEO de presentación (reemplaza imagen estática)
    video: "/assets/video/portada.mp4",
    character: "/assets/characters/shark_happy.jpg",   // fallback si falla el video
    characterStyle: "sticker-cyan",
    background: "ocean_home",
    audio: "/assets/audio/scene_01.mp3",
    buttonText: "🌊 ¡Comenzar aventura!",
  },

  // ── ESCENA 1 ── ¿Quién soy? ───────────────────────────────
  {
    id: "who",
    type: "info",
    question: "¿Quién soy?",
    emoji: "🦈",
    title: "Hola, soy el Tiburoncito Elías",
    text: "Soy un tiburón. Soy fuerte, rápido y vivo en el mar de Chile.",
    // 🎬 VIDEO del tiburón presentándose
    video: "/assets/video/quien_soy.mp4",
    character: "/assets/characters/shark_idle.jpg",    // fallback
    characterStyle: "sticker-cyan",
    background: "coral_reef",
    audio: null,
    buttonText: "Seguir nadando 🏊",
  },

  // ── ESCENA 2 ── ¿Qué como? ────────────────────────────────
  {
    id: "food",
    type: "interactive-food",
    question: "¿Qué como?",
    emoji: "🍽️",
    title: "Toca lo que puede comer un tiburón",
    text: "Como peces, calamares y otros animalitos del mar.",
    // shark_swim.png → tiburón saltando con energía (más amigable que el de boca abierta)
    character: "/assets/characters/shark_swim.png",
    characterStyle: "sticker-white",
    background: "deep_ocean",
    audio: "/assets/audio/scene_03.mp3",
    buttonText: "Seguir explorando 🗺️",
    foods: [
      { id: "fish",  emoji: "🐟", name: "Pez",    correct: true  },
      { id: "squid", emoji: "🦑", name: "Calamar", correct: true  },
      { id: "algae", emoji: "🌿", name: "Alga",   correct: false },
      { id: "shoe",  emoji: "👟", name: "Zapato",  correct: false },
    ],
    correctMsg: "¡Muy bien! 🎉 ¡Eso puede comer un tiburón!",
    wrongMsg:   "😄 ¡Eso no es comida de tiburón!",
  },

  // ── ESCENA 3 ── ¿Dónde vivo? ──────────────────────────────
  {
    id: "home",
    type: "interactive-map",
    question: "¿Dónde vivo?",
    emoji: "🗺️",
    title: "Vivo en el mar de Chile",
    text: "Vivo en el océano, cerca de la costa y en aguas profundas. ¡En Chile hay tiburones!",
    // shark_eat.png → tiburón azul caricatura (simpático)
    character: "/assets/characters/shark_eat.png",
    characterStyle: "sticker-white",
    mapImage: "/assets/objects/map_chile.png",
    background: "chilean_coast",
    audio: "/assets/audio/scene_04.mp3",
    buttonText: "Ver mi cuerpo 💪",
  },

  // ── ESCENA 4 ── ¿Cómo es mi cuerpo? ──────────────────────
  {
    id: "body",
    type: "interactive-body",
    question: "¿Cómo es mi cuerpo?",
    emoji: "💪",
    title: "Toca cada parte para conocerla",
    text: "Tengo aletas para nadar, cola para avanzar y dientes para comer.",
    // shark_body.jpg → vista lateral completa (ideal para anatomía)
    character: "/assets/characters/shark_body.jpg",
    characterStyle: "sticker-white",
    background: "ocean_home",
    audio: null,
    buttonText: "¿Cómo nacemos? 🐣",
    bodyParts: [
      { id: "fins",  label: "Aletas",  emoji: "🏊", description: "Las aletas me ayudan a moverme por el agua." },
      { id: "tail",  label: "Cola",    emoji: "💨", description: "La cola me ayuda a nadar muy rápido." },
      { id: "teeth", label: "Dientes", emoji: "😁", description: "Los dientes me ayudan a comer mi comida." },
    ],
  },

  // ── ESCENA 5 ── ¿Cómo me reproduzco? ─────────────────────
  {
    id: "reproduction",
    type: "reproduction",
    question: "¿Cómo nacen los tiburones?",
    emoji: "🐣",
    title: "¡Los tiburones tienen bebés!",
    text: "Los tiburones tienen bebés tiburoncitos. Algunos nacen de huevos 🥚 y otros nacen como crías vivas, igual que nosotros.",
    character: "/assets/characters/shark_happy.jpg",
    characterStyle: "sticker-cyan",
    babyImage: "/assets/objects/baby_shark.png",
    eggImage:  "/assets/objects/egg.png",
    background: "coral_reef",
    audio: null,
    buttonText: "Ver dato curioso ✨",
  },

  // ── ESCENA 6 ── Dato curioso ──────────────────────────────
  {
    id: "curiosity",
    type: "curiosity",
    question: "Dato curioso",
    emoji: "🤩",
    title: "¡Los tiburones son MUY antiguos!",
    text: "Los tiburones existen desde hace muchísimo tiempo... ¡incluso antes que los dinosaurios! 🦕",
    subtext: "¡Son los abuelos del océano! 👴🌊",
    // 🎬 VIDEO del tiburón (dato curioso)
    video: "/assets/video/dato_curioso.mp4",
    character: "/assets/characters/shark_happy.jpg",   // fallback
    characterStyle: "sticker-cyan",
    dinosaurImage: "/assets/objects/dinosaur.png",
    background: "deep_ocean",
    audio: "/assets/audio/scene_07.mp3",
    buttonText: "¡Guau! 🎉",
  },

  // ── ESCENA 7 ── Cierre ─────────────────────────────────────
  {
    id: "ending",
    type: "ending",
    title: "¡Gracias por esta aventura!",
    emoji: "💙",
    text: "Gracias por acompañar a Elías en esta aventura por el mar.",
    subtext: "🌊 Cuidemos el océano 🌊",
    credit: "Presentación preparada con ❤️ para Elías",
    character: "/assets/characters/shark_happy.jpg",
    characterStyle: "sticker-cyan",
    background: "ocean_home",
    audio: "/assets/audio/scene_08.mp3",
  },
]
