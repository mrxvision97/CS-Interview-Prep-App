export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  promptCategory?: string;
  promptId?: string;
  timestamp: number;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  systemPrompt: string;
  initialMessage?: string;
  icon: string;
  category: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

export interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompts: PromptTemplate[];
}

export interface AppSettings {
  apiKey: string;
  model: string;
  temperature: number;
}

