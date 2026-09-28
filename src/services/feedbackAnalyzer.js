// Common IT ESL Grammar Patterns & Fixes
const GRAMMAR_RULES = [
  {
    pattern: /\bdiscuss\s+about\b/i,
    correction: "discuss",
    explanation: "'Discuss' is a transitive verb. Do not add 'about' after 'discuss'.",
    example: "Incorrect: 'Let's discuss about the bug.' → Correct: 'Let's discuss the bug.'"
  },
  {
    pattern: /\bworking\s+since\s+(\d+|\w+)\s+(years|months)\b/i,
    correction: "have been working for $1 $2",
    explanation: "Use 'for' with duration of time (2 years), and 'since' with a starting point (since 2022).",
    example: "'I have been working for 3 years' instead of 'working since 3 years'."
  },
  {
    pattern: /\bhe\s+don'?t\b/i,
    correction: "he doesn't",
    explanation: "Third-person singular 'he' requires 'doesn't', not 'don't'.",
    example: "'He doesn't understand the requirement.'"
  },
  {
    pattern: /\bshe\s+don'?t\b/i,
    correction: "she doesn't",
    explanation: "Third-person singular 'she' requires 'doesn't'.",
    example: "'She doesn't have access to the repo.'"
  },
  {
    pattern: /\bit\s+don'?t\b/i,
    correction: "it doesn't",
    explanation: "Third-person singular 'it' requires 'doesn't'.",
    example: "'It doesn't build cleanly.'"
  },
  {
    pattern: /\bmore\s+better\b/i,
    correction: "much better / better",
    explanation: "Avoid double comparatives. Use 'better' or 'much better'.",
    example: "'This approach is much better.'"
  },
  {
    pattern: /\bmore\s+faster\b/i,
    correction: "much faster / faster",
    explanation: "Avoid double comparatives like 'more faster'.",
    example: "'The search query runs much faster now.'"
  },
  {
    pattern: /\bexplained\s+me\b/i,
    correction: "explained to me",
    explanation: "Use 'explained to me' when addressing a person.",
    example: "'The team lead explained to me how the deployment script works.'"
  },
  {
    pattern: /\baccording\s+to\s+me\b/i,
    correction: "in my opinion / from my perspective",
    explanation: "'According to' is used for external sources. For personal thoughts, use 'In my opinion' or 'From my perspective'.",
    example: "'In my opinion, we should refactor this service.'"
  },
  {
    pattern: /\bI\s+am\s+having\s+(\d+)\s+years\s+experience\b/i,
    correction: "I have $1 years of experience",
    explanation: "Use simple present 'I have' for permanent states or experience, not continuous 'I am having'.",
    example: "'I have 5 years of software development experience.'"
  },
  {
    pattern: /\breturn\s+back\b/i,
    correction: "return",
    explanation: "'Return' already means to go or give back. Adding 'back' is redundant.",
    example: "'I will return to this task after the meeting.'"
  },
  {
    pattern: /\brevert\s+back\b/i,
    correction: "reply / respond / revert",
    explanation: "'Revert back' is redundant in corporate communication. Use 'reply' or simply 'revert'.",
    example: "'I will reply with the log details shortly.'"
  }
];

const FILLER_WORDS = ['um', 'uh', 'basically', 'like', 'actually', 'you know', 'literally', 'honestly', 'sort of', 'kind of'];

const IT_VOCAB_UPGRADES = [
  { basic: /\bfixed the bug\b/i, suggestion: "resolved the regression issue / hotfixed the defect" },
  { basic: /\bmade it fast\b/i, suggestion: "optimized performance bottlenecks / improved execution speed" },
  { basic: /\btalked to\b/i, suggestion: "aligned with / collaborated with" },
  { basic: /\bbig problem\b/i, suggestion: "critical impediment / blocker / architectural challenge" },
  { basic: /\bchange the code\b/i, suggestion: "refactor the implementation / update the codebase" },
  { basic: /\bcheck the code\b/i, suggestion: "perform a thorough code review / inspect the logs" },
  { basic: /\btry to do\b/i, suggestion: "endeavor to execute / prioritize delivery of" },
  { basic: /\bdid not work\b/i, suggestion: "encountered a failure / did not meet acceptance criteria" }
];

