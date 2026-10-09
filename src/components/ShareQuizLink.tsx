import { useState, useEffect } from 'react';
import { Share2, Check, Sparkles } from 'lucide-react';
import { supabase } from '../supabase';

interface ShareQuizLinkProps {
  jornadaId: string;
  homeUrl?: string;
}

export function ShareQuizLink({ jornadaId, homeUrl }: ShareQuizLinkProps) {
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const baseUrl = homeUrl && /^https?:\/\//.test(homeUrl) ? homeUrl.replace(/\/$/, '') : window.location.origin;
  const shareUrl = `${baseUrl}/?am_id=${encodeURIComponent(jornadaId)}`;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { count } = await supabase
          .from('jornadas')
          .select('id', { count: 'exact', head: true })
          .eq('referred_by', jornadaId);
        if (active && count) setReferralCount(count);
      } catch (error) {
        console.error('Error fetching referral count:', error);
      }
    })();
    return () => { active = false; };
  }, [jornadaId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Jornada Ikigai',
          text: 'Acabei de descobrir uma carreira que combina com o meu jeito de ser! Descubra a sua também:',
          url: shareUrl,
        });
        return;
      } catch {
        // usuário cancelou o share nativo — cai para o clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error('Error copying share link:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[var(--color-brand-50)] border border-[var(--color-brand-200)] rounded-xl p-5 text-center">
      <p className="text-sm font-medium text-[var(--text-main)] mb-1">
        Conhece alguém que precisa dessa clareza?
      </p>
      <p className="text-xs text-stone-500 mb-4">
        Compartilhe a Jornada e ajude um amigo a descobrir o próprio caminho.
      </p>
      <div className="flex items-center gap-2">
        <span className="flex-1 truncate px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-500 font-mono text-left">
          {shareUrl}
        </span>
        <button
          onClick={handleShare}
          className="shrink-0 px-4 py-2 bg-[var(--color-brand-600)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-brand-700)] transition-colors inline-flex items-center gap-1.5"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copiado!' : 'Compartilhar'}
        </button>
      </div>
      {referralCount > 0 && (
        <p className="mt-3 text-sm font-medium text-[var(--color-brand-700)] inline-flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          {referralCount === 1
            ? 'Você já inspirou 1 pessoa a começar a jornada!'
            : `Você já inspirou ${referralCount} pessoas a começarem a jornada!`}
        </p>
      )}
    </div>
  );
}
