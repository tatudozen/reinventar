
export interface Category {
  id: string;
  label: string;
  color: string;
  cardBackImage: string; // URL da imagem do verso da carta
  image?: string; 
  questions: string[];
}

export interface Quote {
  text: string;
  author: string;
}

export interface CategoriesData {
  [key: string]: Category;
}

export interface AppState {
  currentScreen: 'landing' | 'selection' | 'quote' | 'deck' | 'card' | 'audit';
  currentCategoryKey: string | null;
  currentQuestionIndex: number | null;
  answers: Record<string, string>; // key: "categoryId-questionIndex", value: answer
  completedCategories: string[];
}

export type CycleOrder = string[];
