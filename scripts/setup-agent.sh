#!/bin/bash

echo "Setting up Pydantic AI Agent..."

# Create agent directory if it doesn't exist
mkdir -p agent

# Copy environment example if .env doesn't exist
if [ ! -f "agent/.env" ]; then
    if [ -f "agent/env_example.txt" ]; then
        cp agent/env_example.txt agent/.env
        echo "Created agent/.env from template"
        echo "Please edit agent/.env and add your OpenAI API key"
    else
        echo "Error: env_example.txt not found"
        exit 1
    fi
else
    echo "agent/.env already exists"
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install pydantic-ai ag-ui python-dotenv httpx ddgs beautifulsoup4

echo "Setup complete!"
echo "To start the agent, run: ./scripts/run-agent.sh"
echo "To start the frontend, run: npm run dev"
