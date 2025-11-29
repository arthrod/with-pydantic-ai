"""Tests for the agent module."""
import os
import pytest
from unittest.mock import MagicMock, AsyncMock, patch

# Set dummy API key before importing agent (required by OpenAI client)
os.environ["OPENAI_API_KEY"] = "test-key-for-testing"

from pydantic_ai import RunContext
from pydantic_ai.ag_ui import StateDeps
from ag_ui.core import EventType

from src.agent import (
    ProverbsState,
    agent,
    get_proverbs,
    add_proverbs,
    set_proverbs,
    get_weather,
)


class TestProverbsState:
    """Tests for the ProverbsState model."""

    def test_default_empty_list(self):
        """Test that default state has an empty proverbs list."""
        state = ProverbsState()
        assert state.proverbs == []

    def test_with_proverbs(self):
        """Test creating state with proverbs."""
        proverbs = ["A penny saved is a penny earned", "Time is money"]
        state = ProverbsState(proverbs=proverbs)
        assert state.proverbs == proverbs
        assert len(state.proverbs) == 2

    def test_proverbs_is_list_of_strings(self):
        """Test that proverbs must be strings."""
        state = ProverbsState(proverbs=["test"])
        assert isinstance(state.proverbs[0], str)

    def test_empty_string_proverb(self):
        """Test that empty strings are allowed."""
        state = ProverbsState(proverbs=[""])
        assert state.proverbs == [""]


class TestAgent:
    """Tests for the agent configuration."""

    def test_agent_exists(self):
        """Test that agent is properly configured."""
        assert agent is not None

    def test_agent_has_tools(self):
        """Test that agent has the expected tools registered."""
        # Get tool names from the toolset
        tool_names = list(agent._function_toolset.tools.keys())
        assert "get_proverbs" in tool_names
        assert "add_proverbs" in tool_names
        assert "set_proverbs" in tool_names
        assert "get_weather" in tool_names


class TestGetProverbs:
    """Tests for the get_proverbs tool."""

    def test_get_empty_proverbs(self):
        """Test getting proverbs from empty state."""
        state = ProverbsState()
        deps = MagicMock(spec=StateDeps)
        deps.state = state
        ctx = MagicMock(spec=RunContext)
        ctx.deps = deps

        result = get_proverbs(ctx)
        assert result == []

    def test_get_existing_proverbs(self):
        """Test getting existing proverbs."""
        proverbs = ["First proverb", "Second proverb"]
        state = ProverbsState(proverbs=proverbs)
        deps = MagicMock(spec=StateDeps)
        deps.state = state
        ctx = MagicMock(spec=RunContext)
        ctx.deps = deps

        result = get_proverbs(ctx)
        assert result == proverbs
        assert len(result) == 2


class TestAddProverbs:
    """Tests for the add_proverbs tool."""

    @pytest.mark.asyncio
    async def test_add_to_empty_list(self):
        """Test adding proverbs to empty state."""
        state = ProverbsState()
        deps = MagicMock(spec=StateDeps)
        deps.state = state
        ctx = MagicMock(spec=RunContext)
        ctx.deps = deps

        new_proverbs = ["New proverb"]
        result = await add_proverbs(ctx, new_proverbs)

        assert state.proverbs == ["New proverb"]
        assert result.type == EventType.STATE_SNAPSHOT
        assert result.snapshot == state

    @pytest.mark.asyncio
    async def test_add_to_existing_list(self):
        """Test adding proverbs to existing list."""
        state = ProverbsState(proverbs=["Existing proverb"])
        deps = MagicMock(spec=StateDeps)
        deps.state = state
        ctx = MagicMock(spec=RunContext)
        ctx.deps = deps

        new_proverbs = ["New proverb 1", "New proverb 2"]
        result = await add_proverbs(ctx, new_proverbs)

        assert len(state.proverbs) == 3
        assert state.proverbs == ["Existing proverb", "New proverb 1", "New proverb 2"]
        assert result.type == EventType.STATE_SNAPSHOT

    @pytest.mark.asyncio
    async def test_add_empty_list(self):
        """Test adding empty list of proverbs."""
        state = ProverbsState(proverbs=["Existing"])
        deps = MagicMock(spec=StateDeps)
        deps.state = state
        ctx = MagicMock(spec=RunContext)
        ctx.deps = deps

        result = await add_proverbs(ctx, [])

        assert state.proverbs == ["Existing"]
        assert result.type == EventType.STATE_SNAPSHOT


class TestSetProverbs:
    """Tests for the set_proverbs tool."""

    @pytest.mark.asyncio
    async def test_set_proverbs_replaces_list(self):
        """Test that set_proverbs replaces entire list."""
        state = ProverbsState(proverbs=["Old proverb"])
        deps = MagicMock(spec=StateDeps)
        deps.state = state
        ctx = MagicMock(spec=RunContext)
        ctx.deps = deps

        new_proverbs = ["New proverb 1", "New proverb 2"]
        result = await set_proverbs(ctx, new_proverbs)

        assert state.proverbs == new_proverbs
        assert result.type == EventType.STATE_SNAPSHOT
        assert result.snapshot == state

    @pytest.mark.asyncio
    async def test_set_empty_list(self):
        """Test setting to empty list."""
        state = ProverbsState(proverbs=["Existing"])
        deps = MagicMock(spec=StateDeps)
        deps.state = state
        ctx = MagicMock(spec=RunContext)
        ctx.deps = deps

        result = await set_proverbs(ctx, [])

        assert state.proverbs == []
        assert result.type == EventType.STATE_SNAPSHOT

    @pytest.mark.asyncio
    async def test_set_on_empty_state(self):
        """Test setting proverbs on empty state."""
        state = ProverbsState()
        deps = MagicMock(spec=StateDeps)
        deps.state = state
        ctx = MagicMock(spec=RunContext)
        ctx.deps = deps

        new_proverbs = ["First", "Second"]
        result = await set_proverbs(ctx, new_proverbs)

        assert state.proverbs == new_proverbs
        assert result.type == EventType.STATE_SNAPSHOT


class TestGetWeather:
    """Tests for the get_weather tool."""

    def test_get_weather_returns_formatted_string(self):
        """Test that get_weather returns properly formatted string."""
        ctx = MagicMock(spec=RunContext)

        result = get_weather(ctx, "New York")

        assert result == "The weather in New York is sunny."

    def test_get_weather_with_different_locations(self):
        """Test get_weather with various locations."""
        ctx = MagicMock(spec=RunContext)

        locations = ["London", "Tokyo", "San Francisco", "Paris"]
        for location in locations:
            result = get_weather(ctx, location)
            assert location in result
            assert "sunny" in result

    def test_get_weather_empty_location(self):
        """Test get_weather with empty string location."""
        ctx = MagicMock(spec=RunContext)

        result = get_weather(ctx, "")
        assert result == "The weather in  is sunny."
