import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { supabase } from './supabase';

// Fase 1 — Mapa de Energia
export type EnergyLevel = 'flow' | 'boost' | 'neutral' | 'drain';
export type ActivityMap = Record<string, EnergyLevel>;

// Fase 5 — arquétipos disponíveis
export type Archetype =
  | 'sabio' | 'guardiao' | 'explorador'
  | 'criador' | 'conector' | 'realizador';

export interface AppState {
  xp: number;
  guide: string;               // guia escolhido na seleção inicial
  completedPhases: number[];

  // Shims de compatibilidade — mirrors para Mission pages (remover ao reescrever cada Fase)
  mentor: string;
  theme: string;
  completedMissions: number[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mission1: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mission2: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mission3: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mission4: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mission5: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mission6: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mission7: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mission8: Record<string, any>;

  phase1: {
    energyCards: ActivityMap;  // card sort de atividades
    maturityVerbs: string[];   // verbos que sempre fizeram naturalmente
    curiosityThemes: string[]; // temas de curiosidade
  };

  phase2: {
    skillRatings: Record<string, number>;    // avaliação das 9 dimensões de habilidade
    detailRatings: Record<string, number[]>; // sub-perguntas de aprofundamento
    whoAsksYou: string[];                    // "quem te procura" (tipos de pedido de ajuda)
    hiddenTalents: string[];                 // talentos ocultos selecionados
  };

  phase3: {
    impactPoints: Record<string, number>; // (legado) alocação de moedas — não mais usado na UI
    uniqueProblem: string;                // a dor que o negócio resolve (opção ou texto livre)
    niche: string;                        // nicho de mercado (label ou texto livre)
    subNiche: string;                     // sub-nicho (texto livre)
    ministry: string;                     // (legado) área — mantido por compat, não mais escrito
    cargo: string;                        // chapéu de dono(a) preferido
  };

  phase4: {
    sceneDuels: Record<string, string>;    // duelos de cenas (sceneId → opção escolhida)
    environments: string[];               // ambientes preferidos
    forcedChoices: Record<string, string>; // escolhas forçadas (choiceId → opção)
  };

  phase5: {
    archetype: Archetype | '';
    savedFigures: string[];
    discardedFigures: string[];
  };

  phase6: {
    connections: string[];   // quem você quer impactar
    modes: string[];         // como prefere se conectar
    intention: string;       // intenção de relação escrita
  };

  phase7: {
    fields: Record<string, string>;
    savedRoles: string[];
    discardedRoles: string[];
  };

  phase8: {
    letter: string;
    future: Record<string, string>;      // seleções das perguntas de visão
    businessVision: string;              // visão do negócio em 1 ano (texto)
  };

  // Fase "O Modelo da Reinvenção" — camada econômica do Plano de Reinvenção
  businessModel: {
    offerFormats: string[];   // formatos de oferta (serviço, oficina, produto…)
    payer: string[];          // quem paga (cliente ≠ quem se quer impactar)
    ambition: string;         // nível de ambição/tempo (renda extra → fonte principal)
    financialGoal: string;    // meta financeira aproximada (faixa)
    assets: string[];         // ativos que já possui (rede, reputação, capital…)
  };

  user: {
    name: string;
    email: string;
    phone: string;
  };

  adminConfig: {
    videoUrls: Record<string, string>;
  };
}

const initialState: AppState = {
  xp: 0,
  guide: '',
  completedPhases: [],

  // Shims
  mentor: '', theme: 'cyber', completedMissions: [],
  mission1: {}, mission2: {}, mission3: {}, mission4: {},
  mission5: {}, mission6: {}, mission7: {}, mission8: {},

  phase1: { energyCards: {}, maturityVerbs: [], curiosityThemes: [] },
  phase2: { skillRatings: {}, detailRatings: {}, whoAsksYou: [], hiddenTalents: [] },
  phase3: { impactPoints: {}, uniqueProblem: '', niche: '', subNiche: '', ministry: '', cargo: '' },
  phase4: { sceneDuels: {}, environments: [], forcedChoices: {} },
  phase5: { archetype: '', savedFigures: [], discardedFigures: [] },
  phase6: { connections: [], modes: [], intention: '' },
  phase7: { fields: {}, savedRoles: [], discardedRoles: [] },
  phase8: { letter: '', future: {}, businessVision: '' },
  businessModel: { offerFormats: [], payer: [], ambition: '', financialGoal: '', assets: [] },

  user: { name: '', email: '', phone: '' },
  adminConfig: { videoUrls: {} },
};

interface AppContextType {
  state: AppState;
  addXP: (amount: number) => void;
  updatePhase: <K extends keyof AppState>(phase: K, data: Partial<AppState[K]>) => void;
  replacePhase: <K extends keyof AppState>(phase: K, data: AppState[K]) => void;
  completePhase: (phaseId: number) => void;
  resetPhases: (keys: (keyof AppState)[]) => void;
  setGuide: (guide: string) => void;
  setUserData: (name: string, email: string, phone?: string) => void;
  updateAdminConfig: (data: Partial<AppState['adminConfig']>) => void;
  resetJourney: () => void;
  // Shims de compatibilidade — remover ao reescrever cada Fase
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateMission: (key: string, data: Record<string, any>) => void;
  completeMission: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('reinventar_state');
      if (saved) return { ...initialState, ...JSON.parse(saved) };
    } catch {
      // ignora estado corrompido
    }
    return initialState;
  });

  const adminConfigId = useRef<string | null>(null);

  // Persiste estado no localStorage
  useEffect(() => {
    localStorage.setItem('reinventar_state', JSON.stringify(state));
  }, [state]);

  // Sincroniza adminConfig do Supabase (schema reinventar) — só se env vars estiverem configuradas
  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;
    supabase
      .from('admin_config')
      .select('id, video_urls')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          adminConfigId.current = data.id;
          if (data.video_urls && Object.keys(data.video_urls).length > 0) {
            setState((prev) => ({
              ...prev,
              adminConfig: { videoUrls: data.video_urls },
            }));
          }
        }
      });

    const channel = supabase
      .channel('reinventar_admin_config')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'reinventar', table: 'admin_config' },
        (payload) => {
          const videoUrls = (payload.new as { video_urls: Record<string, string> }).video_urls;
          if (videoUrls) {
            setState((prev) => ({ ...prev, adminConfig: { videoUrls } }));
          }
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addXP = (amount: number) => {
    setState((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const updatePhase = <K extends keyof AppState>(phase: K, data: Partial<AppState[K]>) => {
    setState((prev) => ({
      ...prev,
      [phase]:
        typeof data === 'object' && data !== null && !Array.isArray(data)
          ? { ...(prev[phase] as object), ...data }
          : data,
    }));
  };

  const replacePhase = <K extends keyof AppState>(phase: K, data: AppState[K]) => {
    setState((prev) => ({ ...prev, [phase]: data }));
  };

  const completePhase = (phaseId: number) => {
    setState((prev) => {
      if (prev.completedPhases.includes(phaseId)) return prev;
      const updated = [...prev.completedPhases, phaseId];
      return { ...prev, completedPhases: updated, completedMissions: updated };
    });
  };

  // Reseta fatias específicas de fase aos valores iniciais (usado por "Refazer esta fase").
  // Não mexe em completedPhases — a barra de progresso é baseada na URL, não nesse array.
  const resetPhases = (keys: (keyof AppState)[]) => {
    setState((prev) => {
      const patch: Record<string, unknown> = {};
      keys.forEach((k) => {
        patch[k as string] = JSON.parse(JSON.stringify(initialState[k]));
      });
      return { ...prev, ...(patch as unknown as Partial<AppState>) };
    });
  };

  const setGuide = (guide: string) => {
    setState((prev) => ({ ...prev, guide, mentor: guide }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMission = (key: string, data: Record<string, any>) => {
    setState((prev) => ({
      ...prev,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key]: { ...(prev as Record<string, any>)[key], ...data },
    }));
  };

  const completeMission = completePhase;

  const setUserData = (name: string, email: string, phone = '') => {
    setState((prev) => ({ ...prev, user: { name, email, phone } }));
  };

  const updateAdminConfig = (data: Partial<AppState['adminConfig']>) => {
    setState((prev) => {
      const mergedVideoUrls = { ...prev.adminConfig.videoUrls, ...(data.videoUrls ?? {}) };
      return { ...prev, adminConfig: { ...prev.adminConfig, ...data, videoUrls: mergedVideoUrls } };
    });
  };

  const resetJourney = () => {
    localStorage.removeItem('reinventar_state');
    // Preserva adminConfig — não é dado de jornada do usuário
    setState(prev => ({ ...initialState, adminConfig: prev.adminConfig }));
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addXP,
        updatePhase,
        replacePhase,
        completePhase,
        resetPhases,
        setGuide,
        setUserData,
        updateAdminConfig,
        resetJourney,
        updateMission,
        completeMission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
