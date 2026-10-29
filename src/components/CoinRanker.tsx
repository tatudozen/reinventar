import { Minus, Plus, Coins } from 'lucide-react';
import { cn } from '../lib/utils';

export interface CoinRankerItem {
  id: string;
  label: string;
  emoji?: string;
}

interface CoinRankerProps {
  items: CoinRankerItem[];
  values: Record<string, number>;
  totalCoins: number;
  onChange: (next: Record<string, number>) => void;
}

// Distribuição de moedas para forçar uma ordem de preferência entre itens já
// escolhidos. Total de moedas costuma ser (nº de itens + 1), garantindo que
// pelo menos um item receba mais que os outros.
export function CoinRanker({ items, values, totalCoins, onChange }: CoinRankerProps) {
  const used = Object.values(values).reduce((a, b) => a + (b || 0), 0);
  const left = totalCoins - used;

  const setValue = (id: string, delta: number) => {
    const current = values[id] || 0;
    const next = current + delta;
    if (next < 0) return;
    if (delta > 0 && left <= 0) return;
    const updated = { ...values, [id]: next };
    if (next === 0) delete updated[id];
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-4 text-sm font-mono">
        <Coins className="w-4 h-4 text-[var(--color-brand-500)]" />
        <span className="text-[var(--color-text-muted)]">
          <span className="font-bold text-[var(--neon-cyan)]">{left}</span> de {totalCoins} moedas para distribuir
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map(item => {
          const value = values[item.id] || 0;
          return (
            <div key={item.id}
              className={cn('flex items-center gap-3 rounded-xl border p-3 transition-all',
                value > 0
                  ? 'border-[var(--color-brand-400)] bg-[var(--glass)]'
                  : 'border-white/10 bg-[var(--glass)]')}>
              {item.emoji && <span className="text-xl shrink-0">{item.emoji}</span>}
              <span className="flex-1 text-sm font-medium text-[var(--text-main)] leading-tight">{item.label}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setValue(item.id, -1)}
                  disabled={value === 0}
                  aria-label={`Menos uma moeda em ${item.label}`}
                  className="w-7 h-7 rounded-full border border-[var(--color-brand-300)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--text-main)] hover:border-[var(--color-brand-500)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-mono font-bold tabular-nums" style={{ color: value > 0 ? 'var(--neon-cyan)' : 'var(--color-text-muted)' }}>
                  {value}
                </span>
                <button
                  onClick={() => setValue(item.id, +1)}
                  disabled={left <= 0}
                  aria-label={`Mais uma moeda em ${item.label}`}
                  className="w-7 h-7 rounded-full border border-[var(--color-brand-300)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--text-main)] hover:border-[var(--color-brand-500)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
