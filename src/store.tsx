import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { supabase } from './supabase';

type Quadrant = 'flow' | 'boost' | 'neutral' | 'drain';
export type ActivityMap = Record<string, Quadrant>;

const QUADRANT_MIGRATION: Record<string, Quadrant> = {
  gosto_faco: 'flow',
  gosto_naofaco: 'boost',
  naogosto_faco: 'neutral',
  naogosto_naofaco: 'drain',
};

function migrateState(raw: AppState): AppState {
  const cards = raw.mission1?.energyCards;
  if (!cards) return raw;
  const hasOld = Object.values(cards).some(v => v in QUADRANT_MIGRATION);
  if (!hasOld) return raw;
  const migrated: ActivityMap = {};
  Object.entries(cards).forEach(([k, v]) => {
    migrated[k] = QUADRANT_MIGRATION[v] ?? v;
  });
  return { ...raw, mission1: { ...raw.mission1, energyCards: migrated } };
}

export type ColorCategory = 'estudo' | 'lazer' | 'familia' | 'descanso' | 'tedio' | null;
export type AgendaMap = Record<string, ColorCategory>; // cellId (e.g., 'seg_manha') -> category

export interface AppState {
  xp: number;
  mission1: {
    energyCards: ActivityMap;
    childhoodVerbs: string[];
    curiosityRadar: string[];
  };
  mission2: {
    lightningChallenges: Record<string, number>;
    detailRatings: Record<string, number[]>;
    praiseMap: string[];
    hiddenTalents: string[];
  };
  mission3: {
    impactPoints: Record<string, number>;
    communityDilemmas: Record<string, string>;
    impactScale: string;
    contributionType: string[];
    uniqueProblem: string;
  };
  mission4: {
    sceneDuels: Record<string, string>;
    environments: string[];
    forcedChoices: Record<string, string>;
  };
  mission5: { ministry?: string; cargo?: string; saved: string[]; discarded: string[] };
  mission6: {
    selectedArchetypes: string[];
    futureVision: Record<string, string>;
    ultimateRole: string;
  };
  mission7: { saved: string[]; discarded: string[] };
  mission8: { letter: string; future: Record<string, string> };
  user: { name: string; email: string };
  mentor: string;
  theme: string;
  completedMissions: number[];
  adminConfig: {
    videoUrls: Record<string, string>;
  };
}

const initialState: AppState = {
  xp: 0,
  mission1: { energyCards: {}, childhoodVerbs: [], curiosityRadar: [] },
  mission2: { lightningChallenges: {}, detailRatings: {}, praiseMap: [], hiddenTalents: [] },
  mission3: { impactPoints: {}, communityDilemmas: {}, impactScale: '', contributionType: [], uniqueProblem: '' },
  mission4: { sceneDuels: {}, environments: [], forcedChoices: {} },
  mission5: { ministry: '', cargo: '', saved: [], discarded: [] },
  mission6: { selectedArchetypes: [], futureVision: {}, ultimateRole: '' },
  mission7: { saved: [], discarded: [] },
  mission8: { letter: '', future: {} },
  user: { name: '', email: '' },
  mentor: '',
  theme: 'cyber',
  completedMissions: [],
  adminConfig: {
    videoUrls: {}
  }
};

interface AppContextType {
  state: AppState;
  addXP: (amount: number) => void;
  updateMission: <K extends keyof AppState>(mission: K, data: Partial<AppState[K]>) => void;
  completeMission: (missionId: number) => void;
  replaceMission: <K extends keyof AppState>(mission: K, data: AppState[K]) => void;
  setUserData: (name: string, email: string) => void;
  setThemeAndMentor: (mentor: string, theme: string) => void;
  updateAdminConfig: (data: Partial<AppState['adminConfig']>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('appState');
      if (saved) return migrateState(JSON.parse(saved));
    } catch (e) {}
    return initialState;
  });

  const adminConfigId = useRef<string | null>(null);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  // Sync adminConfig from Supabase
  useEffect(() => {
    supabase
      .from('admin_config')
      .select('id, video_urls')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          adminConfigId.current = data.id;
          // Só aplica se tiver URLs de facto (evita {} sobrescrever estado local)
          if (data.video_urls && Object.keys(data.video_urls).length > 0) {
            setState((prev) => ({
              ...prev,
              adminConfig: { videoUrls: data.video_urls }
            }));
          }
        }
      });

    const channel = supabase
      .channel('admin_config_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'admin_config' },
        (payload) => {
          const videoUrls = (payload.new as { video_urls: Record<string, string> }).video_urls;
          if (videoUrls) {
            setState((prev) => ({
              ...prev,
              adminConfig: { videoUrls }
            }));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addXP = (amount: number) => {
    setState((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const updateMission = <K extends keyof AppState>(mission: K, data: Partial<AppState[K]>) => {
    setState((prev) => ({
      ...prev,
      [mission]: typeof data === 'object' && data !== null && !Array.isArray(data)
        ? { ...(prev[mission] as object), ...data }
        : data
    }));
  };

  const replaceMission = <K extends keyof AppState>(mission: K, data: AppState[K]) => {
    setState((prev) => ({
      ...prev,
      [mission]: data
    }));
  };

  const completeMission = (missionId: number) => {
    setState((prev) => {
      if (prev.completedMissions.includes(missionId)) return prev;
      return { ...prev, completedMissions: [...prev.completedMissions, missionId] };
    });
  };

  const setUserData = (name: string, email: string) => {
    setState((prev) => ({ ...prev, user: { name, email } }));
  };

  const setThemeAndMentor = (mentor: string, theme: string) => {
    setState((prev) => ({ ...prev, mentor, theme }));
    document.documentElement.dataset.theme = theme;
  };

  const updateAdminConfig = (data: Partial<AppState['adminConfig']>) => {
    setState((prev) => {
      const mergedVideoUrls = { ...prev.adminConfig.videoUrls, ...(data.videoUrls || {}) };
      return { ...prev, adminConfig: { ...prev.adminConfig, ...data, videoUrls: mergedVideoUrls } };
    });
  };

  return (
    <AppContext.Provider value={{ state, addXP, updateMission, replaceMission, completeMission, setUserData, setThemeAndMentor, updateAdminConfig }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
