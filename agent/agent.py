import json
import asyncio
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict
from pydantic_ai import Agent, RunContext
from pydantic_ai.ag_ui import StateDeps
from ag_ui.core import StateSnapshotEvent, EventType
from dotenv import load_dotenv
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

class LogEntry(BaseModel):
    """Log entry for tracking agent actions."""
    model_config = ConfigDict(json_encoders={datetime: lambda v: v.isoformat()})
    
    timestamp: datetime = Field(default_factory=datetime.now)
    message: str
    type: str = "info"  # info, warning, error, success
    details: Optional[Dict[str, Any]] = None

class AgentState(BaseModel):
    """Simple state model for basic agent."""
    model_config = ConfigDict(json_encoders={datetime: lambda v: v.isoformat()})
    
    model: str = "openai"
    message: str = ""
    logs: List[LogEntry] = Field(default_factory=list)
    thinking_count: int = 0
    last_thought: str = ""

# Create the basic agent
basic_agent = Agent(
    'openai:gpt-4o',
    deps_type=StateDeps[AgentState],
    system_prompt="You are a helpful AI assistant. When asked to think deeply about something, use the deep_think tool."
)

def emit_state_snapshot(ctx: RunContext[StateDeps[AgentState]]) -> StateSnapshotEvent:
    """
    Create a StateSnapshotEvent containing the current agent state.
    
    The agent state is serialized and embedded in a StateSnapshotEvent with type EventType.STATE_SNAPSHOT.
    
    Returns:
        StateSnapshotEvent: Event whose `snapshot` is the current AgentState serialized to a dict and whose `type` is `EventType.STATE_SNAPSHOT`.
    """
    return StateSnapshotEvent(
        type=EventType.STATE_SNAPSHOT,
        snapshot=ctx.deps.state.model_dump()
    )

@basic_agent.tool
async def deep_think(ctx: RunContext[StateDeps[AgentState]], topic: str) -> List[Any]:
    """
    Perform a deep thinking session on a given topic, update the agent state, and return a message plus a state snapshot.
    
    Updates the state's thinking_count and last_thought, appends informational and completion LogEntry entries, and simulates processing delay.
    
    Parameters:
        ctx (RunContext[StateDeps[AgentState]]): Execution context providing access to the agent's state.
        topic (str): Topic to think about.
    
    Returns:
        List[Any]: A two-item list where the first item is a completion message string and the second item is a StateSnapshotEvent representing the current state.
    """
    logger.info(f"Starting deep think about: {topic}")
    
    # Update state
    ctx.deps.state.thinking_count += 1
    ctx.deps.state.last_thought = topic
    
    logger.info(f"Updated thinking_count to: {ctx.deps.state.thinking_count}")
    
    # Add log entry
    ctx.deps.state.logs.append(LogEntry(
        message=f"Deep thinking about: {topic}",
        type="info",
        details={"thinking_count": ctx.deps.state.thinking_count}
    ))
    
    logger.info(f"Added log entry. Total logs: {len(ctx.deps.state.logs)}")
    
    # Simulate thinking process
    await asyncio.sleep(2)
    
    # Add completion log
    ctx.deps.state.logs.append(LogEntry(
        message=f"Completed deep thinking about: {topic}",
        type="success",
        details={"thinking_count": ctx.deps.state.thinking_count}
    ))
    
    logger.info(f"Completed deep think. Final thinking_count: {ctx.deps.state.thinking_count}")
    
    # Return both the response and the state snapshot
    return [
        f"I have completed deep thinking about '{topic}'. This was my {ctx.deps.state.thinking_count}th deep thinking session.",
        emit_state_snapshot(ctx)
    ]

@basic_agent.tool
async def get_state_info(ctx: RunContext[StateDeps[AgentState]]) -> List[Any]:
    """
    Return a human-readable snapshot of the agent's current state and a state snapshot event.
    
    Parameters:
        ctx: Run context whose state (AgentState) will be read to build the snapshot.
    
    Returns:
        A two-item list where the first element is a multiline string describing the current thinking_count, last_thought, and number of log entries; the second element is a StateSnapshotEvent representing the current serialized state.
    """
    logger.info("Getting state info")
    info = f"""
Current State:
- Thinking count: {ctx.deps.state.thinking_count}
- Last thought: {ctx.deps.state.last_thought}
- Log entries: {len(ctx.deps.state.logs)}
"""
    logger.info(f"State info: {info}")
    
    # Return both the response and the state snapshot
    return [
        info,
        emit_state_snapshot(ctx)
    ]

@basic_agent.system_prompt
async def basic_instructions(ctx: RunContext[StateDeps[AgentState]]) -> str:
    """
    Provide the system prompt used by the basic agent, embedding available tools and the current AgentState.
    
    Parameters:
        ctx (RunContext[StateDeps[AgentState]]): Execution context whose state fields (thinking_count, last_thought, logs) are injected into the returned prompt.
    
    Returns:
        str: A formatted system prompt describing the assistant's role, available tools (`deep_think`, `get_state_info`), and the current state's thinking count, last thought, and number of log entries.
    """
    logger.info(f"System prompt called. Current thinking_count: {ctx.deps.state.thinking_count}")
    return f"""
You are a helpful AI assistant with the ability to think deeply about topics.

AVAILABLE TOOLS:
- `deep_think`: Use this when asked to think deeply about something
- `get_state_info`: Use this to check the current state

CURRENT STATE:
- Thinking count: {ctx.deps.state.thinking_count}
- Last thought: {ctx.deps.state.last_thought}
- Log entries: {len(ctx.deps.state.logs)}

When someone asks you to think deeply about something, use the deep_think tool.
"""

# Create the FastAPI app
app = basic_agent.to_ag_ui(deps=StateDeps(AgentState()))

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting basic agent on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)