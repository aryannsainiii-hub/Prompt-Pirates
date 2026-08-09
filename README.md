# SHAYAK - AI Technical Interviewer

> **Build the interviewer, not the interview.**

SHAYAK is an autonomous AI Technical Interviewer built for the
**31-Day AI Engineering Cohort Hackathon**.

Instead of running a fixed questionnaire, SHAYAK conducts a
personalized, multi-turn technical interview that adapts to the
candidate's learning journey, previous answers, curriculum coverage,
and demonstrated technical depth.

---

# 🚀 Quick Links

| Resource | Link |
|---|---|
| **Live Demo** | [Open SHAYAK](https://shayak-iota.vercel.app/) |
| **Source Repository** | [GitHub Repository](https://github.com/aryannsainiii-hub/Prompt-Pirates.git) |
| **AI Usage Log & Prompt Architecture** | [PROMPTS.md](./PROMPTS.md) |

### AI Development Histories

The complete AI-assisted development conversations from all three
contributors are available through `PROMPTS.md`.

| Contributor | AI Chat History |
|---|---|
| Developer 01-- arunesh-unoff-1111| [View AI Prompt history](https://chatgpt.com/share/6a7878ab-d218-83e8-b3a2-a0bbb7468ff9) |
| Developer 02--aryannsainiii-hub | [View AI Prompt history](https://chatgpt.com/share/6a787541-056c-83ee-8668-8b64a9e59d60) |
| Developer 03 -- aryan003m| [View AI Prompt history](https://chatgpt.com/share/6a787541-056c-83ee-8668-8b64a9e59d60) |
| Final Prompt history | [View AI Prompt history](https://chatgpt.com/share/6a7880a9-5b18-83ee-a3c6-c6bb8b42f820) |

> **Important:** `PROMPTS.md` contains the complete prompt
> architecture, AI engineering decisions, and links to the actual
> AI-assisted development conversations.

---

# 🎯 Hackathon Requirement Coverage

SHAYAK is designed specifically around the **Interview Agent**
challenge.

| Hackathon Requirement | SHAYAK Implementation |
|---|---|
| Conversational technical interview | Multi-turn AI interview |
| Minimum 8 questions | Interview completion logic |
| At least 4 curriculum days | Curriculum coverage tracking |
| Adaptive follow-up questions | Response-driven question generation |
| Maintain conversation context | Session Manager |
| Personalized interview | Candidate + curriculum context |
| Structured feedback | Final evaluation engine |
| Required HTTP endpoint | `POST /api/interview` |
| Synthetic candidate profiles | Candidate dataset |
| 31-day curriculum | Curriculum dataset |
| AI Usage Log | `PROMPTS.md` + 3 AI chat histories |
| Public source repository | GitHub repository |
| Live application | Deployed web application |

---

# 🧠 What SHAYAK Actually Does

The central idea behind SHAYAK is:

> **Don't ask the candidate a predefined list of questions.
> Interview the candidate based on what they actually say.**

SHAYAK starts with:

```text
Candidate Profile
       +
Completed Missions
       +
31-Day Curriculum
       +
Experience Level