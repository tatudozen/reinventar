import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../store';
import { Settings, Save, ArrowLeft, Lock, LogOut, KeyRound, Plus, Trash2, Pencil, ChevronDown, ChevronUp, GraduationCap, Star, MessageSquare, Ruler, Users, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const MENTORS = [
  { id: 'sabio', name: 'O Sábio' },
  { id: 'heroi', name: 'O Herói' },
  { id: 'rebelde', name: 'O Rebelde' },
  { id: 'curadora', name: 'A Curadora' },
  { id: 'exploradora', name: 'A Exploradora' },
  { id: 'criadora', name: 'A Criadora' }
];

const PHASES = [
  { id: 'fase0', name: 'Fase 0 (Onboarding)' },
  { id: 'missao1', name: 'Missão 1' },
  { id: 'missao2', name: 'Missão 2' },
  { id: 'missao3', name: 'Missão 3' },
  { id: 'missao4', name: 'Missão 4' },
  { id: 'missao5', name: 'Missão 5' },
  { id: 'missao6', name: 'Missão 6' },
  { id: 'missao7', name: 'Missão 7' },
  { id: 'missao8', name: 'Missão 8' },
  { id: 'missao_concluida', name: 'Missão Concluída' },
  { id: 'pesquisa_obrigado', name: 'Pesquisa — Obrigado' },
];

const SESSION_KEY = 'admin_token';

// ─── Curadoria constants ─────────────────────────────────────────────────────

const RIASEC_OPTIONS = [
  { value: 'R', label: 'R — Realista' },
  { value: 'I', label: 'I — Investigativo' },
  { value: 'A', label: 'A — Artístico' },
  { value: 'S', label: 'S — Social' },
  { value: 'E', label: 'E — Empreendedor' },
  { value: 'C', label: 'C — Convencional' },
];

const INT_OPTIONS = [
  { value: 'logico', label: 'Lógico-Matemática' },
  { value: 'linguistica', label: 'Linguística' },
  { value: 'espacial', label: 'Espacial' },
  { value: 'corporal', label: 'Corporal-Cinestésica' },
  { value: 'musical', label: 'Musical' },
  { value: 'interpessoal', label: 'Interpessoal' },
  { value: 'intrapessoal', label: 'Intrapessoal' },
  { value: 'naturalista', label: 'Naturalista' },
];

const PILLAR_OPTIONS = [
  { value: 'love', label: 'O que você ama' },
  { value: 'good', label: 'No que é bom' },
  { value: 'world', label: 'O que o mundo precisa' },
  { value: 'paid', label: 'Pelo que pode ser pago' },
];

// ─── Career types ─────────────────────────────────────────────────────────────

interface CareerCourse {
  id: number;
  career_id: number;
  name: string;
  university: string | null;
  summary: string | null;
  link: string | null;
  active: boolean;
}

interface AdminCareer {
  id: number;
  area: string;
  profession: string;
  description: string | null;
  trend_demand: string | null;
  ikigai_pillars: string[];
  riasec_types: string[];
  intelligence_types: string[];
  active: boolean;
  sort_order: number;
  courses: CareerCourse[];
}

const EMPTY_CAREER = {
  area: '',
  profession: '',
  description: '',
  trend_demand: '',
  ikigai_pillars: [] as string[],
  riasec_types: [] as string[],
  intelligence_types: [] as string[],
  sort_order: 0,
};

const EMPTY_COURSE = {
  name: '',
  university: '',
  summary: '',
  link: '',
};

// ─── CheckboxGroup helper ─────────────────────────────────────────────────────

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const toggle = (v: string) =>
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <label key={o.value} className="flex items-center gap-1.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={selected.includes(o.value)}
            onChange={() => toggle(o.value)}
            className="w-3.5 h-3.5 accent-stone-700"
          />
          <span className="text-xs text-stone-700">{o.label}</span>
        </label>
      ))}
    </div>
  );
}

// ─── CuradoriaCareers component ───────────────────────────────────────────────

