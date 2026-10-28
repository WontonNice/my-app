import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { AppLink } from './AppLink';
import { appendStudentPreview, type StudentPreviewContext } from '../lib/studentPreview';

export function WontonCompanion({ previewContext }: { previewContext: StudentPreviewContext }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); } };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape); };
  }, [open]);
  return <div className="wonton-companion" ref={root}>
    <button type="button" ref={trigger} className="wonton-trigger" aria-expanded={open} aria-controls="wonton-options" onClick={() => setOpen(value => !value)}><img src="/images/wontonrobot.png" alt="" width="96" height="96" /><span><strong>Meet Wonton</strong><small>Your classroom companion</small></span></button>
    {open && <div className="wonton-options" id="wonton-options"><div><strong>Ready for a lunch break?</strong><button type="button" aria-label="Close Wonton options" onClick={() => { setOpen(false); trigger.current?.focus(); }}><X size={16} /></button></div><AppLink href={appendStudentPreview('/study-hall/shsat/meals', previewContext)}>Uber Eats <ArrowRight size={16} /></AppLink><p>Choose your meal and send it to your teacher.</p></div>}
  </div>;
}
