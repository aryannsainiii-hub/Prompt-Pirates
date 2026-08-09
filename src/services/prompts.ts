// empty file
import { CandidateProfile, CurriculumDay, InterviewTurn } from '../types';

export function buildQuestionPrompt(
  candidate: CandidateProfile,
  day: CurriculumDay,
  conversationHistory: InterviewTurn[],
  isFollowUp: boolean,
  lastAnswerScore?: number,
  language: string = 'English'
): string {
  const lastTurn = conversationHistory.length > 0 
    ? conversationHistory[conversationHistory.length - 1] 
    : null;

  let historyText = 'No previous turns. This is the initial question of the interview session.';
  
  if (conversationHistory.length > 0) {
    historyText = conversationHistory.map((t) => {
      const evaluation = t.evaluation;
      const score = evaluation?.score ?? 'N/A';
      const strengths = evaluation?.strengths?.length ? evaluation.strengths.join(', ') : 'None';
      const gaps = evaluation?.gaps?.length ? evaluation.gaps.join(', ') : 'None';
      const answer = t.answer ? t.answer : '(No answer)';
      
      return `[Turn ${t.turnNumber} - Day ${t.day} (${t.dayTitle})]\n` +
             `Question: ${t.question}\n` +
             `Candidate Answer: ${answer}\n` +
             `Evaluated Score: ${score}/10\n` +
             `Key Strengths Identified: ${strengths}\n` +
             `Identified Technical Gaps: ${gaps}`;
    }).join('\n\n');
  }

  const languageInstruction = language !== 'English' 
    ? `\n\nCRITICAL LANGUAGE MANDATE: You MUST generate the question and all interviewer text in ${language}. Keep technical terms clear while speaking naturally in ${language}.` 
    : '';

  let strategySection = '';
  if (isFollowUp) {
    const previousScore = lastAnswerScore ?? 'low';
    const previousAnswer = lastTurn?.answer ?? '';
    strategySection = `THIS IS AN ADAPTIVE FOLLOW-UP QUESTION on Day ${day.day} (${day.title}).
The candidate scored ${previousScore}/10 on the previous question.
Previous Candidate Answer: "${previousAnswer}"

INSTRUCTIONS:
1. Address the candidate's specific previous answer or misconception using a natural human conversational transition.
2. Ask a sharp, focused, scenario-based follow-up question.
3. Help the candidate clarify or diagnose an edge case.
4. Do not directly give away the solution.`;
  } else {
    strategySection = `THIS IS A NEW TOPIC QUESTION introducing Day ${day.day} (${day.title}).
${lastTurn ? `Previous turn was on Day ${lastTurn.day}. Candidate's previous response: "${lastTurn.answer}"` : ''}

INSTRUCTIONS:
1. Transition naturally to this new topic like a real senior interviewer.
2. Present a realistic, production-oriented engineering scenario.
3. Assess the core concepts: ${day.keyConcepts.slice(0, 2).join(' and ')}.
4. Ensure the complexity is appropriate for a ${candidate.role}.
5. Ask the candidate to consider production trade-offs, failure modes, latency, and/or cost.`;
  }

  return `You are a Principal AI Systems Architect conducting a realistic, conversational, and adaptive technical interview for the 31-Day AI Cohort.

CANDIDATE PROFILE
Name: ${candidate.name} (ID: ${candidate.id})
Target Role: ${candidate.role}
Background: ${candidate.background}
Target Expertise Areas: ${candidate.targetAreas.join(', ')}
Completed Cohort Modules: Days ${candidate.completedDays.join(', ')}

TARGET TOPIC FOR THIS QUESTION:
Day: ${day.day}
Title: ${day.title}
Module: ${day.module}
Description: ${day.description}
Key Concepts to Assess: ${day.keyConcepts.join(', ')}

CONVERSATION HISTORY SO FAR:
${historyText}

${strategySection}

CRITICAL INTERVIEWER RULES:
Rule 1 - Peer communication: Speak directly to the candidate as a technical peer. Use language such as "You" and "your architecture".
Rule 2 - Conversational rigor: Sound like an empathetic Senior/Principal AI Architect. The interview should feel realistic and conversational rather than robotic.
Rule 3 - Avoid robotic filler: Do NOT generate generic phrases such as "As an AI model", "Sure!", "Great job!", or "Here is your question:".
Rule 4 - Length: Limit the natural transition plus question to 2-4 sentences maximum.
Rule 5 - Output format: Output ONLY the spoken interviewer text directly. Do not output JSON, labels, explanations, meta-commentary, "Question:", or analysis.${languageInstruction}`;
}


export function buildEvaluationPrompt(
  candidate: CandidateProfile,
  day: CurriculumDay,
  question: string,
  answer: string,
  language: string = 'English'
): string {
  const languageInstruction = language !== 'English'
    ? ` Write the feedback, strengths, and gaps text in ${language}.`
    : '';

  const answerText = answer.trim() === '' ? '(Blank / No response)' : answer;

  return `You are a Principal AI Systems Architect evaluating a candidate's answer in a technical interview.

CANDIDATE
Name: ${candidate.name}
Role: ${candidate.role}

TOPIC
Day: ${day.day}
Title: ${day.title}
Module: ${day.module}

KEY TOPIC CONCEPTS
${day.keyConcepts.join(', ')}

INTERVIEW QUESTION
"${question}"

CANDIDATE ANSWER
${answerText}

EVALUATION TASK
Assess the answer rigorously for technical accuracy, architectural trade-off awareness, practical depth, and clarity.${languageInstruction}

SHORT OR VAGUE ANSWER HANDLING
If the answer is "I don't know", "not sure", gibberish, a one-word answer, or blank:
1. Assign a score from 1 to 3.
2. Respectfully explain why technical depth was missing.
3. List missing concepts in gaps.
4. Set needsFollowUp to true.

EVALUATION SCORING SCALE
1-3: No technical substance, incorrect assertions, or blank answer.
4-5: Superficial answer missing key trade-offs or production edge cases.
6-7: Solid baseline understanding with minor gaps or missing optimizations.
8-10: Exceptional depth, clear architectural reasoning, practical trade-offs, and production awareness.

REQUIRED JSON OUTPUT
Respond ONLY with valid JSON exactly matching this structure:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentence constructive, highly specific evaluation feedback>",
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "gaps": ["<specific missing concept 1>", "<specific missing concept 2>"],
  "needsFollowUp": <true if score < 6 else false>
}`;
}


export function buildFinalFeedbackPrompt(
  candidate: CandidateProfile,
  turns: InterviewTurn[],
  language: string = 'English'
): string {
  const transcript = turns.map((t) => {
    const evaluation = t.evaluation;
    const score = evaluation?.score ?? 0;
    const strengths = evaluation?.strengths?.length ? evaluation.strengths.join(', ') : 'None';
    const gaps = evaluation?.gaps?.length ? evaluation.gaps.join(', ') : 'None';
    
    return `Turn ${t.turnNumber} | Day ${t.day} (${t.dayTitle}):\n` +
           `Question Asked: ${t.question}\n` +
           `Candidate Answer: ${t.answer}\n` +
           `Evaluated Score: ${score}/10\n` +
           `Strengths: ${strengths}\n` +
           `Gaps: ${gaps}`;
  }).join('\n\n');

  const languageInstruction = language !== 'English'
    ? `\nWrite overallSummary, strengths, gaps, and recommendedNextSteps in ${language}.\n`
    : '';

  return `You are the Lead Technical Assessment Evaluator for the 31-Day AI Cohort.
Analyze the complete interview transcript for the specific candidate and synthesize a thorough, actionable technical assessment.

CANDIDATE
Name: ${candidate.name}
Role: ${candidate.role}

TRANSCRIPT AND TURN SCORES
${transcript}
${languageInstruction}
REQUIRED FINAL JSON STRUCTURE
Respond ONLY with valid JSON exactly matching this structure:
{
  "overallSummary": "<3-4 sentence comprehensive assessment of the candidate's engineering depth, architectural maturity, and overall cohort performance>",
  "strengths": [
    "<key demonstrated strength 1>",
    "<key demonstrated strength 2>",
    "<key demonstrated strength 3>"
  ],
  "gaps": [
    "<key growth area 1>",
    "<key growth area 2>",
    "<key growth area 3>"
  ],
  "recommendedNextSteps": [
    "<actionable learning milestone 1>",
    "<actionable learning milestone 2>",
    "<actionable learning milestone 3>"
  ],
  "technicalLevel": "<'Emerging' | 'Competent' | 'Advanced' | 'Expert'>"
}`;
}