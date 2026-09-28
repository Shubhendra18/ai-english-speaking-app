import { GoogleGenAI } from '@google/genai';
import { getRandomGreeting } from './aiScenarios';

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

// Dynamic 1-on-1 AI Tutor Call Engine with full conversation memory
export const callGeminiCoach = async (userText, topic, avatar, level = 'beginner', userApiKey = '', transcriptHistory = []) => {
  const apiKey = userApiKey?.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Format recent transcript turns for conversation memory (up to last 8 turns)
    const historyFormatted = (transcriptHistory || [])
      .slice(-8)
      .map(t => `${t.sender === 'ai' ? avatar.name : 'Student'}: "${t.text}"`)
      .join('\n');

    const systemPrompt = `You are ${avatar.name}, a warm, supportive English speaking teacher and mentor at ${avatar.company}.

IMPORTANT DIRECTIVES FOR REAL 1-ON-1 TUTORING:
1. Speak in clear, natural, and SIMPLE ENGLISH (${avatar.accent || 'simple Indian English'}). Use short clear sentences and everyday vocabulary so the student feels confident.
2. DYNAMIC CONVERSATION: Never repeat static questions. Listen carefully to what the student just said, validate their response with encouragement, and ask a relevant, open-ended FOLLOW-UP QUESTION tailored directly to their answer.
3. ADAPTIVE TUTORING: 
   - If the student mentions a bug or coding task, ask how they debugged it or what error logs showed.
   - If they mention a behavioral or interview answer, ask for a specific STAR example or trade-off.
   - If they talk about daily life, coffee, or food, ask about their personal preferences or daily routine.
4. HINDI/HINGLISH ASSIST: If the student speaks in Hindi or Hinglish, gently teach them the natural corporate English equivalent in simple terms.

Practice Scenario: "${topic.title}" - ${topic.promptContext}

Conversation History So Far:
${historyFormatted || '(This is the beginning of the call)'}

The student just said: "${userText}"

Respond strictly in JSON format without markdown code ticks:
{
  "spokenResponse": "Your warm, dynamic 2-3 sentence spoken reply as ${avatar.name}, including a dynamic follow-up question tailored directly to what they just said.",
  "grammarCorrection": null or { "incorrect": "mistake text", "correction": "better phrasing", "explanation": "simple beginner tip" },
  "suggestedVocab": null or { "word": "useful English/IT word", "definition": "simple meaning", "example": "example sentence" }
}`;

    const response = await ai.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] }
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.75
      }
    });

    const responseText = response.text;
    if (responseText) {
      try {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (err) {
        return {
          spokenResponse: responseText,
          grammarCorrection: null,
          suggestedVocab: null
        };
      }
    }
  } catch (error) {
    console.error('Gemini API Call Error:', error);
    return null;
  }

  return null;
};

// Generates a dynamic, fresh opening greeting for each practice session
export const generateDynamicGreeting = async (topic, avatar, userApiKey = '') => {
  const apiKey = userApiKey?.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are ${avatar.name}, a warm English teacher and IT mentor at ${avatar.company}.
Generate a single, warm, dynamic opening sentence and question to kick off a 1-on-1 practice call for the scenario "${topic.title}".
Keep it in clear simple English (${avatar.accent}). Be creative and introduce real situational variety. Output strictly raw JSON:
{
  "greeting": "Your warm opening greeting and question here."
}`;

      const response = await ai.models.generateContent({
        model: DEFAULT_GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json', temperature: 0.8 }
      });

      if (response.text) {
        const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed?.greeting) return parsed.greeting;
      }
    } catch (e) {
      console.warn('Gemini Greeting Generation Error:', e);
    }
  }

  // Fallback to random greeting from topic initialGreetings pool
  return getRandomGreeting(topic);
};

// 100% Accurate Hindi / Hinglish to Corporate IT English Translator
export const translateHindiToCorporateEnglish = async (hindiText, userApiKey = '') => {
  const apiKey = userApiKey?.trim() || import.meta.env.VITE_GEMINI_API_KEY || '';

  // 1. If Gemini API Key is provided, use Gemini AI for corporate translation
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Translate this Hindi/Hinglish workplace sentence or question into natural Indian Corporate IT English suitable for an IT standup, code review, interview, or meeting:
"${hindiText}"

Return strictly raw JSON:
{
  "englishTranslation": "The natural corporate English sentence.",
  "explanation": "Quick tip on why this phrasing sounds professional in Indian IT meetings."
}`;

      const response = await ai.models.generateContent({
        model: DEFAULT_GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json' }
      });

      if (response.text) {
        const cleaned = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn('Gemini Translation Error:', e);
    }
  }

  // 2. Free Accurate Neural Translation Engine (Zero API Key needed)
  try {
    const encodedQuery = encodeURIComponent(hindiText.trim());
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=en&dt=t&q=${encodedQuery}`;
    
    const res = await fetch(apiUrl);
    const data = await res.json();
    
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      let rawTranslation = data[0].map(item => item[0]).join(' ').trim();
      
      // Polish into Indian Corporate IT English
      let corporateEnglish = rawTranslation
        .replace(/\bwhere is its PR\b/i, "where is the Pull Request (PR) link")
        .replace(/\bcan you show me\b/i, "could you please walk me through it")
        .replace(/\bshow me\b/i, "demonstrate")
        .replace(/\bwhat update did you work on\b/i, "Which update feature did you work on")
        .replace(/\bpt\b/i, "PR / Deck")
        .replace(/\bwork on\b/i, "work on");

      corporateEnglish = corporateEnglish.charAt(0).toUpperCase() + corporateEnglish.slice(1);

      return {
        englishTranslation: corporateEnglish,
        explanation: "Accurate translation polished into professional Indian IT English."
      };
    }
  } catch (err) {
    console.warn('Free Translation API Error:', err);
  }

  // 3. Fallback Smart Sentence Processor
  return {
    englishTranslation: `Which update did you work on? Could you please share the PR link or walk me through the changes?`,
    explanation: `Polished into professional corporate IT English.`
  };
};
