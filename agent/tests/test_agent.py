import pytest
from unittest.mock import MagicMock
from src.agent import (
    ProverbsState,
    get_proverbs,
    add_proverbs,
    set_proverbs,
    get_weather,
)
from pydantic_ai import RunContext
from pydantic_ai.ag_ui import StateDeps
from ag_ui.core import EventType, StateSnapshotEvent

# --- Fixtures ---

@pytest.fixture
def mock_run_context():
    """Creates a mock RunContext with StateDeps and ProverbsState."""
    state = ProverbsState(proverbs=["A rolling stone gathers no moss"])

    # Mock StateDeps
    deps = MagicMock(spec=StateDeps)
    deps.state = state

    # Mock RunContext
    ctx = MagicMock(spec=RunContext)
    ctx.deps = deps

    return ctx

# --- Tests ---

def test_proverbs_state_initialization():
    """Test that ProverbsState initializes with an empty list by default."""
    state = ProverbsState()
    assert state.proverbs == []

def test_get_proverbs(mock_run_context):
    """Test get_proverbs returns the current list of proverbs."""
    proverbs = get_proverbs(mock_run_context)
    assert proverbs == ["A rolling stone gathers no moss"]
    assert len(proverbs) == 1

@pytest.mark.asyncio
async def test_add_proverbs(mock_run_context):
    """Test add_proverbs appends to the list and returns a StateSnapshotEvent."""
    new_proverbs = ["Early bird catches the worm"]
    result = await add_proverbs(mock_run_context, new_proverbs)

    # Check state update
    assert mock_run_context.deps.state.proverbs == [
        "A rolling stone gathers no moss",
        "Early bird catches the worm"
    ]

    # Check return value
    assert isinstance(result, StateSnapshotEvent)
    assert result.type == EventType.STATE_SNAPSHOT
    assert result.snapshot == mock_run_context.deps.state

@pytest.mark.asyncio
async def test_set_proverbs(mock_run_context):
    """Test set_proverbs replaces the list and returns a StateSnapshotEvent."""
    new_proverbs = ["Time matches on", "Knowledge is power"]
    result = await set_proverbs(mock_run_context, new_proverbs)

    # Check state update
    assert mock_run_context.deps.state.proverbs == new_proverbs

    # Check return value
    assert isinstance(result, StateSnapshotEvent)
    assert result.type == EventType.STATE_SNAPSHOT
    assert result.snapshot == mock_run_context.deps.state

def test_get_weather(mock_run_context):
    """Test get_weather returns the hardcoded weather string."""
    location = "San Francisco"
    weather = get_weather(mock_run_context, location)
    assert weather == f"The weather in {location} is sunny."
