#!/bin/bash

# Guide Intelligence Dashboard Stop Script
# This script stops all running services

echo "🛑 Stopping Guide Intelligence Dashboard..."
echo "=========================================="

# Function to stop service by PID file
stop_service() {
    local name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "Stopping $name (PID: $pid)..."
            kill $pid
            sleep 2
            if ps -p $pid > /dev/null 2>&1; then
                echo "Force stopping $name..."
                kill -9 $pid
            fi
            echo "✅ $name stopped"
        else
            echo "⚠️  $name was not running"
        fi
        rm -f "$pid_file"
    else
        echo "⚠️  No PID file found for $name"
    fi
}

# Stop React App
stop_service "React App" "react-app.pid"

# Stop Backend API
stop_service "Backend API" "backend.pid"

# Stop MCP Server
stop_service "MCP Server" "mcp-server.pid"

# Clean up any remaining processes
echo ""
echo "🧹 Cleaning up remaining processes..."

# Kill any remaining processes on our ports
for port in 3000 8000; do
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "Killing process on port $port (PID: $pid)..."
        kill -9 $pid
    fi
done

# Clean up log files (optional)
read -p "🗑️  Remove log files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f *.log
    echo "✅ Log files removed"
fi

echo ""
echo "✅ All services stopped successfully!"
echo "====================================="
echo ""
echo "📝 Log files preserved (unless removed above):"
echo "   - mcp-server.log"
echo "   - backend.log"
echo "   - react-app.log"
echo ""
echo "🚀 To start again, run: ./start.sh"
