import { GoogleGenAI, Type } from '@google/genai';
import { CandidateProfile, CurriculumDay, EvaluationResult, FinalFeedback, InterviewTurn } from '../types';
import { buildQuestionPrompt, buildEvaluationPrompt, buildFinalFeedbackPrompt } from './prompts';

let genAIInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIInstance) {
    try {
      genAIInstance = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI instance:', e);
      return null;
    }
  }
  return genAIInstance;
}

/**
 * Generate an interview question tailored to candidate profile and curriculum day.
 */
export async function generateQuestion(
  candidate: CandidateProfile,
  day: CurriculumDay,
  history: InterviewTurn[],
  isFollowUp: boolean = false,
  lastScore?: number,
  language: string = 'English'
): Promise<string> {
  const prompt = buildQuestionPrompt(candidate, day, history, isFollowUp, lastScore, language);

  try {
    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      const question = response.text?.trim();
      if (question && question.length > 10) {
        return question;
      }
    }
  } catch (err) {
    console.error('Gemini question generation failed, using fallback question:', err);
  }

  // Robust Fallback Question
  if (isFollowUp) {
    return `Looking back at Day ${day.day} (${day.title}), what specific debugging steps or metric checks would you perform when encountering production issues with ${day.keyConcepts[0] || 'this architecture'}?`;
  }
  return `In Day ${day.day} (${day.title}), suppose you are designing a production solution utilizing ${day.keyConcepts.join(', ')}. What key architectural trade-offs and failure modes would you evaluate?`;
}

/**
 * Evaluate a candidate's answer with full structured feedback and score.
 */
export async function evaluateAnswer(
  candidate: CandidateProfile,
  day: CurriculumDay,
  question: string,
  answer: string,
  language: string = 'English'
): Promise<EvaluationResult> {
  // Catch empty or extremely short garbage answers immediately to reduce LLM overhead
  const trimmed = answer.trim();
  if (!trimmed || trimmed.length < 3) {
    return {
      score: 2,
      feedback: 'The response provided was minimal or empty. Please provide technical detail in your answers.',
      strengths: [],
      gaps: ['Response lacked technical detail and architectural explanation.'],
      needsFollowUp: true,
      suggestedTopic: day.title,
    };
  }

  const prompt = buildEvaluationPrompt(candidate, day, question, answer, language);

  try {
    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: 'Score between 1 and 10' },
              feedback: { type: Type.STRING, description: 'Constructive evaluation text' },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of candidate strengths shown in answer',
              },
              gaps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of technical gaps or missed concepts',
              },
              needsFollowUp: { type: Type.BOOLEAN, description: 'True if score < 6' },
            },
            required: ['score', 'feedback', 'strengths', 'gaps', 'needsFollowUp'],
          },
        },
      });

      const jsonText = response.text?.trim();
      if (jsonText) {
        const parsed = JSON.parse(jsonText);
        const score = typeof parsed.score === 'number' ? Math.max(1, Math.min(10, Math.round(parsed.score))) : 5;
        return {
          score,
          feedback: parsed.feedback || 'Answer evaluated based on technical accuracy and depth.',
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          gaps: Array.isArray(parsed.gaps) ? parsed.gaps : ['Could elaborate more on production edge cases.'],
          needsFollowUp: typeof parsed.needsFollowUp === 'boolean' ? parsed.needsFollowUp : score < 6,
          suggestedTopic: day.title,
        };
      }
    }
  } catch (err) {
    console.error('Gemini answer evaluation error, using fallback evaluation:', err);
  }

  // Safe fallback heuristic evaluation
  const wordCount = trimmed.split(/\s+/).length;
  const hasKeyConcepts = day.keyConcepts.some(kc => trimmed.toLowerCase().includes(kc.toLowerCase()));
  
  let fallbackScore = 5;
  if (wordCount > 30 && hasKeyConcepts) fallbackScore = 8;
  else if (wordCount > 15) fallbackScore = 6;
  else fallbackScore = 3;

  return {
    score: fallbackScore,
    feedback: `Evaluated candidate answer on Day ${day.day} (${day.title}). Response length: ${wordCount} words.`,
    strengths: hasKeyConcepts ? [`Mentioned core concept relative to ${day.title}`] : ['Attempted response'],
    gaps: !hasKeyConcepts ? [`Did not explicitly reference core concepts like ${day.keyConcepts.slice(0, 2).join(', ')}`] : ['Could provide deeper architectural details'],
    needsFollowUp: fallbackScore < 6,
    suggestedTopic: day.title,
  };
}

