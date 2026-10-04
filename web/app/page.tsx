// Simple landing page - Phase 0 placeholder
// Run with: cd web && npm install && npm run dev
export default function Home() {
  return (
    <main style={{ background: '#FFFDF7', minHeight: '100vh', padding: 40, fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ color: '#1A1A1A' }}>Bible Journey</h1>
      <p style={{ color: '#6B7280', fontSize: 18 }}>Read the Bible. Understand the Bible. Remember the Bible.</p>
      <div style={{ background: 'white', borderRadius: 16, padding: 24, marginTop: 24, maxWidth: 500 }}>
        <h3>Your guided journey through the Bible</h3>
        <p>Day 1 / 365 - Genesis 1-3 - 15 min</p>
        <button style={{ background: '#2B4C7E', color: 'white', padding: '14px 24px', borderRadius: 12, border: 0, fontSize: 16 }}>
          Start Reading
        </button>
      </div>
      <p style={{ marginTop: 24, color: '#6B7280' }}>Phase 0: Landing placeholder. App is in /app folder with Expo.</p>
    </main>
  );
}
