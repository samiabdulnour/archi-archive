// archi-app.jsx — capture flow prototype with grid-sheet menu
// Variations toggled at runtime via the `variant` prop.

const { useState, useEffect } = React;

// ─────────────────────────────────────────────────────────────
// 5 type + palette variations
// ─────────────────────────────────────────────────────────────
const VARIANTS = {
  // 1 — Apple default. SF only, no mono. Single warm accent.
  apple: {
    label: 'Apple Default',
    desc: 'SF throughout, near-mono, warm terracotta accent',
    fontMain: '-apple-system, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
    fontMono: '-apple-system, "SF Pro Text", system-ui, sans-serif',
    bg: '#F2F2F7',
    surface: '#FFFFFF',
    ink: '#000000',
    ink2: 'rgba(60,60,67,0.6)',
    ink3: 'rgba(60,60,67,0.3)',
    rule: 'rgba(60,60,67,0.12)',
    accent: '#C2410C',
    accentInk: '#FFFFFF',
    cellBg: '#FFFFFF',
    cellRule: 'rgba(60,60,67,0.18)',
    radius: 14,
    titleWeight: 700,
    bodyWeight: 400,
    titleLetter: 0.4,
    bodyLetter: -0.2,
    uppercaseLabels: false,
  },

  // 2 — Helvetica swiss. Architectural signage.
  swiss: {
    label: 'Swiss',
    desc: 'Helvetica, paper white, ink black, no accent',
    fontMain: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, monospace',
    bg: '#F4F2EC',
    surface: '#FCFAF4',
    ink: '#0E0E0C',
    ink2: '#6B6863',
    ink3: '#A19D95',
    rule: '#D8D4CA',
    accent: '#0E0E0C',
    accentInk: '#FCFAF4',
    cellBg: '#FCFAF4',
    cellRule: '#C9C4B7',
    radius: 0,
    titleWeight: 500,
    bodyWeight: 400,
    titleLetter: -0.4,
    bodyLetter: 0,
    uppercaseLabels: true,
  },

  // 3 — Editorial serif accent.
  editorial: {
    label: 'Editorial',
    desc: 'Inter body, serif display, warm cream',
    fontMain: '"Inter", system-ui, sans-serif',
    fontDisplay: '"Newsreader", "Source Serif Pro", Georgia, serif',
    fontMono: '"JetBrains Mono", monospace',
    bg: '#EFEAE0',
    surface: '#FAF6EC',
    ink: '#1F1B14',
    ink2: '#6F6856',
    ink3: '#A8A294',
    rule: '#D6CFBE',
    accent: '#7C2D12',
    accentInk: '#FAF6EC',
    cellBg: '#FAF6EC',
    cellRule: '#C8C0AE',
    radius: 4,
    titleWeight: 400,
    bodyWeight: 400,
    titleLetter: -0.6,
    bodyLetter: 0,
    useDisplay: true,
    uppercaseLabels: true,
  },

  // 4 — Mono drafting.
  mono: {
    label: 'Drafting',
    desc: 'Mono everywhere, blueprint cool grey',
    fontMain: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
    fontMono: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
    bg: '#E8EBEC',
    surface: '#F4F6F7',
    ink: '#0F1416',
    ink2: '#566066',
    ink3: '#9099A0',
    rule: '#C5CCD0',
    accent: '#0F1416',
    accentInk: '#F4F6F7',
    cellBg: '#F4F6F7',
    cellRule: '#B4BBC0',
    radius: 2,
    titleWeight: 500,
    bodyWeight: 400,
    titleLetter: -0.2,
    bodyLetter: 0,
    uppercaseLabels: false,
  },

  // 6 — NaN foundry style. Chartreuse field, black ink, tracked-out caps.
  nan: {
    label: 'NaN Green',
    desc: 'Chartreuse field, black ink, tracked-out caps (NaN foundry feel)',
    fontMain: '"Inter", "Helvetica Neue", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, monospace',
    bg: '#7CEB7C',          // mint — chosen direction
    surface: '#FAFAF7',     // off-white card
    ink: '#000000',
    ink2: '#000000',
    ink3: 'rgba(0,0,0,0.45)',
    rule: 'rgba(0,0,0,0.5)',
    accent: '#000000',      // black is the "accent"
    accentInk: '#7CEB7C',   // mint text on black
    cellBg: '#FAFAF7',
    cellRule: 'rgba(0,0,0,0.55)',
    radius: 2,
    titleWeight: 700,
    bodyWeight: 500,
    titleLetter: -1.0,
    bodyLetter: 0,
    uppercaseLabels: true,
    isNan: true,
  },

  // 5 — Dark ink. Architectural folio.
  ink: {
    label: 'Folio Dark',
    desc: 'Dark mode, GT-style, single warm accent',
    fontMain: '"Inter", system-ui, sans-serif',
    fontMono: '"JetBrains Mono", monospace',
    bg: '#0F0F0E',
    surface: '#1A1A18',
    ink: '#ECEAE4',
    ink2: '#A8A49B',
    ink3: '#6E6A62',
    rule: '#2A2A26',
    accent: '#D97757',
    accentInk: '#0F0F0E',
    cellBg: '#1A1A18',
    cellRule: '#3A3A35',
    radius: 10,
    titleWeight: 500,
    bodyWeight: 400,
    titleLetter: -0.3,
    bodyLetter: 0,
    uppercaseLabels: true,
    isDark: true,
  },
};

