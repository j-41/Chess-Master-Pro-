import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { BoardTheme, PieceSet, AppTheme } from '../context/SettingsContext';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  
  const boardThemes: { id: BoardTheme; name: string; light: string; dark: string }[] = [
    { id: 'green', name: 'Green', light: '#eeeed2', dark: '#769656' },
    { id: 'brown', name: 'Brown', light: '#f0d9b5', dark: '#b58863' },
    { id: 'blue', name: 'Blue', light: '#dee3e6', dark: '#8ca2ad' },
    { id: 'purple', name: 'Purple', light: '#e8dff0', dark: '#9070a0' },
    { id: 'ice', name: 'Ice', light: '#e0f0ff', dark: '#7baed0' },
    { id: 'wood', name: 'Wood', light: '#e8c88a', dark: '#a67c52' },
    { id: 'marble', name: 'Marble', light: '#f0ece4', dark: '#b8b0a0' },
    { id: 'neon', name: 'Neon', light: '#1a1a2e', dark: '#16213e' },
  ];

  return (
    <div className="page-container" style={{ maxWidth: '800px', paddingBottom: 'var(--space-10)' }}>
      <h1 style={{ marginBottom: 'var(--space-6)' }}>Settings</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Appearance */}
        <section className="card" style={{ padding: 'var(--space-4)' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Appearance</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>App Theme</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button 
                  className={`btn ${settings.appTheme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => updateSettings({ appTheme: 'dark' })}
                >
                  Dark Mode
                </button>
                <button 
                  className={`btn ${settings.appTheme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => updateSettings({ appTheme: 'light' })}
                >
                  Light Mode
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>Board Theme</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 'var(--space-3)' }}>
                {boardThemes.map(theme => (
                  <div 
                    key={theme.id}
                    onClick={() => updateSettings({ boardTheme: theme.id, customBoardColors: null })}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 'var(--space-1)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gridTemplateRows: '1fr 1fr',
                      border: settings.boardTheme === theme.id ? '3px solid var(--accent-primary)' : '2px solid transparent',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <div style={{ backgroundColor: theme.light }} />
                      <div style={{ backgroundColor: theme.dark }} />
                      <div style={{ backgroundColor: theme.dark }} />
                      <div style={{ backgroundColor: theme.light }} />
                    </div>
                    <span style={{ fontSize: 'var(--fs-xs)', color: settings.boardTheme === theme.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {theme.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Audio */}
        <section className="card" style={{ padding: 'var(--space-4)' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Audio</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Sound Effects</div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>Play sounds for moves, captures, and checks</div>
              </div>
              <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
                <input 
                  type="checkbox" 
                  checked={settings.soundEnabled} 
                  onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: settings.soundEnabled ? 'var(--accent-primary)' : 'var(--bg-hover)',
                  transition: '.4s',
                  borderRadius: '24px',
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '16px',
                    width: '16px',
                    left: settings.soundEnabled ? '30px' : '4px',
                    bottom: '4px',
                    backgroundColor: 'white',
                    transition: '.4s',
                    borderRadius: '50%',
                  }} />
                </span>
              </label>
            </div>

            {settings.soundEnabled && (
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 'bold' }}>Volume</label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={settings.soundVolume} 
                  onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        </section>

        {/* Board Behavior */}
        <section className="card" style={{ padding: 'var(--space-4)' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Board Behavior</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Show Legal Moves</div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>Highlight possible squares when selecting a piece</div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.showLegalMoves} 
                onChange={(e) => updateSettings({ showLegalMoves: e.target.checked })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Show Coordinates</div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>Display ranks and files around the board</div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.showCoordinates} 
                onChange={(e) => updateSettings({ showCoordinates: e.target.checked })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Show Evaluation Bar</div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>Display engine evaluation next to the board</div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.showEvalBar} 
                onChange={(e) => updateSettings({ showEvalBar: e.target.checked })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Auto-Queen</div>
                <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>Automatically promote pawns to Queens</div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.autoQueen} 
                onChange={(e) => updateSettings({ autoQueen: e.target.checked })}
              />
            </div>

          </div>
        </section>

        <button 
          className="btn btn-ghost" 
          onClick={resetSettings}
          style={{ alignSelf: 'flex-start', color: 'var(--color-error)' }}
        >
          Reset All Settings
        </button>

      </div>
    </div>
  );
};

export default SettingsPage;
