import { MessageSquare, Plus, Settings, Trash2, ChevronDown, ChevronRight, Download, Upload, TrendingUp } from 'lucide-react';
import { useState, useRef } from 'react';
import { Conversation, PromptCategory } from '../types';

interface SidebarProps {
  promptCategories: PromptCategory[];
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onSelectPrompt: (categoryId: string, promptId: string) => void;
  onOpenSettings: () => void;
  onExportConversations: () => void;
  onImportConversations: (file: File) => void;
  onOpenAnalytics: () => void;
}

export default function Sidebar({
  promptCategories,
  conversations,
  currentConversation,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onSelectPrompt,
  onOpenSettings,
  onExportConversations,
  onImportConversations,
  onOpenAnalytics,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['algorithms', 'behavioral'])
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <div className="w-80 bg-gray-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          CS Interview Prep
        </h1>
        <button
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          <span className="font-medium">New Conversation</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Interview Topics Section */}
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Interview Topics
          </h2>
          <div className="space-y-1">
            {promptCategories.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left group"
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                  <span className="text-2xl">{category.icon}</span>
                  <span className="flex-1 text-sm font-medium">{category.name}</span>
                  <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {category.prompts.length}
                  </span>
                </button>

                {expandedCategories.has(category.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {category.prompts.map((prompt) => (
                      <button
                        key={prompt.id}
                        onClick={() => onSelectPrompt(category.id, prompt.id)}
                        className="w-full flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-left group"
                      >
                        <span className="text-lg mt-0.5">{prompt.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
                            {prompt.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {prompt.description}
                          </div>
                          {prompt.difficulty && (
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                              {prompt.difficulty}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Conversations Section */}
        {conversations.length > 0 && (
          <div className="p-4 border-t border-gray-800">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Recent Conversations
            </h2>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    currentConversation?.id === conversation.id
                      ? 'bg-gray-800'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <MessageSquare size={16} className="text-gray-400 flex-shrink-0" />
                  <button
                    onClick={() => onSelectConversation(conversation)}
                    className="flex-1 text-left text-sm text-gray-300 hover:text-white transition-colors truncate"
                  >
                    {conversation.title}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all"
                    title="Delete conversation"
                  >
                    <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export/Import & Settings */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {conversations.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={onExportConversations}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              title="Export all conversations"
            >
              <Download size={16} />
              <span className="text-xs font-medium">Export</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
              title="Import conversations"
            >
              <Upload size={16} />
              <span className="text-xs font-medium">Import</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onImportConversations(file);
                  e.target.value = '';
                }
              }}
              className="hidden"
            />
          </div>
        )}
        <button
          onClick={onOpenAnalytics}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <TrendingUp size={18} />
          <span className="text-sm font-medium">Your Progress</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-300 hover:text-white"
        >
          <Settings size={18} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}

