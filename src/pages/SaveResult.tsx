import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Leaf } from 'lucide-react';
import { useApp } from '../store';
import { supabase } from '../supabase';
import {
  generateRelatorioHtml,
  formatMissionDataText,
  computeCareerCompatibility,
  computeUserProfile,
  computeResultLenses,
  type CareerSuggestion,
  type LensPick,
} from '../lib/ikigai-analysis';

type LensViewCareer = { profession: string; area: string; riasec_types: string[]; intelligence_types: string[]; ikigai_pillars: string[] };

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
    setUserData(name, email);

    const id = Date.now().toString(36);
    // Persiste o id para permitir voltar ao resultado sem refazer o cadastro
    localStorage.setItem('ikigai_jornada_id', id);

    const refId = localStorage.getItem('ikigai_ref');

    const mission_data = {
      mission1: state.mission1,
      mission2: state.mission2,
      mission3: state.mission3,
      mission4: state.mission4,
      mission5: state.mission5,
      mission6: state.mission6,
      mission7: state.mission7,
      mission8: state.mission8,
    };

    try {
      await supabase.from('jornadas').insert({
        id,
        user_name: name,
        user_email: email,
        user_phone: phone || null,
        mentor: state.mentor,
        theme: state.theme,
        xp: state.xp,
        completed_missions: state.completedMissions,
        mission_data,
        referred_by: refId ?? null,
      });
    } catch (error) {
      console.error('Error saving jornada:', error);
    }

    let topCareers: CareerSuggestion[] = [];
    let lenses: LensPick<LensViewCareer>[] = [];
    try {
      const { data: careersData } = await supabase
        .from('careers')
        .select('profession, area, description, trend_demand, riasec_types, intelligence_types, ikigai_pillars')
        .eq('active', true);

      if (careersData && careersData.length > 0) {
        const { riasecTop3, topIntIds, pillarWeights, ministryArea } = computeUserProfile(state);

        lenses = computeResultLenses<LensViewCareer>(
          state,
          careersData.map(c => ({
            profession: c.profession,
            area: c.area,
            riasec_types: c.riasec_types ?? [],
            intelligence_types: c.intelligence_types ?? [],
            ikigai_pillars: c.ikigai_pillars ?? [],
          })),
        );

        topCareers = careersData
          .map(c => ({
            profession: c.profession,
            area: c.area,
            description: c.description,
            trend_demand: c.trend_demand,
            riasec_types: c.riasec_types ?? [],
            score: computeCareerCompatibility(
              { riasec_types: c.riasec_types ?? [], intelligence_types: c.intelligence_types ?? [], ikigai_pillars: c.ikigai_pillars ?? [], area: c.area },
              riasecTop3,
              topIntIds,
              pillarWeights,
              ministryArea,
            ),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);
      }
    } catch (err) {
      console.error('Error fetching careers for webhook:', err);
    }

    try {
      const relatorio_html = generateRelatorioHtml(name, email, id, state, topCareers, lenses);
      const rawSurvey = sessionStorage.getItem('ikigai_survey');
      const survey_data = rawSurvey ?? undefined;

      // Resolve quem indicou (?am_id=) para o GHL receber o e-mail do indicador pronto
      let referrer_name: string | undefined;
      let referrer_email: string | undefined;
      if (refId) {
        try {
          const { data: referrer } = await supabase
            .from('jornadas')
            .select('user_name, user_email')
            .eq('id', refId)
            .maybeSingle();
          if (referrer && referrer.user_email !== email) {
            referrer_name = referrer.user_name;
            referrer_email = referrer.user_email;
          }
        } catch (err) {
          console.error('Error resolving referrer:', err);
        }
      }

      await fetch('https://services.leadconnectorhq.com/hooks/AGisM9u9lfUGWGM6q5bE/webhook-trigger/JvfJPbkfjGGyjUhGIoLv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone: phone || undefined, jornada_id: id, relatorio_html, mission_data: formatMissionDataText(state), survey_data, ref_id: refId ?? undefined, referrer_name, referrer_email }),
      });
    } catch (error) {
      console.error('Error calling GHL webhook:', error);
    }

    // Avalia regras de recompensa por indicação para quem indicou (fire-and-forget)
    if (refId) {
      fetch('/api/referral-evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referrer_id: refId }),
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

      <p className="text-stone-500 mb-10 leading-relaxed">
        Insira seu nome e e-mail para salvar seu resultado e receber sua análise personalizada do Ikigai.
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
