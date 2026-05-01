// archi-app.jsx — design canvas
const { useState: useA } = React;

function Frame({ children }) {
  return (
    <IOSDevice width={390} height={844} dark>
      <div style={{position:'relative', width:'100%', height: 844, background:'#000'}}>
        {children}
      </div>
    </IOSDevice>
  );
}

function Note({ title, body }) {
  return (
    <div style={{
      padding: '16px 18px', maxWidth: 380,
      fontFamily: FONT,
      background: C.paper,
      borderRadius: 14,
      color: C.ink,
    }}>
      <div style={{fontSize: 16, fontWeight: 600, marginBottom: 6, letterSpacing:'-0.01em'}}>{title}</div>
      <div style={{fontSize: 14, lineHeight: 1.5, color: C.inkMuted}}>{body}</div>
    </div>
  );
}

// Lite-save toast — appears briefly after shutter when in Lite mode.
function LiteToast({ photo=PHOTO_BUILDING }) {
  return (
    <>
      <CameraReference typeId="building" lite />
      {/* dim photo */}
      <div style={{position:'absolute', inset:0, background:'rgba(0,0,0,0.18)', zIndex:14, pointerEvents:'none'}}/>
      {/* toast */}
      <div style={{
        position:'absolute', left:14, right:14, bottom:170, zIndex:15,
        background: C.mint, color: C.ink, borderRadius: 16,
        padding: '14px 18px',
        display:'flex', alignItems:'center', gap:14,
        fontFamily: FONT,
        boxShadow:'0 14px 38px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          width:42, height:42, borderRadius:8,
          backgroundImage:`url("${photo}")`, backgroundSize:'cover', backgroundPosition:'center',
          flexShrink:0,
        }}/>
        <div style={{flex:1}}>
          <div style={{fontSize:15, fontWeight:600, letterSpacing:'-0.01em'}}>Saved as building</div>
          <div style={{fontSize:13, color:'rgba(15,15,14,0.62)', fontWeight:500}}>Tag later in gallery</div>
        </div>
        <button style={{
          background: C.ink, color: '#fff', border:0,
          padding:'8px 14px', borderRadius:999, fontSize:13, fontWeight:600,
          fontFamily: FONT,
        }}>Tag now</button>
      </div>
    </>
  );
}

