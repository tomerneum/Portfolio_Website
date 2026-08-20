// Editable site settings. Everything a non-developer might want to change
// lives here rather than being scattered through the components.

export const site = {
  name: 'Tomer Neumann',
  nameHe: 'תומר ניימן',
  role: 'Industrial Designer',
  // Canonical origin. Link previews (WhatsApp, LinkedIn, iMessage) need
  // absolute URLs, so this is what turns /img/... into a shareable link.
  url: 'https://tomerneumann.com',
  // Shown over the fullscreen hero video on the home page.
  statement:
    'Techno-Optimist Designer specializing in computational design, animation and technical problem solving',
  email: 'tomerneum@gmail.com',
  // E.164 for the tel: link; the contact page spaces it out for reading.
  phone: '+972545609139',
  location: ['Hofit', 'Israel'],
  // LinkedIn is the only real profile - the Instagram and YouTube entries
  // here pointed at the sites' front pages, not at Tomer, so they are gone.
  social: [{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/tomer-neumann-440ab91a6/' }],
  // No Work entry - the home page is the work index. Project pages still
  // live under /work/<slug>.
  nav: [
    { label: 'About', href: '/about' },
    { label: 'Configurators', href: '/configurators' },
    { label: 'Archive', href: '/archive' },
    { label: 'Contact', href: '/contact' },
  ],
};

// The hero video, playing fullscreen behind the statement.
//
// Deliberately the heaviest file on the site: 27s of 1080p at ~5.8 Mbps,
// 60 MB master -> 18.7 MB. An earlier pass at 2.8 MB was visibly grainy on
// the plywood, and this is the first thing anyone sees. It loads eagerly, so
// the poster below carries the screen until enough of it has arrived.
//
// Like everything in /videos/ it is served immutable for a year: a revised
// cut needs a NEW filename or browsers keep the old one. Hence the -2.
export const hero = {
  video: '/videos/hero-assembly-2.mp4',
  poster: '/videos/hero-assembly-2.poster.jpg',
};

// Per-project display metadata.
//   meta   - small line under the title in the grid. Kilo uses "Client / Year";
//            add real clients and years here when you have them.
//   accent - tints the hover overlay, one deliberate colour per project.
//   video  - the silent looping preview shown in the grid. Drop the file at
//            this path and the tile becomes video automatically.
//   hidden - takes the project out of the grid and makes /work/<slug> a 404,
//            without touching its content. For work that is not ready to
//            show yet.
export const projectMeta = {
  'impossible-ceramics': {
    meta: 'Material research',
    accent: '#8c4a2f',
    video: '/videos/impossible-ceramics.mp4',
  },
  'construction-design-for-moria-architects': {
    meta: 'Moria Architects / Tel Aviv Museum of Art',
    accent: '#1f3a5f',
    // Stills only: this tile is Daniel Hanoch's exhibition photograph, so
    // there is deliberately no looping preview to swap in over it.
    video: null,
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
    // -2: re-cropped higher to keep the hand on the handle. See the crop
    // override in scripts/prepare-videos.cjs.
    video: '/videos/easypour-pitcher-2.mp4',
    // Temporarily out of the site. Everything - content, media, the crop -
    // stays in place; delete this line to bring it back.
    hidden: true,
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

// Client logo reel shown under the About text. Converted from the source GIF
// to mp4 (677 KB -> 136 KB) with its slideshow pacing intact.
//
// Note the -2 suffix: /videos/ is served immutable with a one-year max-age,
// so a revised reel needs a NEW filename or browsers keep the old one.
// Bump the number whenever the reel changes.
export const aboutReel = {
  video: '/videos/company-logo-reel-2.mp4',
  poster: '/videos/company-logo-reel-2.poster.webp',
};

// Live parametric configurators, embedded on /configurators. Each runs as
// its own hosted app (Grasshopper + Rhino Compute) inside an iframe; adding
// another is one entry here.
//
//   title    - shown above the embed
//   subtitle - the small line under it (the stack it runs on)
//   blurb    - one or two sentences of context
//   url      - the hosted app to frame
export const configurators = [
  {
    slug: 'cardboard-box',
    title: 'Cardboard Box',
    subtitle: 'Grasshopper · Rhino Compute',
    blurb:
      'Set the box dimensions and board, orbit the live 3D model, then send it to the studio to receive an exact solve and a flat-pattern DXF ready to cut.',
    url: 'https://web-production-9f142.up.railway.app/examples/cardboard/',
  },
];

// Swap a specific image inside a project page for a video.
//
// Keyed by the original filename in public/images. This lives here rather
// than in image-manifest.json because that file is regenerated by the image
// scripts, which would discard the substitution.
export const mediaReplacements = {
  // The spinning-top GIF, replaced by the real capture.
  '7ba5e64b-7e2b-49c1-a872-c6bdc7066c5b_rw_1200.gif': {
    video: '/videos/mobius-spinning-top.mp4',
    poster: '/videos/mobius-spinning-top.poster.jpg',
    w: 1866,
    h: 1078,
  },
  // The landscape assembly clip on the Parametric Fabrication page, replaced
  // by the upscaled master - the GIF was a 800x453 crop of the same footage.
  '40bd1425-7d91-4c66-b8fe-260195ef841b_rw_1200.gif': {
    video: '/videos/parametric-fabrication-assembly.mp4',
    poster: '/videos/parametric-fabrication-assembly.poster.jpg',
    w: 1908,
    h: 1080,
  },
};

// Order projects appear in the grid. Anything not listed is appended.
export const featuredOrder = [
  'impossible-ceramics',
  'construction-design-for-moria-architects',
  'hydroponic-system',
  'dj-accessibility-kit',
  '3d-balance-board',
  'freelance-rendering-and-animation',
  'bo-vacuum-cleaner',
  'ikea-hack-wheelchair-tray',
  'easypour-pitcher',
  'mobius-spinning-top',
  'field-worker-tool',
  'fold-up-clothes-hanger',
  'xbox-modeling-from-scratch',
];
