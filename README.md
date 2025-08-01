# Basic Pydantic AI Agent with CopilotKit

This is a simple demonstration of a Pydantic AI agent integrated with CopilotKit for real-time state management and UI updates.

## Features

- **Basic Agent**: A simple AI assistant with deep thinking capabilities
- **Real-time State Updates**: Watch the agent's state change in real-time
- **Activity Logging**: See all agent actions and their timestamps
- **Thinking Counter**: Track how many times the agent has thought deeply

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key_here

# Agent URL (defaults to localhost:8000)
PYDANTIC_AI_AGENT_URL=http://localhost:8000
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Start the Agent

In the `agent` directory:

```bash
cd agent
python agent.py
```

This will start the Pydantic AI agent on `http://localhost:8000`.

### 4. Start the UI

In the root directory:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

This will start the Next.js application on `http://localhost:3000`.

## Testing the Agent

1. Open `http://localhost:3000` in your browser
2. You'll see a split-screen interface:
   - Left panel: Chat interface
   - Right panel: Agent state display

3. Try asking the agent to think deeply about something:
   - "Think deeply about the meaning of life"
   - "Can you think deeply about artificial intelligence?"
   - "Please think deeply about climate change"

4. Watch the right panel update in real-time:
   - Thinking count increases
   - New log entries appear
   - Last thought updates

## Agent State

The agent maintains a simple state with:
- `thinking_count`: Number of deep thinking sessions
- `last_thought`: The most recent topic the agent thought about
- `logs`: Array of all agent actions with timestamps

## Architecture

- **Backend**: Pydantic AI agent with AG-UI integration
- **Frontend**: Next.js with CopilotKit for state management
- **Communication**: HTTP-based agent communication via AG-UI protocol

## Next Steps

Once this basic setup is working, you can:
1. Add more complex tools to the agent
2. Implement more sophisticated state management
3. Add user interactions with the state
4. Build more complex workflows

## Troubleshooting

- Make sure both the agent (`:8000`) and UI (`:3000`) are running
- Check that your OpenAI API key is valid
- Look at the browser console for any errors
- Check the agent logs for backend issues