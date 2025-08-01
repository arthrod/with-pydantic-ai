# Pydantic AI Research Assistant with AG-UI Protocol

A comprehensive research assistant built with **Pydantic AI** and the official **AG-UI protocol** for real-time frontend-agent communication. This application demonstrates proper integration between a Python-based AI agent and a modern React frontend using CopilotKit.

## 🏗️ Architecture

This application uses the official **AG-UI (Agent-User Interaction) Protocol** to enable real-time communication between:

- **Backend**: Pydantic AI agent with AG-UI protocol support
- **Frontend**: React + CopilotKit with AG-UI client integration
- **Communication**: Real-time streaming via AG-UI events over HTTP

### AG-UI Protocol Benefits

✅ **Real-time streaming**: Token-by-token agent responses  
✅ **State synchronization**: Live updates of agent progress  
✅ **Structured communication**: Standardized event-based messaging  
✅ **Framework agnostic**: Works with any frontend framework  
✅ **No mock data**: All interactions use real agent state  

## 🚀 Features

- **Deep Research Workflow**: 6-step comprehensive research process
- **Real-time Progress Tracking**: Live visualization of agent steps
- **Web Search Integration**: Actual web searches using DuckDuckGo
- **Content Analysis**: AI-powered information synthesis
- **Fact Verification**: Cross-reference validation
- **Transparent Process**: Full visibility into agent reasoning

## 🛠️ Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- OpenAI API key

### 1. Install Dependencies

```bash
# Install all dependencies (includes backend setup)
npm install
```

### 2. Environment Setup

Create `.env` file in the root:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

Create `agent/.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Application

```bash
# Start both frontend and backend with AG-UI integration
npm run dev
```

This starts:
- **Backend**: Pydantic AI agent with AG-UI at `http://localhost:8000`
- **Frontend**: Next.js with CopilotKit at `http://localhost:3000`

## 🔧 System Components

### Backend Agent (`agent/agent.py`)

```python
# Pydantic AI agent with AG-UI protocol
research_agent = Agent(
    'openai:gpt-4o',
    deps_type=StateDeps[ResearchState],
    system_prompt="You are a comprehensive research assistant..."
)

# Convert to AG-UI compatible FastAPI app
app = research_agent.to_ag_ui(deps=StateDeps(ResearchState()))
```

**Research Tools Available:**
- `start_research(query)` - Initialize research workflow
- `deep_think_analyze_query()` - Cognitive analysis
- `web_search(terms)` - Real web search via DuckDuckGo
- `analyze_content()` - Content relevance analysis
- `synthesize_information()` - Information synthesis
- `verify_facts()` - Fact verification
- `generate_final_output()` - Comprehensive report

### Frontend Integration (`src/app/api/copilotkit/route.ts`)

```typescript
// AG-UI client connecting to Pydantic AI agent
const runtime = new CopilotRuntime({
  agents: {
    "research_agent": new HttpAgent({url: "http://localhost:8000/"}),
  }   
});
```

### Real-time State Management (`src/components/ChatInterface.tsx`)

```typescript
// AG-UI state integration - NO MOCK DATA
const { state } = useCoAgent<ResearchState>({
  name: "research_agent", // Matches backend agent
  initialState: {
    query: "",
    steps: [],
    search_results: [],
    // ... real agent state
  },
});
```

## 📡 AG-UI Protocol Flow

1. **User Input**: Message sent via CopilotKit chat
2. **AG-UI Relay**: Frontend sends to `/api/copilotkit`
3. **Agent Processing**: Pydantic AI executes research workflow
4. **Real-time Events**: Agent streams state updates via AG-UI
5. **Live Updates**: Frontend receives and displays progress
6. **Final Result**: Complete research report delivered

### Example Event Flow:
```
USER: "Research AI safety regulations"
  ↓ AG-UI Protocol
AGENT: StateSnapshotEvent(steps=[...])
  ↓ Real-time streaming  
UI: Updates progress sidebar
  ↓ Continues...
AGENT: Final research report
  ↓ AG-UI Protocol
UI: Displays complete results
```

## 🧪 Testing the Integration

### 1. Verify Backend AG-UI Endpoint
```bash
curl -X GET http://localhost:8000/
# Expected: "Method Not Allowed" (correct, POST endpoint)
```

### 2. Test Research Query
Visit `http://localhost:3000` and ask:
> "Research the latest developments in quantum computing"

### 3. Observe Real-time Updates
Watch the progress sidebar for live agent steps:
- 🧠 Deep Think: Analyzing Query
- 🔧 Tool Call: Web Search  
- 📋 Subtask: Content Analysis
- 🧠 Deep Think: Synthesis
- 📋 Subtask: Fact Verification  
- 🔧 Tool Call: Content Generation

## 🔍 No Mock Data Policy

This application contains **ZERO mock data**:

❌ **Removed**: Static step definitions  
❌ **Removed**: Hardcoded progress states  
❌ **Removed**: Fake search results  
❌ **Removed**: Simulated processing delays  

✅ **Real**: Agent state from Pydantic AI  
✅ **Real**: Live web search results  
✅ **Real**: Dynamic step progression  
✅ **Real**: Actual processing times  

## 🐛 Troubleshooting

### Backend Issues
```bash
cd agent && python agent.py
# Should show: "Uvicorn running on http://0.0.0.0:8000"
```

### Frontend Issues
```bash
npm run dev:ui
# Should show: "Ready - started server on 0.0.0.0:3000"
```

### AG-UI Connection Issues
- Verify agent name matches: `"research_agent"`
- Check CORS settings if needed
- Ensure ports 3000 and 8000 are available

## 📚 Learn More

- [Pydantic AI Documentation](https://ai.pydantic.dev/)
- [AG-UI Protocol Specification](https://docs.ag-ui.com/)
- [CopilotKit Integration Guide](https://docs.copilotkit.ai/)

## 🤝 Contributing

This project demonstrates best practices for AG-UI protocol integration. Feel free to extend with additional research tools or frontend components while maintaining the AG-UI standard.

---

**Built with Pydantic AI + AG-UI Protocol + CopilotKit**