// ─────────────────────────────────────────────────────────────
// Taxonomy (3 × 4 from CLAUDE.md)
// ─────────────────────────────────────────────────────────────
const KINDS = [
  { id: 'space', label: 'Space', hint: 'building, room, plaza' },
  { id: 'surface', label: 'Surface', hint: 'detail, material' },
  { id: 'page', label: 'Page', hint: 'flat, printed, drawn' },
];
const CONTEXTS = [
  { id: 'travel', label: 'Travel', short: 'TRV' },
  { id: 'exhibition', label: 'Exhibit', short: 'EXH' },
  { id: 'making', label: 'Making', short: 'MAK' },
  { id: 'reference', label: 'Ref', short: 'REF' },
];

// fake stock of recent items for the gallery
const STOCK = [
  { kind: 'space', context: 'travel', tone: 220 },
  { kind: 'surface', context: 'travel', tone: 35 },
  { kind: 'page', context: 'reference', tone: 50 },
  { kind: 'space', context: 'exhibition', tone: 200 },
  { kind: 'surface', context: 'making', tone: 15 },
  { kind: 'space', context: 'travel', tone: 195 },
  { kind: 'page', context: 'exhibition', tone: 40 },
  { kind: 'surface', context: 'travel', tone: 25 },
  { kind: 'space', context: 'making', tone: 210 },
];

// ─────────────────────────────────────────────────────────────
// Reusable photo-placeholder (striped, monospace caption)
// ─────────────────────────────────────────────────────────────
function PhotoPlaceholder({ tone = 30, label = '', v, style = {} }) {
  // hsl(tone, 8%, 60%)
  const a = `hsl(${tone}, 12%, ${v.isDark ? 22 : 76}%)`;
  const b = `hsl(${tone}, 12%, ${v.isDark ? 28 : 82}%)`;
  return (
    <div style={{
      background: `repeating-linear-gradient(45deg, ${a}, ${a} 8px, ${b} 8px, ${b} 16px)`,
      borderRadius: v.radius,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
      padding: 10, color: v.ink2, fontFamily: v.fontMono, fontSize: 10,
      letterSpacing: 0.06, textTransform: 'uppercase',
      border: `1px solid ${v.cellRule}`,
      ...style,
    }}>{label}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// Header / nav bar — minimal, app-style
// ─────────────────────────────────────────────────────────────
function AppHeader({ title, leading, trailing, v }) {
  const display = v.useDisplay ? v.fontDisplay : v.fontMain;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '52px 20px 14px', position: 'relative',
    }}>
      <div style={{ width: 44, display: 'flex', justifyContent: 'flex-start' }}>{leading}</div>
      <div style={{
        fontFamily: display, fontSize: 17, fontWeight: 500, color: v.ink,
        letterSpacing: v.bodyLetter, textAlign: 'center',
      }}>{title}</div>
      <div style={{ width: 44, display: 'flex', justifyContent: 'flex-end' }}>{trailing}</div>
    </div>
  );
}

