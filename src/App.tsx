import { useState, useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import SettingsModal from './components/SettingsModal';
import EmptyState from './components/EmptyState';
import { promptCategories, getPromptById } from './prompts';
import { Conversation, Message, AppSettings } from './types';
import { sendChatMessage } from './utils/openai';
import { loadConversations, saveConversations, loadSettings, saveSettings, exportConversations, importConversations } from './utils/storage';
import { useDarkMode } from './hooks/useDarkMode';
import { trackEvent, initAnalytics } from './utils/analytics';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    model: 'gpt-4o',
    temperature: 0.7,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isDarkMode, toggleDarkMode} = useDarkMode();

  // Load data on mount
  useEffect(() => {
    initAnalytics();
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    setConversations(loadConversations());
  }, []);

  // Save conversations whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const handleNewChat = () => {
    setCurrentConversation(null);
    setError(null);
  };

  const handleSelectPrompt = (categoryId: string, promptId: string) => {
    const prompt = getPromptById(promptId);
    if (!prompt) return;

    trackEvent('conversation_created', { categoryId, promptId });

    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: prompt.title,
      messages: [],
      promptCategory: categoryId,
      promptId: promptId,
      timestamp: Date.now(),
    };

    // Add system message
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: prompt.systemPrompt,
      timestamp: Date.now(),
    };

    newConversation.messages.push(systemMessage);

    // Add initial message if exists
    if (prompt.initialMessage) {
      const initialMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: prompt.initialMessage,
        timestamp: Date.now() + 1,
      };
      newConversation.messages.push(initialMessage);
    }

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    setError(null);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setError(null);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleExportConversations = () => {
    try {
      exportConversations(conversations);
      trackEvent('conversations_exported', { count: conversations.length });
      // Success notification could be added here
    } catch (err) {
      setError('Failed to export conversations');
    }
  };

  const handleImportConversations = async (file: File) => {
    try {
      const importedConversations = await importConversations(file);
      
      // Merge with existing conversations (avoid duplicates by ID)
      const existingIds = new Set(conversations.map(c => c.id));
      const newConversations = importedConversations.filter(c => !existingIds.has(c.id));
      
      if (newConversations.length === 0) {
        setError('No new conversations to import');
        return;
      }
      
      const merged = [...newConversations, ...conversations];
      setConversations(merged);
      saveConversations(merged);
      
      trackEvent('conversations_imported', { count: newConversations.length });
      
      // Success feedback
      setError(null);
      alert(`Successfully imported ${newConversations.length} conversation(s)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import conversations');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversation) return;

    setError(null);
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
    };

    setCurrentConversation(updatedConversation);
    setConversations((prev) =>
      prev.map((c) => (c.id === updatedConversation.id ? updatedConversation : c))
    );

    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now() + 1,
    };

    const conversationWithAssistant = {
      ...updatedConversation,
      messages: [...updatedConversation.messages, assistantMessage],
    };

    setCurrentConversation(conversationWithAssistant);

    try {
      trackEvent('message_sent');
      
      await sendChatMessage(
        settings.apiKey,
        settings.model,
        settings.temperature,
        updatedConversation.messages,
        (chunk) => {
          assistantMessage.content += chunk;
          setCurrentConversation({ ...conversationWithAssistant });
        }
      );

      // Save the completed conversation
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationWithAssistant.id ? conversationWithAssistant : c))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove the failed assistant message
      setCurrentConversation(updatedConversation);
      setConversations((prev) =>
        prev.map((c) => (c.id === updatedConversation.id ? updatedConversation : c))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const visibleMessages = currentConversation?.messages.filter((m) => m.role !== 'system') || [];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      <Sidebar
        promptCategories={promptCategories}
        conversations={conversations}
        currentConversation={currentConversation}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onSelectPrompt={handleSelectPrompt}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportConversations={handleExportConversations}
        onImportConversations={handleImportConversations}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
      />

      <div className="flex-1 flex flex-col">
        {!currentConversation ? (
          <EmptyState />
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentConversation.title}
              </h2>
              {currentConversation.promptId && (
                <p className="text-sm text-gray-600 mt-1">
                  {getPromptById(currentConversation.promptId)?.description}
                </p>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto w-full">
                {visibleMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-4 p-6 bg-gray-50">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-2">AI Coach</div>
                      <div className="text-gray-500">Thinking...</div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-t border-red-200 px-6 py-3">
                <div className="max-w-4xl mx-auto flex items-center gap-2 text-red-800">
                  <AlertCircle size={18} />
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Input */}
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder="Ask a question or share your thoughts..."
            />
          </>
        )}
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <AnalyticsDashboard
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
    </div>
  );
}

export default App;
