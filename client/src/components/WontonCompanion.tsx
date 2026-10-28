import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { AppLink } from './AppLink';
import { WontonSprite } from './WontonSprite';
import { appendStudentPreview, type StudentPreviewContext } from '../lib/studentPreview';

export function WontonCompanion({ previewContext }: { previewContext: StudentPreviewContext }) {
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [walking, setWalking] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (paused || open || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => setWalking(true), 18000);
    return () => window.clearInterval(interval);
  }, [paused, open]);
  useEffect(() => {
    if (!walking) return;
    const timer = window.setTimeout(() => setWalking(false), 3000);
    return () => window.clearTimeout(timer);
  }, [walking]);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <div className={`wonton-companion${walking && !paused && !open ? ' wonton-roaming' : ''}`} ref={root}>
    <button type="button" ref={trigger} className="wonton-trigger" aria-label="Wonton companion menu" aria-expanded={open} aria-controls="wonton-options" onPointerEnter={() => setGreeting(true)} onPointerLeave={() => setGreeting(false)} onFocus={() => setGreeting(true)} onBlur={() => setGreeting(false)} onClick={() => { setWalking(false); setOpen(value => !value); }}><WontonSprite paused={paused} mood={open || greeting ? 'wave' : walking ? 'walk' : 'idle'} /><span className="wonton-caption"><strong>Wonton</strong><small>Tap for a lunch break</small></span></button>
    {open && <div className="wonton-options" id="wonton-options"><div><strong>Ready for a lunch break?</strong><button type="button" aria-label="Close Wonton options" onClick={() => { setOpen(false); trigger.current?.focus(); }}><X size={16} /></button></div><AppLink href={appendStudentPreview('/study-hall/shsat/meals', previewContext)}>Uber Eats <ArrowRight size={16} /></AppLink><p>Choose your meal and send it to your teacher.</p><button type="button" onClick={() => setPaused(value => !value)}>{paused ? 'Resume Wonton animations' : 'Pause Wonton animations'}</button></div>}
  </div>;
}
