import { useRef, useState } from 'react';
import { IconImage, IconX, IconCamera, IconCheck } from './Icons';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  compact?: boolean;
}

export function ImageUpload({ value, onChange, label = 'إضافة صورة', compact = false }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'none' | 'url' | 'file'>('none');
  const [urlInput, setUrlInput] = useState(value || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setMode('none');
    }
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
    setMode('none');
    if (fileRef.current) fileRef.current.value = '';
  };

  if (value) {
    return (
      <div className="relative">
        <img src={value} alt="preview" className={`w-full ${compact ? 'h-32' : 'h-44'} object-cover rounded-2xl border border-border-light`} />
        <button onClick={clearImage}
          className="absolute top-2 left-2 w-8 h-8 bg-danger text-white rounded-xl flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors">
          <IconX size={14} />
        </button>
      </div>
    );
  }

  if (mode === 'none') {
    return (
      <div className="flex gap-2">
        <button onClick={() => fileRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border-light bg-surface text-text-secondary text-xs font-bold hover:bg-primary-50 hover:text-primary hover:border-primary-100 transition-all">
          <IconCamera size={16} />
          <span>من الجهاز</span>
        </button>
        <button onClick={() => setMode('url')}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border-light bg-surface text-text-secondary text-xs font-bold hover:bg-primary-50 hover:text-primary hover:border-primary-100 transition-all">
          <IconImage size={16} />
          <span>رابط URL</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        {!compact && <span className="sr-only">{label}</span>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="flex-1 px-4 py-3 rounded-2xl border border-border-light text-sm bg-surface focus:border-primary focus:outline-none" dir="ltr" />
        <button onClick={handleUrlSubmit}
          className="px-4 py-3 rounded-2xl gradient-primary text-white text-xs font-bold">
          <IconCheck size={16} />
        </button>
        <button onClick={() => { setMode('none'); setUrlInput(''); }}
          className="px-3 py-3 rounded-2xl bg-surface text-text-secondary border border-border-light text-xs">
          <IconX size={16} />
        </button>
      </div>
    </div>
  );
}
