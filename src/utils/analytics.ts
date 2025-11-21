// Privacy-first analytics system
// All analytics are stored locally and can be exported by the user
// No data is sent to external servers unless user explicitly enables it

interface AnalyticsEvent {
  type: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

interface AnalyticsData {
  sessionStart: number;
  events: AnalyticsEvent[];
  stats: {
    conversationsCreated: number;
    messagesTotal: number;
    promptsUsed: Record<string, number>;
    categoriesExplored: Set<string>;
    exportCount: number;
    importCount: number;
  };
}

const ANALYTICS_KEY = 'cs_interview_analytics';

// Initialize or load analytics data
function getAnalyticsData(): AnalyticsData {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Convert Set back from array
      parsed.stats.categoriesExplored = new Set(parsed.stats.categoriesExplored || []);
      return parsed;
    }
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }

  return {
    sessionStart: Date.now(),
    events: [],
    stats: {
      conversationsCreated: 0,
      messagesTotal: 0,
      promptsUsed: {},
      categoriesExplored: new Set(),
      exportCount: 0,
      importCount: 0,
    },
  };
}

// Save analytics data
function saveAnalyticsData(data: AnalyticsData): void {
  try {
    // Convert Set to array for JSON serialization
    const toSave = {
      ...data,
      stats: {
        ...data.stats,
        categoriesExplored: Array.from(data.stats.categoriesExplored),
      },
    };
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save analytics:', error);
  }
}

// Track an event
export function trackEvent(type: string, metadata?: Record<string, any>): void {
  const data = getAnalyticsData();
  
  data.events.push({
    type,
    timestamp: Date.now(),
    metadata,
  });

  // Update stats based on event type
  switch (type) {
    case 'conversation_created':
      data.stats.conversationsCreated++;
      if (metadata?.promptId) {
        data.stats.promptsUsed[metadata.promptId] = 
          (data.stats.promptsUsed[metadata.promptId] || 0) + 1;
      }
      if (metadata?.categoryId) {
        data.stats.categoriesExplored.add(metadata.categoryId);
      }
      break;
    case 'message_sent':
      data.stats.messagesTotal++;
      break;
    case 'conversations_exported':
      data.stats.exportCount++;
      break;
    case 'conversations_imported':
      data.stats.importCount++;
      break;
  }

  // Keep only last 1000 events to avoid storage issues
  if (data.events.length > 1000) {
    data.events = data.events.slice(-1000);
  }

  saveAnalyticsData(data);
}

// Get analytics summary
export function getAnalyticsSummary() {
  const data = getAnalyticsData();
  const now = Date.now();
  const sessionDuration = now - data.sessionStart;

  // Get most used prompts
  const mostUsedPrompts = Object.entries(data.stats.promptsUsed)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([promptId, count]) => ({ promptId, count }));

  // Calculate daily usage
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  
  const eventsLast24h = data.events.filter(e => e.timestamp > oneDayAgo).length;
  const eventsLastWeek = data.events.filter(e => e.timestamp > oneWeekAgo).length;

  return {
    sessionDuration,
    totalEvents: data.events.length,
    stats: {
      ...data.stats,
      categoriesExplored: data.stats.categoriesExplored.size,
      categoriesList: Array.from(data.stats.categoriesExplored),
    },
    mostUsedPrompts,
    recentActivity: {
      last24h: eventsLast24h,
      lastWeek: eventsLastWeek,
    },
  };
}

// Export analytics data
export function exportAnalytics(): void {
  const data = getAnalyticsData();
  const summary = getAnalyticsSummary();

  const exportData = {
    exportDate: new Date().toISOString(),
    ...summary,
    allEvents: data.events,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `cs-interview-analytics-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Clear analytics data
export function clearAnalytics(): void {
  localStorage.removeItem(ANALYTICS_KEY);
}

// Track page/app load
export function initAnalytics(): void {
  trackEvent('app_loaded');
}

