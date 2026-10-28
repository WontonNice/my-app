import '../styles/wonton-pet.css';

export function WontonSprite({ mood = 'idle', paused = false }: { mood?: 'idle' | 'wave' | 'walk'; paused?: boolean }) {
  return <span className={`wonton-pet wonton-pet--${mood}${paused ? ' wonton-pet--paused' : ''}`} aria-hidden="true"><span className="wonton-pet-shadow" /><span className="wonton-pet-frames" /></span>;
}
