import { Conversation, AppSettings } from '../types';

const CONVERSATIONS_KEY = 'cs_interview_conversations';
const SETTINGS_KEY = 'cs_interview_settings';

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error('Failed to save conversations:', error);
  }
}

export function loadConversations(): Conversation[] {
  try {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load conversations:', error);
    return [];
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    const saved = data ? JSON.parse(data) : null;
    
    // Check for environment variables (Vite uses import.meta.env)
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    const envModel = import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4o';
    const envTemperature = parseFloat(import.meta.env.VITE_DEFAULT_TEMPERATURE || '0.7');
    
    // Priority: localStorage > environment variables > defaults
    return {
      apiKey: saved?.apiKey || envApiKey || '',
      model: saved?.model || envModel || 'gpt-4o',
      temperature: saved?.temperature ?? envTemperature ?? 0.7,
    };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
      model: import.meta.env.VITE_DEFAULT_MODEL || 'gpt-4o',
      temperature: parseFloat(import.meta.env.VITE_DEFAULT_TEMPERATURE || '0.7'),
    };
  }
}

// Export/Import functionality
export function exportConversations(conversations: Conversation[]): void {
  try {
    const dataStr = JSON.stringify(conversations, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cs-interview-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export conversations:', error);
    throw new Error('Failed to export conversations');
  }
}

export function importConversations(file: File): Promise<Conversation[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = event.target?.result as string;
        const conversations = JSON.parse(data) as Conversation[];
        
        // Validate the data structure
        if (!Array.isArray(conversations)) {
          throw new Error('Invalid file format: expected an array of conversations');
        }
        
        // Basic validation of conversation structure
        for (const conv of conversations) {
          if (!conv.id || !conv.title || !Array.isArray(conv.messages)) {
            throw new Error('Invalid conversation structure');
          }
        }
        
        resolve(conversations);
      } catch (error) {
        console.error('Failed to parse import file:', error);
        reject(new Error('Invalid file format or corrupted data'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

