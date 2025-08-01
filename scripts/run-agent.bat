@echo off
echo Starting Pydantic AI Agent...

REM Check if .env file exists
if not exist "agent\.env" (
    echo Error: .env file not found in agent directory
    echo Please copy agent\env_example.txt to agent\.env and add your OpenAI API key
    pause
    exit /b 1
)

REM Change to agent directory
cd agent

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Install dependencies if needed
echo Checking dependencies...
pip install pydantic-ai ag-ui python-dotenv httpx ddgs beautifulsoup4

REM Run the agent
echo Starting agent on http://localhost:8000
python agent.py 