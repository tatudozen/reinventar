import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { supabase } from './supabase';

// Fase 1 — Mapa de Energia
export type EnergyLevel = 'flow' | 'boost' | 'neutral' | 'drain';
export type ActivityMap = Record<string, EnergyLevel>;

// Fase 5 — arquétipos disponíveis
export type Archetype =
  | 'mentor' | 'criador' | 'guardiao'
  | 'explorador' | 'curador' | 'sabio'
  | 'conector' | 'realizador';

export interface AppState {
  xp: number;
  guide: string;               // guia escolhido na seleção inicial
  completedPhases: number[];

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
    impactPoints: Record<string, number>; // coin allocation entre causas
    uniqueProblem: string;                // problema único selecionado
  };

  phase4: {
    sceneDuels: Record<string, string>;    // duelos de cenas (sceneId → opção escolhida)
    environments: string[];               // ambientes preferidos
    forcedChoices: Record<string, string>; // escolhas forçadas (choiceId → opção)
  };

  phase5: {
    archetype: Archetype | '';            // arquétipo selecionado
  };

  phase6: {
    connections: string[];               // tipos de conexão selecionados
  };

  phase7: {
    fields: Record<string, string>;      // campos do formulário "O Próximo Capítulo"
  };

  phase8: {
    letter: string;                      // carta ao eu de amanhã
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

  phase1: { energyCards: {}, maturityVerbs: [], curiosityThemes: [] },
  phase2: { skillRatings: {}, detailRatings: {}, whoAsksYou: [], hiddenTalents: [] },
  phase3: { impactPoints: {}, uniqueProblem: '' },
  phase4: { sceneDuels: {}, environments: [], forcedChoices: {} },
  phase5: { archetype: '' },
  phase6: { connections: [] },
  phase7: { fields: {} },
  phase8: { letter: '' },

  user: { name: '', email: '', phone: '' },
  adminConfig: { videoUrls: {} },
};

interface AppContextType {
  state: AppState;
  addXP: (amount: number) => void;
  updatePhase: <K extends keyof AppState>(phase: K, data: Partial<AppState[K]>) => void;
  replacePhase: <K extends keyof AppState>(phase: K, data: AppState[K]) => void;
  completePhase: (phaseId: number) => void;
  setGuide: (guide: string) => void;
  setUserData: (name: string, email: string, phone?: string) => void;
  updateAdminConfig: (data: Partial<AppState['adminConfig']>) => void;
  resetJourney: () => void;
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

  // Sincroniza adminConfig do Supabase (schema reinventar)
  useEffect(() => {
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
      return { ...prev, completedPhases: [...prev.completedPhases, phaseId] };
    });
  };

  const setGuide = (guide: string) => {
    setState((prev) => ({ ...prev, guide }));
  };

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
    setState(initialState);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addXP,
        updatePhase,
        replacePhase,
        completePhase,
        setGuide,
        setUserData,
        updateAdminConfig,
        resetJourney,
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