/**
 * Generate final assessment report for completed interview.
 */
export async function generateFinalFeedback(
  candidate: CandidateProfile,
  turns: InterviewTurn[],
  language: string = 'English'
): Promise<FinalFeedback> {
  const prompt = buildFinalFeedbackPrompt(candidate, turns, language);

  // Compute average score per day
  const dayScores: Record<number, number> = {};
  turns.forEach(t => {
    if (t.evaluation) {
      dayScores[t.day] = t.evaluation.score;
    }
  });

  const scoresList = Object.values(dayScores);
  const avg10 = scoresList.length > 0 ? scoresList.reduce((a, b) => a + b, 0) / scoresList.length : 7;
  const overall100 = Math.round(avg10 * 10);

  const categoryScores = {
    overallScore: overall100,
    technicalAccuracy: Math.min(100, Math.round(overall100 * 1.05)),
    depth: Math.max(50, Math.round(overall100 * 0.95)),
    reasoning: Math.min(100, Math.round(overall100 * 1.02)),
    communication: Math.min(100, Math.round(overall100 * 0.98)),
  };

  try {
    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallSummary: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              gaps: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              technicalLevel: { type: Type.STRING },
            },
            required: ['overallSummary', 'strengths', 'gaps', 'recommendedNextSteps', 'technicalLevel'],
          },
        },
      });

      const jsonText = response.text?.trim();
      if (jsonText) {
        const parsed = JSON.parse(jsonText);
        const validLevels = ['Emerging', 'Competent', 'Advanced', 'Expert'];
        const technicalLevel = validLevels.includes(parsed.technicalLevel)
          ? parsed.technicalLevel
          : 'Competent';

        return {
          overallSummary: parsed.overallSummary || `${candidate.name} demonstrated solid engagement across ${turns.length} technical interview questions.`,
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Completed all 8 required interview questions'],
          gaps: Array.isArray(parsed.gaps) ? parsed.gaps : ['Further study in production scaling & evaluation recommended'],
          recommendedNextSteps: Array.isArray(parsed.recommendedNextSteps)
            ? parsed.recommendedNextSteps
            : ['Review RAG evaluation frameworks', 'Practice vector quantization trade-offs'],
          dayScores,
          technicalLevel,
          categoryScores,
        };
      }
    }
  } catch (err) {
    console.error('Gemini final report generation error, using fallback report:', err);
  }

  // Fallback report
  const avg = scoresList.length > 0 ? scoresList.reduce((a, b) => a + b, 0) / scoresList.length : 6;
  let level: 'Emerging' | 'Competent' | 'Advanced' | 'Expert' = 'Competent';
  if (avg >= 8.5) level = 'Expert';
  else if (avg >= 7) level = 'Advanced';
  else if (avg >= 5) level = 'Competent';
  else level = 'Emerging';

  return {
    overallSummary: `${candidate.name} completed the technical interview covering ${Object.keys(dayScores).length} curriculum days with an average score of ${avg.toFixed(1)}/10. Shows clear engineering potential with target growth areas in production edge cases.`,
    strengths: [
      `Demonstrated understanding of core concepts in completed cohort days (${candidate.completedDays.slice(0, 3).join(', ')})`,
      'Engaged in multi-turn adaptive technical questions',
      'Articulated engineering decisions under scenario constraints'
    ],
    gaps: [
      'Needs deeper familiarity with production error handling and circuit breakers',
      'Can expand on quantitative benchmarks for vector search performance'
    ],
    recommendedNextSteps: [
      'Deep dive into evaluation metrics (Ragas / TruLens) for RAG pipelines',
      'Practice hands-on implementation of custom MCP tool schemas and sandboxing',
      'Review continuous batching and PagedAttention in vLLM serving'
    ],
    dayScores,
    technicalLevel: level,
    categoryScores,
  };
}