function App() {
  return (
    <DesignCanvas>
      {/* ============ SECTION 1 — CAMERA + LITE/FULL TOGGLE ============ */}
      <DCSection id="camera" title="01 · Camera — L/F toggle next to the shutter">
        <DCArtboard id="ref-full" label="Reference · Full mode (default)" width={420} height={900}>
          <Frame><CameraReference typeId="building" /></Frame>
        </DCArtboard>

        <DCArtboard id="ref-lite" label="Reference · Lite mode (L active)" width={420} height={900}>
          <Frame><CameraReference typeId="building" lite /></Frame>
        </DCArtboard>

        <DCArtboard id="lite-toast" label="After shutter in Lite — saved as building" width={420} height={900}>
          <Frame><LiteToast /></Frame>
        </DCArtboard>

        <DCArtboard id="proj-lite" label="Project · Lite — same toggle" width={420} height={900}>
          <Frame><CameraProject project="Villa Sora" count={23} lite/></Frame>
        </DCArtboard>

        <DCArtboard id="caption-1" label="Notes" width={420} height={620}>
          <div style={{padding: 22, height:'100%', overflow:'auto', background:'#0d0d0c'}}>
            <Note
              title="L / F toggle replaces the flip-camera button"
              body="A small segmented pill in the bottom-right where flip-camera used to sit. L = Lite (save with type only). F = Full (shutter → tagger). Always visible, one tap to switch. Flip-camera moves into the ⋯ menu — architecture photos are rear-camera 99% of the time anyway."
            />
            <div style={{height:10}}/>
            <Note
              title="Long-press shutter as a power shortcut"
              body="Optional: press-and-hold the shutter for a moment to skip the tagger this one time, regardless of L/F state. So even in Full mode you can sneak a quick shot when you're in a hurry."
            />
            <div style={{height:10}}/>
            <Note
              title="Lite-save toast — green, with 'Tag now' escape"
              body="In Lite, the shutter saves the photo and shows a green toast: 'Saved as building · Tag later in gallery'. A 'Tag now' button on the toast lets you change your mind for that one shot. The toast slides up for ~2.5s then dismisses."
            />
            <div style={{height:10}}/>
            <Note
              title="Untagged photos surface in the gallery"
              body="Lite-saved photos appear in a 'Needs tagging' strip at the top of the gallery. Tap any photo and you go straight to the one-page tagger. Batch tag mode = select N photos, tag them together."
            />
          </div>
        </DCArtboard>
      </DCSection>

      {/* ============ SECTION 2 — ONE-PAGE TAGGING ============ */}
      <DCSection id="tagger" title="02 · One-page tagger — type-aware, swatch grid">
        <DCArtboard id="building" label="Building · Typology + Concept (no materiality)" width={420} height={900}>
          <Frame><TaggerBuilding mode="reference" /></Frame>
        </DCArtboard>

        <DCArtboard id="element" label="Element · Element + Materiality + Concept" width={420} height={900}>
          <Frame><TaggerElement mode="reference" /></Frame>
        </DCArtboard>

        <DCArtboard id="building-proj" label="Building · Project mode (yellow check)" width={420} height={900}>
          <Frame><TaggerBuilding mode="project" /></Frame>
        </DCArtboard>

        <DCArtboard id="caption-2" label="Notes" width={420} height={780}>
          <div style={{padding: 22, height:'100%', overflow:'auto', background:'#0d0d0c'}}>
            <Note
              title="Tagger adapts to the type set in camera"
              body="Building → Typology + Concept + Author·Year. Element → Element + Materiality + Concept. Graphic → Concept + Author·Year only. Materiality stays where it belongs (on elements), and the building tagger gets to be calmer."
            />
            <div style={{height:10}}/>
            <Note
              title="2 rows × 4 columns — no horizontal scrolling"
              body="Each section is a fixed 2×4 grid of 70px tiles. All 8 typologies and all 8 concepts visible at once. If a taxonomy ever grows past 8, the 9th tile becomes a 'More…' tile that opens a sheet — but the common case stays scan-friendly."
            />
            <div style={{height:10}}/>
            <Note
              title="Concept count matches concept count"
              body="There are exactly 8 concepts (Form, Space, Light, Materiality, Structure, Context, Circulation, Craft), so 2×4 fits perfectly. Typology is currently 11 — 8 most-used surfaced as tiles, the rest behind a 'More' tile (or trim the list to 8 in the data model)."
            />
            <div style={{height:10}}/>
            <Note
              title="Author·Year"
              body="Single line input with hairline underline. Recent authors autosuggest above the keyboard."
            />
          </div>
        </DCArtboard>
      </DCSection>

      {/* ============ SECTION 3 — SYSTEM ============ */}
      <DCSection id="system" title="03 · Color + type system">
        <DCArtboard id="palette" label="Palette — green / yellow / red / paper / ink" width={780} height={420}>
          <div style={{padding:28, height:'100%', display:'flex', gap:14, fontFamily:FONT, background:'#0d0d0c'}}>
            <Swatch name="Green"  hex="#A8EFB7" ink={C.ink} sub="Reference (default)"/>
            <Swatch name="Yellow" hex="#F2E961" ink={C.ink} sub="Project (active)"/>
            <Swatch name="Red"    hex="#FF5A4D" ink="#fff"  sub="Save / commit only"/>
            <Swatch name="Paper"  hex="#F2EEE6" ink={C.ink} sub="Neutral surface"/>
            <Swatch name="Ink"    hex="#0F0F0E" ink="#F2EEE6" sub="Type & shell"/>
          </div>
        </DCArtboard>

        <DCArtboard id="type" label="Type — Inter only, sentence case" width={780} height={460}>
          <div style={{padding:32, height:'100%', background: C.paper, color: C.ink, fontFamily:FONT}}>
            <div style={{display:'grid', gridTemplateColumns:'140px 1fr', gap:'18px 24px', alignItems:'baseline'}}>
              <div style={{fontSize:13, color:C.inkMuted, fontWeight:500}}>L / F toggle</div>
              <div style={{fontSize:14, fontWeight:600, letterSpacing:'-0.005em'}}>L &nbsp;&nbsp; F</div>

              <div style={{fontSize:13, color:C.inkMuted, fontWeight:500}}>Toast title</div>
              <div style={{fontSize:15, fontWeight:600, letterSpacing:'-0.01em'}}>Saved as building</div>

              <div style={{fontSize:13, color:C.inkMuted, fontWeight:500}}>Section label</div>
              <div style={{fontSize:13, color:C.inkMuted, fontWeight:500}}>Typology · Concept · Materiality · Author</div>

              <div style={{fontSize:13, color:C.inkMuted, fontWeight:500}}>Pill</div>
              <div style={{fontSize:14, fontWeight:500, letterSpacing:'-0.005em'}}>Cultural</div>

              <div style={{fontSize:13, color:C.inkMuted, fontWeight:500}}>Save</div>
              <div style={{fontSize:16, fontWeight:600, letterSpacing:'-0.01em'}}>Save · 4 tags →</div>
            </div>

            <div style={{marginTop:28, paddingTop:18, borderTop:'1px solid rgba(15,15,14,0.12)'}}>
              <div style={{fontSize:14, color:C.inkMuted, lineHeight:1.55, maxWidth:600}}>
                Inter only — no JetBrains Mono, no uppercase. Weights: 400 / 500 / 600. Tighter tracking on display sizes. Sentence case everywhere.
              </div>
            </div>
          </div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

function Swatch({ name, hex, ink, sub }) {
  return (
    <div style={{
      flex:1,
      background: hex,
      color: ink,
      borderRadius: 14,
      padding: 18,
      display:'flex', flexDirection:'column', justifyContent:'space-between',
      minHeight: 240,
      border: hex === '#0F0F0E' ? '1px solid #2a2926' : 0,
    }}>
      <div>
        <div style={{fontSize: 18, fontWeight: 600, letterSpacing:'-0.01em'}}>{name}</div>
        <div style={{fontSize:13, marginTop:4, opacity:0.6, letterSpacing:'-0.005em'}}>{hex}</div>
      </div>
      <div style={{fontSize: 13, lineHeight: 1.45, opacity: 0.75}}>{sub}</div>
    </div>
  );
}

window.App = App;
