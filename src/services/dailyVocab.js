export const DAILY_VOCABULARY = [
  // IT & Tech Terms
  {
    id: 'v1',
    word: 'Refactor',
    phonetic: '/riːˈfæktər/',
    category: 'IT Engineering',
    level: 'Beginner',
    definition: 'Restructuring existing computer code without changing its external behavior.',
    example: 'I need to refactor this function to make it cleaner and faster.',
    itContext: 'Used daily in code reviews and standups when improving code quality.'
  },
  {
    id: 'v2',
    word: 'Bottleneck',
    phonetic: '/ˈbɒtl.nek/',
    category: 'IT Engineering',
    level: 'Beginner',
    definition: 'A point of congestion in a system that slows down overall performance.',
    example: 'The database query was the main bottleneck causing page delays.',
    itContext: 'Used when discussing performance optimization and architecture.'
  },
  {
    id: 'v3',
    word: 'Asynchronous',
    phonetic: '/eɪˈsɪŋkrənəs/',
    category: 'IT Engineering',
    level: 'Intermediate',
    definition: 'Operations that run independently without waiting for each other to finish.',
    example: 'We use asynchronous API calls to load user data without freezing the UI.',
    itContext: 'Essential for web development, Node.js, and background jobs.'
  },
  {
    id: 'v4',
    word: 'Decouple',
    phonetic: '/diːˈkʌp.əl/',
    category: 'IT Engineering',
    level: 'Intermediate',
    definition: 'Separating components so they operate independently.',
    example: 'We decoupled the notification service from the payment system.',
    itContext: 'Used in system design and microservice architecture conversations.'
  },
  {
    id: 'v5',
    word: 'Impediment',
    phonetic: '/ɪmˈped.ɪ.mənt/',
    category: 'Agile & Standup',
    level: 'Beginner',
    definition: 'Anything that slows down or stops progress (a blocker).',
    example: 'My main impediment today is waiting for staging environment access.',
    itContext: 'Professional corporate term for "blocker" during daily standups.'
  },

  // Daily Use English Words
  {
    id: 'v6',
    word: 'Elaborate',
    phonetic: '/ɪˈlæb.ə.reɪt/',
    category: 'Daily English',
    level: 'Beginner',
    definition: 'To explain something in greater detail.',
    example: 'Could you please elaborate on your proposed solution?',
    itContext: 'Great polite phrase to use during meetings when you want more details.'
  },
  {
    id: 'v7',
    word: 'Concise',
    phonetic: '/kənˈsaɪs/',
    category: 'Daily English',
    level: 'Beginner',
    definition: 'Giving a lot of information clearly and in a few words.',
    example: 'Please keep your standup update short and concise.',
    itContext: 'Highly valued attribute in engineering documentation and updates.'
  },
  {
    id: 'v8',
    word: 'Perspective',
    phonetic: '/pəˈspek.tɪv/',
    category: 'Daily English',
    level: 'Beginner',
    definition: 'A particular attitude or way of considering something (an opinion).',
    example: 'From my perspective, starting with automated tests is the safest route.',
    itContext: 'Replaces "According to me" with polished corporate English.'
  },
  {
    id: 'v9',
    word: 'Prioritize',
    phonetic: '/praɪˈɒr.ɪ.taɪz/',
    category: 'Daily English',
    level: 'Beginner',
    definition: 'Treat something as more important than other things.',
    example: 'We need to prioritize fixing the critical authentication bug today.',
    itContext: 'Used daily in task allocation, sprint planning, and team syncs.'
  },
  {
    id: 'v10',
    word: 'Reiterate',
    phonetic: '/riːˈɪt.ər.eɪt/',
    category: 'Daily English',
    level: 'Intermediate',
    definition: 'To say something again for emphasis or clarity.',
    example: 'I want to reiterate that our main goal is maintaining zero downtime.',
    itContext: 'Excellent executive word for summarizing key meeting decisions.'
  }
];

const STORAGE_KEY_LEARNED_WORDS = 'sivi_tech_learned_vocab';

export const getLearnedWordIds = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_LEARNED_WORDS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const toggleLearnedWord = (wordId) => {
  const current = getLearnedWordIds();
  let updated;
  if (current.includes(wordId)) {
    updated = current.filter(id => id !== wordId);
  } else {
    updated = [...current, wordId];
  }
  localStorage.setItem(STORAGE_KEY_LEARNED_WORDS, JSON.stringify(updated));
  return updated;
};

export const getTodayVocabObjectives = () => {
  const learnedIds = getLearnedWordIds();
  return DAILY_VOCABULARY.map(w => ({
    ...w,
    isLearned: learnedIds.includes(w.id)
  }));
};
