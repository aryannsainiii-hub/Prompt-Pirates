# SHAYAK - AI Usage Log, Architecture & Prompt History

> **Build the interviewer, not the interview.**

SHAYAK is an autonomous, principal-level AI Technical Interviewer
designed for the 31-Day AI Engineering Cohort Hackathon.

It conducts personalized, multi-turn technical interviews based on
candidate profiles, completed missions, curriculum progress, previous
answers, and interview context.

This document contains:

- AI-assisted development history
- AI conversation links from all three contributors
- Prompt architecture
- Interview reasoning strategy
- Answer evaluation logic
- Final evaluation synthesis
- API contract
- AI engineering decisions
- Hackathon requirement mapping

---

# 1. AI-Assisted Development History

SHAYAK was developed collaboratively by three team members using
AI-assisted engineering.

The following links provide access to the actual AI-assisted
development conversations used during the implementation of SHAYAK.

These conversations are included as development evidence for the
hackathon's authenticity review.

## Developer 01

**AI Development Conversation: arunesh-unoff-1111**

[View Developer 01 AI Prompt History](https://chatgpt.com/share/6a7878ab-d218-83e8-b3a2-a0bbb7468ff9)

This conversation contains the AI-assisted development work performed
by Developer 01 during the development of SHAYAK.

---

## Developer 02

**AI Development Conversation: aryannsainiii-hub**

[View Developer 02 AI Chat History](https://chatgpt.com/share/6a787541-056c-83ee-8668-8b64a9e59d60)

This conversation contains the AI-assisted development work performed
by Developer 02 during the development of SHAYAK.

---

## Developer 03

**AI Development Conversation: aryan003m**

[View Developer 03 AI Prompt History](https://chatgpt.com/share/6a76bea9-559c-83ee-9d56-8e190ec4c107?ogimg=plain)

This conversation contains the AI-assisted development work performed
by Developer 03 during the development of SHAYAK.

---

## Final Prompt History

**AI Development Conversation:**

[Prompt History](https://chatgpt.com/share/6a7880a9-5b18-83ee-a3c6-c6bb8b42f820)

This conversation contains the AI-assisted development work performed
by Developer 03 during the development of SHAYAK.

---

## Purpose of the AI Development Records

The linked conversations document the AI-assisted engineering process
used during the project, including areas such as:

- Architecture exploration
- Prompt engineering
- AI integration
- Frontend development
- Backend development
- Interview logic
- Debugging
- Error resolution
- Feature refinement
- Technical decision-making
- Deployment and development troubleshooting

The final source code in this repository is the authoritative
implementation.

---

# 2. Project Objective

## Hackathon Challenge

> **Build the interviewer, not the interview.**

The goal of SHAYAK is to simulate a realistic technical interviewer
rather than a static questionnaire.

The system evaluates candidates based on their learning journey
through the 31-Day AI Engineering Cohort.

The interview is designed to:

- Understand the candidate's completed learning journey
- Assess technical understanding
- Ask adaptive follow-up questions
- Maintain context across the conversation
- Explore engineering reasoning
- Evaluate production trade-offs
- Identify technical strengths and gaps
- Generate actionable learning recommendations

---

# 3. Core Interview Philosophy

SHAYAK does not follow a completely predetermined list of questions.

Instead, the interview follows an adaptive loop:

```text
Candidate Profile
       |
       v
Curriculum Context
       |
       v
Question Generation
       |
       v
Candidate Answer
       |
       v
Answer Evaluation
       |
       v
Identify Strengths / Gaps / Missing Depth
       |
       v
Adaptive Follow-up
       |
       v
Next Question
       |
       v
Curriculum Coverage
       |
       v
Final Evaluation
```

The purpose of this loop is to make the interview responsive to the
candidate instead of simply progressing through a fixed questionnaire.

---

# 4. Interview Agent Architecture

The interview engine combines multiple sources of context before
generating the next question.

```text
                    SHAYAK
                       |
       +---------------+---------------+
       |               |               |
       v               v               v
 Candidate         Curriculum      Conversation
  Profile            Context          Context
       |               |               |
       +---------------+---------------+
                       |
                       v
              Interview Engine
                       |
                       v
               Gemini AI Service
                       |
                       v
              Question Generation
                       |
                       v
               Candidate Answer
                       |
                       v
              Answer Evaluation
                       |
             +---------+---------+
             |                   |
             v                   v
        Strong Answer       Weak / Partial
             |                   |
             v                   v
       Go Deeper              Clarify
             |                   |
             +---------+---------+
                       |
                       v
                Next Question
                       |
                       v
             Curriculum Tracking
                       |
                       v
              Final Evaluation
```

---

# 5. AI Interview Engine & Prompts

## 5.1 Dynamic Question Synthesis Prompt

**Source:** `src/services/geminiService.ts`

The following prompt template is responsible for generating
adaptive, production-oriented technical interview questions.

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

### Prompt Intent

The prompt provides the AI with:

- Candidate role
- Candidate experience level
- Current curriculum day
- Curriculum topics
- Language preference
- Production engineering constraints

This allows the generated question to be relevant to both the
candidate and the curriculum.

---

# 6. Turn Answer Evaluation Prompt

**Source:** `src/services/geminiService.ts`

Each candidate answer can be evaluated using a structured scoring
framework.

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

## Evaluation Dimensions

| Dimension | Weight |
|---|---:|
| Technical Accuracy | 40% |
| Architectural Depth & Edge Cases | 30% |
| Engineering Reasoning & Trade-offs | 20% |
| Technical Communication | 10% |

The evaluation output is used by the interview engine to understand
the quality and depth of the candidate's response.

---

# 7. Adaptive Follow-Up Strategy

The candidate's answer is not treated as an isolated response.

The interview engine uses the answer to determine what should be
tested next.

```text
Candidate Answer
       |
       v
Evaluate Response
       |
       +-----------------------+
       |                       |
       v                       v
Strong / Detailed        Weak / Incomplete
       |                       |
       v                       v
Probe Deeper             Clarify Concept
       |                       |
       v                       v
Explore Trade-off        Test Understanding
       |                       |
       +-----------+-----------+
                   |
                   v
             Next Question
```

Possible follow-up directions include:

- Asking for deeper reasoning
- Challenging an architectural decision
- Testing an edge case
- Exploring production constraints
- Asking about scalability
- Testing failure handling
- Comparing alternative approaches
- Clarifying an incomplete explanation

This allows the interview to behave more like a real technical
conversation.

---

# 8. Curriculum-Aware Interviewing

SHAYAK uses the 31-Day AI Engineering Cohort curriculum as part of the
interview context.

The interview tracks curriculum coverage throughout the session.

The minimum challenge requirements are:

```text
Minimum Questions: 8
Minimum Unique Curriculum Days: 4
```

The interview should therefore collect enough evidence across multiple
curriculum areas before generating the final evaluation.

Conceptually:

```text
Question 1 -> Curriculum Day X
Question 2 -> Curriculum Day Y
Question 3 -> Curriculum Day X
Question 4 -> Curriculum Day Z
Question 5 -> Curriculum Day A
Question 6 -> Curriculum Day Y
Question 7 -> Curriculum Day B
Question 8 -> Curriculum Day A

                 |
                 v

       5 Unique Curriculum Days
```

The actual days depend on the candidate profile, curriculum context,
and interview flow.

---

# 9. Session Context

SHAYAK maintains interview state through a session identifier.

A session can contain information such as:

- Candidate identity
- Candidate profile
- Current question
- Question number
- Curriculum day
- Curriculum days already covered
- Conversation context
- Answer evaluations
- Interview completion state
- Final evaluation

The session-based approach allows SHAYAK to maintain context during an
active interview without requiring persistent user accounts.

---

# 10. Final Evaluation & Scorecard Synthesis

After the interview reaches the required depth and curriculum
coverage, SHAYAK synthesizes the collected evidence into a final
candidate evaluation.

The final scorecard evaluates:

- **Technical Accuracy**
- **Technical Depth**
- **System Design & Reasoning**
- **Technical Communication**
- **Day-by-Day Curriculum Mastery**

The final report can additionally contain:

- Overall assessment
- Technical strengths
- Knowledge gaps
- Areas requiring improvement
- Evidence from interview responses
- Recommended learning areas
- Tailored learning recommendations

---

# 11. Final Evaluation Flow

```text
All Candidate Answers
        |
        v
Individual Answer Evaluations
        |
        v
Technical Evidence Collection
        |
        v
Curriculum Coverage Analysis
        |
        v
Cross-Interview Synthesis
        |
        v
Final Candidate Scorecard
        |
        +-----------------------+
        |           |           |
        v           v           v
     Strengths     Gaps    Recommendations
```

---

# 12. REST API Endpoint

## `POST /api/interview`

The core AI Interview Agent is exposed through the HTTP endpoint:

```http
POST /api/interview
```

The endpoint supports both starting and continuing an interview
session.

---

## Request Body

```json
{
  "sessionId": "optional-existing-session-id",
  "candidate": {
    "id": "CAND-007",
    "role": "AI Engineer",
    "level": "Intermediate"
  },
  "message": "In our vector search pipeline, I use Cosine similarity over HNSW index and tune efSearch dynamically under high QPS.",
  "language": "English"
}
```

---

## Response

```json
{
  "reply": "Assuming model weights match, how would you tune HNSW parameters like efSearch and M under high query-per-second load without blowing up latency budgets?",
  "done": false,
  "sessionId": "session-1723100000000",
  "language": "English",
  "finalReport": null
}
```

When the interview is completed, the response can contain the final
evaluation report.

Example:

```json
{
  "reply": "Interview completed.",
  "done": true,
  "sessionId": "session-1723100000000",
  "language": "English",
  "finalReport": {
    "technicalAccuracy": 8,
    "technicalDepth": 7,
    "systemDesignReasoning": 8,
    "technicalCommunication": 8,
    "curriculumMastery": 7,
    "strengths": [
      "Strong understanding of vector search",
      "Good production trade-off reasoning"
    ],
    "gaps": [
      "Limited discussion of failure recovery"
    ],
    "recommendations": [
      "Explore production RAG reliability patterns"
    ]
  }
}
```

---

# 13. AI Engineering Decisions

## Candidate-Aware Question Generation

Questions are generated using candidate context rather than being
identical for every candidate.

### Why?

A candidate who has completed advanced vector database missions
should be evaluated differently from a candidate who has only
completed introductory RAG topics.

---

## Curriculum-Aware Question Generation

The curriculum provides the technical context used during question
generation.

### Why?

The challenge specifically requires the interview to be based on the
candidate's learning journey.

---

## Answer-Driven Follow-Ups

Previous responses influence subsequent questions.

### Why?

A realistic technical interview should investigate what the candidate
actually says.

---

## Structured Answer Evaluation

Answers are evaluated using consistent scoring dimensions.

### Why?

A structured evaluation makes the final scorecard more consistent and
actionable.

---

## Session-Based State

Interview state is associated with a session ID.

### Why?

The challenge requires maintaining context during the interview but
does not require persistent user accounts.

---

# 14. Why Gemini Is Used

SHAYAK uses the Gemini API as the reasoning and language generation
layer.

Gemini is responsible for tasks such as:

- Technical question generation
- Adaptive follow-up generation
- Candidate answer evaluation
- Structured reasoning
- Final evaluation synthesis

The surrounding application is responsible for:

- Candidate data
- Curriculum data
- Session state
- Interview rules
- Question counting
- Curriculum tracking
- API handling
- User interface

This separation keeps the application logic independent from the
language model.

---

# 15. AI Usage Boundaries

The AI model is used as an interview reasoning engine.

The application itself controls important deterministic rules such as:

```text
Question Count
Curriculum Coverage
Session State
Candidate Selection
Interview Completion
API Contract
```

This prevents the AI model from being solely responsible for enforcing
the hackathon's minimum requirements.

---

# 16. Hackathon Requirement Mapping

| Hackathon Requirement | SHAYAK Implementation |
|---|---|
| Conversational technical interview | Multi-turn interview engine |
| Minimum 8 questions | Question count tracking |
| At least 4 curriculum days | Curriculum coverage tracking |
| Adaptive follow-up questions | Answer-driven question generation |
| Maintain conversation context | Session Manager |
| Personalized interview | Candidate + curriculum context |
| Structured feedback | Final evaluation engine |
| Required HTTP endpoint | `POST /api/interview` |
| Candidate learning journey | Synthetic candidate profiles |
| 31-day curriculum | Curriculum dataset |
| AI Usage Log | This document + linked AI conversations |

---

# 17. AI Development Transparency

The AI conversations linked in this document are provided to make the
AI-assisted development process inspectable.

They demonstrate the development process across areas including:

```text
Planning
   ↓
Architecture
   ↓
Implementation
   ↓
Prompt Engineering
   ↓
Debugging
   ↓
Feature Refinement
   ↓
Testing
   ↓
Deployment
   ↓
Documentation
```

The conversations should be considered development evidence rather
than the source of truth for the final application.

The final source code in the repository is the authoritative
implementation.

---

# 18. Repository Relationship

The AI usage documentation maps to the actual implementation as
follows:

```text
PROMPTS.md
    |
    +-- AI Development Conversations
    |
    +-- Question Generation Prompts
    |
    +-- Answer Evaluation Prompts
    |
    +-- Interview Strategy
    |
    +-- API Contract
    |
    v
Source Code
    |
    +-- geminiService.ts
    +-- interviewEngine.ts
    +-- sessionManager.ts
    +-- server.ts
    |
    v
Live SHAYAK Application
```

---

# 19. Important Source Files

| Source File | Responsibility |
|---|---|
| `server.ts` | HTTP server and `/api/interview` endpoint |
| `src/services/geminiService.ts` | Gemini integration and prompt logic |
| `src/services/interviewEngine.ts` | Interview orchestration |
| `src/services/sessionManager.ts` | Active session state |
| `src/data/` | Candidate and curriculum datasets |
| `src/components/` | Interview interface |
| `src/App.tsx` | Application orchestration |
| `src/types.ts` | Shared TypeScript types |

---

# 20. Security & API Key Handling

SHAYAK requires a Gemini API key to communicate with the Gemini API.

The key is supplied through:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The actual `.env` file is not part of the public repository.

The repository only contains:

```text
.env.example
```

The Gemini API key must be configured through the local environment
during development or through secure environment variables on the
deployment platform.

Never expose the API key in:

- Source code
- Frontend code
- GitHub commits
- README files
- Prompt documentation
- Public screenshots

---

# 21. Scope Constraints

The following features are intentionally outside the scope of the
challenge:

- Voice interaction
- Audio input/output
- User authentication
- Login/signup
- Persistent user accounts
- Long-term conversation history
- Native mobile applications

SHAYAK focuses on the core challenge:

> **Build the interviewer, not the interview.**

---

# 22. Development Philosophy

The project was built around one central question:

> **What should an AI interviewer ask next after hearing this
> candidate's answer?**

Rather than treating the interview as a predefined sequence, SHAYAK
treats it as a continuously evolving technical conversation.

The resulting system combines:

```text
Candidate Context
        +
Curriculum Context
        +
Conversation Context
        +
Answer Evaluation
        +
Adaptive Questioning
        =
Personalized AI Technical Interview
```

---

# 23. Final System Concept

SHAYAK can be summarized as:

```text
                    CANDIDATE
                        |
                        v
               Candidate Profile
                        |
                        v
               Curriculum Context
                        |
                        v
              AI Interview Agent
                        |
              +---------+---------+
              |                   |
              v                   v
         Ask Question       Evaluate Answer
              |                   |
              |                   v
              |             Identify Gaps
              |                   |
              +---------<---------+
                        |
                        v
                 Adaptive Follow-Up
                        |
                        v
                Curriculum Tracking
                        |
                        v
                 8+ Questions
                 4+ Curriculum Days
                        |
                        v
                Final Scorecard
                        |
          +-------------+-------------+
          |             |             |
          v             v             v
       Strengths       Gaps     Recommendations
```

---

# 24. Authenticity & Submission Evidence

This repository provides the following evidence for hackathon review:

### Public Source

The complete project source code is available in the repository.

### AI Usage Log

This `PROMPTS.md` file documents the AI-assisted engineering process.

### AI Conversation History

Three contributor-specific AI conversation links are provided at the
beginning of this document.

### Prompt Architecture

The key AI prompt templates used for question generation and answer
evaluation are documented above.

### Implementation Mapping

The documented prompts and architecture are mapped to the actual source
files used by SHAYAK.

### Live Application

The deployed application demonstrates the final implemented system.

---

# 25. Final Statement

SHAYAK is built around a simple principle:

> **A good technical interviewer does not simply ask questions.
> They listen, reason, adapt, probe, and evaluate.**

SHAYAK brings that principle into an AI-powered technical interview
system designed around the candidate's actual learning journey.

**Build the interviewer, not the interview.**