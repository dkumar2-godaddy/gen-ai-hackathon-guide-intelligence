#!/bin/bash

# Guide Intelligence Dashboard Startup Script
# This script starts all required services

echo "🚀 Starting Guide Intelligence Dashboard..."
echo "=========================================="

# Check if required commands exist
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 is required but not installed. Aborting." >&2; exit 1; }
command -v pip3 >/dev/null 2>&1 || { echo "❌ pip3 is required but not installed. Aborting." >&2; exit 1; }

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Please stop the service using this port."
        return 1
    fi
    return 0
}

# Check ports
echo "🔍 Checking ports..."
check_port 3000 || exit 1
check_port 4000 || exit 1

# Install dependencies if needed
echo "📦 Installing dependencies..."

# Install React dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing React dependencies..."
    npm install
fi


# Install MCP server dependencies
if [ ! -d "MCP-SERVER/venv" ]; then
    echo "Installing MCP server dependencies..."
    cd MCP-SERVER
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

echo "✅ Dependencies installed successfully!"
echo ""

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file..."
    cat > .env << EOF
# React App Configuration
REACT_APP_API_BASE_URL=http://localhost:8000

# MCP Server Configuration (optional)
OAUTH_CLIENT_ID=3a732f46-c240-4344-91ed-5e7ab1a04b4a
OAUTH_CLIENT_SECRET=9a6UOEykPfz9AIKoSaqsLEnE2avJgUqk
OAUTH_SCOPE=care.dataplane.read:all
EOF
    echo "✅ Environment file created!"
fi

echo ""
echo "🎯 Starting services..."
echo "======================"

# Function to start service in background
start_service() {
    local name=$1
    local command=$2
    local log_file=$3
    
    echo "Starting $name..."
    $command > $log_file 2>&1 &
    local pid=$!
    echo $pid > "${name}.pid"
    echo "✅ $name started (PID: $pid)"
}

# Start MCP Server
echo "🔧 Starting MCP Server..."
cd MCP-SERVER
source venv/bin/activate
python main.py --stdio > ../mcp-server.log 2>&1 &
MCP_PID=$!
echo $MCP_PID > ../mcp-server.pid
cd ..
echo "✅ MCP Server started (PID: $MCP_PID)"

# Wait a moment for MCP server to start
sleep 2

# Start LLM Server
echo "🤖 Starting LLM Server..."
cd LLM-Server/gd-agent-sdk-llm
npm install > ../../llm-server.log 2>&1
npm run dev > ../../llm-server.log 2>&1 &
LLM_PID=$!
echo $LLM_PID > ../../llm-server.pid
cd ../..
echo "✅ LLM Server started (PID: $LLM_PID)"

# Wait a moment for LLM server to start
sleep 3


# Start React App
echo "⚛️  Starting React App..."
npm start > react-app.log 2>&1 &
REACT_PID=$!
echo $REACT_PID > react-app.pid
echo "✅ React App started (PID: $REACT_PID)"

echo ""
echo "🎉 All services started successfully!"
echo "=================================="
echo ""
echo "📱 Frontend:     http://localhost:3000"
echo "🔧 LLM Server:  http://localhost:4000"
echo ""
echo "📋 Service Status:"
echo "   MCP Server:   PID $MCP_PID"
echo "   LLM Server:   PID $LLM_PID"
echo "   React App:    PID $REACT_PID"
echo ""
echo "📝 Logs:"
echo "   MCP Server:   mcp-server.log"
echo "   LLM Server:   llm-server.log"
echo "   React App:    react-app.log"
echo ""
echo "🛑 To stop all services, run: ./stop.sh"
echo ""

# Wait for user to press Ctrl+C
trap 'echo ""; echo "🛑 Stopping services..."; ./stop.sh; exit 0' INT

echo "Press Ctrl+C to stop all services"
while true; do
    sleep 1
done
