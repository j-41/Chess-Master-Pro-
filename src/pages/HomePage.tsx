import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRandomPuzzle } from '../engine/puzzles';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { state: auth } = useAuth();
  
  const dailyPuzzle = getRandomPuzzle(1000, 1500);

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Hero Section */}
      <section style={{ 
        display: 'flex', 
        gap: 'var(--space-6)', 
        alignItems: 'center',
        background: 'var(--bg-elevated)',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 'var(--fs-4xl)', marginBottom: 'var(--space-2)' }}>
            Play Chess Online <br/>
            <span style={{ color: 'var(--accent-primary)' }}>on the #1 Site!</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--fs-lg)', marginBottom: 'var(--space-6)' }}>
            Play with friends or challenge the computer. Improve your game with puzzles and deep analysis.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button 
              className="btn btn-primary btn-lg" 
              style={{ fontSize: 'var(--fs-xl)' }}
              onClick={() => navigate('/play')}
            >
              ♟️ Play Online
            </button>
            <button 
              className="btn btn-secondary btn-lg"
              style={{ fontSize: 'var(--fs-xl)' }}
              onClick={() => navigate('/play')}
            >
              🤖 Play Computer
            </button>
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '400px', 
            aspectRatio: '1/1',
            background: 'url(/board-preview.png) center/cover',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            backgroundColor: 'var(--bg-tertiary)', /* Fallback */
          }} />
        </div>
      </section>

      {/* Quick Play & Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        
        {/* Play Card */}
        <div className="card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            ⚡ Quick Play
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/play', { state: { timeControl: '1+0', mode: 'ai', difficulty: 10, color: 'random' } })}>1 min Bullet</button>
            <button className="btn btn-secondary" onClick={() => navigate('/play', { state: { timeControl: '3+0', mode: 'ai', difficulty: 12, color: 'random' } })}>3 min Blitz</button>
            <button className="btn btn-secondary" onClick={() => navigate('/play', { state: { timeControl: '5+0', mode: 'ai', difficulty: 12, color: 'random' } })}>5 min Blitz</button>
            <button className="btn btn-secondary" onClick={() => navigate('/play', { state: { timeControl: '10+0', mode: 'ai', difficulty: 15, color: 'random' } })}>10 min Rapid</button>
          </div>
        </div>

        {/* Puzzle Card */}
        <div className="card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            🧩 Daily Puzzle
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Test your tactical vision with today's selected puzzle.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              onClick={() => navigate('/puzzles')}
            >
              Solve Puzzle
            </button>
          </div>
        </div>

        {/* Stats Card (if logged in) */}
        {auth.isLoggedIn && auth.currentUser && (
          <div className="card" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              📊 Your Stats
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>Rapid Rating</span>
              <span style={{ fontWeight: 'bold' }}>{auth.currentUser.rating}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-light)' }}>
              <span>Games Played</span>
              <span style={{ fontWeight: 'bold' }}>{auth.currentUser.gamesPlayed}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0' }}>
              <span>Win/Loss/Draw</span>
              <span style={{ fontWeight: 'bold' }}>
                <span style={{ color: 'var(--color-success)' }}>{auth.currentUser.wins}</span> / 
                <span style={{ color: 'var(--color-error)' }}> {auth.currentUser.losses}</span> / 
                <span style={{ color: 'var(--text-secondary)' }}> {auth.currentUser.draws}</span>
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HomePage;
