// archi-tagger.jsx
// Paper-scheme one-page tagger. No pills.
// A — Swatches: each option is a tile/sample card.
// B — Index: typeset like a project register / contents page.

const { useState: useT } = React;

// ============================================================
// PaperShell — shared scaffold for paper-scheme tagger.
// ============================================================
function PaperShell({ photo, mode='reference', children, saveLabel='Save · 4 tags' }) {
  return (
    <div style={{
      position:'absolute', inset:0,
      background: C.paper,
      fontFamily: FONT, color: C.ink, overflow:'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        position:'absolute', top:50, left:14, right:14, zIndex:10,
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <button style={{
          background:'transparent', color:C.ink, border:0,
          width:34, height:34, borderRadius:99,
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}>{I.x(15)}</button>
        <span style={{fontSize:14, fontWeight:500, color:C.ink, letterSpacing:'-0.005em'}}>Tag photo</span>
        <button style={{
          background:'transparent', color:C.inkMuted, border:0,
          padding:'7px 12px', fontSize:14, fontWeight:500, fontFamily:FONT,
        }}>Skip</button>
      </div>

      {/* Photo strip */}
      <div style={{
        position:'absolute', top:96, left:14, right:14, height:84, borderRadius:10,
        backgroundColor:'#222',
        backgroundImage:`url("${photo}")`, backgroundSize:'cover', backgroundPosition:'center',
      }}/>

      {/* Body */}
      <div style={{
        position:'absolute', top:196, left:0, right:0, bottom:80,
        overflowY:'auto', padding:'4px 0 24px',
      }}>
        {children}
      </div>

      {/* Save */}
      <button style={{
        position:'absolute', left:14, right:14, bottom:14,
        background: C.ink, color: C.paper,
        border:0, padding:'14px', borderRadius:14,
        fontSize:16, fontWeight:600, letterSpacing:'-0.01em',
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        fontFamily: FONT,
      }}>
        {saveLabel} {I.arrow(16)}
      </button>
    </div>
  );
}

// ============================================================
// PATTERN A — SWATCHES
// Each section is a row of square tiles. Visual sample cards
// rather than text pills. Selection = tile fills with ink, label inverts.
// Concept tiles use little SVG glyphs (light / structure / etc.)
// Materiality tiles use hatch/texture patterns.
// ============================================================

// --- glyphs for concepts (small abstract marks) ---
const conceptGlyph = (name, color='currentColor') => {
  const map = {
    Form:        <path d="M8 28 L20 8 L32 28 Z" fill={color}/>,
    Space:       <rect x="8" y="8" width="24" height="24" stroke={color} strokeWidth="2" fill="none"/>,
    Light:       <g><circle cx="20" cy="20" r="6" fill={color}/><g stroke={color} strokeWidth="1.6" strokeLinecap="round"><line x1="20" y1="4" x2="20" y2="9"/><line x1="20" y1="31" x2="20" y2="36"/><line x1="4" y1="20" x2="9" y2="20"/><line x1="31" y1="20" x2="36" y2="20"/><line x1="8" y1="8" x2="11" y2="11"/><line x1="29" y1="29" x2="32" y2="32"/><line x1="32" y1="8" x2="29" y2="11"/><line x1="11" y1="29" x2="8" y2="32"/></g></g>,
    Materiality: <g fill={color}><rect x="6" y="6" width="9" height="9"/><rect x="17" y="6" width="9" height="9" opacity="0.45"/><rect x="28" y="6" width="6" height="9" opacity="0.7"/><rect x="6" y="17" width="6" height="9" opacity="0.6"/><rect x="14" y="17" width="12" height="9"/><rect x="28" y="17" width="6" height="9" opacity="0.3"/><rect x="6" y="28" width="14" height="6" opacity="0.5"/><rect x="22" y="28" width="12" height="6"/></g>,
    Structure:   <g stroke={color} strokeWidth="2" fill="none"><line x1="6" y1="34" x2="34" y2="34"/><line x1="10" y1="34" x2="10" y2="10"/><line x1="30" y1="34" x2="30" y2="10"/><line x1="10" y1="10" x2="30" y2="10"/><line x1="10" y1="34" x2="30" y2="10"/><line x1="30" y1="34" x2="10" y2="10"/></g>,
    Context:     <g stroke={color} strokeWidth="1.8" fill="none"><circle cx="20" cy="20" r="13"/><circle cx="20" cy="20" r="7"/><circle cx="20" cy="20" r="2" fill={color}/></g>,
    Circulation: <path d="M6 20 Q14 6 20 20 T34 20" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round"/>,
    Craft:       <g stroke={color} strokeWidth="1.6" fill="none"><path d="M8 12 L32 12 M8 20 L32 20 M8 28 L32 28"/><path d="M14 8 L14 32 M26 8 L26 32"/></g>,
  };
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">{map[name] || null}</svg>
  );
};

// --- material hatch patterns ---
const materialPattern = (name, color) => {
  // Returns inline SVG fill style
  const id = `mat-${name.toLowerCase()}`;
  const patterns = {
    Concrete: (
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={C.paper}/>
        <circle cx="1.5" cy="1.5" r="0.6" fill={color}/>
        <circle cx="4.5" cy="3.5" r="0.5" fill={color}/>
        <circle cx="2.2" cy="4.8" r="0.4" fill={color}/>
      </pattern>
    ),
    Brick: (
      <pattern id={id} width="14" height="8" patternUnits="userSpaceOnUse">
        <rect width="14" height="8" fill={C.paper}/>
        <rect x="0" y="0" width="13" height="3" fill="none" stroke={color} strokeWidth="0.7"/>
        <rect x="-7" y="4" width="13" height="3" fill="none" stroke={color} strokeWidth="0.7"/>
        <rect x="7" y="4" width="13" height="3" fill="none" stroke={color} strokeWidth="0.7"/>
      </pattern>
    ),
    Stone: (
      <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill={C.paper}/>
        <path d="M0 5 L6 3 L12 6 L16 5" stroke={color} strokeWidth="0.6" fill="none"/>
        <path d="M0 11 L4 9 L9 12 L16 11" stroke={color} strokeWidth="0.6" fill="none"/>
        <path d="M3 0 V4 M9 4 V9 M5 9 V16" stroke={color} strokeWidth="0.5"/>
      </pattern>
    ),
    Timber: (
      <pattern id={id} width="20" height="6" patternUnits="userSpaceOnUse">
        <rect width="20" height="6" fill={C.paper}/>
        <path d="M0 2 Q5 1 10 2 T20 2" stroke={color} strokeWidth="0.6" fill="none"/>
        <path d="M0 4 Q5 5 10 4 T20 4" stroke={color} strokeWidth="0.5" fill="none"/>
      </pattern>
    ),
    Steel: (
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={C.paper}/>
        <line x1="0" y1="0" x2="6" y2="6" stroke={color} strokeWidth="0.6"/>
      </pattern>
    ),
    Metal: (
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={C.paper}/>
        <line x1="0" y1="0" x2="6" y2="6" stroke={color} strokeWidth="0.6"/>
        <line x1="6" y1="0" x2="0" y2="6" stroke={color} strokeWidth="0.6"/>
      </pattern>
    ),
    Glass: (
      <pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill={C.paper}/>
        <line x1="0" y1="2" x2="10" y2="2" stroke={color} strokeWidth="0.4" opacity="0.5"/>
        <line x1="0" y1="6" x2="10" y2="6" stroke={color} strokeWidth="0.4" opacity="0.5"/>
      </pattern>
    ),
    Earth: (
      <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill={C.paper}/>
        <path d="M0 4 Q2 2 4 4 T8 4" stroke={color} strokeWidth="0.5" fill="none"/>
      </pattern>
    ),
    Tile: (
      <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill={C.paper} stroke={color} strokeWidth="0.5"/>
      </pattern>
    ),
    Plaster: (
      <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill={C.paper}/>
        <circle cx="3" cy="3" r="0.4" fill={color} opacity="0.6"/>
        <circle cx="9" cy="6" r="0.3" fill={color} opacity="0.6"/>
        <circle cx="5" cy="10" r="0.3" fill={color} opacity="0.6"/>
        <circle cx="11" cy="11" r="0.4" fill={color} opacity="0.6"/>
      </pattern>
    ),
    Textile: (
      <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={C.paper}/>
        <line x1="0" y1="0" x2="6" y2="0" stroke={color} strokeWidth="0.4"/>
        <line x1="0" y1="3" x2="6" y2="3" stroke={color} strokeWidth="0.4"/>
        <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="0.4"/>
        <line x1="3" y1="0" x2="3" y2="6" stroke={color} strokeWidth="0.4"/>
      </pattern>
    ),
  };
  return patterns[name] || null;
};

// --- typology glyph (filled black silhouette) ---
const typologyGlyph = (name, color='currentColor') => {
  const map = {
    Residential:  <path d="M6 20 L20 6 L34 20 V34 H6 Z" fill={color}/>,
    Office:       <g fill={color}><rect x="8" y="8" width="24" height="26"/><g fill={C.paper}><rect x="11" y="12" width="4" height="4"/><rect x="18" y="12" width="4" height="4"/><rect x="25" y="12" width="4" height="4"/><rect x="11" y="19" width="4" height="4"/><rect x="18" y="19" width="4" height="4"/><rect x="25" y="19" width="4" height="4"/><rect x="11" y="26" width="4" height="4"/><rect x="25" y="26" width="4" height="4"/></g></g>,
    Cultural:     <g fill={color}><polygon points="20,6 36,16 4,16"/><rect x="6" y="16" width="3" height="14"/><rect x="13" y="16" width="3" height="14"/><rect x="24" y="16" width="3" height="14"/><rect x="31" y="16" width="3" height="14"/><rect x="4" y="30" width="32" height="3"/></g>,
    Educational:  <g fill={color}><rect x="6" y="14" width="28" height="20"/><polygon points="6,14 20,6 34,14"/><rect x="17" y="22" width="6" height="12" fill={C.paper}/></g>,
    Religious:    <g fill={color}><rect x="6" y="20" width="28" height="14"/><path d="M6 20 Q20 6 34 20 Z"/><rect x="18" y="10" width="4" height="10"/><rect x="14" y="14" width="12" height="3"/></g>,
    Civic:        <g fill={color}><rect x="6" y="14" width="28" height="20"/><polygon points="6,14 20,6 34,14"/><circle cx="20" cy="22" r="3" fill={C.paper}/></g>,
    Commercial:   <g fill={color}><rect x="8" y="10" width="24" height="24"/><rect x="11" y="14" width="6" height="6" fill={C.paper}/><rect x="23" y="14" width="6" height="6" fill={C.paper}/><rect x="11" y="24" width="18" height="2" fill={C.paper}/></g>,
    Hospitality:  <g fill={color}><rect x="6" y="12" width="28" height="22"/><rect x="10" y="16" width="3" height="3" fill={C.paper}/><rect x="16" y="16" width="3" height="3" fill={C.paper}/><rect x="22" y="16" width="3" height="3" fill={C.paper}/><rect x="28" y="16" width="3" height="3" fill={C.paper}/><rect x="10" y="22" width="3" height="3" fill={C.paper}/><rect x="16" y="22" width="3" height="3" fill={C.paper}/><rect x="22" y="22" width="3" height="3" fill={C.paper}/><rect x="28" y="22" width="3" height="3" fill={C.paper}/></g>,
    Industrial:   <g fill={color}><polygon points="4,34 4,18 12,22 12,14 20,18 20,14 28,18 28,14 36,18 36,34"/></g>,
    Heritage:     <g fill={color}><rect x="6" y="14" width="28" height="20"/><polygon points="6,14 20,4 34,14"/><rect x="14" y="20" width="4" height="14" fill={C.paper}/><rect x="22" y="20" width="4" height="14" fill={C.paper}/><circle cx="20" cy="11" r="1.5" fill={C.paper}/></g>,
    Other:        <g fill={color}><circle cx="20" cy="20" r="14"/><text x="20" y="26" textAnchor="middle" fill={C.paper} fontSize="16" fontFamily="Inter" fontWeight="600">?</text></g>,
  };
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">{map[name] || null}</svg>
  );
};

// SwatchTile — generic tile button. Selected = ink fill, paper foreground.
function SwatchTile({ active, label, children, mode='reference', size=64 }) {
  return (
    <div style={{flexShrink:0, width:size, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
      <div style={{
        width:size, height:size, borderRadius:10,
        background: active ? C.ink : C.paper,
        border: `1px solid ${active ? C.ink : 'rgba(15,15,14,0.16)'}`,
        color: active ? C.paper : C.ink,
        display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative', overflow:'hidden',
        transition:'background 0.15s',
      }}>
        {children}
        {active && (
          <div style={{
            position:'absolute', top:5, right:5,
            width:14, height:14, borderRadius:99,
            background: mode==='reference' ? C.mint : C.yellow,
            color: C.ink, display:'inline-flex', alignItems:'center', justifyContent:'center',
          }}>{I.check(9)}</div>
        )}
      </div>
      <div style={{
        fontSize:11, fontWeight:500, color: active ? C.ink : C.inkMuted,
        letterSpacing:'-0.005em', textAlign:'center',
      }}>{label}</div>
    </div>
  );
}

function SwatchSection({ label, summary, children, layout='scroll', cols=4 }) {
  const inner = layout === 'grid' ? (
    <div style={{
      display:'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 10, padding:'2px 16px 4px',
    }}>{children}</div>
  ) : (
    <div style={{
      display:'flex', gap:10, overflowX:'auto', padding:'2px 16px 4px',
      scrollbarWidth:'none',
    }}>{children}</div>
  );
  return (
    <div style={{padding:'16px 0 14px', borderBottom:`1px solid rgba(15,15,14,0.08)`}}>
      <div style={{padding:'0 16px 10px', display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
        <span style={{fontSize:12, color:C.inkMuted, fontWeight:500, letterSpacing:'0.04em', textTransform:'uppercase'}}>{label}</span>
        {summary && (
          <span style={{
            fontSize:13, color:C.ink, fontWeight:500, letterSpacing:'-0.005em',
            maxWidth:220, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{summary}</span>
        )}
      </div>
      {inner}
    </div>
  );
}

// element glyph map (filled silhouettes for element types)
const elementGlyph = (name, color='currentColor') => {
  const map = {
    Column:   <g fill={color}><rect x="14" y="6" width="12" height="3"/><rect x="14" y="31" width="12" height="3"/><rect x="17" y="9" width="6" height="22"/></g>,
    Wall:     <rect x="6" y="6" width="28" height="28" fill={color}/>,
    Arch:     <g fill={color}><rect x="6" y="22" width="6" height="12"/><rect x="28" y="22" width="6" height="12"/><path d="M6 22 Q6 6 20 6 Q34 6 34 22 L28 22 Q28 12 20 12 Q12 12 12 22 Z"/></g>,
    Door:     <g fill={color}><rect x="10" y="6" width="20" height="28"/><circle cx="26" cy="20" r="1.5" fill={C.paper}/></g>,
    Window:   <g fill={color}><rect x="6" y="8" width="28" height="24"/><g fill={C.paper}><rect x="9" y="11" width="9" height="9"/><rect x="22" y="11" width="9" height="9"/><rect x="9" y="22" width="9" height="7"/><rect x="22" y="22" width="9" height="7"/></g></g>,
    Stair:    <g fill={color}><rect x="6" y="28" width="28" height="6"/><rect x="10" y="22" width="24" height="6"/><rect x="14" y="16" width="20" height="6"/><rect x="18" y="10" width="16" height="6"/></g>,
    Ramp:     <g fill={color}><polygon points="6,34 34,34 34,6"/></g>,
    Roof:     <g fill={color}><polygon points="4,22 20,6 36,22 36,26 4,26"/></g>,
    Ceiling:  <g fill={color}><rect x="4" y="6" width="32" height="6"/><g stroke={color} strokeWidth="1.4"><line x1="8" y1="14" x2="8" y2="34"/><line x1="14" y1="14" x2="14" y2="34"/><line x1="20" y1="14" x2="20" y2="34"/><line x1="26" y1="14" x2="26" y2="34"/><line x1="32" y1="14" x2="32" y2="34"/></g></g>,
    Floor:    <g fill={color}><rect x="4" y="28" width="32" height="6"/><g stroke={color} strokeWidth="1.2"><line x1="4" y1="22" x2="36" y2="22"/><line x1="4" y1="16" x2="36" y2="16"/><line x1="4" y1="10" x2="36" y2="10"/></g></g>,
    Facade:   <g fill={color}><rect x="6" y="6" width="28" height="28"/><g fill={C.paper}><rect x="9" y="9" width="3" height="6"/><rect x="14" y="9" width="3" height="6"/><rect x="19" y="9" width="3" height="6"/><rect x="24" y="9" width="3" height="6"/><rect x="29" y="9" width="2" height="6"/><rect x="9" y="18" width="3" height="6"/><rect x="14" y="18" width="3" height="6"/><rect x="19" y="18" width="3" height="6"/><rect x="24" y="18" width="3" height="6"/><rect x="29" y="18" width="2" height="6"/><rect x="9" y="27" width="3" height="5"/><rect x="14" y="27" width="3" height="5"/><rect x="19" y="27" width="3" height="5"/><rect x="24" y="27" width="3" height="5"/></g></g>,
    Railing:  <g fill={color}><rect x="4" y="14" width="32" height="3"/><rect x="6" y="17" width="3" height="14"/><rect x="14" y="17" width="3" height="14"/><rect x="22" y="17" width="3" height="14"/><rect x="30" y="17" width="3" height="14"/><rect x="4" y="31" width="32" height="3"/></g>,
    Joint:    <g fill={color}><rect x="6" y="6" width="13" height="13"/><rect x="21" y="6" width="13" height="13"/><rect x="6" y="21" width="13" height="13"/><rect x="21" y="21" width="13" height="13"/></g>,
    Pavement: <g fill={color}><rect x="4" y="4" width="14" height="14"/><rect x="20" y="4" width="16" height="14"/><rect x="4" y="20" width="16" height="16"/><rect x="22" y="20" width="14" height="16"/></g>,
  };
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">{map[name] || null}</svg>
  );
};

// ============================================================
// BUILDING tagger — typology + concept only (no materiality).
// 2-row 4-column grid for each section, no horizontal scrolling.
// ============================================================
function TaggerBuilding({ photo=PHOTO_BUILDING, mode='reference', picked={typology:'Cultural', concepts:['Light','Materiality'], author:''} }) {
  const typologyOpts = TYPOLOGY.slice(0, 8); // 2 rows × 4
  const conceptOpts = CONCEPTS;              // exactly 8

  return (
    <PaperShell photo={photo} mode={mode} saveLabel="Save · 3 tags">
      <SwatchSection label="Typology" summary={picked.typology} layout="grid" cols={4}>
        {typologyOpts.map(t => (
          <SwatchTile key={t} active={picked.typology===t} mode={mode} label={t} size={70}>
            {typologyGlyph(t, picked.typology===t ? C.paper : C.ink)}
          </SwatchTile>
        ))}
      </SwatchSection>

      <SwatchSection label="Concept" summary={(picked.concepts||[]).join(' · ')} layout="grid" cols={4}>
        {conceptOpts.map(c => (
          <SwatchTile key={c} active={(picked.concepts||[]).includes(c)} mode={mode} label={c} size={70}>
            {conceptGlyph(c, (picked.concepts||[]).includes(c) ? C.paper : C.ink)}
          </SwatchTile>
        ))}
      </SwatchSection>

      <div style={{padding:'18px 16px 8px'}}>
        <div style={{fontSize:12, color:C.inkMuted, fontWeight:500, letterSpacing:'0.04em', textTransform:'uppercase', marginBottom:10}}>Author · Year</div>
        <input style={{
          width:'100%', boxSizing:'border-box',
          background:'transparent', color:C.ink,
          border:'0', borderBottom:`1px solid rgba(15,15,14,0.25)`,
          padding:'8px 0', fontSize:15, fontFamily:FONT,
          letterSpacing:'-0.005em', outline:'none',
        }} placeholder="e.g. Kahn · 1972"/>
      </div>
    </PaperShell>
  );
}

// ============================================================
// ELEMENT tagger — element + materiality + concept.
// Materiality belongs to elements (textures of a column, joint, etc.)
// ============================================================
function TaggerElement({ photo=PHOTO_DETAIL, mode='reference', picked={element:'Column', materials:['Stone'], concepts:['Materiality','Craft'], author:''} }) {
  const elementOpts = ELEMENTS.slice(0, 8); // 2 rows × 4

  return (
    <PaperShell photo={photo} mode={mode} saveLabel="Save · 4 tags">
      <SwatchSection label="Element" summary={picked.element} layout="grid" cols={4}>
        {elementOpts.map(e => (
          <SwatchTile key={e} active={picked.element===e} mode={mode} label={e} size={70}>
            {elementGlyph(e, picked.element===e ? C.paper : C.ink)}
          </SwatchTile>
        ))}
      </SwatchSection>

      <SwatchSection label="Materiality" summary={(picked.materials||[]).join(' · ')} layout="grid" cols={4}>
        {MATERIALS.slice(0, 8).map(m => {
          const isActive = (picked.materials||[]).includes(m);
          return (
            <div key={m} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
              <div style={{
                width:70, height:70, borderRadius:10,
                border: `1px solid ${isActive ? C.ink : 'rgba(15,15,14,0.16)'}`,
                position:'relative', overflow:'hidden',
                background: isActive ? C.ink : C.paper,
              }}>
                <svg width="70" height="70" viewBox="0 0 70 70" style={{position:'absolute', inset:0}}>
                  <defs>{materialPattern(m, isActive ? C.paper : C.ink)}</defs>
                  <rect width="70" height="70" fill={`url(#mat-${m.toLowerCase()})`} opacity={isActive ? 0.9 : 1}/>
                </svg>
                {isActive && (
                  <div style={{
                    position:'absolute', top:5, right:5,
                    width:14, height:14, borderRadius:99,
                    background: mode==='reference' ? C.mint : C.yellow,
                    color: C.ink, display:'inline-flex', alignItems:'center', justifyContent:'center',
                    zIndex:2,
                  }}>{I.check(9)}</div>
                )}
              </div>
              <div style={{
                fontSize:11, fontWeight:500, color: isActive ? C.ink : C.inkMuted,
                letterSpacing:'-0.005em', textAlign:'center',
              }}>{m}</div>
            </div>
          );
        })}
      </SwatchSection>

      <SwatchSection label="Concept" summary={(picked.concepts||[]).join(' · ')} layout="grid" cols={4}>
        {CONCEPTS.map(c => (
          <SwatchTile key={c} active={(picked.concepts||[]).includes(c)} mode={mode} label={c} size={70}>
            {conceptGlyph(c, (picked.concepts||[]).includes(c) ? C.paper : C.ink)}
          </SwatchTile>
        ))}
      </SwatchSection>
    </PaperShell>
  );
}

function TaggerSwatches({ photo=PHOTO_BUILDING, mode='reference', picked={typology:'Cultural', concepts:['Light','Materiality'], materials:['Concrete'], author:''} }) {
  return (
    <PaperShell photo={photo} mode={mode} saveLabel="Save · 4 tags">
      <SwatchSection label="Typology" summary={picked.typology}>
        {TYPOLOGY.slice(0,8).map(t => (
          <SwatchTile key={t} active={picked.typology===t} mode={mode} label={t}>
            {typologyGlyph(t, picked.typology===t ? C.paper : C.ink)}
          </SwatchTile>
        ))}
      </SwatchSection>

      <SwatchSection label="Concept" summary={(picked.concepts||[]).join(' · ')}>
        {CONCEPTS.map(c => (
          <SwatchTile key={c} active={(picked.concepts||[]).includes(c)} mode={mode} label={c}>
            {conceptGlyph(c, (picked.concepts||[]).includes(c) ? C.paper : C.ink)}
          </SwatchTile>
        ))}
      </SwatchSection>

      <SwatchSection label="Materiality" summary={(picked.materials||[]).join(' · ')}>
        {MATERIALS.map(m => {
          const isActive = (picked.materials||[]).includes(m);
          return (
            <div key={m} style={{flexShrink:0, width:64, display:'flex', flexDirection:'column', alignItems:'center', gap:6}}>
              <div style={{
                width:64, height:64, borderRadius:10,
                border: `1px solid ${isActive ? C.ink : 'rgba(15,15,14,0.16)'}`,
                position:'relative', overflow:'hidden',
                background: isActive ? C.ink : C.paper,
              }}>
                <svg width="64" height="64" viewBox="0 0 64 64" style={{position:'absolute', inset:0}}>
                  <defs>{materialPattern(m, isActive ? C.paper : C.ink)}</defs>
                  <rect width="64" height="64" fill={`url(#mat-${m.toLowerCase()})`} opacity={isActive ? 0.9 : 1}/>
                </svg>
                {isActive && (
                  <div style={{
                    position:'absolute', top:5, right:5,
                    width:14, height:14, borderRadius:99,
                    background: mode==='reference' ? C.mint : C.yellow,
                    color: C.ink, display:'inline-flex', alignItems:'center', justifyContent:'center',
                    zIndex:2,
                  }}>{I.check(9)}</div>
                )}
              </div>
              <div style={{
                fontSize:11, fontWeight:500, color: isActive ? C.ink : C.inkMuted,
                letterSpacing:'-0.005em', textAlign:'center',
              }}>{m}</div>
            </div>
          );
        })}
      </SwatchSection>

      <div style={{padding:'18px 16px 8px'}}>
        <div style={{fontSize:12, color:C.inkMuted, fontWeight:500, letterSpacing:'0.04em', textTransform:'uppercase', marginBottom:10}}>Author · Year</div>
        <input style={{
          width:'100%', boxSizing:'border-box',
          background:'transparent', color:C.ink,
          border:'0', borderBottom:`1px solid rgba(15,15,14,0.25)`,
          padding:'8px 0', fontSize:15, fontFamily:FONT,
          letterSpacing:'-0.005em', outline:'none',
        }} placeholder="e.g. Kahn · 1972"/>
      </div>
    </PaperShell>
  );
}

// ============================================================
// PATTERN B — INDEX
// Typeset like a project register / contents page. Sections stacked,
// each option in a tight 2-column grid as small text.
// Selected = bullet on the left + bold type. Quiet, archival.
// ============================================================
function IndexRow({ label, active, mode='reference' }) {
  const dotColor = mode==='reference' ? C.mint : C.yellow;
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'14px 1fr',
      alignItems:'baseline', gap:8,
      padding:'7px 0',
      borderBottom: `1px solid rgba(15,15,14,0.06)`,
    }}>
      <div style={{
        width:8, height:8, marginTop:6,
        background: active ? C.ink : 'transparent',
        borderRadius:0,
        border: active ? 0 : `1px solid rgba(15,15,14,0.25)`,
      }}/>
      <div style={{
        fontSize:14, letterSpacing:'-0.005em',
        fontWeight: active ? 600 : 400,
        color: active ? C.ink : C.inkMuted,
      }}>{label}</div>
    </div>
  );
}

function IndexSection({ number, label, summary, columns=2, children }) {
  return (
    <div style={{padding:'18px 18px 14px', borderBottom:`1px solid rgba(15,15,14,0.10)`}}>
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8}}>
        <div style={{display:'flex', alignItems:'baseline', gap:10}}>
          <span style={{
            fontSize:11, color:C.inkFaint, fontWeight:500, letterSpacing:'0.05em',
            fontVariantNumeric:'tabular-nums',
          }}>{number}</span>
          <span style={{
            fontSize:13, color:C.ink, fontWeight:600, letterSpacing:'-0.005em',
            textTransform:'uppercase',
          }}>{label}</span>
        </div>
        {summary && (
          <span style={{
            fontSize:13, color:C.ink, fontWeight:500, letterSpacing:'-0.005em',
            maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
          }}>{summary}</span>
        )}
      </div>
      <div style={{
        display:'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`,
        columnGap: 18,
      }}>{children}</div>
    </div>
  );
}

function TaggerIndex({ photo=PHOTO_BUILDING, mode='reference', picked={typology:'Cultural', concepts:['Light','Materiality'], materials:['Concrete'], author:''} }) {
  return (
    <PaperShell photo={photo} mode={mode} saveLabel="Save · 4 tags">
      <IndexSection number="01" label="Typology" summary={picked.typology} columns={2}>
        {TYPOLOGY.map(t => (
          <IndexRow key={t} label={t} active={picked.typology===t} mode={mode}/>
        ))}
      </IndexSection>

      <IndexSection number="02" label="Concept" summary={(picked.concepts||[]).join(' · ')} columns={2}>
        {CONCEPTS.map(c => (
          <IndexRow key={c} label={c} active={(picked.concepts||[]).includes(c)} mode={mode}/>
        ))}
      </IndexSection>

      <IndexSection number="03" label="Materiality" summary={(picked.materials||[]).join(' · ')} columns={2}>
        {MATERIALS.map(m => (
          <IndexRow key={m} label={m} active={(picked.materials||[]).includes(m)} mode={mode}/>
        ))}
      </IndexSection>

      <div style={{padding:'18px 18px 8px'}}>
        <div style={{display:'flex', alignItems:'baseline', gap:10, marginBottom:8}}>
          <span style={{
            fontSize:11, color:C.inkFaint, fontWeight:500, letterSpacing:'0.05em',
            fontVariantNumeric:'tabular-nums',
          }}>04</span>
          <span style={{
            fontSize:13, color:C.ink, fontWeight:600, letterSpacing:'-0.005em',
            textTransform:'uppercase',
          }}>Author · Year</span>
        </div>
        <input style={{
          width:'100%', boxSizing:'border-box',
          background:'transparent', color:C.ink,
          border:'0', borderBottom:`1px solid rgba(15,15,14,0.25)`,
          padding:'6px 0', fontSize:15, fontFamily:FONT,
          letterSpacing:'-0.005em', outline:'none',
        }} placeholder="e.g. Kahn · 1972"/>
      </div>
    </PaperShell>
  );
}

Object.assign(window, { PaperShell, TaggerSwatches, TaggerIndex, TaggerBuilding, TaggerElement, SwatchTile, SwatchSection, IndexRow, IndexSection });
