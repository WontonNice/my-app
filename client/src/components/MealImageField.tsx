import { useId, useRef, useState } from 'react';
import { ClipboardPaste, ImagePlus, X } from 'lucide-react';

async function resizeMealImage(file: Blob): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Choose a JPG, PNG, or WebP image.');
  if (file.size > 15 * 1024 * 1024) throw new Error('Choose an image smaller than 15 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    const ratio = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * ratio)); canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image processing is unavailable. Try another browser.');
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.85, 0.7, 0.5, 0.3]) {
      const image = canvas.toDataURL('image/jpeg', quality);
      if (image.length <= 180000) return image;
    }
    throw new Error('This image is too detailed. Crop it or choose a smaller image.');
  } finally { bitmap.close(); }
}

export function MealImageField({ label, value, onChange, onBusyChange }: { label: string; value: string; onChange: (image: string) => void; onBusyChange: (busy: boolean) => void }) {
  const id = useId(); const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function load(file: Blob) {
    setBusy(true); onBusyChange(true); setError('');
    try { onChange(await resizeMealImage(file)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not read this image.'); }
    finally { setBusy(false); onBusyChange(false); }
  }
  async function paste() {
    setError('');
    try {
      if (!navigator.clipboard?.read) throw new Error('Click this image area and press Ctrl+V (or ⌘V) to paste.');
      const items = await navigator.clipboard.read();
      for (const item of items) { const type = item.types.find(type => ['image/png', 'image/jpeg', 'image/webp'].includes(type)); if (type) { await load(await item.getType(type)); return; } }
      throw new Error('Copy an image first, then paste it here.');
    } catch (reason) { setError(reason instanceof Error && reason.name !== 'NotAllowedError' ? reason.message : 'Clipboard access was not granted. Click this area and press Ctrl+V (or ⌘V), or upload a file.'); }
  }
  return <div className="meal-image-field" tabIndex={0} role="group" aria-labelledby={id} onPaste={event => {
    const item = Array.from(event.clipboardData.items).find(item => item.type.startsWith('image/'));
    if (item && !busy) { event.preventDefault(); const file = item.getAsFile(); if (file) void load(file); }
  }}>
    <span id={id} className="meal-field-label">{label}</span>
    <div className="meal-image-preview">{value ? <img src={value} alt={label} /> : <span><ImagePlus size={26} /> Add a photo</span>}</div>
    <input ref={fileInput} className="meal-file-input" aria-label={`Upload ${label}`} type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={event => { const file = event.target.files?.[0]; if (file) void load(file); event.target.value = ''; }} />
    <div className="meal-image-actions"><button type="button" disabled={busy} onClick={() => fileInput.current?.click()}><ImagePlus size={16} />Upload</button><button type="button" disabled={busy} onClick={() => void paste()}><ClipboardPaste size={16} />Paste</button>{value && <button type="button" disabled={busy} aria-label={`Remove ${label}`} onClick={() => onChange('')}><X size={16} /></button>}</div>
    <small>{busy ? 'Preparing image…' : 'Or click here and press Ctrl+V / ⌘V.'}</small>
    {error && <p role="alert" className="meal-image-error">{error}</p>}
  </div>;
}
