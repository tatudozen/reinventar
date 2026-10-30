import { cn } from '../lib/utils';

export interface MedalItem {
  id: string;
  label: string;
  emoji?: string;
}

interface MedalPodiumProps {
  items: MedalItem[];
  // valor por item: 3 = ouro, 2 = prata, 1 = bronze, ausente = sem medalha
  values: Record<string, number>;
  onChange: (next: Record<string, number>) => void;
  maxMedals?: number; // padrão 3
}

const MEDALS: Record<number, { emoji: string; name: string; color: string }> = {
  3: { emoji: '🥇', name: 'Ouro',   color: '#eab308' },
  2: { emoji: '🥈', name: 'Prata',  color: '#94a3b8' },
  1: { emoji: '🥉', name: 'Bronze', color: '#d97706' },
};

// Pódio ordinal: toque num item para dar a próxima medalha livre (ouro → prata →
// bronze). Toque de novo num medalhado para liberar a medalha. Força preferência.
export function MedalPodium({ items, values, onChange, maxMedals = 3 }: MedalPodiumProps) {
  const cap = Math.min(maxMedals, items.length);

  const toggle = (id: string) => {
    const current = values[id] || 0;
    if (current > 0) {
      // remove a medalha deste item
      const next = { ...values };
      delete next[id];
      onChange(next);
      return;
    }
    // acha a maior medalha ainda livre (3,2,1) dentro do cap
    const used = new Set(Object.values(values));
    for (let m = 3; m >= 3 - cap + 1; m--) {
      if (!used.has(m)) {
        onChange({ ...values, [id]: m });
        return;
      }
    }
    // todas as medalhas já atribuídas: não faz nada
  };

  return (
    <div className="space-y-2.5">
      {items.map(item => {
        const medal = values[item.id] || 0;
        const info = MEDALS[medal];
        const allUsed = Object.keys(values).length >= cap;
        const dim = medal === 0 && allUsed;
        return (
          <button key={item.id} onClick={() => toggle(item.id)}
            className={cn('w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
              medal > 0
                ? 'border-[var(--color-brand-500)] bg-[var(--glass)] shadow-[var(--btn-shadow)]'
                : dim
                  ? 'border-white/10 bg-[var(--glass)] opacity-50'
                  : 'border-white/10 bg-[var(--glass)] hover:border-white/25')}>
            <span className="w-7 text-center text-xl shrink-0">
              {info ? info.emoji : (item.emoji ?? '•')}
            </span>
            <span className="flex-1 text-sm font-medium text-[var(--text-main)] leading-tight">{item.label}</span>
            {info && (
              <span className="text-[10px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                style={{ color: info.color, background: `${info.color}22`, border: `1px solid ${info.color}55` }}>
                {info.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
