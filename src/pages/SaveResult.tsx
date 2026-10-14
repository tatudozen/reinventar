import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Leaf } from 'lucide-react';
import { useApp } from '../store';
import { supabase } from '../supabase';

export default function SaveResult() {
  const navigate = useNavigate();
  const { state, setUserData } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || submitting) return;

    setSubmitting(true);
    setUserData(name, email, phone);

    const id = Date.now().toString(36);
    localStorage.setItem('reinventar_jornada_id', id);

    const refId = localStorage.getItem('reinventar_ref');

    const phase_data = {
      phase1: state.phase1,
      phase2: state.phase2,
      phase3: state.phase3,
      phase4: state.phase4,
      phase5: state.phase5,
      phase6: state.phase6,
      phase7: state.phase7,
      phase8: state.phase8,
    };

    // Webhook fire-and-forget — não bloqueia a navegação se falhar
    fetch('https://services.leadconnectorhq.com/hooks/AGisM9u9lfUGWGM6q5bE/webhook-trigger/5cd1715e-a3ac-4016-9f33-ad21ecedebb1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        phone: phone || '',
        guide: state.guide,
        xp: state.xp,
        completed_phases: state.completedPhases,
        referred_by: refId ?? null,
        letter: state.phase8?.letter ?? '',
        saved_roles: state.phase7?.savedRoles ?? [],
        connections: state.phase6?.connections ?? [],
        intention: state.phase6?.intention ?? '',
      }),
    }).catch(() => {});

    try {
      await supabase.from('jornadas').insert({
        id,
        user_name: name,
        user_email: email,
        user_phone: phone || null,
        guide: state.guide,
        xp: state.xp,
        completed_phases: state.completedPhases,
        phase_data,
        referred_by: refId ?? null,
      });
    } catch (error) {
      console.error('Error saving jornada:', error);
    }

    try {
      const crmResponse = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app: 'reinventar',
          nome: name,
          email,
          telefone: phone || null,
          am_id: refId || null,
          source_lead_id: id,
          resultado: phase_data,
        }),
      });
      if (!crmResponse.ok) {
        const detail = await crmResponse.text().catch(() => '');
        console.error('Error saving lead in CRM:', crmResponse.status, detail);
      }
    } catch (error) {
      console.error('Error saving lead in CRM:', error);
    }

    // Avalia regras de recompensa por indicação (fire-and-forget)
    if (refId) {
      fetch('/api/referral-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referrer_id: refId, tenant_host: window.location.hostname }),
      }).catch(err => console.error('Error evaluating referral rules:', err));
    }

    navigate(`/resultado/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-md mx-auto w-full">
      <div className="w-16 h-16 rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-600)] flex items-center justify-center mb-6">
        <Star className="w-8 h-8" />
      </div>

      <div className="text-[var(--color-brand-500)] mb-4">
        <Leaf className="w-6 h-6 mx-auto" />
      </div>

      <h1 className="font-serif text-4xl text-[var(--text-main)] mb-2">
        Sua jornada está <br/>
        <span className="italic text-[var(--color-brand-500)]">completa</span>
      </h1>

      <p className="text-[var(--color-text-muted)] mb-10 leading-relaxed">
        Insira seu nome e e-mail para salvar seu resultado e receber sua análise personalizada.
      </p>

      <form onSubmit={handleSubmit} className="w-full text-left">
        <div className="mb-4">
          <label className="block text-xs font-mono text-[var(--color-text-muted)] tracking-wider uppercase mb-2">
            Seu Nome
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Como você prefere ser chamado(a)?"
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-[var(--color-brand-400)] transition-colors"
          />
        </div>

        <div className="mb-4">
          <label className="block text-xs font-mono text-[var(--color-text-muted)] tracking-wider uppercase mb-2">
            Seu E-mail
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-[var(--color-brand-400)] transition-colors"
          />
        </div>

        <div className="mb-8">
          <label className="block text-xs font-mono text-[var(--color-text-muted)] tracking-wider uppercase mb-2">
            Celular <span className="normal-case text-stone-400 font-sans tracking-normal">(opcional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-[var(--color-brand-400)] transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-[var(--color-brand-600)] text-white text-sm rounded-[4px] font-medium hover:bg-[var(--color-brand-700)] transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? 'Salvando...' : 'Ver meu Resultado'}
          {!submitting && <span>→</span>}
        </button>
      </form>

      <p className="text-xs text-stone-400 mt-4">
        Seus dados são usados apenas para personalizar seu resultado.
      </p>
    </div>
  );
}
