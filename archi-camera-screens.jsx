// archi-camera-screens.jsx
// Camera screens — green=reference, yellow=project, red=save.
// Mode indicator is a small pill (not a bar) so it doesn't compete with the photo.

const { useState: useS } = React;

function CamShell({ children, photo = PHOTO_BUILDING, dim = 0.0 }) {
  return (
    <div style={{
      position:'absolute', inset:0,
      backgroundColor:'#000',
      backgroundImage:`url("${photo}")`,
      backgroundSize:'cover',
      backgroundPosition:'center',
      backgroundRepeat:'no-repeat',
      overflow:'hidden',
      fontFamily: FONT,
      color:'#fff',
    }}>
      {dim > 0 && <div style={{position:'absolute', inset:0, background:`rgba(0,0,0,${dim})`}}/>}
      {children}
    </div>
  );
}

function ChromeGradient({ side='bottom' }) {
  const grad = side === 'bottom'
    ? 'linear-gradient(to top, rgba(0,0,0,0.45), transparent 55%)'
    : 'linear-gradient(to bottom, rgba(0,0,0,0.32), transparent 55%)';
  const pos = side === 'bottom' ? { bottom:0, height:'28%' } : { top:0, height:'18%' };
  return <div style={{position:'absolute', left:0, right:0, ...pos, background:grad, pointerEvents:'none'}}/>;
}

// LiteToggle — L / F segmented pill. The whole "do I tag now or later?" decision.
function LiteToggle({ lite=false, dark=true }) {
  const bg = dark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.7)';
  const inactive = dark ? 'rgba(255,255,255,0.55)' : 'rgba(15,15,14,0.5)';
  return (
    <div style={{
      display:'inline-flex', alignItems:'center',
      background: bg, backdropFilter:'blur(14px)',
      borderRadius:999, padding:3,
      border:'1px solid rgba(255,255,255,0.12)',
      fontFamily: FONT,
    }}>
      <span style={{
        width:30, height:26, borderRadius:999,
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        fontSize:13, fontWeight:600, letterSpacing:'-0.005em',
        background: lite ? '#fff' : 'transparent',
        color: lite ? C.ink : inactive,
      }}>L</span>
      <span style={{
        width:30, height:26, borderRadius:999,
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        fontSize:13, fontWeight:600, letterSpacing:'-0.005em',
        background: !lite ? '#fff' : 'transparent',
        color: !lite ? C.ink : inactive,
      }}>F</span>
    </div>
  );
}

// ProjectPill — only shown in project mode. The yellow dot signals mode;
// the project name is the actual content. Reference mode shows nothing here.
function ProjectPill({ name, count }) {
  return (
    <button style={{
      display:'inline-flex', alignItems:'center', gap:7,
      background: 'rgba(0,0,0,0.55)', backdropFilter:'blur(14px)',
      color:'#fff', border:0,
      padding:'7px 12px 7px 9px', borderRadius:999,
      fontSize:13, fontWeight:500, letterSpacing:'-0.005em',
      fontFamily: FONT,
    }}>
      <span style={{
        width:9, height:9, borderRadius:99, background: C.yellow,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.2)',
        flexShrink:0,
      }}/>
      <span>{name}</span>
      {count != null && (
        <span style={{
          fontSize:12, color:'rgba(255,255,255,0.6)', fontWeight:400,
          paddingLeft:5, marginLeft:1, borderLeft:'1px solid rgba(255,255,255,0.18)',
        }}>{count}</span>
      )}
      <span style={{opacity:0.5, marginLeft:1}}>{I.caret(8)}</span>
    </button>
  );
}

// V1 — REFERENCE: green dot + sentence-case label
function CameraReference({ typeId='building', reuseOn=false, lite=false, photo=PHOTO_BUILDING }) {
  const t = TYPES.find(x => x.id === typeId) || TYPES[0];

  return (
    <CamShell photo={photo}>
      <ChromeGradient side="top" />
      <ChromeGradient side="bottom" />

      {/* Top — type pill (left) + options (right). Mode shown in segmented control at bottom. */}
      <div style={{
        position:'absolute', top:0, left:0, right:0,
        padding:'56px 14px 12px',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, zIndex:10,
      }}>
        <div style={{display:'flex', alignItems:'center', gap:6, flexWrap:'wrap'}}>
          {/* Type pill — what you're capturing */}
          <button style={{
            display:'inline-flex', alignItems:'center', gap:5,
            background: 'rgba(0,0,0,0.55)', backdropFilter:'blur(14px)', color:'#fff',
            padding:'7px 12px', borderRadius:999, border:0,
            fontSize:13, fontWeight:500, letterSpacing:'-0.005em',
          }}>
            {t.label} {I.caret(9)}
          </button>
          {/* Reuse toggle */}
          <button title="Reuse last tags" style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            width:32, height:32, borderRadius:999, border:0,
            background: reuseOn ? C.mint : 'rgba(0,0,0,0.55)',
            color: reuseOn ? C.ink : '#fff',
            backdropFilter:'blur(14px)',
          }}>{I.reuse(15)}</button>
        </div>
        <button style={{
          width:32, height:32, borderRadius:999, border:0,
          background: 'rgba(0,0,0,0.55)', color:'#fff', backdropFilter:'blur(14px)',
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}>{I.more(18)}</button>
      </div>

      {/* Reuse hint — small, sentence case, only when on */}
      {reuseOn && (
        <div style={{
          position:'absolute', top: 100, left: 14, zIndex: 10,
          background: C.mint, color: C.ink,
          padding:'5px 11px', borderRadius:8,
          fontSize:13, fontWeight:500, letterSpacing:'-0.005em',
        }}>
          Reusing · Cultural · Light
        </div>
      )}

      <Shutter accent={C.mint} />

      {/* Bottom bar */}
      <div style={{
        position:'absolute', left:0, right:0, bottom:30,
        padding:'0 22px',
        display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:11,
      }}>
        <Thumb photo={PHOTO_DETAIL} />
        <ModePill mode="reference" />
        <LiteToggle lite={lite} />
      </div>
    </CamShell>
  );
}

