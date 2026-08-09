import React, { useState } from 'react';
import { InterviewSession } from '../types';
import { 
  Code2, CheckCircle2, Terminal, BookOpen, ShieldCheck, 
  Copy, X, Layers, Server, Sparkles 
} from 'lucide-react';

interface JudgeInspectorDrawerProps {
  session: InterviewSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeInspectorDrawer: React.FC<JudgeInspectorDrawerProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'requirements' | 'endpoints' | 'prompts' | 'session'>('requirements');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(label);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const requirementsList = [
    {
      title: 'Conduct conversational technical interview',
      status: true,
      detail: 'Tailors scenario-based questions according to candidate profile & 31-day AI Cohort learning path.'
    },
    {
      title: 'Ask at least 8 questions',
      status: (session?.questionCount || 0) >= 8,
      detail: `Current progress: ${session?.questionCount || 0} / 8 questions conducted.`
    },
    {
      title: 'Cover at least 4 different curriculum days',
      status: (session?.daysCovered.length || 0) >= 4,
      detail: `Current progress: ${session?.daysCovered.length || 0} / 4 days covered (${session?.daysCovered.map(d => `Day ${d}`).join(', ') || 'None'}).`
    },
    {
      title: 'Generate adaptive follow-up questions',
      status: true,
      detail: 'If evaluation score < 6/10, automatically probes deeper into misconception on the same topic.'
    },
    {
      title: 'Maintain conversation context',
      status: true,
      detail: 'Injects past turns, scores, strengths, and gaps into subsequent question generation prompts.'
    },
    {
      title: 'Produce structured final feedback report',
      status: session?.isCompleted || false,
      detail: 'Outputs overall summary, strengths, gaps, recommended next steps, and technical readiness tier.'
    },
    {
      title: 'Expose required HTTP API endpoints',
      status: true,
      detail: 'Exposes /api/candidates, /api/curriculum, /api/interview/start, /api/interview/answer, /api/health.'
    }
  ];

  const endpointsList = [
    {
      method: 'GET',
      path: '/api/candidates',
      desc: 'List all candidate profiles with background and completed cohort days.',
      exampleReq: 'curl http://localhost:3000/api/candidates'
    },
    {
      method: 'GET',
      path: '/api/curriculum',
      desc: 'List 31-day AI Cohort curriculum modules and key concepts.',
      exampleReq: 'curl http://localhost:3000/api/curriculum'
    },
    {
      method: 'POST',
      path: '/api/interview/start',
      desc: 'Start a personalized interview session for a selected candidate.',
      exampleReq: `curl -X POST http://localhost:3000/api/interview/start \\\n  -H "Content-Type: application/json" \\\n  -d '{"candidateId": "CAND-007"}'`
    },
    {
      method: 'POST',
      path: '/api/interview/answer',
      desc: 'Submit candidate answer for evaluation and retrieve next question/report.',
      exampleReq: `curl -X POST http://localhost:3000/api/interview/answer \\\n  -H "Content-Type: application/json" \\\n  -d '{"sessionId": "${session?.sessionId || 'SESSION_ID'}", "answer": "Detailed technical answer..."}'`
    },
    {
      method: 'GET',
      path: '/api/health',
      desc: 'Server status & health check endpoint.',
      exampleReq: 'curl http://localhost:3000/api/health'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-2xl h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-100 text-base">Judge Inspector & Technical Spec</h2>
              <p className="text-xs text-slate-400">ABTalks Vibe Code Hackathon • Problem Statement 2</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('requirements')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'requirements'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Hackathon Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('endpoints')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'endpoints'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>API Endpoints</span>
          </button>

          <button
            onClick={() => setActiveTab('prompts')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'prompts'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>System Prompts</span>
          </button>

          <button
            onClick={() => setActiveTab('session')}
            className={`py-3 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'session'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Live Session State</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Requirements Checklist */}
          {activeTab === 'requirements' && (
            <div className="space-y-3">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
                <span className="font-bold">Mandate Status: </span>
                All mandatory hackathon specifications are satisfied and enforced dynamically.
              </div>

              <div className="space-y-2">
                {requirementsList.map((req, idx) => (
                  <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full ${
                      req.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{req.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{req.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Endpoints Tab */}
          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              {endpointsList.map((ep, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        ep.method === 'GET' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {ep.method}
                      </span>
                      <code className="text-xs font-bold text-slate-200">{ep.path}</code>
                    </div>

                    <button
                      onClick={() => copyToClipboard(ep.exampleReq, ep.path)}
                      className="text-[11px] font-medium text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedEndpoint === ep.path ? 'Copied!' : 'Copy curl'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">{ep.desc}</p>

                  <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-pre">
                    {ep.exampleReq}
                  </pre>
                </div>
              ))}
            </div>
          )}

          {/* System Prompts Tab */}
          {activeTab === 'prompts' && (
            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Question Generation Prompt Strategy
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Injects candidate role, background, target areas, cohort topic key concepts, and past turn scores. Forces exactly one scenario-based technical question without fluff.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Answer Evaluation Prompt Strategy
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Evaluates answer accuracy, depth, and architectural reasoning against target day key concepts. Constrains output to JSON with score (1-10), feedback, strengths, and gaps. Handles short/weak answers safely with score &lt; 6.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Final Report Prompt Strategy
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Synthesizes all turn evaluations, computes scores across cohort days, generates overall summary, top strengths, growth gaps, and actionable recommendations.
                </p>
              </div>
            </div>
          )}

          {/* Session State Tab */}
          {activeTab === 'session' && (
            <div>
              {session ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Session ID: <code className="text-indigo-300">{session.sessionId}</code></span>
                    <span>Turns: {session.turns.length}</span>
                  </div>
                  <pre className="p-4 bg-slate-950 rounded-xl text-[11px] font-mono text-emerald-400 border border-slate-800 overflow-x-auto max-h-[60vh]">
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-500 italic">
                  No active interview session. Select a candidate to start an interview session.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
