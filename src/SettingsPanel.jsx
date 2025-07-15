import React, { useState } from "react";

const SettingsPanel = ({ settings, onSettingsChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const colorblindPalettes = {
    default: {
      male: '#2196F3',
      female: '#E91E63',
      neutral: '#9E9E9E'
    },
    protanopia: {
      male: '#1976D2',
      female: '#FF9800',
      neutral: '#9E9E9E'
    },
    deuteranopia: {
      male: '#1976D2',
      female: '#FF9800',
      neutral: '#9E9E9E'
    },
    tritanopia: {
      male: '#E91E63',
      female: '#4CAF50',
      neutral: '#9E9E9E'
    }
  };
  
  const handleColorPaletteChange = (palette) => {
    onSettingsChange({
      ...settings,
      colorPalette: palette,
      colors: colorblindPalettes[palette]
    });
  };
  
  const handleSettingChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };
  
  return (
    <div style={{ position: 'fixed', top: '100px', right: '20px', zIndex: 10000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#fff',
          border: '2px solid #ddd',
          borderRadius: '8px',
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        ⚙️ Settings
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '45px',
          right: '0',
          background: '#fff',
          border: '2px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          minWidth: '280px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          zIndex: 10001
        }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
            Accessibility Options
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Color Palette:
            </label>
            <select
              value={settings.colorPalette}
              onChange={(e) => handleColorPaletteChange(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="default">Default (Blue/Pink)</option>
              <option value="protanopia">Protanopia Friendly</option>
              <option value="deuteranopia">Deuteranopia Friendly</option>
              <option value="tritanopia">Tritanopia Friendly</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.showDeathIcons}
                onChange={(e) => handleSettingChange('showDeathIcons', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Show death icons (✕)
            </label>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.showBirthIcons}
                onChange={(e) => handleSettingChange('showBirthIcons', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Show birth icons (★)
            </label>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.showDeceasedBanner}
                onChange={(e) => handleSettingChange('showDeceasedBanner', e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Show deceased banner
            </label>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Edge Style:
            </label>
            <select
              value={settings.edgeStyle}
              onChange={(e) => handleSettingChange('edgeStyle', e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              <option value="smoothstep">Smooth Step</option>
              <option value="straight">Straight</option>
              <option value="step">Step</option>
              <option value="bezier">Bezier</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '0' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Font Size:
            </label>
            <input
              type="range"
              min="10"
              max="20"
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
              style={{ width: '100%', marginBottom: '4px' }}
            />
            <div style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>
              {settings.fontSize}px
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;