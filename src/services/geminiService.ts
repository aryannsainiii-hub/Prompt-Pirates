// empty file
import { GoogleGenAI, Type } from '@google/genai';
import {
  CandidateProfile,
  CurriculumDay,
  EvaluationResult,
  FinalFeedback,
  InterviewTurn
} from '../types';
import {
  buildQuestionPrompt,
  buildEvaluationPrompt,
  buildFinalFeedbackPrompt
} from './prompts';

let genAIInstance: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  
  if (genAIInstance) {
    return genAIInstance;
  }

  try {
    genAIInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    return genAIInstance;
  } catch (error) {
    console.warn('Failed to initialize GoogleGenAI instance:', error);
    return null;
  }
}

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
          temperature: 0.7
        }
      });
      
      const generatedQuestion = response.text?.trim();
      if (generatedQuestion && generatedQuestion.length > 10) {
        return generatedQuestion;
      }
    }
  } catch (error) {
    console.warn('Gemini question generation failed, using fallback question:', error);
  }

  // Fallback question
  if (isFollowUp) {
    return `Looking back at Day ${day.day} (${day.title}), what specific debugging steps or metric checks would you perform when encountering production issues with ${day.keyConcepts[0] || 'this architecture'}?`;
  }
  
  return `In Day ${day.day} (${day.title}), suppose you are designing a production solution utilizing ${day.keyConcepts.join(', ')}. What key architectural trade-offs and failure modes would you evaluate?`;
}

export async function evaluateAnswer(
  candidate: CandidateProfile,
  day: CurriculumDay,
  question: string,
  answer: string,
  language: string = 'English'
): Promise<EvaluationResult> {
  const trimmed = answer.trim();
  
  // Immediate short-answer protection
  if (!trimmed || trimmed.length < 3) {
    return {
      score: 2,
      feedback: 'The response provided was minimal or empty. Please provide technical detail in your answers.',
      strengths: [],
      gaps: ['Response lacked technical detail and architectural explanation.'],
      needsFollowUp: true,
      suggestedTopic: day.title
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
              score: {
                type: Type.NUMBER,
                description: 'Score between 1 and 10'
              },
              feedback: {
                type: Type.STRING,
                description: 'Constructive evaluation text'
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of candidate strengths shown in answer'
              },
              gaps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of technical gaps or missed concepts'
              },
              needsFollowUp: {
                type: Type.BOOLEAN,
                description: 'True if score < 6'
              }
            },
            required: ['score', 'feedback', 'strengths', 'gaps', 'needsFollowUp']
          }
        }
      });

      const jsonText = response.text?.trim();
      if (jsonText) {
        const parsed = JSON.parse(jsonText);
        
        let score = Number(parsed.score);
        if (isNaN(score)) {
          score = 5;
        } else {
          score = Math.max(1, Math.min(10, Math.round(score)));
        }

        return {
          score,
          feedback: parsed.feedback || 'Answer evaluated based on technical accuracy and depth.',
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
          gaps: Array.isArray(parsed.gaps) ? parsed.gaps : ['Could elaborate more on production edge cases.'],
          needsFollowUp: typeof parsed.needsFollowUp === 'boolean' ? parsed.needsFollowUp : score < 6,
          suggestedTopic: day.title
        };
      }
    }
  } catch (error) {
    console.warn('Gemini answer evaluation error, using fallback evaluation:', error);
  }

  // Deterministic answer-evaluation fallback
  const wordCount = trimmed.split(/\s+/).length;
  const mentionsKeyConcept = day.keyConcepts.some((concept) =>
    trimmed.toLowerCase().includes(concept.toLowerCase())
  );

  let fallbackScore = 5;
  if (wordCount > 30 && mentionsKeyConcept) {
    fallbackScore = 8;
  } else if (wordCount > 15) {
    fallbackScore = 6;
  } else {
    fallbackScore = 3;
  }

  return {
    score: fallbackScore,
    feedback: `Evaluated Day ${day.day} (${day.title}) response based on ${wordCount} words length and key concept inclusion.`,
    strengths: mentionsKeyConcept
      ? [`Mentioned core concept relative to ${day.title}`]
      : ['Attempted response'],
    gaps: !mentionsKeyConcept
      ? [`Did not explicitly reference core concepts like ${day.keyConcepts.slice(0, 2).join(', ')}`]
      : ['Could provide deeper architectural details'],
    needsFollowUp: fallbackScore < 6,
    suggestedTopic: day.title
  };
}

export async function generateFinalFeedback(
  candidate: CandidateProfile,
  turns: InterviewTurn[],
  language: string = 'English'
): Promise<FinalFeedback> {
  const prompt = buildFinalFeedbackPrompt(candidate, turns, language);

  // Calculate day scores
  const dayScores: Record<number, number> = {};
  for (const turn of turns) {
    if (turn.evaluation) {
      dayScores[turn.day] = turn.evaluation.score;
    }
  }

  const scoresList = Object.values(dayScores);
  const sum = scoresList.reduce((acc, val) => acc + val, 0);
  const avg10 = scoresList.length > 0 ? sum / scoresList.length : 7;
  const overall100 = Math.round(avg10 * 10);

  // Calculate category scores
  const categoryScores = {
    overallScore: overall100,
    technicalAccuracy: Math.min(100, Math.round(overall100 * 1.05)),
    depth: Math.max(50, Math.round(overall100 * 0.95)),
    reasoning: Math.min(100, Math.round(overall100 * 1.02)),
    communication: Math.min(100, Math.round(overall100 * 0.98))
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
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              gaps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendedNextSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              technicalLevel: { type: Type.STRING }
            },
            required: [
              'overallSummary',
              'strengths',
              'gaps',
              'recommendedNextSteps',
              'technicalLevel'
            ]
          }
        }
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
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ['Completed all required interview questions'],
          gaps: Array.isArray(parsed.gaps) ? parsed.gaps : ['Further study in production scaling & evaluation recommended'],
          recommendedNextSteps: Array.isArray(parsed.recommendedNextSteps)
            ? parsed.recommendedNextSteps
            : ['Review RAG evaluation frameworks', 'Practice vector quantization trade-offs'],
          dayScores,
          technicalLevel,
          categoryScores
        };
      }
    }
  } catch (error) {
    console.warn('Gemini final report generation error, using fallback report:', error);
  }

  // Deterministic fallback report
  const avg = scoresList.length > 0 ? (sum / scoresList.length) : 6;
  
  let fallbackTechnicalLevel: 'Emerging' | 'Competent' | 'Advanced' | 'Expert' = 'Competent';
  if (avg >= 8.5) {
    fallbackTechnicalLevel = 'Expert';
  } else if (avg >= 7) {
    fallbackTechnicalLevel = 'Advanced';
  } else if (avg >= 5) {
    fallbackTechnicalLevel = 'Competent';
  } else {
    fallbackTechnicalLevel = 'Emerging';
  }

  return {
    overallSummary: `${candidate.name} completed the technical interview covering ${Object.keys(dayScores).length} curriculum days with an average score of ${avg.toFixed(1)}/10. Shows clear engineering potential with target growth areas in production edge cases.`,
    strengths: [
      `${candidate.completedDays.slice(0, 3).join(', ')}`,
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
    technicalLevel: fallbackTechnicalLevel,
    categoryScores
  };
}