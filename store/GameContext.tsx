
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CATEGORY_ORDER } from '../data';
import { auth, db, isFirebaseInitialized } from '../firebase-config';
// @ts-ignore - Bypass missing type definitions for Firebase v9 modules
import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
// @ts-ignore
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

interface GameContextType {
  currentScreen: string;
  currentCategoryKey: string | null;
  currentQuestionIndex: number | null;
  answers: Record<string, string>;
  completedCategories: string[];
  isOffline: boolean;
  connectionError: string | null;
  isInitialized: boolean;
  userUid: string | null;
  
  goToScreen: (screen: string) => void;
  selectCategory: (key: string) => void;
  selectCard: (index: number) => void;
  saveAnswer: (text: string) => void;
  completeCategory: () => void;
  getFormattedAnswerKey: () => string;
  resetProgress: (skipConfirm?: boolean) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [currentCategoryKey, setCurrentCategoryKey] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completedCategories, setCompletedCategories] = useState<string[]>([]);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOffline, setIsOffline] = useState(!isFirebaseInitialized);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [userUid, setUserUid] = useState<string | null>(null);

  // Inicialização: Auth do Firebase ou Fallback para LocalStorage
  useEffect(() => {
    if (!isFirebaseInitialized || !auth) {
      // MODO OFFLINE (LocalStorage)
      console.log("Iniciando em modo Offline...");
      loadFromLocalStorage();
      setIsOffline(true);
      setConnectionError("Firebase não configurado ou chave inválida.");
      setIsInitialized(true);
      return;
    }

    // MODO ONLINE (Firebase)
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        console.log("Usuário conectado:", user.uid);
        setUserUid(user.uid);
        setIsOffline(false);
        setConnectionError(null);
        
        // Carregar dados do Firestore
        try {
          if (db) {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              const data = docSnap.data();
              setAnswers(data.answers || {});
              setCompletedCategories(data.completedCategories || []);
              console.log("Dados carregados do Firestore.");
            } else {
              console.log("Nenhum dado anterior encontrado. Criando novo perfil...");
              // Cria documento inicial vazio para garantir que existe
              await setDoc(docRef, { 
                createdAt: new Date().toISOString(),
                answers: {},
                completedCategories: [] 
              }, { merge: true });
            }
          }
        } catch (error: any) {
          // Tratamento de erro de permissão melhorado
          if (error.code === 'permission-denied') {
             const msg = "Acesso negado ao Firestore. Verifique as Regras de Segurança no Console.";
             console.warn(`⚠️ ${msg}`);
             setConnectionError(msg);
          } else {
             console.error("Erro ao buscar dados do Firestore:", error);
             setConnectionError("Erro de conexão com o banco de dados.");
          }
          loadFromLocalStorage(); // Fallback garantido
          setIsOffline(true); 
        }
        setIsInitialized(true);

      } else {
        console.log("Nenhum usuário. Tentando login anônimo...");
        try {
          await signInAnonymously(auth);
        } catch (error: any) {
          console.error("Erro no login anônimo:", error);
          setConnectionError(`Erro no login: ${error.message}`);
          loadFromLocalStorage();
          setIsOffline(true);
          setIsInitialized(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loadFromLocalStorage = () => {
    const savedState = localStorage.getItem('metodo_reinventar_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setAnswers(parsed.answers || {});
        setCompletedCategories(parsed.completedCategories || []);
      } catch (e) {
        console.error("Erro ao ler localStorage", e);
      }
    }
  };

  // Persistência APENAS LocalStorage (Backup)
  useEffect(() => {
    if (!isInitialized) return;
    const dataToSave = {
      answers,
      completedCategories,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('metodo_reinventar_state', JSON.stringify(dataToSave));
  }, [answers, completedCategories, isInitialized]);

  const goToScreen = (screen: string) => setCurrentScreen(screen);

  const selectCategory = (key: string) => {
    setCurrentCategoryKey(key);
    setCurrentScreen('quote');
    setTimeout(() => {
      setCurrentScreen('deck');
    }, 2500);
  };

  const selectCard = (index: number) => {
    setCurrentQuestionIndex(index);
    setCurrentScreen('card');
  };

  const getFormattedAnswerKey = useCallback(() => {
    if (!currentCategoryKey || currentQuestionIndex === null) return '';
    return `${currentCategoryKey}-${currentQuestionIndex}`;
  }, [currentCategoryKey, currentQuestionIndex]);

  const saveAnswer = async (text: string) => {
    const key = getFormattedAnswerKey();
    if (!key) return;

    // 1. Atualiza estado local (Feedback instantâneo na UI)
    setAnswers(prev => ({ ...prev, [key]: text }));

    // 2. Salva no Firestore (Se online)
    if (!isOffline && userUid && db) {
      try {
        const userRef = doc(db, "users", userUid);
        await setDoc(userRef, {
          answers: {
            [key]: text
          },
          lastUpdated: new Date().toISOString()
        }, { merge: true });
        console.log(`✅ Resposta salva no Firestore: ${key}`);
      } catch (e: any) {
        if (e.code === 'permission-denied') {
          console.warn("⚠️ Permissão de escrita negada.");
          setConnectionError("Falha ao salvar: Acesso negado (Regras Firestore).");
          setIsOffline(true);
        } else {
          console.error("❌ Erro ao salvar resposta no Firestore:", e);
        }
      }
    }
  };

  const completeCategory = async () => {
    if (currentCategoryKey) {
      let newCompletedList = completedCategories;
      if (!completedCategories.includes(currentCategoryKey)) {
        newCompletedList = [...completedCategories, currentCategoryKey];
        setCompletedCategories(newCompletedList);

        if (!isOffline && userUid && db) {
          try {
             const userRef = doc(db, "users", userUid);
             await updateDoc(userRef, {
                completedCategories: arrayUnion(currentCategoryKey),
                lastUpdated: new Date().toISOString()
             });
             console.log(`✅ Categoria completada salva no Firestore: ${currentCategoryKey}`);
          } catch (e: any) {
             if (e.code === 'permission-denied') {
                 console.warn("⚠️ Permissão de atualização negada.");
                 setConnectionError("Falha ao salvar: Acesso negado (Regras Firestore).");
                 setIsOffline(true);
             } else {
                 try {
                     const userRef = doc(db, "users", userUid);
                     await setDoc(userRef, {
                        completedCategories: newCompletedList,
                        lastUpdated: new Date().toISOString()
                     }, { merge: true });
                 } catch (retryError: any) {
                     if (retryError.code !== 'permission-denied') {
                        console.error("Falha no fallback setDoc:", retryError);
                     }
                 }
             }
          }
        }
      }

      const newCompletedCount = newCompletedList.length;
      if (newCompletedCount >= 5) {
        setCurrentScreen('audit');
      } else {
        setCurrentScreen('selection'); 
      }
    }
  };

  // Função para limpar progresso
  const resetProgress = async (skipConfirm: boolean = false) => {
    if (skipConfirm || window.confirm("Tem certeza que deseja apagar todo o progresso?")) {
      // 1. Limpeza Imediata (UI First)
      setAnswers({});
      setCompletedCategories([]);
      setCurrentCategoryKey(null);
      setCurrentQuestionIndex(null);
      localStorage.removeItem('metodo_reinventar_state');
      setCurrentScreen('landing');
      
      // 2. Limpeza no Banco (Background)
      if (!isOffline && userUid && db) {
        try {
          const userRef = doc(db, "users", userUid);
          // Substitui o documento inteiro por um vazio/novo
          await setDoc(userRef, {
            answers: {},
            completedCategories: [],
            resetAt: new Date().toISOString()
          });
          console.log("Progresso resetado no Firestore.");
        } catch (e) {
          console.error("Erro ao resetar no Firestore (mas local foi limpo)", e);
        }
      }
    }
  };

  return (
    <GameContext.Provider value={{
      currentScreen,
      currentCategoryKey,
      currentQuestionIndex,
      answers,
      completedCategories,
      isOffline,
      connectionError,
      isInitialized,
      userUid,
      goToScreen,
      selectCategory,
      selectCard,
      saveAnswer,
      completeCategory,
      getFormattedAnswerKey,
      resetProgress
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};
