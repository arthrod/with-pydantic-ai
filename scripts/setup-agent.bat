@echo off
echo Setting up Pydantic AI Agent...

REM Create agent directory if it doesn't exist
if not exist "agent" mkdir agent

REM Copy environment example if .env doesn't exist
if not exist "agent\.env" (
    if exist "agent\env_example.txt" (
        copy "agent\env_example.txt" "agent\.env"
        echo Created agent\.env from template
        echo Please edit agent\.env and add your OpenAI API key
    ) else (
        echo Error: env_example.txt not found
        pause
        exit /b 1
    )
) else (
    echo agent\.env already exists
)

REM Install Python dependencies
echo Installing Python dependencies...
pip install pydantic-ai ag-ui python-dotenv httpx ddgs beautifulsoup4

echo Setup complete!
echo To start the agent, run: scripts\run-agent.bat
echo To start the frontend, run: npm run dev
pause 