function CuradoriaCareers({ token }: { token: string }) {
  const [careers, setCareers] = useState<AdminCareer[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_CAREER);
  const [addingCareer, setAddingCareer] = useState(false);
  const [newCareer, setNewCareer] = useState(EMPTY_CAREER);
  const [courseForm, setCourseForm] = useState<Record<number, typeof EMPTY_COURSE>>({});
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [migrating, setMigrating] = useState(false);
  const [migrationSql, setMigrationSql] = useState('');

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token]);

  const loadCareers = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin-careers', { headers: authHeaders() });
    const data = await res.json();
    if (data.ok) setCareers(data.careers);
    setLoading(false);
  }, [authHeaders]);

  useEffect(() => { loadCareers(); }, [loadCareers]);

  const flash = (msg: string) => { setStatusMsg(msg); setTimeout(() => setStatusMsg(''), 4000); };

  const handleMigrate = async (seed: boolean) => {
    setMigrating(true);
    setMigrationSql('');
    const res = await fetch('/api/admin-migrate', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ seed }),
    });
    const data = await res.json();
    setMigrating(false);
    if (data.ok) { flash('✓ Tabelas criadas! Recarregando...'); setTimeout(loadCareers, 1000); }
    else if (data.sql) { setMigrationSql(data.sql); flash('Execute o SQL abaixo no Supabase Studio.'); }
    else flash(`Erro: ${data.error}`);
  };

  const handleSeedPlanilha = async () => {
    if (!confirm('Importar 65 carreiras da planilha? Duplicatas (área + profissão já existentes) serão ignoradas.')) return;
    setMigrating(true);
    setMigrationSql('');
    const res = await fetch('/api/admin-seed-careers', {
      method: 'POST',
      headers: authHeaders(),
    });
    const data = await res.json();
    setMigrating(false);
    if (data.ok) { flash(`✓ Importação concluída (${data.count ?? 65} carreiras processadas)! Recarregando...`); setTimeout(loadCareers, 1000); }
    else if (data.sql) { setMigrationSql(data.sql); flash('Execute o SQL abaixo no Supabase Studio (SQL Editor).'); }
    else flash(`Erro: ${data.error}`);
  };

  const handleAddCareer = async () => {
    if (!newCareer.area || !newCareer.profession) return flash('Área e profissão são obrigatórios');
    setSaving(true);
    const res = await fetch('/api/admin-careers', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(newCareer),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) { setNewCareer(EMPTY_CAREER); setAddingCareer(false); loadCareers(); flash('Carreira adicionada!'); }
    else flash(`Erro: ${data.error}`);
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    const res = await fetch('/api/admin-careers', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ id: editId, ...editForm }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) { setEditId(null); loadCareers(); flash('Salvo!'); }
    else flash(`Erro: ${data.error}`);
  };

  const handleToggleActive = async (career: AdminCareer) => {
    await fetch('/api/admin-careers', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ id: career.id, active: !career.active }),
    });
    loadCareers();
  };

  const handleDeleteCareer = async (id: number) => {
    if (!confirm('Desativar esta carreira?')) return;
    await fetch(`/api/admin-careers?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    loadCareers();
  };

  const handleAddCourse = async (careerId: number) => {
    const form = courseForm[careerId];
    if (!form?.name) return flash('Nome do curso é obrigatório');
    setSaving(true);
    const res = await fetch('/api/admin-courses', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ career_id: careerId, ...form }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.ok) {
      setCourseForm(prev => ({ ...prev, [careerId]: EMPTY_COURSE }));
      loadCareers();
      flash('Curso adicionado!');
    } else flash(`Erro: ${data.error}`);
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm('Excluir este curso?')) return;
    await fetch(`/api/admin-courses?id=${courseId}`, { method: 'DELETE', headers: authHeaders() });
    loadCareers();
  };

  const areaGroups = careers.reduce<Record<string, AdminCareer[]>>((acc, c) => {
    if (!acc[c.area]) acc[c.area] = [];
    acc[c.area].push(c);
    return acc;
  }, {});

  const fieldCls = "w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500";
  const labelCls = "block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1";

  return (
    <div className="bg-white border border-stone-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h2 className="text-xl font-bold text-stone-800">Curadoria de Carreiras</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleSeedPlanilha}
            disabled={migrating}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white text-sm font-bold rounded-lg hover:bg-emerald-800 disabled:opacity-60 transition-colors"
          >
            {migrating ? 'Importando...' : '↓ Importar Planilha (65)'}
          </button>
          <button
            onClick={() => { setAddingCareer(v => !v); setNewCareer(EMPTY_CAREER); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 text-white text-sm font-bold rounded-lg hover:bg-stone-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Carreira
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">{statusMsg}</div>
      )}

      {/* Painel de migração — aparece quando não há carreiras */}
      {!loading && careers.length === 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <h3 className="font-bold text-amber-800 mb-1">Banco de dados não configurado</h3>
          <p className="text-sm text-amber-700 mb-3">
            As tabelas <code>careers</code> e <code>courses</code> não existem ainda neste Supabase. Clique abaixo para criá-las automaticamente.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleMigrate(false)}
              disabled={migrating}
              className="px-4 py-2 bg-amber-700 text-white text-sm font-bold rounded-lg hover:bg-amber-800 disabled:opacity-60 transition-colors"
            >
              {migrating ? 'Criando...' : 'Criar tabelas (vazias)'}
            </button>
            <button
              onClick={() => handleMigrate(true)}
              disabled={migrating}
              className="px-4 py-2 bg-stone-800 text-white text-sm font-bold rounded-lg hover:bg-stone-700 disabled:opacity-60 transition-colors"
            >
              {migrating ? 'Criando...' : 'Criar tabelas + seed (20 carreiras)'}
            </button>
          </div>
          {migrationSql && (
            <div className="mt-4">
              <p className="text-xs font-bold text-amber-800 mb-1">Execute este SQL no Supabase Studio (SQL Editor):</p>
              <textarea
                readOnly
                value={migrationSql}
                className="w-full h-48 text-xs font-mono bg-white border border-amber-300 rounded-lg p-3 text-stone-700 resize-none"
                onClick={e => (e.target as HTMLTextAreaElement).select()}
              />
              <button
                onClick={() => navigator.clipboard.writeText(migrationSql).then(() => flash('SQL copiado!'))}
                className="mt-1 text-xs text-amber-700 hover:underline"
              >
                Copiar SQL
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add career form */}
      {addingCareer && (
        <div className="mb-6 p-4 bg-stone-50 border border-stone-200 rounded-xl">
          <h3 className="font-bold text-stone-700 mb-4">Nova Carreira</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Área</label>
              <input className={fieldCls} value={newCareer.area} onChange={e => setNewCareer(p => ({ ...p, area: e.target.value }))} placeholder="Ex: Tecnologia e Dados" />
            </div>
            <div>
              <label className={labelCls}>Profissão</label>
              <input className={fieldCls} value={newCareer.profession} onChange={e => setNewCareer(p => ({ ...p, profession: e.target.value }))} placeholder="Ex: Cientista de Dados" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Descrição</label>
              <input className={fieldCls} value={newCareer.description} onChange={e => setNewCareer(p => ({ ...p, description: e.target.value }))} placeholder="Breve descrição da profissão" />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Tendência / Demanda</label>
              <input className={fieldCls} value={newCareer.trend_demand} onChange={e => setNewCareer(p => ({ ...p, trend_demand: e.target.value }))} placeholder="Ex: Alta demanda no mercado digital" />
            </div>
            <div>
              <label className={labelCls}>Tipos RIASEC</label>
              <CheckboxGroup options={RIASEC_OPTIONS} selected={newCareer.riasec_types} onChange={v => setNewCareer(p => ({ ...p, riasec_types: v }))} />
            </div>
            <div>
              <label className={labelCls}>Inteligências</label>
              <CheckboxGroup options={INT_OPTIONS} selected={newCareer.intelligence_types} onChange={v => setNewCareer(p => ({ ...p, intelligence_types: v }))} />
            </div>
            <div>
              <label className={labelCls}>Pilares Ikigai</label>
              <CheckboxGroup options={PILLAR_OPTIONS} selected={newCareer.ikigai_pillars} onChange={v => setNewCareer(p => ({ ...p, ikigai_pillars: v }))} />
            </div>
            <div>
              <label className={labelCls}>Ordem</label>
              <input type="number" className={fieldCls} value={newCareer.sort_order} onChange={e => setNewCareer(p => ({ ...p, sort_order: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddCareer} disabled={saving} className="px-5 py-2 bg-stone-800 text-white text-sm font-bold rounded-lg hover:bg-stone-700 disabled:opacity-60 transition-colors">
              {saving ? 'Salvando...' : 'Adicionar'}
            </button>
            <button onClick={() => setAddingCareer(false)} className="px-5 py-2 bg-stone-200 text-stone-700 text-sm font-bold rounded-lg hover:bg-stone-300 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {(Object.entries(areaGroups) as [string, AdminCareer[]][]).map(([area, areaCareer]) => (
            <div key={area}>
              <h3 className="text-xs font-mono tracking-widest uppercase text-stone-400 mb-3">{area}</h3>
              <div className="space-y-2">
                {areaCareer.map(career => (
                  <div key={career.id} className={`border rounded-xl overflow-hidden ${career.active ? 'border-stone-200' : 'border-stone-100 opacity-60'}`}>
                    {/* Career header row */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-stone-50">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-sm text-stone-800">{career.profession}</span>
                        <span className="ml-2 text-[10px] text-stone-400">{career.riasec_types.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggleActive(career)}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${career.active ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-stone-100 text-stone-500 hover:bg-green-100 hover:text-green-700'}`}
                        >
                          {career.active ? 'Ativo' : 'Inativo'}
                        </button>
                        <button
                          onClick={() => { setEditId(career.id); setEditForm({ area: career.area, profession: career.profession, description: career.description || '', trend_demand: career.trend_demand || '', ikigai_pillars: career.ikigai_pillars, riasec_types: career.riasec_types, intelligence_types: career.intelligence_types, sort_order: career.sort_order }); setExpandedId(career.id); }}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCareer(career.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { setExpandedId(expandedId === career.id ? null : career.id); if (editId === career.id) setEditId(null); }}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded transition-colors"
                        >
                          {expandedId === career.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded: edit form or course list */}
                    {expandedId === career.id && (
                      <div className="px-4 py-4 border-t border-stone-100 space-y-4">
                        {editId === career.id ? (
                          /* Edit form */
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                              <div>
                                <label className={labelCls}>Área</label>
                                <input className={fieldCls} value={editForm.area} onChange={e => setEditForm(p => ({ ...p, area: e.target.value }))} />
                              </div>
                              <div>
                                <label className={labelCls}>Profissão</label>
                                <input className={fieldCls} value={editForm.profession} onChange={e => setEditForm(p => ({ ...p, profession: e.target.value }))} />
                              </div>
                              <div className="md:col-span-2">
                                <label className={labelCls}>Descrição</label>
                                <input className={fieldCls} value={editForm.description} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
                              </div>
                              <div className="md:col-span-2">
                                <label className={labelCls}>Tendência / Demanda</label>
                                <input className={fieldCls} value={editForm.trend_demand} onChange={e => setEditForm(p => ({ ...p, trend_demand: e.target.value }))} />
                              </div>
                              <div>
                                <label className={labelCls}>Tipos RIASEC</label>
                                <CheckboxGroup options={RIASEC_OPTIONS} selected={editForm.riasec_types} onChange={v => setEditForm(p => ({ ...p, riasec_types: v }))} />
                              </div>
                              <div>
                                <label className={labelCls}>Inteligências</label>
                                <CheckboxGroup options={INT_OPTIONS} selected={editForm.intelligence_types} onChange={v => setEditForm(p => ({ ...p, intelligence_types: v }))} />
                              </div>
                              <div>
                                <label className={labelCls}>Pilares Ikigai</label>
                                <CheckboxGroup options={PILLAR_OPTIONS} selected={editForm.ikigai_pillars} onChange={v => setEditForm(p => ({ ...p, ikigai_pillars: v }))} />
                              </div>
                              <div>
                                <label className={labelCls}>Ordem</label>
                                <input type="number" className={fieldCls} value={editForm.sort_order} onChange={e => setEditForm(p => ({ ...p, sort_order: Number(e.target.value) }))} />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={handleSaveEdit} disabled={saving} className="px-4 py-1.5 bg-stone-800 text-white text-sm font-bold rounded-lg hover:bg-stone-700 disabled:opacity-60">
                                {saving ? 'Salvando...' : 'Salvar'}
                              </button>
                              <button onClick={() => setEditId(null)} className="px-4 py-1.5 bg-stone-200 text-stone-700 text-sm font-bold rounded-lg hover:bg-stone-300">
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Career detail view */
                          <div className="text-sm text-stone-600 space-y-1">
                            {career.description && <p><strong>Descrição:</strong> {career.description}</p>}
                            {career.trend_demand && <p><strong>Tendência:</strong> {career.trend_demand}</p>}
                            {career.riasec_types.length > 0 && <p><strong>RIASEC:</strong> {career.riasec_types.join(', ')}</p>}
                            {career.intelligence_types.length > 0 && <p><strong>Inteligências:</strong> {career.intelligence_types.join(', ')}</p>}
                            {career.ikigai_pillars.length > 0 && <p><strong>Pilares:</strong> {career.ikigai_pillars.join(', ')}</p>}
                          </div>
                        )}

                        {/* Courses section */}
                        <div className="border-t border-stone-100 pt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <GraduationCap className="w-4 h-4 text-stone-400" />
                            <span className="text-xs font-mono uppercase tracking-wider text-stone-400">Cursos associados</span>
                          </div>

                          {career.courses.length > 0 ? (
                            <div className="space-y-2 mb-4">
                              {career.courses.map(course => (
                                <div key={course.id} className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-stone-800">{course.name}</p>
                                    {course.university && <p className="text-xs text-stone-500">{course.university}</p>}
                                    {course.summary && <p className="text-xs text-stone-400 mt-0.5">{course.summary}</p>}
                                    {course.link && <a href={course.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">{course.link}</a>}
                                  </div>
                                  <button onClick={() => handleDeleteCourse(course.id)} className="p-1 text-stone-300 hover:text-red-500 transition-colors shrink-0">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-stone-400 italic mb-3">Nenhum curso associado ainda.</p>
                          )}

                          {/* Add course form */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <input
                              className={fieldCls}
                              placeholder="Nome do curso *"
                              value={courseForm[career.id]?.name || ''}
                              onChange={e => setCourseForm(p => ({ ...p, [career.id]: { ...EMPTY_COURSE, ...p[career.id], name: e.target.value } }))}
                            />
                            <input
                              className={fieldCls}
                              placeholder="Universidade"
                              value={courseForm[career.id]?.university || ''}
                              onChange={e => setCourseForm(p => ({ ...p, [career.id]: { ...EMPTY_COURSE, ...p[career.id], university: e.target.value } }))}
                            />
                            <input
                              className={`${fieldCls} md:col-span-2`}
                              placeholder="Resumo executivo"
                              value={courseForm[career.id]?.summary || ''}
                              onChange={e => setCourseForm(p => ({ ...p, [career.id]: { ...EMPTY_COURSE, ...p[career.id], summary: e.target.value } }))}
                            />
                            <input
                              className={`${fieldCls} md:col-span-2`}
                              placeholder="Link para saber mais (https://...)"
                              value={courseForm[career.id]?.link || ''}
                              onChange={e => setCourseForm(p => ({ ...p, [career.id]: { ...EMPTY_COURSE, ...p[career.id], link: e.target.value } }))}
                            />
                          </div>
                          <button
                            onClick={() => handleAddCourse(career.id)}
                            disabled={saving}
                            className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-stone-700 text-white text-xs font-bold rounded-lg hover:bg-stone-600 disabled:opacity-60 transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Adicionar Curso
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FeedbackPanel component ──────────────────────────────────────────────────

interface FeedbackEntry {
  id: number;
  rating: number;
  comment: string | null;
  page: string;
  created_at: string;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          className="w-3.5 h-3.5"
          fill={s <= rating ? '#f59e0b' : 'transparent'}
          stroke={s <= rating ? '#f59e0b' : '#d1d5db'}
        />
      ))}
    </span>
  );
}

interface ReferralRule {
  id: number;
  name: string;
  threshold: number;
  webhook_url: string;
  active: boolean;
}

function ReferralRulesPanel({ token }: { token: string }) {
  const [rules, setRules] = useState<ReferralRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [threshold, setThreshold] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const authHeaders = useCallback(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-referral-rules', { headers: authHeaders() });
      const data = await res.json();
      if (data.ok) setRules(data.rules);
      else setError(data.error || 'Erro ao carregar');
    } catch {
      setError('Erro de rede');
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    const t = parseInt(threshold, 10);
    if (!name.trim() || !Number.isInteger(t) || t < 1 || !webhookUrl.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin-referral-rules', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ name: name.trim(), threshold: t, webhook_url: webhookUrl.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setName(''); setThreshold(''); setWebhookUrl('');
        await load();
      } else {
        setError(data.error || 'Erro ao criar regra');
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (rule: ReferralRule) => {
    await fetch('/api/admin-referral-rules', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ id: rule.id, active: !rule.active }),
    });
    await load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remover esta regra? Os disparos já registrados também serão apagados.')) return;
    await fetch(`/api/admin-referral-rules?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    await load();
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      {/* Explicação */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 leading-relaxed">
        Defina recompensas por indicação. Quando um estudante atingir o número de indicações
        do limiar, o webhook é chamado <strong>uma única vez</strong> com os dados dele
        (<code>referrer_name</code>, <code>referrer_email</code>, <code>referral_count</code>).
      </div>

      {/* Formulário de nova regra */}
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-stone-800 mb-4 border-b pb-3">Nova regra</h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Nome da recompensa</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Brinde por 5 indicações"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Indicações ≥</label>
            <input
              type="number"
              min={1}
              value={threshold}
              onChange={e => setThreshold(e.target.value)}
              placeholder="5"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">URL do Webhook</label>
          <input
            type="url"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
            placeholder="https://services.leadconnectorhq.com/hooks/..."
            className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm outline-none focus:border-stone-400 font-mono"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 text-white text-sm font-bold rounded-lg hover:bg-stone-900 transition-colors disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {saving ? 'Salvando...' : 'Adicionar regra'}
        </button>
      </div>

      {/* Lista de regras */}
      {rules.length === 0 ? (
        <div className="text-center py-12 text-stone-400 text-sm">Nenhuma regra cadastrada ainda.</div>
      ) : (
        <div className="space-y-3">
          {rules.map(rule => (
            <div key={rule.id} className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-4">
              <div className="shrink-0 w-14 h-14 rounded-lg bg-stone-100 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-stone-800 leading-none">{rule.threshold}</span>
                <span className="text-[9px] text-stone-400 uppercase tracking-wide mt-0.5">indic.</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800 text-sm">{rule.name}</p>
                <p className="text-xs text-stone-400 font-mono truncate">{rule.webhook_url}</p>
              </div>
              <button
                onClick={() => toggleActive(rule)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  rule.active
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                    : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                }`}
              >
                {rule.active ? 'Ativa' : 'Inativa'}
              </button>
              <button
                onClick={() => handleDelete(rule.id)}
                className="shrink-0 p-2 text-stone-400 hover:text-red-600 transition-colors"
                aria-label="Remover regra"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackPanel({ token }: { token: string }) {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin-feedback', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) setEntries(data.feedback);
        else setError(data.error || 'Erro ao carregar');
      })
      .catch(() => setError('Erro de rede'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
  );

  if (entries.length === 0) return (
    <div className="text-center py-12 text-stone-400 text-sm">Nenhuma avaliação recebida ainda.</div>
  );

  const avg = entries.reduce((sum, e) => sum + e.rating, 0) / entries.length;
  const dist = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: entries.filter(e => e.rating === star).length,
  }));

  return (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-stone-800 mb-5 border-b pb-4">Avaliações de Experiência</h2>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Média */}
          <div className="text-center min-w-[80px]">
            <div className="text-4xl font-bold text-stone-800">{avg.toFixed(1)}</div>
            <StarDisplay rating={Math.round(avg)} />
            <div className="text-xs text-stone-400 mt-1">{entries.length} avaliações</div>
          </div>
          {/* Distribuição */}
          <div className="flex-1 space-y-1.5 w-full">
            {dist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-stone-500 w-3">{star}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: entries.length ? `${(count / entries.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-stone-400 w-4 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <div className="px-6 py-3 border-b border-stone-100 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-stone-400" />
          <span className="text-sm font-semibold text-stone-600">Comentários</span>
        </div>
        <div className="divide-y divide-stone-100">
          {entries.map(entry => (
            <div key={entry.id} className="px-6 py-4 flex items-start gap-4">
              <StarDisplay rating={entry.rating} />
              <div className="flex-1 min-w-0">
                {entry.comment
                  ? <p className="text-sm text-stone-700 leading-relaxed">{entry.comment}</p>
                  : <p className="text-xs text-stone-300 italic">sem comentário</p>
                }
              </div>
              <span className="text-xs text-stone-400 shrink-0 whitespace-nowrap">
                {new Date(entry.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SurveyPanel — Pesquisa de Satisfação ─────────────────────────────────────

interface SurveyEntry {
  id: number;
  perfil: string | null;
  nps: number | null;
  clareza: string | null;
  missao_fav: string | null;
  dificuldade: string | null;
  precisao: string | null;
  tamanho_jornada: string | null;
  sugestao: string | null;
  comunidade_ia: boolean | null;
  cursos_duvida: string[] | null;
  created_at: string;
}

// Conta ocorrências de um campo, na ordem canônica passada (quando houver),
// deixando valores fora da ordem por último (ordenados por contagem).
function distribution(
  entries: SurveyEntry[],
  pick: (e: SurveyEntry) => string | null,
  order?: string[],
): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const e of entries) {
    const v = pick(e);
    if (v == null || v === '') continue;
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  const seen = new Set<string>();
  const out: { label: string; count: number }[] = [];
  if (order) {
    for (const label of order) {
      if (counts.has(label)) { out.push({ label, count: counts.get(label)! }); seen.add(label); }
    }
  }
  Array.from(counts.entries())
    .filter(([label]) => !seen.has(label))
    .sort((a, b) => b[1] - a[1])
    .forEach(([label, count]) => out.push({ label, count }));
  return out;
}

interface BarRowProps {
  label: string;
  count: number;
  total: number;
  color?: string;
}

const BarRow: React.FC<BarRowProps> = ({ label, count, total, color = 'var(--color-brand-500)' }) => {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-stone-600 w-40 shrink-0 leading-tight">{label}</span>
      <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-stone-500 w-14 text-right shrink-0">{count} · {pct}%</span>
    </div>
  );
};

function DistCard({ title, icon, entries, pick, order, colorFor = () => 'var(--color-brand-500)' }: {
  title: string;
  icon?: React.ReactNode;
  entries: SurveyEntry[];
  pick: (e: SurveyEntry) => string | null;
  order?: string[];
  colorFor?: (label: string) => string;
}) {
  const dist = distribution(entries, pick, order);
  const total = dist.reduce((s, d) => s + d.count, 0);
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6">
      <h3 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2">
        {icon}{title}
      </h3>
      {total === 0 ? (
        <p className="text-xs text-stone-300 italic">sem respostas</p>
      ) : (
        <div className="space-y-2.5">
          {dist.map(d => (
            <BarRow key={d.label} label={d.label} count={d.count} total={total} color={colorFor?.(d.label)} />
          ))}
        </div>
      )}
    </div>
  );
}

function SurveyPanel({ token }: { token: string }) {
  const [entries, setEntries] = useState<SurveyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin-surveys', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        if (data.ok) setEntries(data.surveys);
        else setError(data.error || 'Erro ao carregar');
      })
      .catch(() => setError('Erro de rede'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
  );

  if (entries.length === 0) return (
    <div className="text-center py-12 text-stone-400 text-sm">Nenhuma pesquisa respondida ainda.</div>
  );

  const total = entries.length;

  // NPS: promotores (9-10) − detratores (0-6), ignorando quem não respondeu.
  const npsRated = entries.filter(e => e.nps != null);
  const promoters = npsRated.filter(e => (e.nps as number) >= 9).length;
  const passives = npsRated.filter(e => (e.nps as number) >= 7 && (e.nps as number) <= 8).length;
  const detractors = npsRated.filter(e => (e.nps as number) <= 6).length;
  const npsScore = npsRated.length ? Math.round(((promoters - detractors) / npsRated.length) * 100) : 0;

  // Interesse na comunidade de IA
  const iaRated = entries.filter(e => e.comunidade_ia != null);
  const iaYes = iaRated.filter(e => e.comunidade_ia === true).length;
  const iaPct = iaRated.length ? Math.round((iaYes / iaRated.length) * 100) : 0;

  const tamanhoColor = (label: string) =>
    label.startsWith('Está no tamanho') ? '#10b981'
      : label.includes('MAIOR') ? '#f59e0b'
      : label.includes('MENOR') ? '#f43f5e'
      : 'var(--color-brand-500)';

  const textAnswers = (pick: (e: SurveyEntry) => string | null) =>
    entries.map(e => ({ id: e.id, text: pick(e), date: e.created_at })).filter(x => x.text);

  const dificuldades = textAnswers(e => e.dificuldade);
  const sugestoes = textAnswers(e => e.sugestao);

  return (
    <div className="space-y-6">
      {/* Topo: NPS + totais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-stone-800">{total}</div>
          <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider">respostas</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
          <div className={`text-4xl font-bold ${npsScore >= 50 ? 'text-emerald-600' : npsScore >= 0 ? 'text-amber-600' : 'text-rose-600'}`}>
            {npsScore > 0 ? '+' : ''}{npsScore}
          </div>
          <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider">NPS</div>
          <div className="text-[10px] text-stone-400 mt-2">
            {promoters} prom. · {passives} neutros · {detractors} detr.
          </div>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-6 text-center">
          <div className="text-4xl font-bold text-stone-800 flex items-center justify-center gap-1.5">
            <ThumbsUp className="w-6 h-6 text-[var(--color-brand-500)]" />{iaPct}%
          </div>
          <div className="text-xs text-stone-400 mt-1 uppercase tracking-wider">querem comunidade IA</div>
          <div className="text-[10px] text-stone-400 mt-2">{iaYes} de {iaRated.length}</div>
        </div>
      </div>

      {/* Destaque: tamanho da Jornada */}
      <DistCard
        title="A Jornada deveria ser..."
        icon={<Ruler className="w-4 h-4 text-stone-400" />}
        entries={entries}
        pick={e => e.tamanho_jornada}
        order={[
          'Poderia ser MAIOR — queria mais missões',
          'Está no tamanho certo',
          'Poderia ser MENOR — senti que foi longa',
        ]}
        colorFor={tamanhoColor}
      />

      {/* Grid de distribuições */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DistCard
          title="Clareza após a Jornada"
          entries={entries}
          pick={e => e.clareza}
          order={[
            'Com MAIS clareza sobre meus caminhos',
            'Igual — nada mudou',
            'Com MAIS dúvidas do que antes',
          ]}
        />
        <DistCard
          title="Precisão do resultado"
          entries={entries}
          pick={e => e.precisao}
          order={[
            'Muito eu — me reconheci na hora',
            'Parcialmente eu — acertou umas coisas, errou outras',
            'Não me reconheci',
          ]}
        />
        <DistCard
          title="Perfil de quem respondeu"
          icon={<Users className="w-4 h-4 text-stone-400" />}
          entries={entries}
          pick={e => e.perfil}
        />
        <DistCard
          title="Missão favorita"
          icon={<Star className="w-4 h-4 text-stone-400" />}
          entries={entries}
          pick={e => e.missao_fav}
        />
      </div>

      {/* Respostas abertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-6 py-3 border-b border-stone-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-stone-400" />
            <span className="text-sm font-semibold text-stone-600">Onde travaram / confundiram ({dificuldades.length})</span>
          </div>
          <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
            {dificuldades.length === 0
              ? <p className="px-6 py-6 text-xs text-stone-300 italic">sem respostas</p>
              : dificuldades.map(x => (
                <div key={x.id} className="px-6 py-3">
                  <p className="text-sm text-stone-700 leading-relaxed">{x.text}</p>
                  <span className="text-[10px] text-stone-400">
                    {new Date(x.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-6 py-3 border-b border-stone-100 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-stone-400" />
            <span className="text-sm font-semibold text-stone-600">Sugestões / o que faltou ({sugestoes.length})</span>
          </div>
          <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
            {sugestoes.length === 0
              ? <p className="px-6 py-6 text-xs text-stone-300 italic">sem respostas</p>
              : sugestoes.map(x => (
                <div key={x.id} className="px-6 py-3">
                  <p className="text-sm text-stone-700 leading-relaxed">{x.text}</p>
                  <span className="text-[10px] text-stone-400">
                    {new Date(x.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TenantPanel ─────────────────────────────────────────────────────────────

interface TenantConfig {
  host: string;
  home_url: string;
  explore_label: string;
  explore_url: string;
}

const tenantFieldCls = "w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-700 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500";
const tenantLabelCls = "block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1";

function TenantForm({ form, onChange, onSave, onCancel, saveLabel, saving }: {
  form: TenantConfig;
  onChange: (f: TenantConfig) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
  saving: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className={tenantLabelCls}>Host (domínio)</label>
        <input className={tenantFieldCls} placeholder="ex: jornada.parceiro.com.br" value={form.host}
          onChange={e => onChange({ ...form, host: e.target.value })} disabled={form.host !== '' && saveLabel !== 'Adicionar'} />
      </div>
      <div>
        <label className={tenantLabelCls}>home_url</label>
        <input className={tenantFieldCls} placeholder="https://parceiro.com.br" value={form.home_url}
          onChange={e => onChange({ ...form, home_url: e.target.value })} />
      </div>
      <div>
        <label className={tenantLabelCls}>explore_label</label>
        <input className={tenantFieldCls} placeholder="Explorar Carreiras" value={form.explore_label}
          onChange={e => onChange({ ...form, explore_label: e.target.value })} />
      </div>
      <div>
        <label className={tenantLabelCls}>explore_url</label>
        <input className={tenantFieldCls} placeholder="https://parceiro.com.br/explorar" value={form.explore_url}
          onChange={e => onChange({ ...form, explore_url: e.target.value })} />
      </div>
      <div className="md:col-span-2 flex gap-2">
        <button onClick={onSave} disabled={saving}
          className="px-5 py-2 bg-stone-800 text-white text-sm font-bold rounded-lg hover:bg-stone-700 disabled:opacity-60 transition-colors">
          {saving ? 'Salvando...' : saveLabel}
        </button>
        <button onClick={onCancel}
          className="px-5 py-2 bg-stone-200 text-stone-700 text-sm font-bold rounded-lg hover:bg-stone-300 transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
}

const EMPTY_TENANT: TenantConfig = { host: '', home_url: '', explore_label: '', explore_url: '' };

function TenantPanel({ token }: { token: string }) {
  const [tenants, setTenants] = useState<TenantConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [adding, setAdding] = useState(false);
  const [newTenant, setNewTenant] = useState<TenantConfig>(EMPTY_TENANT);
  const [editHost, setEditHost] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TenantConfig>(EMPTY_TENANT);

  const authHeaders = useCallback(() => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-tenants', { headers: authHeaders() });
      const data = await res.json();
      if (data.ok) setTenants(data.tenants);
      else setError(data.error || 'Erro ao carregar');
    } catch {
      setError('Erro de rede');
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => { load(); }, [load]);

  const showFlash = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(''), 4000); };

  const handleAdd = async () => {
    if (!newTenant.host.trim() || saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin-tenants', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newTenant),
      });
      const data = await res.json();
      if (data.ok) { setNewTenant(EMPTY_TENANT); setAdding(false); await load(); showFlash('Tenant adicionado!'); }
      else setError(data.error || 'Erro ao criar');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editHost || saving) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin-tenants', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.ok) { setEditHost(null); await load(); showFlash('Salvo!'); }
      else setError(data.error || 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (host: string) => {
    if (!confirm(`Remover tenant "${host}"?`)) return;
    await fetch(`/api/admin-tenants?host=${encodeURIComponent(host)}`, { method: 'DELETE', headers: authHeaders() });
    await load();
    showFlash('Removido.');
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}
      {flash && <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{flash}</div>}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800 leading-relaxed">
        Cada tenant é identificado pelo <strong>hostname</strong> do acesso. Os campos
        <code> home_url</code>, <code>explore_label</code> e <code>explore_url</code> personalizam
        os links e botões exibidos no resultado e na pesquisa de satisfação para esse domínio.
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4 border-b pb-3">
          <h2 className="text-lg font-bold text-stone-800">Tenants configurados</h2>
          <button onClick={() => { setAdding(v => !v); setNewTenant(EMPTY_TENANT); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-800 text-white text-sm font-bold rounded-lg hover:bg-stone-700 transition-colors">
            <Plus className="w-4 h-4" /> Novo Tenant
          </button>
        </div>

        {adding && (
          <div className="mb-6 p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <h3 className="font-bold text-stone-700 mb-4">Novo Tenant</h3>
            <TenantForm form={newTenant} onChange={setNewTenant} onSave={handleAdd} onCancel={() => setAdding(false)} saveLabel="Adicionar" saving={saving} />
          </div>
        )}

        {tenants.length === 0 ? (
          <p className="text-center py-10 text-stone-400 text-sm">Nenhum tenant cadastrado ainda.</p>
        ) : (
          <div className="space-y-3">
            {tenants.map(t => (
              <div key={t.host} className="border border-stone-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 bg-stone-50">
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-sm font-medium text-stone-800">{t.host}</span>
                    {t.explore_label && <span className="ml-3 text-xs text-stone-400">{t.explore_label}</span>}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => { setEditHost(t.host); setEditForm({ ...t }); }}
                      className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(t.host)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {editHost === t.host && (
                  <div className="px-4 py-4 border-t border-stone-100">
                    <TenantForm form={editForm} onChange={setEditForm} onSave={handleSaveEdit} onCancel={() => setEditHost(null)} saveLabel="Salvar" saving={saving} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

async function apiAuth(body: object): Promise<{ ok: boolean; token?: string; error?: string }> {
  const res = await fetch('/api/admin-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = await apiAuth({ action: 'login', password });
    setLoading(false);
    if (data.ok && data.token) {
      onLogin(data.token);
    } else {
      setError(data.error || 'Senha incorreta.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-stone-200 rounded-xl shadow-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-stone-500" />
          </div>
          <h1 className="text-xl font-bold text-stone-800">Área de Facilitadores</h1>
          <p className="text-sm text-stone-500 mt-1">Digite a senha para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="Senha de acesso"
            autoFocus
            required
            className={`w-full border rounded-lg px-4 py-2.5 text-sm text-stone-700 outline-none focus:ring-2 transition-colors ${
              error
                ? 'border-red-400 focus:ring-red-200'
                : 'border-stone-300 focus:ring-[var(--color-brand-300)] focus:border-[var(--color-brand-500)]'
            }`}
          />
          {error && <p className="text-xs text-red-500 -mt-1">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[var(--color-brand-600)] text-white font-bold rounded-lg hover:bg-[var(--color-brand-700)] transition-colors text-sm uppercase tracking-wider disabled:opacity-60"
          >
            {loading ? 'Verificando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-stone-400 hover:text-stone-600 hover:underline">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordForm({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirm) { setErrorMsg('As senhas não coincidem.'); return; }
    if (newPassword.length < 6) { setErrorMsg('A senha deve ter no mínimo 6 caracteres.'); return; }
    setStatus('loading');
    setErrorMsg('');

    // Re-autenticar com senha atual antes de alterar
    const check = await apiAuth({ action: 'login', password: currentPassword });
    if (!check.ok) {
      setErrorMsg('Senha atual incorreta.');
      setStatus('error');
      return;
    }

    // A troca de senha em si requer acesso ao painel Vercel (alterar env var ADMIN_PASSWORD).
    // Aqui confirmamos que o usuário conhece a senha atual e orientamos o próximo passo.
    setStatus('success');
    setTimeout(onClose, 3000);
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-6">
      <h2 className="text-base font-bold text-stone-800 mb-1 flex items-center gap-2">
        <KeyRound className="w-4 h-4" /> Alterar Senha
      </h2>
      <p className="text-xs text-stone-500 mb-4">
        Após confirmar, atualize a variável <code>ADMIN_PASSWORD</code> no painel do Vercel e faça um novo deploy.
      </p>
      {status === 'success' ? (
        <p className="text-sm text-green-600 font-medium">Senha atual confirmada. Atualize a env var no Vercel.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => { setCurrentPassword(e.target.value); setErrorMsg(''); }}
            placeholder="Senha atual"
            autoFocus
            required
            className="w-full border border-stone-300 rounded-lg px-4 py-2 text-sm text-stone-700 outline-none focus:ring-2 focus:ring-[var(--color-brand-300)] focus:border-[var(--color-brand-500)] transition-colors"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => { setNewPassword(e.target.value); setErrorMsg(''); }}
            placeholder="Nova senha"
            required
            className="w-full border border-stone-300 rounded-lg px-4 py-2 text-sm text-stone-700 outline-none focus:ring-2 focus:ring-[var(--color-brand-300)] focus:border-[var(--color-brand-500)] transition-colors"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => { setConfirm(e.target.value); setErrorMsg(''); }}
            placeholder="Confirmar nova senha"
            required
            className={`w-full border rounded-lg px-4 py-2 text-sm text-stone-700 outline-none focus:ring-2 transition-colors ${
              errorMsg ? 'border-red-400 focus:ring-red-200' : 'border-stone-300 focus:ring-[var(--color-brand-300)] focus:border-[var(--color-brand-500)]'
            }`}
          />
          {errorMsg && <p className="text-xs text-red-500">{errorMsg}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2 bg-[var(--color-brand-600)] text-white text-sm font-bold rounded-lg hover:bg-[var(--color-brand-700)] transition-colors disabled:opacity-60"
            >
              {status === 'loading' ? 'Verificando...' : 'Confirmar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-stone-200 text-stone-700 text-sm font-bold rounded-lg hover:bg-stone-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function AdminSettings() {
  const { state, updateAdminConfig } = useApp();
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>(state.adminConfig?.videoUrls || {});
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'curadoria' | 'pesquisa' | 'feedback' | 'indicacoes' | 'tenants'>('videos');

  // Sincroniza o formulário quando o Supabase terminar de carregar as URLs
  useEffect(() => {
    const remoteUrls = state.adminConfig?.videoUrls;
    if (remoteUrls && Object.keys(remoteUrls).length > 0) {
      setVideoUrls(remoteUrls);
    }
  }, [state.adminConfig?.videoUrls]);

  useEffect(() => {
    const token = sessionStorage.getItem(SESSION_KEY);
    if (!token) { setCheckingSession(false); return; }
    apiAuth({ action: 'verify', token }).then(({ ok }) => {
      if (ok) setAuthed(true);
      else sessionStorage.removeItem(SESSION_KEY);
      setCheckingSession(false);
    });
  }, []);

  const handleLogin = (token: string) => {
    sessionStorage.setItem(SESSION_KEY, token);
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setShowChangePassword(false);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-light)] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  const handleUrlChange = (mentorId: string, phaseId: string, url: string) => {
    setVideoUrls(prev => ({ ...prev, [`${mentorId}_${phaseId}`]: url }));
    setSaved(false);
  };

  const handleKeyChange = (key: string, url: string) => {
    setVideoUrls(prev => ({ ...prev, [key]: url }));
    setSaved(false);
  };

  const PLANILHA_URLS: Record<string, string> = {
    sabio_onboarding: 'https://youtube.com/shorts/zXDfP--bKuA',
    heroi_onboarding: 'https://youtube.com/shorts/IN1S6iuufyM',
    heroi_missao1:    'https://youtube.com/shorts/IN1S6iuufyM',
    heroi_missao2:    'https://youtube.com/shorts/oQlL22_F71s',
    heroi_missao3:    'https://youtube.com/shorts/LX4NW9BlYek',
    heroi_missao4:    'https://youtube.com/shorts/luJzsXplOCo',
    heroi_missao5:    'https://youtube.com/shorts/nOw5InkrFYg',
    rebelde_onboarding: 'https://youtube.com/shorts/GjFGWdeSlH8',
    rebelde_missao1:  'https://youtube.com/shorts/qRI2E1xoh4k',
    rebelde_missao2:  'https://youtube.com/shorts/L2Gt9SUkRLM',
    rebelde_missao3:  'https://youtube.com/shorts/-J1uUfXtROI',
    rebelde_missao4:  'https://youtube.com/shorts/DvBGJxoD_Vs',
    rebelde_missao5:  'https://youtube.com/shorts/nOw5InkrFYg',
    curadora_onboarding: 'https://youtube.com/shorts/8y5PCYBeR_8',
    curadora_missao1: 'https://youtube.com/shorts/uT_AP8eVc80',
    exploradora_onboarding: 'https://youtube.com/shorts/NesDKEv-I8U',
    exploradora_missao1:    'https://youtube.com/shorts/l6BRDJIUdow',
    criadora_onboarding: 'https://youtube.com/shorts/ycwvRWCa3-8',
    criadora_missao1:    'https://youtube.com/shorts/G9ES4Q4BY4M',
  };

  const handleImportPlanilha = async () => {
    const merged = { ...videoUrls, ...PLANILHA_URLS };
    setVideoUrls(merged);
    setSaveError(null);
    updateAdminConfig({ videoUrls: merged });
    const token = sessionStorage.getItem(SESSION_KEY);
    try {
      const res = await fetch('/api/admin-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ videoUrls: merged }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setSaveError(`Erro: ${data.error || res.status}`); return; }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setSaveError(`Erro de rede: ${e instanceof Error ? e.message : 'desconhecido'}`);
    }
  };

  const handleSave = async () => {
    const nonEmptyUrls = Object.fromEntries(
      Object.entries(videoUrls).filter(([, url]) => (url as string).trim() !== '')
    );

    setSaveError(null);
    updateAdminConfig({ videoUrls: nonEmptyUrls });

    const token = sessionStorage.getItem(SESSION_KEY);
    try {
      const res = await fetch('/api/admin-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ videoUrls: nonEmptyUrls }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(`Erro ao guardar no servidor: ${data.error || res.status}`);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setSaveError(`Erro de rede: ${e instanceof Error ? e.message : 'desconhecido'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] text-[var(--color-text-main)] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8 justify-between">
          <Link to="/" className="text-[var(--color-brand-600)] flex items-center hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Início
          </Link>
          <div className="flex items-center text-xl font-bold font-serif text-[var(--color-brand-800)] gap-2">
            <Settings className="w-6 h-6" />
            Configurações Administrativas
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowChangePassword(v => !v)}
            className="flex items-center gap-1.5 text-sm text-[var(--color-brand-600)] hover:underline"
          >
            <KeyRound className="w-4 h-4" />
            {showChangePassword ? 'Cancelar' : 'Alterar senha'}
          </button>
        </div>

        {showChangePassword && (
          <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-stone-200">
          {([
            { id: 'videos', label: 'Vídeos dos Mentores' },
            { id: 'curadoria', label: 'Curadoria de Carreiras' },
            { id: 'pesquisa', label: 'Pesquisa de Satisfação' },
            { id: 'feedback', label: 'Avaliações' },
            { id: 'indicacoes', label: 'Recompensas de Indicação' },
            { id: 'tenants', label: 'Tenants' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-stone-800 text-stone-800'
                  : 'border-transparent text-stone-400 hover:text-stone-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'curadoria' && (
          <CuradoriaCareers token={sessionStorage.getItem(SESSION_KEY) || ''} />
        )}

        {activeTab === 'pesquisa' && (
          <SurveyPanel token={sessionStorage.getItem(SESSION_KEY) || ''} />
        )}

        {activeTab === 'feedback' && (
          <FeedbackPanel token={sessionStorage.getItem(SESSION_KEY) || ''} />
        )}

        {activeTab === 'indicacoes' && (
          <ReferralRulesPanel token={sessionStorage.getItem(SESSION_KEY) || ''} />
        )}

        {activeTab === 'tenants' && (
          <TenantPanel token={sessionStorage.getItem(SESSION_KEY) || ''} />
        )}

        {activeTab === 'videos' && (
          <>
            <div className="bg-white border text-left p-6 border-stone-200 rounded-xl shadow-sm mb-6">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-stone-800">URLs dos Vídeos dos Mentores</h2>
                <button
                  onClick={handleImportPlanilha}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white text-sm font-bold rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  ↓ Importar da Planilha
                </button>
              </div>

              <div className="space-y-8">
                <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                  <h3 className="font-bold text-lg text-stone-700 mb-4">Landing Page</h3>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                      Vídeo abaixo da hero
                    </label>
                    <input
                      type="text"
                      value={videoUrls['landing'] || ''}
                      onChange={(e) => handleKeyChange('landing', e.target.value)}
                      placeholder="Ex: https://youtube.com/watch?v=... ou /shorts/..."
                      className="w-full bg-white border border-stone-300 rounded p-2 text-sm text-stone-700 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                    />
                    <p className="text-xs text-stone-400 mt-1">Deixe em branco para exibir o placeholder "Vídeo em breve".</p>
                  </div>
                </div>

                {MENTORS.map(mentor => (
                  <div key={mentor.id} className="bg-stone-50 p-4 rounded-lg border border-stone-200">
                    <h3 className="font-bold text-lg text-stone-700 mb-4">Mentor: {mentor.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PHASES.map(phase => {
                        const key = `${mentor.id}_${phase.id}`;
                        return (
                          <div key={phase.id} className="flex flex-col">
                            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                              {phase.name}
                            </label>
                            <input
                              type="text"
                              value={videoUrls[key] || ''}
                              onChange={(e) => handleUrlChange(mentor.id, phase.id, e.target.value)}
                              placeholder="Ex: https://youtube.com/embed/..."
                              className="w-full bg-white border border-stone-300 rounded p-2 text-sm text-stone-700 outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 sticky bottom-6">
              {saveError && (
                <p className="text-red-400 text-sm bg-red-950/40 border border-red-500/30 rounded-lg px-4 py-2 max-w-sm text-right">
                  {saveError}
                </p>
              )}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-[var(--color-brand-600)] text-[var(--bg-dark)] hover:bg-[var(--color-brand-700)] rounded-full font-bold uppercase tracking-wider shadow-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                {saved ? 'Salvo! ✓' : 'Salvar Configurações'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
