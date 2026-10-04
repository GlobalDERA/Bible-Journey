'use client';
// Interactive landing - every button works. No dead clicks.
import { useState } from 'react';

const PLANS: Record<string, string> = {
  '90 days': 'Day 1 / 90 - Genesis 1-13 - ~50 min',
  '180 days': 'Day 1 / 180 - Genesis 1-7 - ~28 min',
  '365 days': 'Day 1 / 365 - Genesis 1-3 - ~15 min',
};

export default function Home() {
  const [plan, setPlan] = useState('365 days');
  const [started, setStarted] = useState(false);

  return (
    <main style={{ background: '#FFFDF7', minHeight: '100vh', padding: 40, fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <a href="#journey" style={{ color: '#2B4C7E', fontWeight: 700 }}>Journey</a>
        <a href="#features" style={{ color: '#2B4C7E', fontWeight: 700 }}>Features</a>
        <a href="https://github.com/globaldera/bible-journey" target="_blank" style={{ color: '#2B4C7E', fontWeight: 700 }}>GitHub →</a>
      </nav>

      <h1 style={{ color: '#1A1A1A' }}>Bible Journey</h1>
      <p style={{ color: '#6B7280', fontSize: 18 }}>Read the Bible. Understand the Bible. Remember the Bible.</p>

      <div id="journey" style={{ background: 'white', borderRadius: 16, padding: 24, marginTop: 24, maxWidth: 560 }}>
        <h3>Your guided journey through the Bible</h3>
        <p>{PLANS[plan]}</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {Object.keys(PLANS).map((p) => (
            <button
              key={p}
              onClick={() => { setPlan(p); setStarted(false); }}
              style={{
                padding: '10px 16px', borderRadius: 10, border: plan === p ? '2px solid #2B4C7E' : '1px solid #E5E7EB',
                background: plan === p ? '#2B4C7E' : 'white', color: plan === p ? 'white' : '#1A1A1A', cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={() => setStarted(true)}
          style={{ background: '#2B4C7E', color: 'white', padding: '14px 24px', borderRadius: 12, border: 0, fontSize: 16, cursor: 'pointer' }}
        >
          Start Reading
        </button>
        {started && (
          <div style={{ marginTop: 16, background: '#E8F5E9', borderRadius: 10, padding: 12 }}>
            <strong>Day 1 ready:</strong> {PLANS[plan]}.
            <br />
            Full app with audio, study &amp; catch-up runs on phone via Expo Go. See GitHub README to run `app/`.
          </div>
        )}
      </div>

      <div id="features" style={{ marginTop: 24, maxWidth: 560 }}>
        <h3>What is inside</h3>
        <ul style={{ color: '#1A1A1A', lineHeight: 1.8 }}>
          <li>📖 Flexible 90 / 180 / 365-day plans</li>
          <li>💛 Catch Me Up when you miss days</li>
          <li>🔍 Study: people, places, themes</li>
          <li>🎧 Human audio + TTS fallback</li>
        </ul>
        <a href="https://github.com/globaldera/bible-journey" target="_blank">
          <button style={{ background: 'white', border: '1px solid #2B4C7E', color: '#2B4C7E', padding: '12px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>
            View code on GitHub →
          </button>
        </a>
      </div>
    </main>
  );
}
