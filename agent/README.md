# Pydantic AI Agent for Research Helper

This agent is designed to work seamlessly with the Research Helper frontend, providing comprehensive research capabilities with real-time state management and interactive features.

## Features

- **CoAgent State Management**: Real-time state synchronization between frontend and backend
- **State Rendering**: Live UI updates based on agent state changes
- **Copilot Actions**: Interactive actions with user confirmation workflows
- **Resource Management**: Add, edit, and delete research resources
- **Research Workflow**: Comprehensive research process with multiple stages
- **Progress Tracking**: Real-time progress updates with detailed logging

## Setup

1. **Install Dependencies**:
   ```bash
   pip install pydantic-ai ag-ui python-dotenv httpx ddgs beautifulsoup4
   ```

2. **Environment Configuration**:
   ```bash
   cp env_example.txt .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the Agent**:
   ```bash
   python agent.py
   ```
   
   The agent will start on `http://localhost:8000`

## Agent Tools

### Research Tools
- `start_research(query: str)`: Initialize research with a query
- `deep_think_analyze_query()`: Analyze and break down the research question
- `web_search(search_terms: List[str])`: Perform web searches for information
- `analyze_content()`: Analyze gathered information for relevance
- `synthesize_information()`: Create coherent insights from data
- `verify_facts()`: Cross-reference and validate findings
- `generate_final_output()`: Create comprehensive research report

### Resource Management Tools
- `add_resource(url: str, title: str, description: str)`: Add research resources
- `delete_resources(urls: List[str])`: Remove resources (with confirmation)
- `update_resource(original_url: str, new_url: str, title: str, description: str)`: Modify resources

### Status Tools
- `get_research_status()`: Get current research status and results

## State Structure

The agent maintains a comprehensive state that includes:

```python
class AgentState(BaseModel):
    model: str = "openai"
    research_question: str = ""
    report: str = ""
    resources: List[Resource] = []
    logs: List[LogEntry] = []
    query: str = ""
    steps: List[Dict[str, Any]] = []
    current_step_index: int = 0
    search_results: List[Dict[str, Any]] = []
    content_analysis: str = ""
    synthesis: str = ""
    fact_verification: str = ""
    final_output: str = ""
    completed: bool = False
```

## Frontend Integration

The agent is designed to work with the Research Helper frontend, which provides:

- **Real-time State Updates**: Live synchronization of agent state
- **Interactive UI**: Resource management with add/edit/delete capabilities
- **Progress Tracking**: Visual progress indicators for research steps
- **Chat Interface**: Natural language interaction with the agent

## API Endpoints

The agent exposes the following endpoints:

- `POST /copilotkit`: Main CopilotKit integration endpoint
- `GET /docs`: Interactive API documentation (Swagger UI)

## Customization

To customize the agent for different use cases:

1. **Modify the State Model**: Update `AgentState` to include additional fields
2. **Add New Tools**: Create new `@research_agent.tool` functions
3. **Update System Prompt**: Modify the `research_instructions` function
4. **Extend Workflow**: Add new research steps to the workflow

## Environment Variables

- `OPENAI_API_KEY`: Required for the language model
- `PYDANTIC_AI_AGENT_URL`: Custom agent URL (default: http://localhost:8000)
- `LANGSMITH_API_KEY`: Optional for tracing and monitoring

## Troubleshooting

1. **Agent not starting**: Check that your OpenAI API key is valid
2. **Frontend connection issues**: Ensure the agent is running on the correct port
3. **State synchronization problems**: Verify the state model matches between frontend and backend

## Development

The agent uses Pydantic AI and AG-UI for:
- Type-safe state management
- Real-time UI updates
- Tool function definitions
- System prompt management

For more information, see the [Pydantic AI documentation](https://github.com/pydantic/pydantic-ai). 