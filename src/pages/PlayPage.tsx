import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlayPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<'ai' | 'local'>('ai');
  const [timeControl, setTimeControl] = useState('10+0');
  const [difficulty, setDifficulty] = useState(10);
  const [color, setColor] = useState<'w' | 'b' | 'random'>('random');

  const handleStartGame = () => {
    navigate('/game', {
      state: {
        mode,
        timeControl,
        difficulty,
        color,
      }
    });
  };

  const timeControls = [
    { label: 'Bullet', options: ['1+0', '2+1'] },
    { label: 'Blitz', options: ['3+0', '3+2', '5+0'] },
    { label: 'Rapid', options: ['10+0', '15+10', '30+0'] },
  ];

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 'var(--space-10)' }}>
      
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}>
        <h1 style={{ textAlign: 'center', margin: 0, fontSize: 'var(--fs-2xl)' }}>
          Play Chess
        </h1>

        {/* Mode Selection */}
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>Game Mode</label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button 
              className={`btn ${mode === 'ai' ? 'btn-primary' : 'btn-secondary'}`} 
              style={{ flex: 1 }}
              onClick={() => setMode('ai')}
            >
              🤖 Vs Computer
            </button>
            <button 
              className={`btn ${mode === 'local' ? 'btn-primary' : 'btn-secondary'}`} 
              style={{ flex: 1 }}
              onClick={() => setMode('local')}
            >
              👥 Local Play
            </button>
          </div>
        </div>

        {/* Time Control Selection */}
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>Time Control</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {timeControls.map(group => (
              <div key={group.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ width: '60px', color: 'var(--text-secondary)' }}>{group.label}</span>
                <div style={{ display: 'flex', gap: 'var(--space-2)', flex: 1 }}>
                  {group.options.map(tc => (
                    <button 
                      key={tc}
                      className={`btn ${timeControl === tc ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: 'var(--space-2)' }}
                      onClick={() => setTimeControl(tc)}
                    >
                      {tc}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Difficulty (if mode is AI) */}
        {mode === 'ai' && (
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>
              <span>AI Difficulty</span>
              <span style={{ color: 'var(--accent-primary)' }}>Level {difficulty}</span>
            </label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={difficulty} 
              onChange={(e) => setDifficulty(parseInt(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: 'var(--fs-sm)', marginTop: 'var(--space-1)' }}>
              <span>Beginner (400)</span>
              <span>Master (2800+)</span>
            </div>
          </div>
        )}

        {/* Color Selection */}
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>Play As</label>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button 
              className={`btn ${color === 'w' ? 'btn-primary' : 'btn-secondary'}`} 
              style={{ flex: 1, fontSize: 'var(--fs-xl)' }}
              onClick={() => setColor('w')}
              title="White"
            >
              ♔
            </button>
            <button 
              className={`btn ${color === 'random' ? 'btn-primary' : 'btn-secondary'}`} 
              style={{ flex: 1, fontSize: 'var(--fs-xl)' }}
              onClick={() => setColor('random')}
              title="Random"
            >
              🎲
            </button>
            <button 
              className={`btn ${color === 'b' ? 'btn-primary' : 'btn-secondary'}`} 
              style={{ flex: 1, fontSize: 'var(--fs-xl)' }}
              onClick={() => setColor('b')}
              title="Black"
            >
              ♚
            </button>
          </div>
        </div>

        <button 
          className="btn btn-primary btn-lg" 
          style={{ width: '100%', marginTop: 'var(--space-2)' }}
          onClick={handleStartGame}
        >
          Play
        </button>

      </div>
    </div>
  );
};

export default PlayPage;
