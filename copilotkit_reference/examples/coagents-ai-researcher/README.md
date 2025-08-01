# AI Researcher Example

This example is a simple AI based search engine with multiple implementation variants.

You can find an online demo of this example [here](https://examples-coagents-ai-researcher-ui.vercel.app).

## Available Implementations

This demo includes three different agent implementations:

1. **LangGraph Agent** (`/agent/`) - Original implementation using LangChain and LangGraph for web search
2. **Pydantic AI Agent** (`/ai_researcher_pydantic/`) - Alternative implementation using Pydantic AI
3. **Agno Agent** (`/ai_researcher_agno/`) - Financial research agent using Agno framework with YFinance tools

**These instructions assume you are in the `coagents-ai-researcher/` directory**

## Running the LangGraph Agent (Original)

First, install the dependencies:

```sh
cd agent

pipx install poetry
poetry install
```

Then, create a `.env` file inside `./agent` with the following:

```
OPENAI_API_KEY=...
TAVILY_API_KEY=...
```

IMPORTANT:
Make sure the OpenAI API Key you provide, supports gpt-4o.

Then, run the demo:

```sh
poetry run demo
```

## Running the Agno Financial Agent

For the financial research agent using Agno:

```sh
cd ai_researcher_agno

pipx install poetry
poetry install
```

Create a `.env` file inside `./ai_researcher_agno`:

```
OPENAI_API_KEY=...
```

Run the financial agent:

```sh
poetry run demo
```

This agent runs on port 8002 and specializes in financial analysis with YFinance tools.

## Running the Pydantic AI Agent

See the README in `./ai_researcher_pydantic/` for instructions on the Pydantic AI implementation.

## Running the UI

First, install the dependencies:

```sh
cd ./ui
pnpm i
```

Then, create a `.env` file inside `./ui` with the following:

```
OPENAI_API_KEY=...
```

Then, run the Next.js project:

```sh
pnpm run dev
```

## Usage

Navigate to [http://localhost:3000](http://localhost:3000).

# LangGraph Studio

Run LangGraph studio, then load the `./agent` folder into it.

Make sure to create teh `.env` mentioned above first!

# Troubleshooting

A few things to try if you are running into trouble:

1. Make sure there is no other local application server running on the 8000 port.
2. Under `/agent/my_agent/demo.py`, change `0.0.0.0` to `127.0.0.1` or to `localhost`