// V2 — PROJECT: yellow dot + project name + photo count
function CameraProject({ project='Villa Sora', lite=false, photo=PHOTO_PROJECT, count=23 }) {
  return (
    <CamShell photo={photo}>
      <ChromeGradient side="top" />
      <ChromeGradient side="bottom" />

      {/* Top — project pill (yellow dot + name + count). Mode shown in segmented control at bottom. */}
      <div style={{
        position:'absolute', top:0, left:0, right:0,
        padding:'56px 14px 12px',
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, zIndex:10,
      }}>
        <ProjectPill name={project} count={count} />
        <button style={{
          width:32, height:32, borderRadius:999, border:0,
          background: 'rgba(0,0,0,0.55)', color:'#fff', backdropFilter:'blur(14px)',
          display:'inline-flex', alignItems:'center', justifyContent:'center',
        }}>{I.more(18)}</button>
      </div>

      {/* Subtle yellow corner ticks — claims the frame as project shot, less heavy than full border */}
      <CornerTicks color={C.yellow} />

      <Shutter accent={C.yellow} />

      <div style={{
        position:'absolute', left:0, right:0, bottom:30,
        padding:'0 22px',
        display:'flex', alignItems:'center', justifyContent:'space-between', zIndex:11,
      }}>
        <Thumb photo={PHOTO_DETAIL} count={count}/>
        <ModePill mode="project" />
        <LiteToggle lite={lite} />
      </div>
    </CamShell>
  );
}

// Subtle viewfinder-style corner ticks. Reads "you're framing for project X"
// without the full intrusive border.
function CornerTicks({ color }) {
  const len = 18, thick = 2, inset = 14;
  const tick = { position:'absolute', background: color };
  return (
    <div style={{position:'absolute', inset:`${inset+90}px ${inset}px ${inset+85}px ${inset}px`, pointerEvents:'none', zIndex:5}}>
      {/* TL */}
      <div style={{...tick, top:0, left:0, width:len, height:thick}}/>
      <div style={{...tick, top:0, left:0, width:thick, height:len}}/>
      {/* TR */}
      <div style={{...tick, top:0, right:0, width:len, height:thick}}/>
      <div style={{...tick, top:0, right:0, width:thick, height:len}}/>
      {/* BL */}
      <div style={{...tick, bottom:0, left:0, width:len, height:thick}}/>
      <div style={{...tick, bottom:0, left:0, width:thick, height:len}}/>
      {/* BR */}
      <div style={{...tick, bottom:0, right:0, width:len, height:thick}}/>
      <div style={{...tick, bottom:0, right:0, width:thick, height:len}}/>
    </div>
  );
}

function Shutter({ accent }) {
  return (
    <div style={{
      position:'absolute', left:'50%', bottom:88,
      transform:'translateX(-50%)',
      width:72, height:72, borderRadius:999,
      background:'#fff',
      border:`3px solid ${accent}`,
      boxShadow:'0 0 0 4px rgba(255,255,255,0.18)',
      zIndex:12,
    }}/>
  );
}

function Thumb({ photo, count=null }) {
  return (
    <div style={{
      position:'relative',
      width:40, height:40, borderRadius:8,
      backgroundColor:'#222',
      backgroundImage:`url("${photo}")`,
      backgroundSize:'cover',
      backgroundPosition:'center',
      border:'2px solid rgba(255,255,255,0.85)',
    }}>
      {count != null && (
        <div style={{
          position:'absolute', bottom:-6, right:-6,
          background: '#fff', color:'#000',
          fontSize:11, fontWeight:600,
          padding:'1px 6px', borderRadius:99,
          minWidth:18, textAlign:'center',
          border:'1.5px solid #000',
          letterSpacing:'-0.01em',
        }}>{count}</div>
      )}
    </div>
  );
}

function ModePill({ mode }) {
  const isRef = mode === 'reference';
  return (
    <div style={{
      display:'inline-flex',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter:'blur(14px)',
      borderRadius:999,
      padding:3,
      border:`1px solid ${C.hairline}`,
    }}>
      <span style={{
        padding:'5px 12px', borderRadius:999,
        fontSize:12, fontWeight:500, letterSpacing:'-0.005em',
        background: isRef ? C.mint : 'transparent',
        color: isRef ? C.ink : 'rgba(255,255,255,0.6)',
      }}>Reference</span>
      <span style={{
        padding:'5px 12px', borderRadius:999,
        fontSize:12, fontWeight:500, letterSpacing:'-0.005em',
        background: !isRef ? C.yellow : 'transparent',
        color: !isRef ? C.ink : 'rgba(255,255,255,0.6)',
      }}>Project</span>
    </div>
  );
}

Object.assign(window, { CameraReference, CameraProject, CamShell, ChromeGradient, ProjectPill, CornerTicks, Shutter, Thumb, ModePill, LiteToggle });
