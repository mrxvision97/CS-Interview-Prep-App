import { X, TrendingUp, MessageSquare, Clock, Award, Download, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAnalyticsSummary, exportAnalytics, clearAnalytics } from '../utils/analytics';
import { getPromptById } from '../prompts';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyticsDashboard({ isOpen, onClose }: AnalyticsDashboardProps) {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setSummary(getAnalyticsSummary());
    }
  }, [isOpen]);

  if (!isOpen || !summary) return null;

  const handleExport = () => {
    exportAnalytics();
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
      clearAnalytics();
      setSummary(getAnalyticsSummary());
    }
  };

  const formatDuration = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return `< 1h`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Your Progress</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={20} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Conversations</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {summary.stats.conversationsCreated}
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award size={20} className="text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Messages</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {summary.stats.messagesTotal}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {summary.stats.categoriesExplored}
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Active</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatDuration(summary.sessionDuration)}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last 24 hours</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {summary.recentActivity.last24h} events
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last 7 days</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {summary.recentActivity.lastWeek} events
                </p>
              </div>
            </div>
          </div>

          {/* Most Used Prompts */}
          {summary.mostUsedPrompts.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Most Used Prompts</h3>
              <div className="space-y-2">
                {summary.mostUsedPrompts.map((item: any, index: number) => {
                  const prompt = getPromptById(item.promptId);
                  return (
                    <div
                      key={item.promptId}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400 dark:text-gray-600">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {prompt?.title || item.promptId}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {prompt?.description || 'Custom prompt'}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                        {item.count} uses
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Categories Explored */}
          {summary.stats.categoriesList.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Topics Explored ({summary.stats.categoriesList.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {summary.stats.categoriesList.map((categoryId: string) => (
                  <span
                    key={categoryId}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm capitalize"
                  >
                    {categoryId.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
            <span className="text-sm font-medium">Clear Data</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

