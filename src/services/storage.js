const STORAGE_KEY_CALLS = 'sivi_tech_calls';
const STORAGE_KEY_STATS = 'sivi_tech_user_stats';
const STORAGE_KEY_SETTINGS = 'sivi_tech_settings';
const STORAGE_KEY_CUSTOM_TOPICS = 'sivi_tech_custom_topics';

export const getStoredCalls = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CALLS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load call logs', e);
    return [];
  }
};

export const saveCallLog = (callRecord) => {
  try {
    const calls = getStoredCalls();
    calls.unshift(callRecord); // add latest to top
    localStorage.setItem(STORAGE_KEY_CALLS, JSON.stringify(calls.slice(0, 50)));
    updateUserStats(callRecord);
    return true;
  } catch (e) {
    console.error('Failed to save call record', e);
    return false;
  }
};

export const getUserStats = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_STATS);
    if (data) return JSON.parse(data);
    
    // Default initial stats
    return {
      totalPracticeMinutes: 42,
      completedCalls: 7,
      averageFluency: 84,
      streakDays: 3,
      lastPracticeDate: new Date().toISOString().split('T')[0],
      topWeakness: 'Filler Words ("Basically", "Like")',
      masteredTopics: ['Daily Standup', 'Code Review']
    };
  } catch (e) {
    return {
      totalPracticeMinutes: 0,
      completedCalls: 0,
      averageFluency: 80,
      streakDays: 1,
      lastPracticeDate: new Date().toISOString().split('T')[0],
      topWeakness: 'Pace & Prepositions',
      masteredTopics: []
    };
  }
};

export const updateUserStats = (newCall) => {
  const current = getUserStats();
  const today = new Date().toISOString().split('T')[0];
  
  let newStreak = current.streakDays || 1;
  if (current.lastPracticeDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (current.lastPracticeDate === yesterday) {
      newStreak += 1;
    } else if (current.lastPracticeDate) {
      newStreak = 1;
    }
  }

  const newTotalCalls = (current.completedCalls || 0) + 1;
  const newMinutes = (current.totalPracticeMinutes || 0) + Math.ceil(newCall.durationSeconds / 60);
  
  // Calculate rolling average fluency
  const oldAvg = current.averageFluency || 80;
  const newAvg = Math.round((oldAvg * (newTotalCalls - 1) + newCall.score) / newTotalCalls);

  const updatedStats = {
    ...current,
    completedCalls: newTotalCalls,
    totalPracticeMinutes: newMinutes,
    averageFluency: newAvg,
    streakDays: newStreak,
    lastPracticeDate: today
  };

  localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(updatedStats));
  return updatedStats;
};

export const getSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
    return data ? JSON.parse(data) : {
      voiceAccent: 'en-US',
      speechRate: 1.0,
      strictness: 'medium', // relaxed, medium, strict
      autoFeedback: true,
      soundEffects: true,
      cameraEnabled: true
    };
  } catch (e) {
    return {
      voiceAccent: 'en-US',
      speechRate: 1.0,
      strictness: 'medium',
      autoFeedback: true,
      soundEffects: true,
      cameraEnabled: true
    };
  }
};

export const saveSettings = (newSettings) => {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
};

export const getCustomTopics = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CUSTOM_TOPICS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveCustomTopic = (topic) => {
  const topics = getCustomTopics();
  topics.push(topic);
  localStorage.setItem(STORAGE_KEY_CUSTOM_TOPICS, JSON.stringify(topics));
  return topics;
};
