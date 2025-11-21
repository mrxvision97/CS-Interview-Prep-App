import { useState, useEffect } from 'react';
import { X, Moon, Sun } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  isDarkMode,
  onToggleDarkMode,
}: SettingsModalProps) {
  const [temperature, setTemperature] = useState(settings.temperature);

  useEffect(() => {
    if (isOpen) {
      setTemperature(settings.temperature);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      apiKey: settings.apiKey, // Keep existing
      model: settings.model, // Keep existing
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

