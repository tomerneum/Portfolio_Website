// Editable site settings. Everything a non-developer might want to change
// lives here rather than being scattered through the components.

export const site = {
  name: 'Tomer Neumann',
  nameHe: 'תומר ניימן',
  role: 'Industrial Designer',
  // Shown over the fullscreen hero video on the home page.
  statement:
    'Techno-Optimist Designer specializing in computational design, animation and technical problem solving',
  email: 'tomerneum@gmail.com',
  location: ['Tel Aviv', 'Israel'],
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tomer-neumann-440ab91a6/' },
    { label: 'YouTube', href: 'https://www.youtube.com/' },
  ],
  // No Work entry - the home page is the work index. Project pages still
  // live under /work/<slug>.
  nav: [
    { label: 'About', href: '/about' },
    { label: 'Archive', href: '/archive' },
    { label: 'Contact', href: '/contact' },
  ],
};

// The hero video. Drop a file at public/videos/showreel.mp4 and it plays
// fullscreen behind the statement. Until then the poster image shows.
export const hero = {
  video: '/videos/showreel.mp4',
  poster: null, // falls back to the first project cover
};

// Per-project display metadata.
//   meta   - small line under the title in the grid. Kilo uses "Client / Year";
//            add real clients and years here when you have them.
//   accent - tints the hover overlay, one deliberate colour per project.
//   video  - the silent looping preview shown in the grid. Drop the file at
//            this path and the tile becomes video automatically.
export const projectMeta = {
  'impossible-ceramics': {
    meta: 'Material research',
    accent: '#8c4a2f',
    video: '/videos/impossible-ceramics.mp4',
  },
  'construction-design-for-moria-architects': {
    meta: 'Moria Architects / Tel Aviv Museum of Art',
    accent: '#1f3a5f',
    video: '/videos/construction-design-for-moria-architects.mp4',
  },
  'hydroponic-system': {
    meta: 'Product design',
    accent: '#2f6b46',
    video: '/videos/hydroponic-system.mp4',
  },
  'freelance-rendering-and-animation': {
    meta: 'Rendering & animation',
    accent: '#2b2f7a',
    video: '/videos/freelance-rendering-and-animation.mp4',
  },
  'dj-accessibility-kit': {
    meta: 'Accessibility',
    accent: '#7a2f5f',
    video: '/videos/dj-accessibility-kit.mp4',
  },
  '3d-balance-board': {
    meta: 'Parametric design',
    accent: '#b4602a',
    video: '/videos/3d-balance-board.mp4',
  },
  'bo-vacuum-cleaner': {
    meta: 'Concept',
    accent: '#3c4a52',
    video: '/videos/bo-vacuum-cleaner.mp4',
  },
  'ikea-hack-wheelchair-tray': {
    meta: 'Open source',
    accent: '#0a5aa8',
    video: '/videos/ikea-hack-wheelchair-tray.mp4',
  },
  'mobius-spinning-top': {
    meta: 'Object',
    accent: '#5b4b8a',
    video: '/videos/mobius-spinning-top.mp4',
  },
  'easypour-pitcher': {
    meta: 'Product design',
    accent: '#a8442f',
    video: '/videos/easypour-pitcher.mp4',
  },
  'field-worker-tool': {
    meta: 'Tool design',
    accent: '#4a6b2f',
    video: '/videos/field-worker-tool.mp4',
  },
  'fold-up-clothes-hanger': {
    meta: 'Product design',
    accent: '#96702a',
    video: '/videos/fold-up-clothes-hanger.mp4',
  },
  'xbox-modeling-from-scratch': {
    meta: 'CAD study',
    accent: '#2f6b5f',
    video: '/videos/xbox-modeling-from-scratch.mp4',
  },
};

// Order projects appear in the grid. Anything not listed is appended.
export const featuredOrder = [
  'impossible-ceramics',
  'freelance-rendering-and-animation',
  'construction-design-for-moria-architects',
  'hydroponic-system',
  'dj-accessibility-kit',
  '3d-balance-board',
  'bo-vacuum-cleaner',
  'ikea-hack-wheelchair-tray',
  'easypour-pitcher',
  'mobius-spinning-top',
  'field-worker-tool',
  'fold-up-clothes-hanger',
  'xbox-modeling-from-scratch',
];
