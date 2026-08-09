import { CurriculumDay, CurriculumModule } from '../types';

export const AI_COHORT_MODULES: CurriculumModule[] = [
  { n: 1, title: 'Environment & Tooling', days: [1, 3] },
  { n: 2, title: 'Data Foundations', days: [4, 6] },
  { n: 3, title: 'Embeddings & Vector Search', days: [7, 10] },
  { n: 4, title: 'LLM Core, Prompting & Fine-Tuning', days: [11, 15] },
  { n: 5, title: 'Chatbot Application Build', days: [16, 20] },
  { n: 6, title: 'Agentic AI & MCP', days: [21, 24] },
  { n: 7, title: 'Evaluation, Security & Deployment', days: [25, 28] },
  { n: 8, title: 'Production & Capstone', days: [29, 31] },
];

export const AI_COHORT_CURRICULUM: CurriculumDay[] = [
  {
    day: 1,
    title: 'VS Code & Python Environment Setup',
    module: 'Environment & Tooling',
    type: 'SETUP',
    tools: ['VS Code', 'Python', 'Python Extension', 'Pylance', 'Virtual Environment'],
    objectives: [
      'Install VS Code and Python on your machine',
      'Configure the Python extension and Pylance',
      'Create and activate a project virtual environment (.venv)',
      'Run and debug your first Python program inside VS Code',
      'Verify the development environment is ready for the remaining course'
    ],
    description: 'Setting up VS Code, Python virtual environment, Pylance type checker, and base development tooling.',
    keyConcepts: ['Virtual Environment (.venv)', 'Pylance', 'Python Debugging', 'Environment Variables'],
    sampleQuestions: [
      'How do you isolate dependencies using Python virtual environments in a team repo?',
      'What are the advantages of using Pylance type checking during early AI application development?'
    ]
  },
  {
    day: 2,
    title: 'Local LLM & AI Coding Assistant Setup',
    module: 'Environment & Tooling',
    type: 'SETUP',
    tools: ['Ollama', 'Qwen2.5-Coder', 'GitHub Copilot', 'Cline'],
    objectives: [
      'Install Ollama and download a local coding model',
      'Verify the local model works through the Ollama CLI',
      'Connect VS Code to the local model using GitHub Copilot or Cline',
      'Generate code using the local AI assistant',
      'Confirm the complete AI coding workflow works offline'
    ],
    description: 'Configuring Ollama local LLMs (Qwen2.5-Coder) and integrating AI coding assistants for offline developer workflows.',
    keyConcepts: ['Ollama CLI', 'Local LLM Inference', 'Cline/Copilot Integration', 'Offline AI Workflow'],
    sampleQuestions: [
      'When is it preferable to use local quantized models over hosted LLM API endpoints?',
      'How do you configure VS Code plugins to communicate with local Ollama endpoints?'
    ]
  },
  {
    day: 3,
    title: 'First AI Project, React Frontend & GitHub',
    module: 'Environment & Tooling',
    type: 'BUILD',
    tools: ['Python', 'Ollama', 'FastAPI', 'React', 'Vite', 'Git', 'GitHub'],
    objectives: [
      'Build a command-line chatbot powered by your local Ollama model',
      'Scaffold a FastAPI backend with a health endpoint',
      'Create a React application using Vite',
      'Connect the React frontend with the FastAPI backend',
      'Initialize Git, commit the project, and publish it to GitHub'
    ],
    description: 'Scaffolding a full-stack AI web app with React, Vite, FastAPI backend, and local Ollama model integration.',
    keyConcepts: ['FastAPI REST API', 'React + Vite', 'CORS Middleware', 'Ollama API Streaming', 'Git Version Control'],
    sampleQuestions: [
      'How do you structure FastAPI endpoints to proxy streaming LLM responses to a React client?',
      'What CORS configuration is required when connecting a Vite frontend to a FastAPI backend?'
    ]
  },

  {
    day: 4,
    title: 'Reading & Processing Structured Data',
    module: 'Data Foundations',
    type: 'BUILD',
    tools: ['Pandas', 'SQLite', 'SQL', 'SQLAlchemy'],
    objectives: [
      'Create synthetic healthcare plans and claims datasets',
      'Load and clean structured CSV data using Pandas',
      'Store the processed data in a SQLite database',
      'Write SQL queries to answer common healthcare questions',
      'Document reusable SQL queries for later chatbot integration'
    ],
    description: 'Data ingestion, cleaning, and SQL query creation for structured healthcare datasets (plans and claims).',
    keyConcepts: ['Pandas Data Cleaning', 'SQLite Storage', 'Relational Schema Design', 'SQL Query Optimization'],
    sampleQuestions: [
      'How do you handle missing or malformed values when loading CSV records into Pandas?',
      'What indexing strategies optimize SQL lookups for high-volume claim datasets?'
    ]
  },
  {
    day: 5,
    title: 'Reading & Processing Unstructured Data',
    module: 'Data Foundations',
    type: 'BUILD',
    tools: ['pdfplumber', 'PyPDF', 'python-docx', 'Tesseract OCR', 'BeautifulSoup', 'Requests'],
    objectives: [
      'Extract text from healthcare PDFs and Word documents',
      'Perform OCR on scanned enrollment forms',
      'Scrape useful content from a public healthcare webpage',
      'Clean and normalize extracted text from multiple sources',
      'Store the processed text files for knowledge-base creation'
    ],
    description: 'Parsing multi-source unstructured healthcare documents (PDFs, DOCX, OCR scans, HTML web pages) into clean text.',
    keyConcepts: ['PDF Extraction (pdfplumber)', 'Tesseract OCR', 'DOM Web Scraping', 'Text Normalization'],
    sampleQuestions: [
      'How do you preserve table layouts when extracting text from complex multi-column PDFs?',
      'What pre-processing image filters improve Tesseract OCR accuracy on scanned medical forms?'
    ]
  },
  {
    day: 6,
    title: 'Building the Knowledge Base',
    module: 'Data Foundations',
    type: 'BUILD',
    tools: ['LangChain Text Splitters', 'JSONL', 'Python'],
    objectives: [
      'Convert structured and unstructured healthcare data into a unified knowledge base',
      'Split long documents into retrieval-friendly chunks',
      'Attach metadata such as source, plan type, and document section to every chunk',
      'Export all processed records into a knowledge_base.jsonl file',
      'Validate chunk quality before using them for embeddings'
    ],
    description: 'Chunking unstructured and structured records into a unified JSONL knowledge base with detailed metadata tags.',
    keyConcepts: ['Recursive Character Splitting', 'Chunk Metadata Schema', 'JSONL Storage Format', 'Chunk Validation'],
    sampleQuestions: [
      'Why is chunk metadata (source, plan type, section) critical for downstream RAG filtering?',
      'What overlap size would you select when chunking 10-page medical policy guidelines?'
    ]
  },

  {
    day: 7,
    title: 'Embeddings Explained',
    module: 'Embeddings & Vector Search',
    type: 'AI_CORE',
    tools: ['Sentence Transformers', 'OpenAI Embeddings', 'Scikit-learn', 'Matplotlib'],
    objectives: [
      'Understand how text is converted into vector embeddings',
      'Generate embeddings for every knowledge base chunk',
      'Store embeddings alongside the original documents',
      'Visualize embedding clusters using PCA',
      'Analyze whether similar healthcare concepts cluster together'
    ],
    description: 'Converting text chunks into high-dimensional vector representations, measuring distance metrics, and visualizing clusters with PCA.',
    keyConcepts: ['Dense Vector Embeddings', 'Cosine vs L2 Distance', 'Dimensionality Reduction (PCA)', 'Semantic Clustering'],
    sampleQuestions: [
      'How do dense vector embeddings differ from sparse keyword representations like BM25?',
      'What causes embedding cluster overlap between distinct domain concepts?'
    ]
  },
  {
    day: 8,
    title: 'Vector Databases Overview',
    module: 'Embeddings & Vector Search',
    type: 'BUILD',
    tools: ['ChromaDB', 'Pinecone'],
    objectives: [
      'Learn the role of vector databases in RAG applications',
      'Set up a local Chroma vector database',
      'Create a cloud-based Pinecone index for comparison',
      'Compare local and managed vector database solutions',
      'Select the most suitable database for the chatbot project'
    ],
    description: 'Comparing local vector stores (ChromaDB) vs cloud managed vector engines (Pinecone) for scalable semantic search.',
    keyConcepts: ['Vector Database Architecture', 'ChromaDB Local Store', 'Pinecone Cloud Indexing', 'Latency & Scale Trade-offs'],
    sampleQuestions: [
      'When should a project migrate from local ChromaDB to managed cloud Pinecone?',
      'How do index update latency and read query throughput differ between local and hosted vector DBs?'
    ]
  },
  {
    day: 9,
    title: 'Building & Populating the Vector Database',
    module: 'Embeddings & Vector Search',
    type: 'BUILD',
    tools: ['ChromaDB', 'Sentence Transformers'],
    objectives: [
      'Load knowledge base embeddings into the vector database',
      'Store documents together with metadata for filtering',
      'Verify that every knowledge base chunk has been indexed',
      'Test semantic search with healthcare-related questions',
      'Evaluate retrieval quality and metadata filtering'
    ],
    description: 'Batch loading embeddings and document payloads into ChromaDB with metadata indexing for fast filtered retrieval.',
    keyConcepts: ['Batch Embedding Ingestion', 'Metadata Indexing', 'Similarity Queries', 'Chroma Collections'],
    sampleQuestions: [
      'How do payload metadata filters accelerate query performance in ChromaDB collections?',
      'What steps verify that 100% of knowledge base chunks are correctly indexed without data corruption?'
    ]
  },
  {
    day: 10,
    title: 'The Retrieval & Matching Engine',
    module: 'Embeddings & Vector Search',
    type: 'SHIP_IT',
    tools: ['SQLite', 'ChromaDB', 'Python'],
    objectives: [
      'Build a query router that decides between SQL, vector search, or hybrid retrieval',
      'Implement structured data lookup for plans and claims',
      'Implement semantic retrieval from the vector database',
      'Merge and deduplicate results from multiple retrieval sources',
      'Evaluate retrieval accuracy using a diverse set of healthcare questions'
    ],
    description: 'Constructing a hybrid retrieval engine and query router uniting structured SQL query lookups and vector semantic search.',
    keyConcepts: ['Query Router', 'Hybrid Retrieval Engine', 'Result Deduplication', 'Reciprocal Rank Fusion (RRF)'],
    sampleQuestions: [
      'How does a query router decide whether to query SQLite structured tables or ChromaDB vector store?',
      'Explain how result deduplication and re-ranking prevent prompt context clutter.'
    ]
  },

  {
    day: 11,
    title: 'RAG End-to-End & LLM API Basics',
    module: 'LLM Core, Prompting & Fine-Tuning',
    type: 'BUILD',
    tools: ['OpenAI SDK', 'Ollama', 'Groq', 'Python'],
    objectives: [
      'Connect the retrieval engine to an LLM to build a complete RAG pipeline',
      'Configure a local or hosted LLM provider using the OpenAI-compatible SDK',
      'Create a grounded prompt that answers only from retrieved context',
      'Generate answers using retrieved knowledge',
      'Evaluate chatbot responses against the retrieval-only baseline'
    ],
    description: 'Connecting hybrid retrieval to LLM APIs (OpenAI/Groq/Ollama) to assemble grounded RAG generation pipelines.',
    keyConcepts: ['End-to-End RAG Flow', 'Grounded System Prompts', 'OpenAI SDK Integration', 'Hallucination Prevention'],
    sampleQuestions: [
      'How do you enforce that the LLM only answers questions using retrieved context snippets?',
      'What metrics evaluate whether an LLM response is faithful to the retrieved document context?'
    ]
  },
  {
    day: 12,
    title: 'Prompt Engineering Fundamentals',
    module: 'LLM Core, Prompting & Fine-Tuning',
    type: 'LEARN',
    tools: ['LLMs', 'Prompt Templates'],
    objectives: [
      'Understand zero-shot, few-shot, and chain-of-thought prompting',
      'Design multiple system prompt variations for the chatbot',
      'Compare prompts based on accuracy, compliance, and tone',
      'Evaluate prompt performance using a fixed question set',
      'Finalize the production-ready system prompt'
    ],
    description: 'Designing system prompts, zero-shot/few-shot exemplars, delimiters, and chain-of-thought reasoning templates.',
    keyConcepts: ['Zero-Shot & Few-Shot Prompting', 'Chain-of-Thought (CoT)', 'System Prompt Engineering', 'Template Benchmarking'],
    sampleQuestions: [
      'How does few-shot prompting improve formatting compliance in structured technical answers?',
      'What prompt engineering techniques prevent user inputs from overriding system instructions?'
    ]
  },
  {
    day: 13,
    title: 'Advanced Prompting: Function Calling & Structured Outputs',
    module: 'LLM Core, Prompting & Fine-Tuning',
    type: 'BUILD',
    tools: ['OpenAI Function Calling', 'Pydantic', 'Python'],
    objectives: [
      'Define tool schemas for healthcare-related chatbot functions',
      'Implement LLM function calling with automatic tool execution',
      'Validate structured outputs using Pydantic models',
      'Log tool calls for debugging and auditing',
      'Test different user queries to verify correct tool selection'
    ],
    description: 'Implementing LLM tool declarations, function calling workflows, and strict Pydantic output schema validation.',
    keyConcepts: ['Function Calling API', 'Pydantic Schema Validation', 'Tool Execution Loops', 'Audit Logging'],
    sampleQuestions: [
      'How do Pydantic models guarantee runtime type safety for LLM-generated JSON tool arguments?',
      'What is the fallback mechanism if an LLM generates invalid parameters for a tool call?'
    ]
  },
  {
    day: 14,
    title: 'Fine-Tuning: Concepts & When to Use It',
    module: 'LLM Core, Prompting & Fine-Tuning',
    type: 'LEARN',
    tools: ['JSONL', 'OpenAI', 'LoRA', 'QLoRA'],
    objectives: [
      'Understand when fine-tuning is more appropriate than prompting or RAG',
      'Identify chatbot issues that fine-tuning can solve',
      'Create a high-quality fine-tuning dataset',
      'Validate and organize the dataset into training and test sets',
      'Prepare the project for model fine-tuning'
    ],
    description: 'Evaluating trade-offs between RAG and fine-tuning, domain adaptation requirements, and dataset preparation.',
    keyConcepts: ['RAG vs Fine-Tuning', 'Domain Adaptation', 'Fine-Tuning JSONL Curation', 'Train/Validation Splits'],
    sampleQuestions: [
      'When should an organization choose LoRA fine-tuning over RAG context injection?',
      'How do you construct high-quality instruction-response pairs for fine-tuning?'
    ]
  },
  {
    day: 15,
    title: 'Fine-Tuning: Hands-On with LoRA & QLoRA',
    module: 'LLM Core, Prompting & Fine-Tuning',
    type: 'SHIP_IT',
    tools: ['PEFT', 'Transformers', 'BitsAndBytes', 'OpenAI Fine-Tuning', 'LoRA'],
    objectives: [
      'Train or fine-tune an LLM using LoRA or the OpenAI fine-tuning workflow',
      'Load and evaluate the fine-tuned model',
      'Compare the base model and fine-tuned model on unseen test cases',
      'Measure improvements in tone, consistency, and response quality',
      'Document whether fine-tuning provides measurable benefits for the chatbot'
    ],
    description: 'Hands-on parameter-efficient fine-tuning using LoRA, QLoRA 4-bit quantization, and evaluation against base models.',
    keyConcepts: ['LoRA Adapters', 'QLoRA 4-bit Quantization', 'PEFT Library', 'Model Evaluation Benchmarks'],
    sampleQuestions: [
      'How does LoRA reduce GPU memory consumption during model parameter updates?',
      'What evaluation metrics demonstrate whether fine-tuning improved tone and domain compliance?'
    ]
  },

  {
    day: 16,
    title: 'Chatbot Backend & API Integration',
    module: 'Chatbot Application Build',
    type: 'BUILD',
    tools: ['FastAPI', 'SQLite', 'Python'],
    objectives: [
      'Create a /chat API endpoint for the healthcare chatbot',
      'Integrate retrieval, function calling, and LLM response generation',
      'Implement session-based conversation management',
      'Build a conversation history endpoint',
      'Test the complete backend API using Postman or cURL'
    ],
    description: 'Building robust FastAPI backend endpoints (`/chat`, `/history`) linking RAG retrieval, tool execution, and session state.',
    keyConcepts: ['FastAPI Route Handlers', 'Session Management', 'Chat History Persistence', 'API Error Handling'],
    sampleQuestions: [
      'How do you manage concurrent user session threads in a FastAPI backend without memory leaks?',
      'What HTTP status codes and error models should be returned when LLM provider APIs timeout?'
    ]
  },
  {
    day: 17,
    title: 'Chatbot Frontend Development',
    module: 'Chatbot Application Build',
    type: 'BUILD',
    tools: ['Streamlit', 'Requests', 'UUID'],
    objectives: [
      'Build an interactive chat interface for the chatbot',
      'Connect the frontend to the backend chat API',
      'Maintain conversation history across user interactions',
      'Add a healthcare plan selector and new conversation option',
      'Validate end-to-end communication between frontend and backend'
    ],
    description: 'Developing interactive chat user interfaces with conversation state, plan selectors, and message rendering.',
    keyConcepts: ['Interactive Chat UI', 'Session State Management', 'API Proxy Calls', 'User Experience Design'],
    sampleQuestions: [
      'How do you manage client-side chat session state when switching between different candidate or plan views?',
      'What UI design practices prevent blank screens during asynchronous LLM generation?'
    ]
  },
  {
    day: 18,
    title: 'Full-Stack Integration & Streaming Responses',
    module: 'Chatbot Application Build',
    type: 'BUILD',
    tools: ['FastAPI', 'StreamingResponse', 'Server-Sent Events', 'Streamlit'],
    objectives: [
      'Implement real-time streaming responses from the LLM',
      'Display generated tokens incrementally in the chat interface',
      'Add loading indicators for a better user experience',
      'Handle interrupted or failed streaming requests gracefully',
      'Verify smooth end-to-end streaming between backend and frontend'
    ],
    description: 'Implementing real-time Server-Sent Events (SSE) token streaming from FastAPI backend to frontend UI.',
    keyConcepts: ['Server-Sent Events (SSE)', 'StreamingResponse Handler', 'Token-by-Token Rendering', 'Connection Abort Handling'],
    sampleQuestions: [
      'How do you handle client network disconnects during an SSE token stream without leaving orphaned backend tasks?',
      'What is the latency difference between buffered JSON API responses vs token-by-token SSE streaming?'
    ]
  },
  {
    day: 19,
    title: 'Response Formatting & Rich Outputs',
    module: 'Chatbot Application Build',
    type: 'BUILD',
    tools: ['Pydantic', 'Markdown', 'Streamlit'],
    objectives: [
      'Add citations to chatbot responses using retrieved knowledge',
      'Create structured cards for claims and coverage summaries',
      'Render Markdown content with tables, lists, and formatting',
      'Validate structured outputs before displaying them',
      'Improve chatbot readability and response trustworthiness'
    ],
    description: 'Rendering rich Markdown responses, inline citation footnotes, structured coverage summary cards, and tables.',
    keyConcepts: ['Markdown Rendering', 'Inline Citation Footnotes', 'Structured Card Components', 'Pydantic Display Contracts'],
    sampleQuestions: [
      'How do you map retrieved knowledge base chunk IDs into clickable user-facing document citations?',
      'What UI layout renders complex markdown tables cleanly across mobile and desktop viewports?'
    ]
  },
  {
    day: 20,
    title: 'Conversation Memory & Context Management',
    module: 'Chatbot Application Build',
    type: 'SHIP_IT',
    tools: ['SQLite', 'FastAPI', 'LLM', 'Token Management'],
    objectives: [
      'Persist conversation history across multiple user sessions',
      'Build context-aware conversations using previous messages',
      'Implement automatic conversation summarization for long chats',
      'Manage token limits while preserving important context',
      'Ensure the chatbot remembers user preferences throughout a conversation'
    ],
    description: 'Managing long-turn conversation memory, automatic context window summarization, and token truncation policies.',
    keyConcepts: ['Conversation Summarization', 'Context Window Truncation', 'Token Budgeting', 'Persistent Session Memory'],
    sampleQuestions: [
      'When conversation history exceeds 16,000 tokens, how do you compress early chat turns without losing user intent?',
      'How do you store persistent user preferences across distinct interview sessions?'
    ]
  },

  {
    day: 21,
    title: 'Agentic Frameworks: LangChain Agents & Tool Use',
    module: 'Agentic AI & MCP',
    type: 'BUILD',
    tools: ['LangChain', 'LangChain Agents', 'ReAct', 'Python'],
    objectives: [
      'Convert function-calling workflows into a reasoning agent',
      'Wrap chatbot capabilities as reusable LangChain tools',
      'Build a ReAct agent capable of selecting the correct tool automatically',
      'Analyze reasoning traces to understand agent decision making',
      'Evaluate whether the agent chooses the right tools for healthcare queries'
    ],
    description: 'Constructing autonomous ReAct (Reasoning + Acting) loop agents with reusable custom tools.',
    keyConcepts: ['ReAct Reasoning Loop', 'Thought-Action-Observation Pattern', 'Custom Tool Wrappers', 'Agent Trace Auditing'],
    sampleQuestions: [
      'Walk through the execution trace of a ReAct agent when an external tool returns an empty observation.',
      'How do you prevent an autonomous agent from entering an infinite tool execution loop?'
    ]
  },
  {
    day: 22,
    title: 'Multi-Agent Orchestration',
    module: 'Agentic AI & MCP',
    type: 'BUILD',
    tools: ['CrewAI', 'LangGraph', 'Python'],
    objectives: [
      'Create specialized agents for different healthcare domains',
      'Build a router agent that delegates requests to the correct specialist',
      'Implement a complete multi-agent workflow',
      'Compare multi-agent performance with a single-agent architecture',
      'Identify scenarios where multiple agents provide measurable benefits'
    ],
    description: 'Designing multi-agent topologies (supervisor, router, specialist workers) using LangGraph and state hand-offs.',
    keyConcepts: ['Supervisor Topology', 'Agent Hand-off Protocol', 'Shared Graph State', 'Specialized Worker Agents'],
    sampleQuestions: [
      'Compare a supervisor-worker multi-agent graph with a sequential chain agent architecture.',
      'How do you prevent circular delegation loops between specialist agents in LangGraph?'
    ]
  },
  {
    day: 23,
    title: 'Model Context Protocol (MCP)',
    module: 'Agentic AI & MCP',
    type: 'BUILD',
    tools: ['MCP Python SDK', 'Claude Desktop', 'Cline', 'Python'],
    objectives: [
      'Understand the purpose of the Model Context Protocol',
      'Build an MCP server exposing healthcare chatbot tools',
      'Connect the MCP server to an MCP-compatible client',
      'Expose multiple chatbot capabilities through standardized MCP tools',
      'Verify successful tool execution through live MCP interactions'
    ],
    description: 'Building custom Model Context Protocol (MCP) servers exposing standardized tools, resources, and prompts.',
    keyConcepts: ['MCP Server Spec', 'JSON-RPC Protocol', 'Resources, Prompts & Tools', 'Stdio/SSE Transport'],
    sampleQuestions: [
      'What key benefits does MCP offer over ad-hoc custom tool declaration wrappers?',
      'How does an MCP client negotiate tools and capabilities with an MCP server upon connection?'
    ]
  },
  {
    day: 24,
    title: 'Agentic Chatbot Integration',
    module: 'Agentic AI & MCP',
    type: 'SHIP_IT',
    tools: ['LangChain', 'MCP', 'FastAPI', 'Python'],
    objectives: [
      'Integrate agents, MCP tools, retrieval, and conversation memory',
      'Replace mock tools with live MCP-powered tool calls',
      'Implement retries, timeouts, and graceful error handling',
      'Perform failure testing to validate chatbot reliability',
      'Build a production-style agentic chatbot pipeline'
    ],
    description: 'Integrating multi-agent loops, live MCP tool execution, RAG retrieval, and session memory into a unified production pipeline.',
    keyConcepts: ['Agentic Integration Pipeline', 'Live MCP Execution', 'Fault Tolerance & Retries', 'End-to-End Failure Testing'],
    sampleQuestions: [
      'How do you handle tool timeouts gracefully without breaking the user conversation state?',
      'What testing strategies validate multi-step agent reasoning reliability before deployment?'
    ]
  },

  {
    day: 25,
    title: 'Chatbot Evaluation & Testing',
    module: 'Evaluation, Security & Deployment',
    type: 'SHIP_IT',
    tools: ['Python', 'Evaluation Dataset', 'Automated Testing'],
    objectives: [
      'Create a benchmark dataset covering representative healthcare questions',
      'Evaluate chatbot responses for accuracy, grounding, and consistency',
      'Measure retrieval quality and end-to-end response performance',
      'Identify common failure cases and document improvement areas',
      'Establish baseline metrics before production deployment'
    ],
    description: 'Automated evaluation benchmarking for response accuracy, context grounding, hallucination detection, and retrieval recall.',
    keyConcepts: ['Evaluation Benchmarks', 'LLM-as-a-Judge', 'Context Faithfulness Metric', 'Regression Testing'],
    sampleQuestions: [
      'How do you build an automated evaluation dataset to detect regression when updating system prompts?',
      'What are the limitations of using an LLM-as-a-Judge for response grading?'
    ]
  },
  {
    day: 26,
    title: 'Performance Optimization & Cost Management',
    module: 'Evaluation, Security & Deployment',
    type: 'OPTIMIZE',
    tools: ['tiktoken', 'Python', 'FastAPI'],
    objectives: [
      'Measure token usage across the chatbot pipeline',
      'Optimize retrieval and prompt size to reduce latency and cost',
      'Implement response caching for repeated queries',
      'Benchmark response time before and after optimization',
      'Document performance improvements using measurable metrics'
    ],
    description: 'Profiling token consumption, prompt prefix caching, semantic caching with Redis, and latency optimization.',
    keyConcepts: ['Token Profiling (tiktoken)', 'Prompt Prefix Caching', 'Semantic Cache Thresholds', 'Cost-per-Query Optimization'],
    sampleQuestions: [
      'How does exact prompt prefix caching differ from semantic vector response caching?',
      'What cosine similarity threshold balances cache hit rate with response accuracy?'
    ]
  },
  {
    day: 27,
    title: 'Security, Privacy & Guardrails',
    module: 'Evaluation, Security & Deployment',
    type: 'BUILD',
    tools: ['FastAPI', 'Python', 'Authentication', 'Input Validation'],
    objectives: [
      'Secure chatbot APIs against unauthorized access',
      'Validate and sanitize user inputs before processing',
      'Protect sensitive healthcare information throughout the pipeline',
      'Implement prompt-injection and jailbreak safeguards',
      'Test common security scenarios and document mitigation strategies'
    ],
    description: 'Hardening APIs against indirect prompt injection, jailbreaks, PII leakage, and unauthorized access.',
    keyConcepts: ['Indirect Prompt Injection Defenses', 'PII Masking & Redaction', 'Input Sanitization', 'Guardrail Classifiers'],
    sampleQuestions: [
      'How do you protect a RAG system against indirect prompt injections hidden inside retrieved untrusted documents?',
      'What automated filters prevent accidental PII/PHI leakage in LLM outputs?'
    ]
  },
  {
    day: 28,
    title: 'Docker & Kubernetes Deployment',
    module: 'Evaluation, Security & Deployment',
    type: 'SHIP_IT',
    tools: ['Docker', 'Kubernetes', 'FastAPI', 'React'],
    objectives: [
      'Containerize the chatbot backend and frontend using Docker',
      'Deploy the application to a Kubernetes cluster',
      'Configure health checks and environment variables',
      'Verify the deployed chatbot functions correctly',
      'Prepare the application for production hosting'
    ],
    description: 'Containerizing full-stack AI services with Docker and orchestrating Kubernetes pods, ingress, and health checks.',
    keyConcepts: ['Docker Multi-Stage Builds', 'Kubernetes Deployment & Pods', 'Liveness & Readiness Probes', 'ConfigMaps & Secrets'],
    sampleQuestions: [
      'How do you configure Kubernetes liveness and readiness probes for an LLM API container with long startup times?',
      'What Docker multi-stage build patterns keep production container image sizes minimal?'
    ]
  },

  {
    day: 29,
    title: 'Monitoring, Logging & Observability',
    module: 'Production & Capstone',
    type: 'BUILD',
    tools: ['Python Logging', 'Prometheus', 'Grafana'],
    objectives: [
      'Add structured logging throughout the chatbot pipeline',
      'Monitor API performance and chatbot usage',
      'Track failures, latency, and tool execution metrics',
      'Build dashboards for production observability',
      'Use monitoring insights to improve chatbot reliability'
    ],
    description: 'Setting up OpenTelemetry tracing, TTFT/TPOT latency metrics, Prometheus scraping, and Grafana dashboards.',
    keyConcepts: ['Structured Logging', 'Prometheus Metrics', 'Grafana Dashboards', 'TTFT & TPOT Monitoring'],
    sampleQuestions: [
      'Why is monitoring Time-To-First-Token (TTFT) and Time-Per-Output-Token (TPOT) critical for LLM user experience?',
      'How do you correlate distributed trace spans across client, backend, vector DB, and LLM provider calls?'
    ]
  },
  {
    day: 30,
    title: 'Production Readiness & Final Testing',
    module: 'Production & Capstone',
    type: 'SHIP_IT',
    tools: ['FastAPI', 'Docker', 'Kubernetes', 'Python'],
    objectives: [
      'Perform complete end-to-end testing of the chatbot',
      'Validate retrieval, agent workflows, and frontend integration',
      'Fix production issues discovered during testing',
      'Complete deployment and operational documentation',
      'Prepare the chatbot for real-world production usage'
    ],
    description: 'Performing end-to-end chaos testing, load testing, SLA verification, and operational runbook preparation.',
    keyConcepts: ['End-to-End Load Testing', 'Chaos Engineering', 'SLA/SLO Verification', 'Production Runbooks'],
    sampleQuestions: [
      'What chaos testing scenarios expose vulnerabilities in vector database index updates under heavy query load?',
      'How do you structure SLA/SLO definitions for production LLM streaming endpoints?'
    ]
  },
  {
    day: 31,
    title: 'Capstone Project & Final Demo',
    module: 'Production & Capstone',
    type: 'CAPSTONE',
    tools: ['FastAPI', 'React', 'LangChain', 'MCP', 'Docker', 'Kubernetes'],
    objectives: [
      'Demonstrate the complete enterprise healthcare chatbot',
      'Showcase retrieval, RAG, agents, MCP, and conversation memory',
      'Present the deployed application with production architecture',
      'Evaluate the chatbot using real-world scenarios',
      'Publish the final project with source code and documentation'
    ],
    description: 'Comprehensive evaluation and defense of the complete production AI system, architecture trade-offs, and capstone demo.',
    keyConcepts: ['Capstone Architecture Defense', 'Production System Synthesis', 'Trade-off Justification', 'Live System Demonstration'],
    sampleQuestions: [
      'In your capstone architecture, what is the single biggest bottleneck at 100x user scale and how will you refactor it?',
      'How do you demonstrate that your RAG + Agent + MCP integration delivers measurable quality improvements over baseline prompting?'
    ]
  }
];

export function getCurriculumDay(dayNumber: number): CurriculumDay | undefined {
  return AI_COHORT_CURRICULUM.find(c => c.day === dayNumber);
}

export function getCurriculumDaysByNumbers(dayNumbers: number[]): CurriculumDay[] {
  return dayNumbers
    .map(d => getCurriculumDay(d))
    .filter((c): c is CurriculumDay => c !== undefined);
}
