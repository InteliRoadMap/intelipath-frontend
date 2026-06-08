import React from 'react';

interface ThemeEditorProps {
  primaryColor: string;
  titleColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  onChangeColor: (key: 'primaryColor' | 'titleColor' | 'textColor', color: string) => void;
  onChangeFont: (key: 'heading' | 'body', font: string) => void;
}

const FONTS = [
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Outfit', value: "'Outfit', sans-serif" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Playfair Display', value: "'Playfair Display', serif" },
  { label: 'Fira Code', value: "'Fira Code', monospace" }
];

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ 
  primaryColor, titleColor, textColor, headingFont, bodyFont, onChangeColor, onChangeFont 
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
    <div className="fixed bottom-8 right-8 bg-slate-800 text-white p-5 rounded-2xl shadow-2xl z-50 border border-slate-700 w-72">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><i className="fas fa-paint-roller text-primary-500"></i> Theme Editor</h3>
      
      <div className="mb-6">
        <h4 className="text-sm font-bold border-b border-slate-700 pb-2 mb-3 text-slate-300">Colors</h4>
        <ColorControl label="Primary Accent" value={primaryColor} colorKey="primaryColor" />
        <ColorControl label="Title Color" value={titleColor} colorKey="titleColor" />
        <ColorControl label="Text Color" value={textColor} colorKey="textColor" />
      </div>

      <div>
        <h4 className="text-sm font-bold border-b border-slate-700 pb-2 mb-3 text-slate-300">Typography</h4>
        <FontControl label="Heading Font" value={headingFont} fontKey="heading" />
        <FontControl label="Body Font" value={bodyFont} fontKey="body" />
      </div>
    </div>
  );
};
