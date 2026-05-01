// archi-camera.jsx
// Design exploration for archi-archive camera redesign
// 1. Reference mode — distinct identity (warm/paper)
// 2. Project mode — distinct identity (mint/active)
// 3. Smart tag UI — least taps possible

const { useState, useRef, useEffect, useMemo } = React;

// =================== SAMPLE PHOTO (placeholder camera feed) ===================
// Plausible architectural reference scene rendered as SVG so artboards stay self-contained
// Inline SVG placeholders — architectural-feeling abstract backgrounds.
// Not "real photos" but plausible enough to read intent. No network.
function svgBg(svg) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
const PHOTO_BUILDING = svgBg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 800'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='%23a89884'/><stop offset='1' stop-color='%23433d35'/></linearGradient></defs><rect width='400' height='800' fill='url(%23g)'/><g fill='%23000' opacity='0.35'><rect x='40' y='220' width='80' height='420'/><rect x='140' y='180' width='90' height='460'/><rect x='250' y='250' width='110' height='390'/></g><g fill='%23fff' opacity='0.18'><rect x='52' y='250' width='14' height='20'/><rect x='80' y='250' width='14' height='20'/><rect x='52' y='290' width='14' height='20'/><rect x='80' y='290' width='14' height='20'/><rect x='52' y='330' width='14' height='20'/><rect x='80' y='330' width='14' height='20'/><rect x='52' y='370' width='14' height='20'/><rect x='80' y='370' width='14' height='20'/><rect x='160' y='220' width='14' height='24'/><rect x='190' y='220' width='14' height='24'/><rect x='160' y='270' width='14' height='24'/><rect x='190' y='270' width='14' height='24'/></g></svg>`);
const PHOTO_DETAIL = svgBg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 800'><defs><pattern id='b' width='40' height='14' patternUnits='userSpaceOnUse'><rect width='38' height='12' fill='%23934a2e'/></pattern></defs><rect width='400' height='800' fill='%23000'/><rect width='400' height='800' fill='url(%23b)' opacity='0.85'/><rect width='400' height='800' fill='%23000' opacity='0.15'/></svg>`);
const PHOTO_GRAPHIC = svgBg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 800'><rect width='400' height='800' fill='%23eae3d2'/><g fill='%231a1a18'><rect x='60' y='160' width='280' height='2'/><rect x='60' y='180' width='200' height='2'/><rect x='60' y='200' width='240' height='2'/><rect x='60' y='220' width='180' height='2'/><rect x='60' y='280' width='280' height='240' fill='none' stroke='%231a1a18' stroke-width='1.5'/><circle cx='200' cy='400' r='60' fill='none' stroke='%231a1a18' stroke-width='1.5'/></g></svg>`);
const PHOTO_PROJECT = svgBg(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 800'><defs><linearGradient id='g2' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='%23c8c4b8'/><stop offset='1' stop-color='%2358544a'/></linearGradient></defs><rect width='400' height='800' fill='url(%23g2)'/><g fill='%23000' opacity='0.45'><polygon points='0,500 200,300 400,500 400,800 0,800'/></g><g stroke='%23fff' stroke-width='1' opacity='0.2' fill='none'><line x1='0' y1='350' x2='400' y2='350'/><line x1='0' y1='400' x2='400' y2='400'/><line x1='0' y1='450' x2='400' y2='450'/></g></svg>`);

// =================== TAXONOMY (mirrors index.html) ===================
const TYPES = [
  { id:'building', label:'Building', glyph:'B' },
  { id:'element',  label:'Element',  glyph:'E' },
  { id:'graphic',  label:'Graphic',  glyph:'G' },
];
const TYPOLOGY = ['Residential','Office','Cultural','Educational','Religious','Civic','Commercial','Hospitality','Industrial','Heritage','Other'];
const CONCEPTS = ['Form','Space','Light','Materiality','Structure','Context','Circulation','Craft'];
const MATERIALS = ['Concrete','Brick','Stone','Timber','Steel','Metal','Glass','Earth','Tile','Plaster','Textile'];
const ELEMENTS = ['Column','Wall','Arch','Door','Window','Stair','Ramp','Roof','Ceiling','Floor','Facade','Railing','Joint','Pavement'];

// =================== TYPE TOKENS ===================
const FONT = "'Inter',-apple-system,BlinkMacSystemFont,sans-serif";
const MONO = "'JetBrains Mono','SF Mono',Menlo,monospace";
const SERIF = "'Fraunces',Georgia,serif";

// =================== ICONS (line, no emoji) ===================
const I = {
  caret: (s=10)=> <svg width={s} height={s} viewBox="0 0 10 10" fill="none"><path d="M2 4 L5 7 L8 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  flip: (s=20)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 8 V6 a2 2 0 0 1 2-2 h3 M21 8 V6 a2 2 0 0 0-2-2 h-3 M3 16 v2 a2 2 0 0 0 2 2 h3 M21 16 v2 a2 2 0 0 1-2 2 h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6"/></svg>,
  more: (s=20)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>,
  reuse: (s=18)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 12 a8 8 0 0 1 14-5.3 M20 12 a8 8 0 0 1-14 5.3 M18 3 v4 h-4 M6 21 v-4 h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  grid: (s=18)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="4" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/><rect x="4" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="14" width="6" height="6" stroke="currentColor" strokeWidth="1.6"/></svg>,
  check: (s=14)=> <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M3 7 L6 10 L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  plus: (s=14)=> <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M7 2 V12 M2 7 H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  arrow: (s=16)=> <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 8 H13 M9 4 L13 8 L9 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  back: (s=18)=> <svg width={s} height={s} viewBox="0 0 18 18" fill="none"><path d="M11 4 L5 9 L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pin: (s=14)=> <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M7 1 V13 M2 7 H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  x: (s=14)=> <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M3 3 L11 11 M11 3 L3 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
};

// =================== COLOR SYSTEM ===================
// Reference = warm paper / black ink (archive, library, reference book)
// Project   = mint chartreuse / black ink (active, alive, building)
// Camera    = always dark (Camera.app convention) but mode-tinted accents
// New palette — three flat colors + paper + ink. From user reference.
const C = {
  yellow: '#F2E961',     // Reference / default
  mint:   '#A8EFB7',     // Project / active
  red:    '#FF5A4D',     // Save / action / urgent
  paper:  '#F2EEE6',     // Neutral surface
  ink:    '#0F0F0E',
  inkMuted: 'rgba(15,15,14,0.62)',
  inkFaint: 'rgba(15,15,14,0.38)',

  // Convenience aliases — green=reference, yellow=project, red=save
  ref: '#A8EFB7',
  refInk: '#0F0F0E',
  refAccent: '#FF5A4D',
  proj: '#F2E961',
  projInk: '#0F0F0E',

  shell: '#0A0A09',
  shellInk: '#F2EEE6',
  glass: 'rgba(0,0,0,0.55)',
  glassUp: 'rgba(20,20,18,0.78)',
  hairline: 'rgba(255,255,255,0.16)',
};

// Make components available globally
Object.assign(window, { TYPES, TYPOLOGY, CONCEPTS, MATERIALS, ELEMENTS, FONT, MONO, SERIF, I, C, PHOTO_BUILDING, PHOTO_DETAIL, PHOTO_GRAPHIC, PHOTO_PROJECT });
