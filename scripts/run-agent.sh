#!/bin/bash

# Run Pydantic AI Agent
echo "Starting Pydantic AI Agent..."

# Check if .env file exists
if [ ! -f "agent/.env" ]; then
    echo "Error: .env file not found in agent directory"
    echo "Please copy agent/env_example.txt to agent/.env and add your OpenAI API key"
    exit 1
fi

# Change to agent directory
cd agent

# Check if Python is available
if ! command -v python &> /dev/null; then
    echo "Error: Python is not installed or not in PATH"
    exit 1
fi

# Install dependencies if needed
echo "Checking dependencies..."
pip install pydantic-ai ag-ui python-dotenv httpx ddgs beautifulsoup4

# Run the agent
echo "Starting agent on http://localhost:8000"
python agent.py