function IconBtn({ children, onClick, v }) {
  return (
    <button onClick={onClick} style={{
      width: 36, height: 36, borderRadius: 999,
      background: 'transparent', border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: v.ink, cursor: 'pointer', padding: 0,
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────────────────────
function HomeView({ v, onCapture, onGallery }) {
  const display = v.useDisplay ? v.fontDisplay : v.fontMain;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: v.bg, color: v.ink,
    }}>
      <div style={{ paddingTop: 60, paddingLeft: 24, paddingRight: 24 }}>
        {v.isNan ? (
          <div style={{
            display: 'inline-block',
            background: '#000', color: v.bg,
            fontFamily: v.fontMain, fontSize: 22, fontWeight: 800,
            letterSpacing: -1.2, padding: '6px 12px 7px',
            lineHeight: 1,
          }}>archi</div>
        ) : (
          <div style={{
            fontFamily: v.fontMono, fontSize: 11, color: v.ink3,
            letterSpacing: v.uppercaseLabels ? 0.18 : 0.04,
            textTransform: v.uppercaseLabels ? 'uppercase' : 'none',
          }}>archi-archive</div>
        )}
        <div style={{
          fontFamily: display, fontSize: v.isNan ? 56 : 32, fontWeight: v.titleWeight,
          color: v.ink, letterSpacing: v.titleLetter, marginTop: v.isNan ? 18 : 4,
          lineHeight: 0.95,
        }}>Today</div>
        <div style={{
          fontFamily: v.fontMono, fontSize: 11, color: v.ink2,
          marginTop: v.isNan ? 12 : 4, letterSpacing: 0.04,
          textTransform: v.uppercaseLabels ? 'uppercase' : 'none',
        }}>Tue · 28 Apr · Sydney</div>
      </div>

      {/* recent strip */}
      <div style={{ padding: '32px 20px 0' }}>
        <div style={{
          fontFamily: v.fontMono, fontSize: 10, color: v.ink3,
          letterSpacing: 0.18, textTransform: v.uppercaseLabels ? 'uppercase' : 'none',
          marginBottom: 10,
        }}>Recent</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {STOCK.slice(0, 6).map((p, i) => (
            <PhotoPlaceholder key={i} tone={p.tone} v={v}
              style={{ aspectRatio: '1', padding: 0 }} />
          ))}
        </div>
      </div>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* primary CTA + browse */}
      <div style={{ padding: '0 20px 36px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={onCapture} style={{
          width: '100%', padding: '18px',
          background: v.accent, color: v.accentInk,
          border: 'none', borderRadius: v.radius === 0 ? 0 : 999,
          fontFamily: v.fontMain, fontSize: 17, fontWeight: 600,
          letterSpacing: v.bodyLetter, cursor: 'pointer',
        }}>Take photo</button>
        <button onClick={onGallery} style={{
          width: '100%', padding: '14px',
          background: 'transparent',
          color: v.ink2,
          border: `1px solid ${v.rule}`,
          borderRadius: v.radius === 0 ? 0 : 999,
          fontFamily: v.fontMain, fontSize: 15, fontWeight: 500,
          cursor: 'pointer',
        }}>Browse archive</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CAPTURE — photo + grid-sheet menu
// ─────────────────────────────────────────────────────────────
function CaptureView({ v, onSave, onCancel, photoTone }) {
  const [pick, setPick] = useState(null); // {kind, context}
  const display = v.useDisplay ? v.fontDisplay : v.fontMain;

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: v.bg, color: v.ink, position: 'relative',
    }}>
      {/* photo area */}
      <div style={{ flex: 1, padding: '52px 16px 0', display: 'flex' }}>
        <PhotoPlaceholder tone={photoTone} v={v}
          label="captured · 9:41"
          style={{ flex: 1, alignItems: 'flex-end' }} />
      </div>

      {/* bottom sheet */}
      <div style={{
        background: v.surface,
        borderTopLeftRadius: v.radius === 0 ? 0 : 24,
        borderTopRightRadius: v.radius === 0 ? 0 : 24,
        padding: '12px 18px 22px',
        marginTop: 14,
        boxShadow: v.isDark
          ? '0 -10px 30px rgba(0,0,0,0.4)'
          : `0 -1px 0 ${v.rule}, 0 -10px 28px rgba(0,0,0,0.06)`,
      }}>
        {/* grab handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: v.ink3, margin: '0 auto 10px',
        }} />

        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <div style={{
            fontFamily: display, fontSize: 17, fontWeight: 500,
            color: v.ink, letterSpacing: v.bodyLetter,
          }}>Tag this photo</div>
          <button onClick={onCancel} style={{
            background: 'transparent', border: 'none', color: v.ink2,
            fontFamily: v.fontMain, fontSize: 13, cursor: 'pointer', padding: 0,
          }}>Cancel</button>
        </div>

        {/* The grid: 3 kinds × 4 contexts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '64px repeat(4, 1fr)',
          gap: 4,
        }}>
          {/* context headers */}
          <div />
          {CONTEXTS.map(c => (
            <div key={c.id} style={{
              fontFamily: v.fontMono, fontSize: 10, color: v.ink2,
              letterSpacing: 0.18, textTransform: v.uppercaseLabels ? 'uppercase' : 'none',
              textAlign: 'center', padding: '4px 0',
            }}>{c.short}</div>
          ))}

          {/* rows */}
          {KINDS.map(k => (
            <React.Fragment key={k.id}>
              <div style={{
                fontFamily: display, fontSize: 14, fontWeight: 500,
                color: v.ink, alignSelf: 'center',
                letterSpacing: v.bodyLetter,
              }}>{k.label}</div>

              {CONTEXTS.map(c => {
                const active = pick && pick.kind === k.id && pick.context === c.id;
                return (
                  <button key={c.id}
                    onClick={() => setPick({ kind: k.id, context: c.id })}
                    style={{
                      aspectRatio: '1',
                      borderRadius: v.radius,
                      background: active ? v.accent : v.cellBg,
                      border: `1px solid ${active ? v.accent : v.cellRule}`,
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: 0,
                      transition: 'all 0.12s',
                    }}>
                    {active && (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 9l3.5 3.5L14 5.5" stroke={v.accentInk}
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* commit */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button onClick={onSave} style={{
            flex: 1, padding: '14px',
            background: 'transparent', color: v.ink2,
            border: `1px solid ${v.rule}`,
            borderRadius: v.radius === 0 ? 0 : 999,
            fontFamily: v.fontMain, fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
          }}>Save without tags</button>
          <button onClick={() => onSave(pick)}
            disabled={!pick}
            style={{
              flex: 1, padding: '14px',
              background: pick ? v.accent : v.rule,
              color: pick ? v.accentInk : v.ink3,
              border: 'none',
              borderRadius: v.radius === 0 ? 0 : 999,
              fontFamily: v.fontMain, fontSize: 14, fontWeight: 600,
              cursor: pick ? 'pointer' : 'default',
              letterSpacing: v.bodyLetter,
            }}>{pick ? `Save · ${KINDS.find(k=>k.id===pick.kind).label}/${CONTEXTS.find(c=>c.id===pick.context).label}` : 'Pick a tag'}</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────────────────
function GalleryView({ v, onBack, onOpen }) {
  const [filterKind, setFilterKind] = useState('all');
  const [filterCtx, setFilterCtx] = useState('all');
  const display = v.useDisplay ? v.fontDisplay : v.fontMain;

  const items = STOCK.filter(p =>
    (filterKind === 'all' || p.kind === filterKind) &&
    (filterCtx === 'all' || p.context === filterCtx)
  );

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: v.bg, color: v.ink, overflow: 'hidden',
    }}>
      {/* header */}
      <div style={{ padding: '52px 20px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
            color: v.ink, fontFamily: v.fontMain, fontSize: 15,
          }}>← Today</button>
          <div style={{
            fontFamily: v.fontMono, fontSize: 11, color: v.ink3,
            letterSpacing: 0.18, textTransform: 'uppercase',
          }}>{items.length} of {STOCK.length}</div>
        </div>
        <div style={{
          fontFamily: display, fontSize: 28, fontWeight: v.titleWeight,
          color: v.ink, letterSpacing: v.titleLetter, marginTop: 8,
          lineHeight: 1.1,
        }}>Archive</div>
      </div>

      {/* filters: two rows */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          fontFamily: v.fontMono, fontSize: 10, color: v.ink3,
          letterSpacing: 0.18, textTransform: 'uppercase', marginBottom: 6,
        }}>Kind</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {[{ id: 'all', label: 'All' }, ...KINDS].map(k => (
            <FilterChip key={k.id} v={v}
              active={filterKind === k.id}
              onClick={() => setFilterKind(k.id)}>{k.label}</FilterChip>
          ))}
        </div>
        <div style={{
          fontFamily: v.fontMono, fontSize: 10, color: v.ink3,
          letterSpacing: 0.18, textTransform: 'uppercase', marginBottom: 6,
        }}>Context</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[{ id: 'all', label: 'All' }, ...CONTEXTS].map(c => (
            <FilterChip key={c.id} v={v}
              active={filterCtx === c.id}
              onClick={() => setFilterCtx(c.id)}>{c.label}</FilterChip>
          ))}
        </div>
      </div>

      {/* grid */}
      <div style={{
        padding: '0 4px', flex: 1, overflowY: 'auto',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, alignContent: 'flex-start',
      }}>
        {items.map((p, i) => (
          <div key={i} onClick={() => onOpen(p)} style={{ position: 'relative', cursor: 'pointer' }}>
            <PhotoPlaceholder tone={p.tone} v={v}
              style={{ aspectRatio: '1', padding: 0, borderRadius: 0, border: 'none' }} />
            <div style={{
              position: 'absolute', top: 4, left: 4,
              padding: '2px 6px', background: 'rgba(0,0,0,0.55)',
              color: '#fff', fontFamily: v.fontMono, fontSize: 9,
              letterSpacing: 0.1, textTransform: 'uppercase',
              borderRadius: 2,
            }}>{KINDS.find(k => k.id === p.kind).label.slice(0,2)} · {CONTEXTS.find(c => c.id === p.context).short}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterChip({ children, active, onClick, v }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px',
      background: active ? v.accent : 'transparent',
      color: active ? v.accentInk : v.ink2,
      border: `1px solid ${active ? v.accent : v.rule}`,
      borderRadius: v.radius === 0 ? 0 : 999,
      fontFamily: v.fontMain, fontSize: 13, fontWeight: active ? 500 : 400,
      cursor: 'pointer', letterSpacing: v.bodyLetter,
    }}>{children}</button>
  );
}

// ─────────────────────────────────────────────────────────────
// SAVED toast / detail
// ─────────────────────────────────────────────────────────────
function SavedView({ v, onContinue, lastPick, photoTone }) {
  const display = v.useDisplay ? v.fontDisplay : v.fontMain;
  const k = lastPick && KINDS.find(x => x.id === lastPick.kind);
  const c = lastPick && CONTEXTS.find(x => x.id === lastPick.context);
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      background: v.bg, color: v.ink,
    }}>
      <div style={{ padding: '52px 20px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onContinue} style={{
          background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
          color: v.ink2, fontFamily: v.fontMain, fontSize: 15,
        }}>Done</button>
      </div>

      <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column' }}>
        <PhotoPlaceholder tone={photoTone} v={v}
          style={{ flex: 1, padding: 0, alignItems: 'flex-start', justifyContent: 'flex-end' }} />

        <div style={{ marginTop: 18 }}>
          <div style={{
            fontFamily: v.fontMono, fontSize: 10, color: v.ink3,
            letterSpacing: 0.18, textTransform: 'uppercase',
          }}>Saved</div>
          <div style={{
            fontFamily: display, fontSize: 22, fontWeight: v.titleWeight,
            color: v.ink, letterSpacing: v.titleLetter, marginTop: 4,
          }}>{k ? `${k.label} · ${c.label}` : 'Untagged'}</div>
          <div style={{
            fontFamily: v.fontMono, fontSize: 11, color: v.ink2,
            marginTop: 6, letterSpacing: 0.04,
          }}>9:41 · 28 Apr 2026 · Sydney</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT — manages screen state
// ─────────────────────────────────────────────────────────────
function ArchiApp({ variant = 'apple', variantOverride = null, initialScreen = 'home' }) {
  const v = variantOverride || VARIANTS[variant] || VARIANTS.apple;
  const [screen, setScreen] = useState(initialScreen);
  const [lastPick, setLastPick] = useState(initialScreen === 'saved' ? { kind: 'surface', context: 'travel' } : null);
  const [photoTone, setPhotoTone] = useState(35);

  const goCapture = () => {
    setPhotoTone(Math.floor(Math.random() * 360));
    setScreen('capture');
  };
  const goSave = (pick) => {
    setLastPick(pick || null);
    setScreen('saved');
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: v.bg, color: v.ink,
      fontFamily: v.fontMain,
    }}>
      {screen === 'home' && (
        <HomeView v={v}
          onCapture={goCapture}
          onGallery={() => setScreen('gallery')} />
      )}
      {screen === 'capture' && (
        <CaptureView v={v} photoTone={photoTone}
          onSave={goSave}
          onCancel={() => setScreen('home')} />
      )}
      {screen === 'saved' && (
        <SavedView v={v} lastPick={lastPick} photoTone={photoTone}
          onContinue={() => setScreen('home')} />
      )}
      {screen === 'gallery' && (
        <GalleryView v={v}
          onBack={() => setScreen('home')}
          onOpen={() => {}} />
      )}
    </div>
  );
}

window.ArchiApp = ArchiApp;
window.ARCHI_VARIANTS = VARIANTS;

// Per-instance accent override — used by the canvas to test 3 accent options
window.makeAppleVariant = (accent, label, desc, accentInk) => ({
  ...VARIANTS.apple,
  accent,
  accentInk: accentInk || VARIANTS.apple.accentInk,
  label,
  desc,
});

// Per-instance NaN-direction override — same DNA, different chartreuse shade.
window.makeNanVariant = (bg, label, desc) => ({
  ...VARIANTS.nan,
  bg,
  accentInk: bg, // chartreuse text on black "save" button stays in sync
  label,
  desc,
});
