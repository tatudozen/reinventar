
// @ts-ignore - Bypass missing type definitions for Firebase v9 modules
import { initializeApp } from 'firebase/app';
// @ts-ignore - Bypass missing type definitions for Firebase v9 modules
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração direta com as chaves fornecidas
// CORREÇÃO: O storageBucket geralmente segue o formato [project-id].appspot.com
const firebaseConfig = {
  apiKey: "AIzaSyBRpPMFCgfy1RXyfzOPs3BFvfvSc2b2Nd4",
  authDomain: "reinventar-168d5.firebaseapp.com",
  projectId: "reinventar-168d5",
  storageBucket: "reinventar-168d5.appspot.com", 
  messagingSenderId: "673882593310",
  appId: "1:673882593310:web:bd630ac68a3190a8c8360f"
};

// Inicializa variáveis
let app = null;
let auth = null;
let db = null;
let storage = null;
let isFirebaseInitialized = false;

try {
  // Inicializa Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  isFirebaseInitialized = true;
  console.log("🔥 Firebase inicializado com sucesso (Configuração Direta).");
} catch (error) {
  console.error("❌ Erro crítico ao inicializar Firebase:", error);
}

export { app, auth, db, storage, isFirebaseInitialized };
