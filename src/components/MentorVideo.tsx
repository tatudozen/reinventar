import React, { useState } from 'react';
import { Play, Video } from 'lucide-react';
import { useApp } from '../store';

interface MentorVideoProps {
  onComplete?: () => void;
  title?: string;
  description?: string;
  videoUrl?: string; // Add videoUrl prop
  videoId?: string;
}

export function getEmbedUrl(url: string | undefined, autoplay = true): string | undefined {
  if (!url) return undefined;
  try {
    // If it's just an id, or doesn't start with http, let it through or handle otherwise, but for now assuming full URLs
    if (!url.startsWith('http')) return url;

    const parsed = new URL(url);
    let videoId = '';

    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        return url;
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/')[2];
      } else if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v') || '';
      }
    } else if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.slice(1);
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;
    }
  } catch (e) {
    // Ignore invalid url errors
  }
  return url;
}

// Allowlist estrita do URL final antes de usá-lo como src de <iframe>.
// Evita passagem de valores arbitrários (data:/javascript:, iframes de phishing)
// vindos de admin_config para o sink — inclusive bypass tipo "youtube.com.evil.com".
export function isSafeEmbedUrl(url: string | undefined): boolean {
  if (!url) return false;
  try {
    const p = new URL(url);
    if (p.protocol !== 'https:') return false;
    const host = p.hostname.toLowerCase();
    if (host === 'player.vimeo.com') return true; // player embed do Vimeo
    const youtube = host === 'www.youtube.com' || host === 'youtube.com' || host === 'www.youtube-nocookie.com';
    return youtube && p.pathname.startsWith('/embed/');
  } catch {
    return false;
  }
}

export function MentorVideo({ onComplete, title = "Mensagem do Mentor", description = "Instruções da Missão", videoUrl: defaultVideoUrl, videoId }: MentorVideoProps) {
  const { state } = useApp();
  const guideId = state.guide || 'sabio';
  const [isPlaying, setIsPlaying] = useState(false);

  const configUrl = videoId ? state.adminConfig?.videoUrls?.[`${guideId}_${videoId}`] : undefined;
  const rawVideoUrl = configUrl || defaultVideoUrl;
  const embedUrl = getEmbedUrl(rawVideoUrl);
  const videoUrl = isSafeEmbedUrl(embedUrl) ? embedUrl : undefined;

  if (isPlaying && videoUrl) {
    return (
      <div className="relative w-full max-w-sm md:max-w-md mx-auto aspect-[9/16] border-2 border-[var(--color-brand-300)] rounded-xl overflow-hidden bg-black shadow-[var(--btn-shadow)] mb-8">
         <iframe 
           src={videoUrl}
           className="w-full h-full"
           title={title}
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowFullScreen
         ></iframe>
         {onComplete && (
           <button 
             onClick={onComplete}
             className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-[var(--color-brand-600)] text-[var(--bg-dark)] font-bold uppercase tracking-wider text-xs rounded shadow-lg hover:opacity-90 z-20"
           >
             Continuar
           </button>
         )}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm md:max-w-md mx-auto aspect-[9/16] border-2 border-[var(--color-brand-300)] rounded-xl overflow-hidden bg-[var(--bg-dark)] shadow-[var(--btn-shadow)] flex items-center justify-center group mb-8">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 grayscale group-hover:grayscale-0 transition-all duration-700" 
        style={{ backgroundImage: `url(/guides/${guideId}.png?v=1)` }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      
      <div className="z-10 flex flex-col items-center text-center p-6 mt-12">
        <div 
          onClick={videoUrl ? () => setIsPlaying(true) : onComplete}
          className="w-16 h-16 rounded-full bg-[var(--glass)] border border-[var(--color-brand-400)] flex items-center justify-center mb-4 text-[var(--neon-cyan)] shadow-lg cursor-pointer hover:scale-110 transition-transform"
        >
          <Play fill="currentColor" className="w-6 h-6 ml-1" />
        </div>
        <h3 className="text-xl font-bold font-serif text-[var(--text-main)] mb-1">{title}</h3>
        <p className="text-[var(--color-text-muted)] text-sm mb-6 max-w-[250px]">{description}</p>
        
        {onComplete && (
          <button 
            onClick={onComplete}
            className="px-6 py-2 bg-[var(--color-brand-600)] text-[var(--bg-dark)] font-bold uppercase tracking-wider text-xs rounded shadow-[var(--btn-shadow)] hover:opacity-90"
          >
            Pular Vídeo
          </button>
        )}
      </div>
      
      <div className="absolute top-4 left-4 flex gap-2">
         <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
         <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">REC</span>
      </div>
      <div className="absolute bottom-4 right-4 opacity-50">
        <Video className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}
