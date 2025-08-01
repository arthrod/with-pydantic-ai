# AI Research Agent with Pydantic AI

A comprehensive research assistant that conducts thorough investigations with complete transparency of the thought process, built using Pydantic AI framework.

## Features

🧠 **Deep Thinking Analysis** - Breaks down complex research queries into components
🔍 **Web Search Integration** - Real-time web search using DuckDuckGo
📊 **Content Analysis** - Evaluates information for relevance and accuracy  
🔗 **Information Synthesis** - Combines insights from multiple sources
✅ **Fact Verification** - Cross-references claims across authoritative sources
📄 **Comprehensive Reporting** - Generates detailed research summaries

## Architecture

The agent implements a structured 6-step research workflow:

1. **Deep Think: Query Analysis** - Cognitive reasoning and context analysis
2. **Tool Call: Web Search** - Searches for relevant information
3. **Subtask: Content Analysis** - Analyzes gathered information for relevance
4. **Deep Think: Synthesis** - Synthesizes information into coherent insights
5. **Subtask: Fact Verification** - Cross-references and validates findings
6. **Tool Call: Content Generation** - Creates comprehensive research output

## Setup

### 1. Environment Setup

Create a `.env` file in the agent directory:

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional (for enhanced search capabilities)
TAVILY_API_KEY=your_tavily_api_key_here
```

### 2. Install Dependencies

```bash
cd agent
pip install -r requirements.txt
```

### 3. Test the Agent

```bash
python test_agent.py
```

### 4. Run the Agent Server

```bash
python agent.py
```

The agent will be available at `http://localhost:8000`

## Integration with Frontend

The agent integrates with the frontend via CopilotKit's AG-UI framework. The frontend expects:

- **Real-time step updates** via `StateSnapshotEvent`
- **Progress tracking** with step statuses: pending → active → completed
- **Structured research workflow** matching the 6-step process
- **Detailed step information** with timestamps and completion details

## API Endpoints

When running, the agent exposes these AG-UI endpoints:

- `GET /` - Agent information and health check
- `POST /agents/execute` - Execute research workflow
- `POST /agents/state` - Get current research state

## Research Workflow

### Step Types

- **thinking** 🧠 - Deep cognitive analysis and reasoning
- **tool** 🔧 - External tool execution (search, generation)
- **subtask** 📋 - Specialized analysis tasks
- **output** 📄 - Final output generation

### State Management

The agent maintains comprehensive state including:

```python
class ResearchState:
    query: str                    # Research query
    steps: List[ResearchStep]     # Workflow steps with progress
    current_step_index: int       # Current step position
    search_results: List[Dict]    # Web search results
    content_analysis: str         # Analysis of gathered content
    synthesis: str                # Synthesized insights
    fact_verification: str        # Verification status
    final_output: str            # Complete research report
    completed: bool              # Workflow completion status
```

## Tools Available

### Research Tools
- `start_research(query)` - Initialize research workflow
- `deep_think_analyze_query()` - Analyze and break down the query
- `web_search(search_terms)` - Perform web search with DuckDuckGo
- `analyze_content()` - Analyze search results for relevance
- `synthesize_information()` - Create coherent insights from data
- `verify_facts()` - Cross-reference and validate findings
- `generate_final_output()` - Create comprehensive research report

### Utility Tools
- `get_research_status()` - Get current research state and progress

## Error Handling

The agent includes robust error handling:

- **Fallback search data** if web search fails
- **Graceful degradation** for missing dependencies
- **Comprehensive logging** for debugging
- **State recovery** for interrupted workflows

## Customization

### Adding New Search Providers

To add additional search providers, implement new tools following this pattern:

```python
@research_agent.tool
async def custom_search(ctx: RunContext[StateDeps[ResearchState]], query: str) -> StateSnapshotEvent:
    # Your search implementation
    return StateSnapshotEvent(
        type=EventType.STATE_SNAPSHOT,
        snapshot=ctx.deps.state
    )
```

### Modifying Workflow Steps

Customize the research workflow by modifying `initialize_research_steps()`:

```python
def initialize_research_steps(query: str) -> List[ResearchStep]:
    return [
        ResearchStep(
            id="custom-step",
            title="Custom Analysis",
            description="Your custom step description",
            type="thinking"  # or "tool", "subtask", "output"
        ),
        # ... other steps
    ]
```

## Performance

- **Search Results**: Limited to 10 results per query for optimal performance
- **Concurrent Searches**: Supports up to 3 parallel search terms
- **Response Time**: Typical workflow completion: 10-15 seconds
- **Memory Usage**: Lightweight state management with structured data

## Troubleshooting

### Common Issues

1. **Missing OpenAI API Key**
   ```
   Error: OpenAI API key not configured
   Solution: Add OPENAI_API_KEY to your .env file
   ```

2. **Search Failures**
   ```
   Error: DuckDuckGo search failed
   Solution: Agent falls back to mock data automatically
   ```

3. **Port Already in Use**
   ```
   Error: Port 8000 already in use
   Solution: Kill existing process or change port in agent.py
   ```

### Debug Mode

Run with debug logging:

```bash
PYDANTIC_AI_DEBUG=1 python agent.py
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions and support:
- Check the [Pydantic AI Documentation](https://ai.pydantic.dev/)
- Review the test suite in `test_agent.py`
- Examine the frontend integration in `src/app/api/copilotkit/route.ts` 