export const analyzeSpeechTurn = (userText, durationSeconds = 10) => {
  if (!userText || userText.trim().length === 0) {
    return {
      text: "",
      wordCount: 0,
      wpm: 0,
      fillerCount: 0,
      detectedFillers: [],
      grammarIssues: [],
      vocabSuggestions: [],
      score: 100,
      paceRating: 'Optimal'
    };
  }

  const cleanText = userText.trim();
  const words = cleanText.split(/\s+/);
  const wordCount = words.length;
  
  // Calculate WPM
  const minutes = Math.max(durationSeconds / 60, 0.1);
  const wpm = Math.round(wordCount / minutes);

  let paceRating = 'Optimal';
  if (wpm < 90) paceRating = 'Too Slow';
  else if (wpm > 170) paceRating = 'Too Fast';

  // Filler words detection
  const detectedFillers = [];
  let fillerCount = 0;

  words.forEach(w => {
    const sanitized = w.toLowerCase().replace(/[^a-z]/g, '');
    if (FILLER_WORDS.includes(sanitized)) {
      fillerCount++;
      if (!detectedFillers.includes(sanitized)) {
        detectedFillers.push(sanitized);
      }
    }
  });

  // Grammar rule checking
  const grammarIssues = [];
  GRAMMAR_RULES.forEach(rule => {
    if (rule.pattern.test(cleanText)) {
      const match = cleanText.match(rule.pattern);
      grammarIssues.push({
        foundText: match ? match[0] : 'grammar pattern',
        correction: rule.correction,
        explanation: rule.explanation,
        example: rule.example
      });
    }
  });

  // IT Vocab upgrade suggestions
  const vocabSuggestions = [];
  IT_VOCAB_UPGRADES.forEach(item => {
    if (item.basic.test(cleanText)) {
      const match = cleanText.match(item.basic);
      vocabSuggestions.push({
        phrase: match ? match[0] : 'phrase',
        suggestion: item.suggestion
      });
    }
  });

  // Score computation
  let score = 100;
  score -= (grammarIssues.length * 12);
  score -= (fillerCount * 4);
  if (paceRating !== 'Optimal') score -= 8;

  score = Math.max(Math.min(score, 100), 40);

  return {
    text: cleanText,
    wordCount,
    wpm,
    fillerCount,
    detectedFillers,
    grammarIssues,
    vocabSuggestions,
    score,
    paceRating
  };
};

export const generateCallOverallReport = (transcript, totalDurationSeconds) => {
  const userTurns = transcript.filter(t => t.sender === 'user');
  
  if (userTurns.length === 0) {
    return {
      overallScore: 85,
      grammarScore: 90,
      vocabScore: 82,
      fluencyScore: 85,
      totalWords: 0,
      totalFillers: 0,
      averageWpm: 125,
      paceSummary: 'Optimal',
      allGrammarIssues: [],
      allVocabSuggestions: [],
      keyTakeaways: ["Keep practicing clear structured responses using the STAR format."]
    };
  }

  let totalWords = 0;
  let totalFillers = 0;
  let totalScoreSum = 0;
  const allGrammarIssues = [];
  const allVocabSuggestions = [];

  userTurns.forEach(turn => {
    const analysis = analyzeSpeechTurn(turn.text, 15);
    totalWords += analysis.wordCount;
    totalFillers += analysis.fillerCount;
    totalScoreSum += analysis.score;
    
    analysis.grammarIssues.forEach(g => {
      if (!allGrammarIssues.some(existing => existing.foundText === g.foundText)) {
        allGrammarIssues.push(g);
      }
    });

    analysis.vocabSuggestions.forEach(v => {
      if (!allVocabSuggestions.some(existing => existing.phrase === v.phrase)) {
        allVocabSuggestions.push(v);
      }
    });
  });

  const minutes = Math.max(totalDurationSeconds / 60, 0.5);
  const averageWpm = Math.round(totalWords / minutes);
  const avgTurnScore = Math.round(totalScoreSum / userTurns.length);

  const grammarScore = Math.max(100 - (allGrammarIssues.length * 15), 50);
  const vocabScore = Math.min(75 + (allVocabSuggestions.length * 8) + (totalWords > 100 ? 10 : 0), 98);
  const fluencyScore = Math.max(100 - (totalFillers * 3) - (averageWpm < 100 ? 10 : 0), 45);

  const overallScore = Math.round((avgTurnScore * 0.4) + (grammarScore * 0.3) + (fluencyScore * 0.3));

  const keyTakeaways = [];
  if (allGrammarIssues.length > 0) {
    keyTakeaways.push(`Focus on prepositions and tenses: review "${allGrammarIssues[0].foundText}" usage.`);
  }
  if (totalFillers > 3) {
    keyTakeaways.push(`Reduce filler words ("um", "basically"). Try pausing silently for 1 second instead.`);
  }
  if (allVocabSuggestions.length > 0) {
    keyTakeaways.push(`Elevate IT impact: replace "${allVocabSuggestions[0].phrase}" with "${allVocabSuggestions[0].suggestion}".`);
  }
  if (keyTakeaways.length < 2) {
    keyTakeaways.push("Great confidence! Continue practicing daily standups to maintain smooth pacing.");
  }

  return {
    overallScore,
    grammarScore,
    vocabScore,
    fluencyScore,
    totalWords,
    totalFillers,
    averageWpm,
    paceSummary: averageWpm > 165 ? 'Fast' : averageWpm < 100 ? 'Deliberate' : 'Optimal Pace',
    allGrammarIssues,
    allVocabSuggestions,
    keyTakeaways
  };
};

