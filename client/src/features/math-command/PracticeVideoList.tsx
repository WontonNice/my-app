import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, X } from 'lucide-react';
import { youtubeVideoId, type PracticeVideo } from '../../../../server/src/shared/practiceCatalog';

export function videoViewsLabel(views: number): string {
  return `${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(views)} views`;
}

export function videoPublishedLabel(date: string, now = Date.now()): string {
  const timestamp = new Date(`${date}T00:00:00Z`).getTime();
  if (!Number.isFinite(timestamp)) return '';
  const days = Math.floor((now - timestamp) / 86400000);
  if (days < 0) return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(timestamp);
  if (days === 0) return 'Today';
  const [value, unit] = days >= 365 ? [Math.floor(days / 365), 'year'] as const
    : days >= 30 ? [Math.floor(days / 30), 'month'] as const
    : days >= 7 ? [Math.floor(days / 7), 'week'] as const : [days, 'day'] as const;
  return new Intl.RelativeTimeFormat('en-US', { numeric: 'always' }).format(-value, unit);
}

export function youtubeEmbedUrl(value: string): string | null {
  const key = youtubeVideoId(value);
  return key ? `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&rel=0&playsinline=1` : null;
}

export function PracticeVideoPlayer({ video, onClose }: { video: PracticeVideo; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const src = youtubeEmbedUrl(video.url);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !src) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = overflow; };
  }, [src]);
  if (!src) return null;
  return <dialog ref={dialogRef} className="math-study-video-dialog" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <header><h2 id={titleId}>{video.title}</h2><button type="button" aria-label="Close video" onClick={onClose} autoFocus><X size={20} aria-hidden="true"/></button></header>
    <iframe src={src} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" sandbox="allow-scripts allow-same-origin allow-presentation" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>
    {video.channelTitle && <p>{video.channelTitle}</p>}
  </dialog>;
}

function VideoRow({ video, onPlay }: { video: PracticeVideo; onPlay: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  const key = youtubeVideoId(video.url);
  const metadata = [video.viewCount === undefined ? '' : videoViewsLabel(video.viewCount), video.publishedAt ? videoPublishedLabel(video.publishedAt) : ''].filter(Boolean);
  return <article className="math-study-video-row">
    <button className="math-study-video-card" type="button" onClick={onPlay} disabled={!key} aria-label={`Play ${video.title}`}>
      <span className="math-study-video-thumbnail">
        {key && !imageFailed ? <img src={`https://i.ytimg.com/vi/${key}/mqdefault.jpg`} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setImageFailed(true)}/> : <Play size={28} aria-hidden="true"/>}
        {video.duration && <span className="math-study-video-duration">{video.duration}</span>}
      </span>
      <span className="math-study-video-details">
        <strong className="math-study-video-title">{video.title}</strong>
        <span className="math-study-video-channel">{video.channelTitle || 'YouTube'}</span>
        {metadata.length > 0 && <span className="math-study-video-metadata"><Play size={11} aria-hidden="true"/>{metadata.join(' · ')}</span>}
        {video.description && <span className="math-study-video-description">{video.description}</span>}
      </span>
    </button>
  </article>;
}

export function PracticeVideoList({ videos }: { videos: PracticeVideo[] }) {
  const [activeVideo, setActiveVideo] = useState<PracticeVideo | null>(null);
  return <><div className="math-study-modules math-study-videos" role="region" aria-label="YouTube video references" tabIndex={0}>
    {videos.map(video => <VideoRow video={video} key={video.id} onPlay={() => setActiveVideo(video)}/>)}
  </div>{activeVideo && createPortal(<PracticeVideoPlayer video={activeVideo} onClose={() => setActiveVideo(null)}/>, document.body)}</>;
}
