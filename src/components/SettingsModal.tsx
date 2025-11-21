import { useState, useEffect } from 'react';
import { X, Key, Zap, AlertCircle, Moon, Sun } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const AVAILABLE_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o (Latest & Recommended)', description: 'Most capable model' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and cost-effective' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Advanced reasoning' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and affordable' },
];

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  isDarkMode,
  onToggleDarkMode,
}: SettingsModalProps) {
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [temperature, setTemperature] = useState(settings.temperature);

  useEffect(() => {
    if (isOpen) {
      setApiKey(settings.apiKey);
      setModel(settings.model);
      setTemperature(settings.temperature);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      apiKey,
      model,
      temperature,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Key size={18} className="text-blue-600" />
              OpenAI API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-2 flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
              <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                Your API key is stored locally in your browser and never sent to any server except OpenAI.
                Get your key from{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium hover:text-blue-700"
                >
                  platform.openai.com
                </a>
              </p>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Zap size={18} className="text-purple-600" />
              Model
            </label>
            <div className="space-y-2">
              {AVAILABLE_MODELS.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    model === m.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="model"
                    value={m.id}
                    checked={model === m.id}
                    onChange={(e) => setModel(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{m.name}</div>
                    <div className="text-sm text-gray-600">{m.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Temperature: {temperature.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>More Focused</span>
              <span>More Creative</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Lower values make responses more focused and deterministic. Higher values make them more creative.
            </p>
          </div>

          {/* Dark Mode */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">
              Appearance
            </label>
            <button
              onClick={onToggleDarkMode}
              className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all bg-white"
            >
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon size={20} className="text-purple-600" /> : <Sun size={20} className="text-yellow-600" />}
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
                  </div>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-purple-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${isDarkMode ? 'translate-x-6 mt-0.5 ml-0.5' : 'translate-x-0.5 mt-0.5'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

