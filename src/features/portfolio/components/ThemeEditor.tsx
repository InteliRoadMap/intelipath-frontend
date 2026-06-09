import React from 'react';

interface ThemeEditorProps {
  primaryColor: string;
  titleColor: string;
  textColor: string;
  radius: string;
  headingFont: string;
  bodyFont: string;
  onChangeColor: (key: 'primaryColor' | 'titleColor' | 'textColor', color: string) => void;
  onChangeRadius: (radius: string) => void;
  onApplyPreset: (colors: { primaryColor: string; titleColor: string; textColor: string }) => void;
  onChangeFont: (key: 'heading' | 'body', font: string) => void;
}

const FONTS = [
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Outfit', value: "'Outfit', sans-serif" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Fira Code', value: "'Fira Code', monospace" }
];

const THEME_PRESETS = [
  { name: 'Midnight', colors: { primaryColor: '#a78bfa', titleColor: '#f8fafc', textColor: '#cbd5e1' } },
  { name: 'Ocean', colors: { primaryColor: '#38bdf8', titleColor: '#f0f9ff', textColor: '#bae6fd' } },
  { name: 'Forest', colors: { primaryColor: '#4ade80', titleColor: '#f0fdf4', textColor: '#bbf7d0' } }
];

const RADIUS_OPTIONS = [
  { label: 'Sharp', value: '0px' },
  { label: 'Rounded', value: '16px' },
  { label: 'Pill', value: '40px' }
];

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ 
  primaryColor, titleColor, textColor, radius, headingFont, bodyFont, onChangeColor, onChangeRadius, onApplyPreset, onChangeFont 
}) => {
  
  const ColorControl = ({ label, value, colorKey }: { label: string, value: string, colorKey: 'primaryColor'|'titleColor'|'textColor' }) => (
    <div className="mb-3">
      <label className="text-xs text-slate-400 block mb-1 uppercase tracking-wider font-semibold">{label}</label>
      <div className="flex items-center gap-2 bg-slate-900 rounded-lg p-1 border border-slate-700">
        <input 
          type="color" 
          value={value} 
          onChange={(e) => onChangeColor(colorKey, e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
        />
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChangeColor(colorKey, e.target.value)}
          className="bg-transparent text-sm font-mono text-slate-300 w-full outline-none px-2 uppercase"
        />
      </div>
    </div>
  );

  const FontControl = ({ label, value, fontKey }: { label: string, value: string, fontKey: 'heading'|'body' }) => (
    <div className="mb-3">
      <label className="text-xs text-slate-400 block mb-1 uppercase tracking-wider font-semibold">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChangeFont(fontKey, e.target.value)}
        className="w-full bg-slate-900 text-slate-300 text-sm rounded-lg p-2 border border-slate-700 outline-none"
      >
        {FONTS.map(f => (
          <option key={f.value} value={f.value}>{f.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed bottom-8 right-8 bg-slate-800 text-white p-5 rounded-2xl shadow-2xl z-50 border border-slate-700 w-72 max-h-[85vh] overflow-y-auto custom-scrollbar">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><i className="fas fa-paint-roller text-[var(--primary-color)]"></i> Theme Editor</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-bold border-b border-slate-700 pb-2 mb-3 text-slate-300">Color Presets</h4>
        <div className="flex gap-2">
          {THEME_PRESETS.map(preset => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset(preset.colors)}
              className="flex-1 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded-lg py-2 flex flex-col items-center gap-1 transition-colors"
              title={preset.name}
            >
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.colors.primaryColor }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.colors.titleColor }}></div>
              </div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-bold border-b border-slate-700 pb-2 mb-3 text-slate-300">Custom Colors</h4>
        <ColorControl label="Primary Accent" value={primaryColor} colorKey="primaryColor" />
        <ColorControl label="Title Color" value={titleColor} colorKey="titleColor" />
        <ColorControl label="Text Color" value={textColor} colorKey="textColor" />
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-bold border-b border-slate-700 pb-2 mb-3 text-slate-300">Layout Style</h4>
        <label className="text-xs text-slate-400 block mb-2 uppercase tracking-wider font-semibold">Border Radius</label>
        <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
          {RADIUS_OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => onChangeRadius(opt.value)}
              className={`flex-1 text-xs py-1.5 rounded-md font-semibold transition-colors ${radius === opt.value ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold border-b border-slate-700 pb-2 mb-3 text-slate-300">Typography</h4>
        <FontControl label="Heading Font" value={headingFont} fontKey="heading" />
        <FontControl label="Body Font" value={bodyFont} fontKey="body" />
      </div>
    </div>
  );
};
