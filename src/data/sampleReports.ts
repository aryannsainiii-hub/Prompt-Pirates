import { InterviewSession } from '../types';
import { CANDIDATE_PROFILES } from './candidates';

export const SAMPLE_EVALUATION_REPORTS: Record<string, InterviewSession> = {
  'CAND-007': {
    sessionId: 'session_sample_007',
    candidate: CANDIDATE_PROFILES[0], // Ethan Brooks
    plannedDays: [3, 7, 8, 12, 15],
    turns: [
      {
        turnNumber: 1,
        day: 3,
        dayTitle: 'Embeddings Explained',
        question: 'Suppose your vector search retrieval pipeline suddenly starts returning low-relevance document chunks in production. How would you systematically diagnose and rectify the issue?',
        answer: 'I would verify query vs document embedding model consistency, check chunk size overlaps and similarity distance metrics (Cosine vs L2), followed by inspecting vector index health and HNSW quantization parameters.',
        evaluation: {
          score: 9,
          feedback: 'Exceptional systematic breakdown covering embeddings model parity, distance metric selection, and vector index quantization.',
          strengths: ['Clear isolation of embedding model versioning mismatch', 'Awareness of distance metric impact on vector spaces'],
          gaps: ['Could mention metadata filtering latency overhead'],
          needsFollowUp: false,
        },
        timestamp: '2026-08-08T10:00:00.000Z',
      },
      {
        turnNumber: 2,
        day: 7,
        dayTitle: 'Chunking Strategies & Context Windows',
        question: 'When dealing with multi-page technical documentation, how do you decide between fixed-size chunking and semantic heading-aware chunking?',
        answer: 'Semantic heading-aware chunking preserves structural coherence and prevents splitting code blocks across chunk boundaries, whereas fixed-size chunking is computationally faster but degrades document context integrity.',
        evaluation: {
          score: 8,
          feedback: 'Solid trade-off comparison between structural semantic boundary retention vs raw fixed token chunking speed.',
          strengths: ['Identified code block boundary preservation', 'Understood context window fragmentation'],
          gaps: ['Did not address recursive character chunking fallback strategies'],
          needsFollowUp: false,
        },
        timestamp: '2026-08-08T10:05:00.000Z',
      },
      {
        turnNumber: 3,
        day: 12,
        dayTitle: 'RAG Architecture & Hybrid Search',
        question: 'How would you implement a Reciprocal Rank Fusion (RRF) pipeline combining BM25 keyword search with dense vector embeddings?',
        answer: 'I would run BM25 and vector queries concurrently, normalize ranks using rrf_score = 1 / (60 + rank), merge result sets, and re-rank top candidates using a cross-encoder model before feeding into the LLM prompt context.',
        evaluation: {
          score: 9,
          feedback: 'Precise knowledge of RRF math formula and cross-encoder re-ranking stage.',
          strengths: ['Exact RRF rank scoring formula', 'Two-stage retrieval and re-ranking architecture'],
          gaps: ['None noted'],
          needsFollowUp: false,
        },
        timestamp: '2026-08-08T10:10:00.000Z',
      },
    ],
    currentQuestion: null,
    currentQuestionDay: null,
    currentTurnNumber: 3,
    daysCovered: [3, 7, 12, 15],
    questionCount: 3,
    isCompleted: true,
    finalFeedback: {
      overallSummary: 'Ethan demonstrates high-level production competence in RAG architectures, vector similarity search, and hybrid retrieval pipelines. His background in Go/Node backend engineering allows him to treat LLM systems with strict infrastructure discipline.',
      strengths: [
        'Deep mastery of embedding model parity and vector quantization (SQ8/PQ)',
        'Precise understanding of hybrid retrieval (BM25 + Vector) and Reciprocal Rank Fusion (RRF)',
        'Strong production debugging instincts for low-relevance retrieval failures'
      ],
      gaps: [
        'Could deepen knowledge in autonomous agent reflection loops and tool-use error recovery',
        'Needs exposure to speculative decoding and vLLM PagedAttention kernel optimizations'
      ],
      recommendedNextSteps: [
        'Complete Day 19 ReAct Agent Architecture module to solidify autonomous execution loops',
        'Experiment with custom Model Context Protocol (MCP) tool integration servers',
        'Study vLLM PagedAttention memory management for high-throughput serving'
      ],
      dayScores: { 3: 9, 7: 8, 12: 9, 15: 8 },
      technicalLevel: 'Advanced',
    },
    createdAt: '2026-08-08T09:50:00.000Z',
    updatedAt: '2026-08-08T10:12:00.000Z',
  },
  'CAND-001': {
    sessionId: 'session_sample_001',
    candidate: CANDIDATE_PROFILES[1], // Sarah Chen
    plannedDays: [1, 4, 10, 18],
    turns: [
      {
        turnNumber: 1,
        day: 4,
        dayTitle: 'Structured Outputs & JSON Schema Validation',
        question: 'How do you guarantee strict JSON output compliance from LLMs in production without relying solely on post-hoc regex parsing?',
        answer: 'I enforce constrained sampling at the decoding layer using JSON Schema grammar constraints (such as Outlines or instructor with Pydantic/Zod schemas), combined with retry loops and fallback auto-correction prompts.',
        evaluation: {
          score: 10,
          feedback: 'Flawless answer highlighting guided decoding at token sampling level alongside schema validation.',
          strengths: ['Constrained sampling comprehension', 'Zod/Pydantic schema validation integration'],
          gaps: [],
          needsFollowUp: false,
        },
        timestamp: '2026-08-08T11:00:00.000Z',
      },
    ],
    currentQuestion: null,
    currentQuestionDay: null,
    currentTurnNumber: 1,
    daysCovered: [1, 4, 10, 18],
    questionCount: 4,
    isCompleted: true,
    finalFeedback: {
      overallSummary: 'Sarah excels at LLM interface design, structured output enforcement, and user experience for AI applications. She brings strong product intuition paired with technical rigor around schema validation.',
      strengths: [
        'Expertise in constrained token decoding and structured schema outputs',
        'Strong grasp of agentic reflection loops and prompt engineering',
        'Excellent understanding of Model Context Protocol (MCP) clients'
      ],
      gaps: [
        'Lower familiarity with low-level C++ vector index acceleration',
        'Needs deeper practice with multi-GPU serving and vLLM tensor parallelism'
      ],
      recommendedNextSteps: [
        'Deep dive into Day 22 vLLM & PagedAttention memory management',
        'Build custom C++ or Rust vector search bindings for performance benchmarking'
      ],
      dayScores: { 1: 9, 4: 10, 10: 9, 18: 9 },
      technicalLevel: 'Expert',
    },
    createdAt: '2026-08-08T10:50:00.000Z',
    updatedAt: '2026-08-08T11:15:00.000Z',
  },
  'CAND-002': {
    sessionId: 'session_sample_002',
    candidate: CANDIDATE_PROFILES[2], // Alex Rivera
    plannedDays: [8, 13, 22, 24],
    turns: [],
    currentQuestion: null,
    currentQuestionDay: null,
    currentTurnNumber: 0,
    daysCovered: [8, 13, 22, 24],
    questionCount: 4,
    isCompleted: true,
    finalFeedback: {
      overallSummary: 'Alex brings deep infrastructure and MLOps capability, demonstrating outstanding knowledge of distributed vector storage, quantization techniques, and serving engine throughput.',
      strengths: [
        'Mastery of vector index quantization (Scalar vs Product Quantization)',
        'Extensive experience with distributed Kubernetes LLM serving and rate limiting',
        'Solid design for production circuit breakers and streaming latency monitoring'
      ],
      gaps: [
        'Can expand focus on prompt optimization and zero-shot chain-of-thought prompting'
      ],
      recommendedNextSteps: [
        'Explore Day 19 ReAct Agent state persistence across distributed clusters',
        'Implement automated prompt evaluation benchmarks with Gemini API'
      ],
      dayScores: { 8: 9, 13: 9, 22: 10, 24: 9 },
      technicalLevel: 'Expert',
    },
    createdAt: '2026-08-08T08:30:00.000Z',
    updatedAt: '2026-08-08T09:00:00.000Z',
  },
  'CAND-003': {
    sessionId: 'session_sample_003',
    candidate: CANDIDATE_PROFILES[3], // Priyam Sharma
    plannedDays: [3, 14, 19, 25],
    turns: [],
    currentQuestion: null,
    currentQuestionDay: null,
    currentTurnNumber: 0,
    daysCovered: [3, 14, 19, 25],
    questionCount: 4,
    isCompleted: true,
    finalFeedback: {
      overallSummary: 'Priyam exhibits broad enterprise architecture leadership across multi-agent orchestration, MCP security protocols, and cloud AI governance.',
      strengths: [
        'Comprehensive multi-agent architecture and delegation flows',
        'Strong enterprise security posture for LLM tool invocation',
        'Clear cost-attribution and token tracking methodology'
      ],
      gaps: [
        'Hands-on tuning of fine-grained vector embedding hyperparameters'
      ],
      recommendedNextSteps: [
        'Practice low-level vector indexing and quantization parameter tuning',
        'Build automated evaluation benchmarks for agent tool execution'
      ],
      dayScores: { 3: 8, 14: 9, 19: 9, 25: 8 },
      technicalLevel: 'Advanced',
    },
    createdAt: '2026-08-08T07:15:00.000Z',
    updatedAt: '2026-08-08T07:45:00.000Z',
  },
};
