import { TipWidget } from './components/TipWidget';

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient blobs */}
      <div style={{
        position: 'absolute', top: '15%', left: '15%',
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 700, height: 700,
        background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 1100, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, color: 'white', lineHeight: 1.1, margin: '0 0 1.5rem 0', letterSpacing: '-0.03em' }}>
            Micro-Tipping<br />
            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              with Arc.
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.125rem', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
            A live tipping experience powered by Arc Network. Sub-second finality and gasless interactions for your community.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TipWidget />
        </div>
      </div>
    </div>
  );
}

export default App;
