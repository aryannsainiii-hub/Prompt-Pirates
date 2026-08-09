import { CandidateProfile, CurriculumDay, InterviewTurn } from '../types';

export function buildQuestionPrompt(
  candidate: CandidateProfile,
  day: CurriculumDay,
  conversationHistory: InterviewTurn[],
  isFollowUp: boolean,
  lastAnswerScore?: number,
  language: string = 'English'
): string {
  const lastTurn = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;

  const historyText = conversationHistory.length > 0
    ? conversationHistory.map(t =>
        `[Turn ${t.turnNumber} - Day ${t.day} (${t.dayTitle})]
Question: ${t.question}
Candidate Answer: ${t.answer || '(No answer)'}
Evaluated Score: ${t.evaluation ? t.evaluation.score : 'N/A'}/10
Key Strengths Identified: ${t.evaluation?.strengths.join(', ') || 'None'}
Identified Technical Gaps: ${t.evaluation?.gaps.join(', ') || 'None'}`
      ).join('\n\n')
    : 'No previous turns. This is the initial question of the interview session.';

  const langInstruction = language && language !== 'English'
    ? `\n\nCRITICAL LANGUAGE MANDATE: You MUST generate the question and all interviewer text in ${language}. Keep technical terms clear while speaking naturally in ${language}.`
    : '';

  return `You are a Principal AI Systems Architect conducting a realistic, conversational, and adaptive technical interview for the 31-Day AI Cohort.

CANDIDATE PROFILE:
- Name: ${candidate.name} (${candidate.id})
- Target Role: ${candidate.role}
- Background: ${candidate.background}
- Target Expertise Areas: ${candidate.targetAreas.join(', ')}
- Completed Cohort Modules: Days ${candidate.completedDays.join(', ')}

TARGET TOPIC FOR THIS QUESTION:
- Curriculum Day ${day.day}: ${day.title} (${day.module})
- Topic Description: ${day.description}
- Key Concepts to Assess: ${day.keyConcepts.join(', ')}

CONVERSATION HISTORY SO FAR:
${historyText}

QUESTION GENERATION STRATEGY:
${isFollowUp
  ? `THIS IS AN ADAPTIVE FOLLOW-UP QUESTION on Day ${day.day} (${day.title}).
The candidate scored ${lastAnswerScore ?? 'low'}/10 on their previous answer.
Candidate's previous response: "${lastTurn?.answer ?? ''}"
Instructions:
1. Address their specific answer or misconception with a natural human conversational transition.
2. Ask a sharp, focused scenario-based follow-up question that helps them clarify or diagnose the edge case without giving away the direct solution.`
  : `THIS IS A NEW TOPIC QUESTION introducing Day ${day.day} (${day.title}).
${lastTurn ? `Candidate's previous response on Day ${lastTurn.day}: "${lastTurn.answer}"` : ''}
Instructions:
1. Frame this transition naturally like a real human senior interviewer.
2. Ask a realistic, production-oriented engineering scenario question testing their understanding of ${day.keyConcepts.slice(0, 2).join(' and ')}.
3. Tailor the situation to ${candidate.role} level complexity, considering production trade-offs, failures, or latency/cost trade-offs.`
}

CRITICAL RULES FOR THE INTERVIEWER:
1. Speak directly to the candidate as a peer ("You", "your architecture").
2. Keep it conversational yet rigorous — sound like an empathetic Senior AI Architect.
3. Do NOT include generic robotic filler like "As an AI model", "Sure!", "Great job!", or "Here is your question:".
4. Limit the question + natural transition to 2-4 sentences maximum.
5. Output ONLY the spoken interviewer text directly.${langInstruction}`;
}

export function buildEvaluationPrompt(
  candidate: CandidateProfile,
  day: CurriculumDay,
  question: string,
  answer: string,
  language: string = 'English'
): string {
  const langInstruction = language && language !== 'English'
    ? `Write the feedback, strengths, and gaps text in ${language}.`
    : '';

  return `You are a Principal AI Systems Architect evaluating a candidate's answer in a technical interview.

CANDIDATE: ${candidate.name} (${candidate.role})
TOPIC: Day ${day.day} - ${day.title} (${day.module})
KEY TOPIC CONCEPTS: ${day.keyConcepts.join(', ')}

INTERVIEW QUESTION ASKED:
"${question}"

CANDIDATE'S ANSWER:
"${answer || '(Blank / No response)'}"

EVALUATION TASK:
Evaluate the answer rigorously for technical accuracy, architectural trade-off awareness, practical depth, and clarity. ${langInstruction}

HANDLING FOR SHORT, VAGUE, OR NON-TECHNICAL RESPONSES:
If the candidate says "I don't know", "not sure", gives gibberish, or provides a 1-word answer, assign a score of 1-3, explain respectfully in feedback why technical depth was missing, list missing concepts under gaps, and set "needsFollowUp": true.

OUTPUT SCHEMA:
Respond ONLY with valid JSON conforming to:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentence constructive, highly specific evaluation feedback>",
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "gaps": ["<specific missing concept 1>", "<specific missing concept 2>"],
  "needsFollowUp": <true if score < 6 else false>
}

Scoring Scale:
1-3: No technical substance, incorrect assertions, or blank answer.
4-5: Superficial answer missing key trade-offs or production edge cases.
6-7: Solid baseline understanding with minor gaps or missing optimizations.
8-10: Exceptional depth, clear architectural reasoning, practical trade-offs, and production awareness.`;
}

export function buildFinalFeedbackPrompt(
  candidate: CandidateProfile,
  turns: InterviewTurn[],
  language: string = 'English'
): string {
  const turnsSummary = turns.map(t =>
    `Turn ${t.turnNumber} | Day ${t.day} (${t.dayTitle}):
Question Asked: ${t.question}
Candidate Answer: ${t.answer}
Evaluated Score: ${t.evaluation?.score || 0}/10
Strengths: ${t.evaluation?.strengths.join(', ') || 'None'}
Gaps: ${t.evaluation?.gaps.join(', ') || 'None'}`
  ).join('\n\n');

  const langInstruction = language && language !== 'English'
    ? `Write overallSummary, strengths, gaps, and recommendedNextSteps in ${language}.`
    : '';

  return `You are the Lead Technical Assessment Evaluator for the 31-Day AI Cohort.
Analyze the complete interview transcript for candidate ${candidate.name} (${candidate.role}) and synthesize a thorough, actionable technical assessment report. ${langInstruction}

INTERVIEW TRANSCRIPT & TURN SCORES:
${turnsSummary}

OUTPUT REQUIREMENTS:
Respond ONLY with valid JSON matching this schema:
{
  "overallSummary": "<3-4 sentence comprehensive assessment of the candidate's engineering depth, architectural maturity, and overall cohort performance>",
  "strengths": ["<key demonstrated strength 1>", "<key demonstrated strength 2>", "<key demonstrated strength 3>"],
  "gaps": ["<key growth area 1>", "<key growth area 2>", "<key growth area 3>"],
  "recommendedNextSteps": ["<actionable learning milestone 1>", "<actionable learning milestone 2>", "<actionable learning milestone 3>"],
  "technicalLevel": "<'Emerging' | 'Competent' | 'Advanced' | 'Expert'>"
}`;
}