export const generateAIResponse = (userText, topic, avatar, turnCount = 1) => {
  const text = (userText || '').toLowerCase();
  
  // Entity & intent detection
  const mentionsBug = text.includes('bug') || text.includes('issue') || text.includes('stuck') || text.includes('error') || text.includes('fail') || text.includes('blocker');
  const mentionsTech = text.includes('react') || text.includes('node') || text.includes('python') || text.includes('api') || text.includes('database') || text.includes('aws') || text.includes('sql') || text.includes('code');
  const mentionsTime = text.includes('yesterday') || text.includes('today') || text.includes('weekend') || text.includes('hour') || text.includes('day') || text.includes('week');
  const mentionsFood = text.includes('coffee') || text.includes('tea') || text.includes('food') || text.includes('order') || text.includes('lunch') || text.includes('drink') || text.includes('cafe');
  const mentionsSalary = text.includes('salary') || text.includes('lpa') || text.includes('package') || text.includes('offer') || text.includes('bonus') || text.includes('pay') || text.includes('money');

  // Scenario specific dynamic responses
  if (topic.id === 'daily_standup') {
    if (mentionsBug) {
      return `I understand! Blockers happen. What specific error log are you seeing, and do you need a 10-minute screen share with senior devs?`;
    }
    if (mentionsTech || mentionsTime) {
      return `Got it! Thanks for that detailed update on your ticket. What is your primary deliverable for today, and do you have any PR ready for review?`;
    }
    return `Great update! You explained your progress clearly. Is there anything else holding up your staging deployment before we wrap up?`;
  }

  if (topic.id === 'tech_interview') {
    if (mentionsTech) {
      return `That sounds like a solid choice! How did you handle data consistency and latency when using those technologies under high traffic?`;
    }
    if (mentionsBug) {
      return `Handling bottlenecks is crucial! What monitoring tools or logs did you inspect to pinpoint that performance bottleneck?`;
    }
    return `Very clear technical response! Could you share how you ensured high availability and tested your code before going live?`;
  }

  if (topic.id === 'behavioral_interview') {
    if (text.includes('result') || text.includes('complete') || text.includes('deliver')) {
      return `That is a strong STAR result! How did your manager or stakeholders react to that outcome?`;
    }
    return `That situation sounds challenging! What specific actions did you personally take to keep the team aligned?`;
  }

  if (topic.id === 'salary_negotiation') {
    if (mentionsSalary) {
      return `Thank you for sharing your expectation! We really value your expertise. If we align on your target salary, would you be ready to accept the official offer letter?`;
    }
    return `Understood! Beyond base compensation, are health benefits, joining bonuses, or remote work flexibility important factors for you?`;
  }

  if (topic.id === 'casual_coffee' || topic.id === 'ordering_food') {
    if (mentionsFood) {
      return `Sounds delicious! Do you usually prefer having that for breakfast or lunch?`;
    }
    if (mentionsTime) {
      return `Nice! How do you like to relax or recharge your energy after a busy week of work?`;
    }
    return `Haha, that's great! It's always nice to take a quick breather during the workday. What else do you enjoy doing in your free time?`;
  }

  if (topic.id === 'pr_review') {
    return `Makes total sense! I appreciate how you structured the pull request and added test coverage. Let's merge this into staging right away!`;
  }

  if (topic.id === 'outage_call') {
    return `Understood! Good quick thinking under pressure. Let's monitor the error metrics for another 10 minutes to verify latency has normalized.`;
  }

  // Dynamic conversational fallbacks
  const dynamicFallbacks = [
    `That is a very clear point! Could you elaborate slightly on how that impacts your overall goals?`,
    `I really like how you expressed that! How would you explain that concept in a high-stakes presentation or meeting?`,
    `Great answer! You used natural phrasing there. What would be the next step you would take in this scenario?`,
    `Well said! Your pacing and clarity were excellent. Is there any other detail you'd like to add before we move forward?`
  ];

  return dynamicFallbacks[turnCount % dynamicFallbacks.length];
};
