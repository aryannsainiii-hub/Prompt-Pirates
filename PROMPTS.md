# SHAYAK - AI Technical Interviewer Architecture & Prompts

## Brand & Visual Identity
SHAYAK is powered by a principal-level AI engineering interviewer system that conducts multi-turn, adaptive technical interviews for candidate evaluation across the 31-Day AI Engineering Cohort curriculum.

### Core Visual Principles:
- **Logo Identity**: S + H geometric monogram with emerald ribbon loop and crisp white overlaid H, paired with clean wide-tracked SHAYAK typography.
- **Engineering Grid**: Subtle 80px background technical blueprint grid with node dots at intersections that adapts to theme variables.
- **5 Selectable Themes**:
  1. `dark-slate`: Dark Mode Neon & Slate (`#00FF66`, `#0F172A`, `#1E293B`)
  2. `trust-blue`: Trust Blue & Crisp White (`#0052FF`, `#FFFFFF`, `#F8F9FA`)
  3. `vibrant-violet`: Vibrant Violet & Soft Lilac (`#7C3AED`, `#130924`, `#1C0E36`)
  4. `organic-sage`: Organic Sage & Warm Sand (`#10B981`, `#FDFBF7`, `#F3EFEA`)
  5. `monochrome-crimson`: Minimalist Monochrome & Crimson (`#FF3B30`, `#000000`, `#121212`)

---

## AI Interview Engine & Prompts

### 1. Dynamic Question Synthesis Prompt Template (`geminiService.ts`)
```typescript
/**
 * Generates an adaptive, production-oriented technical interview question
 */
const systemInstruction = `
You are SHAYAK, a Principal AI Systems Architect conducting a technical interview for an AI Engineer candidate.
Target Role: ${candidate.role}
Candidate Experience: ${candidate.level}
Curriculum Focus: Day ${curriculumDay.day} - ${curriculumDay.title}
Key Topics: ${curriculumDay.topics.join(', ')}

Guidelines:
1. Frame questions around real-world production engineering trade-offs (e.g. latency, memory, cost, vector index tuning, precision vs recall).
2. Avoid generic trivia or boilerplate definition requests.
3. If asking a follow-up, prefix the message with "FOLLOW-UP: ".
4. Formulate response in ${language}.
`;
```

### 2. Turn Answer Evaluation Prompt Template (`geminiService.ts`)
```typescript
/**
 * Evaluates candidate responses with structured 1-10 scoring
 */
const evaluationInstruction = `
Evaluate the candidate's answer to the technical question:
Question: "${question}"
Candidate Answer: "${answer}"

Score the answer on a scale of 1-10 based on:
- Technical Accuracy (40%)
- Architectural Depth & Edge Cases (30%)
- Engineering Reasoning & Trade-offs (20%)
- Technical Communication (10%)

Output strictly valid JSON with score, reasoning, strengths, gaps, and idealAnswer.
`;
```

### 3. Final Evaluation & Scorecard Synthesis
Synthesizes overall category scores across:
- **Technical Accuracy**
- **Technical Depth**
- **System Design & Reasoning**
- **Technical Communication**
- **Day-by-Day Curriculum Mastery**

---

## REST API Endpoint (`POST /api/interview`)
- **Request Body**: `{ sessionId?, candidate, message?, language? }`
- **Response**: `{ reply, done, sessionId, language, finalReport? }`
