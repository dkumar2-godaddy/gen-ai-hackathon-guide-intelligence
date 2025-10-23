#!/usr/bin/env python3
"""
Backend API server for Guide Intelligence Dashboard
Bridges React frontend with MCP server
"""
import asyncio
import json
import logging
import os
import subprocess
import sys
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Guide Intelligence API",
    description="Backend API for Guide Intelligence Dashboard",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class AgentSearchRequest(BaseModel):
    agentId: str
    startDate: Optional[str] = None
    endDate: Optional[str] = None

class MCPToolRequest(BaseModel):
    toolName: str
    arguments: Dict[str, Any] = {}

class TimeRangeRequest(BaseModel):
    timeRange: str = "7d"

# Global state for caching
active_agents_cache = []
last_agents_update = None
system_health_cache = {}
last_health_update = None

# MCP Server integration
async def call_mcp_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """Call MCP tool via subprocess (placeholder for actual MCP integration)"""
    try:
        # This is a placeholder - in a real implementation, you would:
        # 1. Connect to the MCP server via stdio or HTTP
        # 2. Send the tool call request
        # 3. Receive and parse the response
        
        # For now, we'll simulate the MCP call with mock data
        # In production, this would be replaced with actual MCP client code
        logger.info(f"Calling MCP tool: {tool_name} with args: {arguments}")
        
        # Simulate MCP response based on the tool name
        if tool_name == "conversation_state_search":
            return await simulate_conversation_search(arguments)
        else:
            return {"status": "error", "error": f"Unknown tool: {tool_name}"}
            
    except Exception as e:
        logger.error(f"Error calling MCP tool: {str(e)}")
        return {"status": "error", "error": str(e)}

async def simulate_conversation_search(arguments: Dict[str, Any]) -> Dict[str, Any]:
    """Simulate conversation search results (replace with real MCP call)"""
    import random
    from datetime import datetime, timedelta
    
    # Generate realistic conversation data based on arguments
    jomax_id = arguments.get("jomaxId", "unknown")
    start_date = arguments.get("startDate", "2024-01-01 00:00")
    end_date = arguments.get("endDate", "2024-01-07 23:59")
    
    # Parse dates
    start_dt = datetime.strptime(start_date, "%Y-%m-%d %H:%M")
    end_dt = datetime.strptime(end_date, "%Y-%m-%d %H:%M")
    days = (end_dt - start_dt).days + 1
    
    # Generate conversations
    conversations = []
    num_conversations = random.randint(5, 50)  # Random number of conversations
    
    for i in range(num_conversations):
        # Random date within range
        random_days = random.randint(0, days - 1)
        random_hours = random.randint(0, 23)
        random_minutes = random.randint(0, 59)
        conv_date = start_dt + timedelta(days=random_days, hours=random_hours, minutes=random_minutes)
        
        conversation = {
            "conversationInfo": {
                "ucid": f"conv-{random.randint(100000, 999999)}",
                "contactCenterId": arguments.get("contactCenterId", "liveperson:30187337"),
                "customerAuthenticated": random.choice([True, False]),
                "customerDisplayName": f"Customer {random.randint(1000, 9999)}",
                "brandCustomerId": f"brand-{random.randint(10000, 99999)}",
                "customerId": f"customer-{random.randint(1000, 9999)}",
                "createdAt": conv_date.isoformat(),
                "updatedAt": conv_date.isoformat(),
                "platform": random.choice(["amazonconnect", "liveperson"]),
                "channel": random.choice(["app", "web", "phone"]),
                "conversations": []
            }
        }
        conversations.append(conversation)
    
    return {
        "status": "success",
        "message": f"Found {len(conversations)} conversations for agent {jomax_id}",
        "data": conversations,
        "pagination": {
            "limit": 20,
            "offset": 0,
            "total": len(conversations),
            "hasMore": False,
            "nextOffset": 0
        }
    }

def calculate_avg_response_time(conversations: List[Dict[str, Any]]) -> float:
    """Calculate average response time from conversations"""
    if not conversations:
        return 0.0
    
    # Simulate response time calculation
    # In real implementation, this would analyze conversation timestamps
    import random
    return round(random.uniform(2.0, 5.0), 1)

def calculate_customer_satisfaction(conversations: List[Dict[str, Any]]) -> float:
    """Calculate customer satisfaction from conversations"""
    if not conversations:
        return 0.0
    
    # Simulate satisfaction calculation
    # In real implementation, this would analyze satisfaction scores
    import random
    return round(random.uniform(3.5, 4.8), 1)

def calculate_active_hours(conversations: List[Dict[str, Any]], start_date: str, end_date: str) -> float:
    """Calculate active hours from conversations"""
    if not conversations:
        return 0.0
    
    # Simulate active hours calculation
    # In real implementation, this would analyze conversation timestamps
    import random
    return round(random.uniform(20.0, 50.0), 1)

def process_conversations_to_agents(conversations: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Process conversations to extract agent information"""
    import random
    from collections import defaultdict
    
    # Group conversations by agent (jomaxId)
    agent_conversations = defaultdict(list)
    
    for conv in conversations:
        conv_info = conv.get("conversationInfo", {})
        # Extract agent ID from conversation metadata
        # In real implementation, this would come from the conversation data
        agent_id = f"jomax-{random.randint(1000, 9999)}"  # Placeholder
        agent_conversations[agent_id].append(conv_info)
    
    # Convert to agent list
    agents = []
    for agent_id, convs in agent_conversations.items():
        # Calculate agent metrics
        current_conversations = len([c for c in convs if is_recent_conversation(c)])
        total_conversations = len(convs)
        
        # Determine status based on activity
        if current_conversations > 0:
            status = "busy" if current_conversations > 2 else "online"
        else:
            status = "away"
        
        agent = {
            "id": f"agent-{len(agents) + 1}",
            "jomaxId": agent_id,
            "name": f"Agent {len(agents) + 1}",
            "status": status,
            "currentConversations": current_conversations,
            "totalConversations": total_conversations,
            "avgResponseTime": round(random.uniform(1.5, 4.0), 1),
            "satisfaction": round(random.uniform(3.5, 4.8), 1),
            "lastActivity": convs[-1].get("updatedAt", datetime.now().isoformat()) if convs else datetime.now().isoformat(),
            "contactCenterId": convs[0].get("contactCenterId") if convs else "liveperson:30187337",
            "platform": convs[0].get("platform") if convs else "amazonconnect",
            "channel": convs[0].get("channel") if convs else "app"
        }
        agents.append(agent)
    
    return agents

def is_recent_conversation(conversation_info: Dict[str, Any]) -> bool:
    """Check if conversation is recent (within last hour)"""
    try:
        updated_at = conversation_info.get("updatedAt")
        if not updated_at:
            return False
        
        conv_time = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
        now = datetime.now(conv_time.tzinfo)
        return (now - conv_time).total_seconds() < 3600  # 1 hour
    except:
        return False

def process_conversations_to_analytics(conversations: List[Dict[str, Any]], timeRange: str) -> Dict[str, Any]:
    """Process conversations into analytics data"""
    import random
    from collections import defaultdict, Counter
    
    if not conversations:
        return generate_mock_conversation_analytics(timeRange)
    
    # Group conversations by time period
    if timeRange == "7d":
        time_groups = defaultdict(list)
        for conv in conversations:
            conv_info = conv.get("conversationInfo", {})
            created_at = conv_info.get("createdAt")
            if created_at:
                try:
                    conv_time = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    hour = conv_time.hour
                    time_groups[hour].append(conv_info)
                except:
                    pass
        
        # Create trend data
        conversation_trend = []
        for hour in range(9, 17):  # 9 AM to 4 PM
            hour_convs = time_groups.get(hour, [])
            conversation_trend.append({
                "hour": f"{hour}AM" if hour < 12 else f"{hour-12}PM",
                "conversations": len(hour_convs),
                "resolved": len([c for c in hour_convs if is_resolved(c)])
            })
    else:  # 30d
        time_groups = defaultdict(list)
        for conv in conversations:
            conv_info = conv.get("conversationInfo", {})
            created_at = conv_info.get("createdAt")
            if created_at:
                try:
                    conv_time = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    week = conv_time.isocalendar()[1]  # Week number
                    time_groups[week].append(conv_info)
                except:
                    pass
        
        # Create trend data
        conversation_trend = []
        for week in range(1, 5):  # 4 weeks
            week_convs = time_groups.get(week, [])
            conversation_trend.append({
                "week": f"Week {week}",
                "conversations": len(week_convs),
                "resolved": len([c for c in week_convs if is_resolved(c)])
            })
    
    # Channel distribution
    channels = Counter()
    for conv in conversations:
        conv_info = conv.get("conversationInfo", {})
        channel = conv_info.get("channel", "unknown")
        channels[channel] += 1
    
    total_convs = sum(channels.values())
    channel_distribution = []
    colors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"]
    for i, (channel, count) in enumerate(channels.most_common(4)):
        percentage = (count / total_convs * 100) if total_convs > 0 else 0
        channel_distribution.append({
            "name": channel.title(),
            "value": round(percentage),
            "color": colors[i % len(colors)]
        })
    
    # Calculate metrics
    total_conversations = len(conversations)
    resolved_conversations = len([c for c in conversations if is_resolved(c)])
    avg_resolution_time = calculate_avg_resolution_time(conversations)
    customer_satisfaction = calculate_avg_satisfaction(conversations)
    escalation_rate = calculate_escalation_rate(conversations)
    first_call_resolution = calculate_first_call_resolution(conversations)
    
    return {
        "conversationTrend": conversation_trend,
        "channelDistribution": channel_distribution,
        "resolutionTime": generate_resolution_time_data(conversations, timeRange),
        "satisfactionTrend": generate_satisfaction_trend(conversations, timeRange),
        "metrics": {
            "totalConversations": total_conversations,
            "resolvedConversations": resolved_conversations,
            "avgResolutionTime": f"{avg_resolution_time} min",
            "customerSatisfaction": f"{customer_satisfaction}/5",
            "escalationRate": f"{escalation_rate}%",
            "firstCallResolution": f"{first_call_resolution}%"
        }
    }

def is_resolved(conversation_info: Dict[str, Any]) -> bool:
    """Check if conversation is resolved"""
    # In real implementation, this would check conversation status
    import random
    return random.choice([True, False])

def calculate_avg_resolution_time(conversations: List[Dict[str, Any]]) -> float:
    """Calculate average resolution time"""
    if not conversations:
        return 0.0
    import random
    return round(random.uniform(2.5, 4.5), 1)

def calculate_avg_satisfaction(conversations: List[Dict[str, Any]]) -> float:
    """Calculate average customer satisfaction"""
    if not conversations:
        return 0.0
    import random
    return round(random.uniform(3.8, 4.5), 1)

def calculate_escalation_rate(conversations: List[Dict[str, Any]]) -> float:
    """Calculate escalation rate"""
    if not conversations:
        return 0.0
    import random
    return round(random.uniform(5.0, 10.0), 1)

def calculate_first_call_resolution(conversations: List[Dict[str, Any]]) -> float:
    """Calculate first call resolution rate"""
    if not conversations:
        return 0.0
    import random
    return round(random.uniform(85, 95), 1)

def generate_resolution_time_data(conversations: List[Dict[str, Any]], timeRange: str) -> List[Dict[str, Any]]:
    """Generate resolution time trend data"""
    import random
    
    if timeRange == "7d":
        return [
            {"day": "Mon", "avgTime": round(random.uniform(2.5, 4.0), 1), "targetTime": 4.0},
            {"day": "Tue", "avgTime": round(random.uniform(2.5, 4.0), 1), "targetTime": 4.0},
            {"day": "Wed", "avgTime": round(random.uniform(2.5, 4.0), 1), "targetTime": 4.0},
            {"day": "Thu", "avgTime": round(random.uniform(2.5, 4.0), 1), "targetTime": 4.0},
            {"day": "Fri", "avgTime": round(random.uniform(2.5, 4.0), 1), "targetTime": 4.0},
            {"day": "Sat", "avgTime": round(random.uniform(3.0, 4.5), 1), "targetTime": 4.0},
            {"day": "Sun", "avgTime": round(random.uniform(3.0, 4.5), 1), "targetTime": 4.0}
        ]
    else:
        return [
            {"week": "Week 1", "avgTime": round(random.uniform(2.5, 4.0), 1), "targetTime": 4.0},
            {"week": "Week 2", "avgTime": round(random.uniform(2.5, 4.0), 1), "targetTime": 4.0},
            {"week": "Week 3", "avgTime": round(random.uniform(2.5, 4.0), 1), "targetTime": 4.0},
            {"week": "Week 4", "avgTime": round(random.uniform(2.5, 4.0), 1), "targetTime": 4.0}
        ]

def generate_satisfaction_trend(conversations: List[Dict[str, Any]], timeRange: str) -> List[Dict[str, Any]]:
    """Generate satisfaction trend data"""
    import random
    
    if timeRange == "7d":
        return [
            {"day": "Mon", "satisfaction": round(random.uniform(3.8, 4.5), 1)},
            {"day": "Tue", "satisfaction": round(random.uniform(3.8, 4.5), 1)},
            {"day": "Wed", "satisfaction": round(random.uniform(3.8, 4.5), 1)},
            {"day": "Thu", "satisfaction": round(random.uniform(3.8, 4.5), 1)},
            {"day": "Fri", "satisfaction": round(random.uniform(3.8, 4.5), 1)},
            {"day": "Sat", "satisfaction": round(random.uniform(3.5, 4.2), 1)},
            {"day": "Sun", "satisfaction": round(random.uniform(3.5, 4.2), 1)}
        ]
    else:
        return [
            {"week": "Week 1", "satisfaction": round(random.uniform(3.8, 4.5), 1)},
            {"week": "Week 2", "satisfaction": round(random.uniform(3.8, 4.5), 1)},
            {"week": "Week 3", "satisfaction": round(random.uniform(3.8, 4.5), 1)},
            {"week": "Week 4", "satisfaction": round(random.uniform(3.8, 4.5), 1)}
        ]

# Mock data generators
def generate_mock_agent_performance(agent_id: str, date_range: Dict[str, str]) -> Dict[str, Any]:
    """Generate mock agent performance data"""
    import random
    
    # Calculate date range
    start_date = datetime.strptime(date_range.get('startDate', '2024-01-01'), '%Y-%m-%d')
    end_date = datetime.strptime(date_range.get('endDate', '2024-01-07'), '%Y-%m-%d')
    days = (end_date - start_date).days + 1
    
    # Generate mock conversations
    conversations = []
    for i in range(random.randint(20, 100)):
        conv_date = start_date + timedelta(days=random.randint(0, days-1))
        conversations.append({
            "ucid": f"conv-{random.randint(100000, 999999)}",
            "customerDisplayName": f"Customer {random.randint(1000, 9999)}",
            "createdAt": conv_date.isoformat(),
            "platform": random.choice(["amazonconnect", "liveperson"]),
            "channel": random.choice(["app", "web", "phone"]),
            "customerAuthenticated": random.choice([True, False])
        })
    
    # Calculate metrics
    total_conversations = len(conversations)
    avg_response_time = round(random.uniform(2.0, 5.0), 1)
    customer_satisfaction = round(random.uniform(3.5, 4.8), 1)
    active_hours = round(random.uniform(30, 50), 1)
    
    return {
        "agent": {
            "jomaxId": agent_id,
            "contactCenterId": f"center-{random.randint(1, 5)}",
            "platform": random.choice(["amazonconnect", "liveperson"]),
            "channel": random.choice(["app", "web", "phone"])
        },
        "totalConversations": total_conversations,
        "avgResponseTime": f"{avg_response_time} min",
        "customerSatisfaction": f"{customer_satisfaction}/5",
        "activeHours": f"{active_hours} hrs",
        "recentConversations": conversations[:5]
    }

def generate_mock_active_agents() -> List[Dict[str, Any]]:
    """Generate mock active agents data"""
    import random
    
    agents = []
    statuses = ['online', 'busy', 'away']
    
    for i in range(1, 13):
        agents.append({
            "id": f"agent-{i}",
            "jomaxId": f"jomax-{1000 + i}",
            "name": f"Agent {i}",
            "status": random.choice(statuses),
            "currentConversations": random.randint(0, 5),
            "totalConversations": random.randint(50, 200),
            "avgResponseTime": round(random.uniform(1.5, 4.0), 1),
            "satisfaction": round(random.uniform(3.5, 4.8), 1),
            "lastActivity": datetime.now().isoformat(),
            "contactCenterId": f"center-{random.randint(1, 3)}",
            "platform": random.choice(["amazonconnect", "liveperson"]),
            "channel": random.choice(["app", "web", "phone"])
        })
    
    return agents

def generate_mock_conversation_analytics(time_range: str) -> Dict[str, Any]:
    """Generate mock conversation analytics data"""
    import random
    
    if time_range == "7d":
        days = 7
        data_points = 8  # hourly data
        x_axis_key = "hour"
        x_axis_values = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM"]
    else:
        days = 30
        data_points = 4  # weekly data
        x_axis_key = "week"
        x_axis_values = ["Week 1", "Week 2", "Week 3", "Week 4"]
    
    # Generate trend data
    conversation_trend = []
    for i in range(data_points):
        conversation_trend.append({
            x_axis_key: x_axis_values[i],
            "conversations": random.randint(30, 60),
            "resolved": random.randint(25, 55)
        })
    
    # Generate channel distribution
    channel_distribution = [
        {"name": "App", "value": random.randint(35, 50), "color": "#3b82f6"},
        {"name": "Web", "value": random.randint(25, 35), "color": "#22c55e"},
        {"name": "Phone", "value": random.randint(10, 20), "color": "#f59e0b"},
        {"name": "Email", "value": random.randint(5, 15), "color": "#ef4444"}
    ]
    
    # Generate resolution time data
    resolution_time = []
    for i in range(data_points):
        resolution_time.append({
            x_axis_key: x_axis_values[i],
            "avgTime": round(random.uniform(2.5, 4.5), 1),
            "targetTime": 4.0
        })
    
    # Generate satisfaction trend
    satisfaction_trend = []
    for i in range(data_points):
        satisfaction_trend.append({
            x_axis_key: x_axis_values[i],
            "satisfaction": round(random.uniform(3.8, 4.5), 1)
        })
    
    # Calculate metrics
    total_conversations = sum(point["conversations"] for point in conversation_trend)
    resolved_conversations = sum(point["resolved"] for point in conversation_trend)
    avg_resolution_time = round(random.uniform(2.8, 3.5), 1)
    customer_satisfaction = round(random.uniform(4.0, 4.4), 1)
    escalation_rate = round(random.uniform(5.0, 10.0), 1)
    first_call_resolution = round(random.uniform(85, 95), 1)
    
    return {
        "conversationTrend": conversation_trend,
        "channelDistribution": channel_distribution,
        "resolutionTime": resolution_time,
        "satisfactionTrend": satisfaction_trend,
        "metrics": {
            "totalConversations": total_conversations,
            "resolvedConversations": resolved_conversations,
            "avgResolutionTime": f"{avg_resolution_time} min",
            "customerSatisfaction": f"{customer_satisfaction}/5",
            "escalationRate": f"{escalation_rate}%",
            "firstCallResolution": f"{first_call_resolution}%"
        }
    }

def generate_mock_system_health() -> Dict[str, Any]:
    """Generate mock system health data"""
    import random
    
    services = [
        {"name": "MCP Server", "status": "healthy", "uptime": "99.9%", "responseTime": "120ms"},
        {"name": "OAuth Service", "status": "healthy", "uptime": "99.8%", "responseTime": "85ms"},
        {"name": "Conversation API", "status": "warning", "uptime": "98.5%", "responseTime": "450ms"},
        {"name": "Database", "status": "healthy", "uptime": "99.9%", "responseTime": "25ms"},
        {"name": "Cache Service", "status": "healthy", "uptime": "99.7%", "responseTime": "15ms"}
    ]
    
    return {
        "overallHealth": "healthy",
        "uptime": "99.9%",
        "responseTime": "245ms",
        "activeConnections": random.randint(500, 1000),
        "cpuUsage": random.randint(20, 50),
        "memoryUsage": random.randint(30, 70),
        "diskUsage": random.randint(10, 30),
        "networkLatency": random.randint(10, 60),
        "services": services,
        "alerts": [
            {
                "id": 1,
                "type": "warning",
                "message": "Conversation API response time is above threshold",
                "timestamp": datetime.now().isoformat(),
                "resolved": False
            }
        ],
        "metrics": {
            "totalRequests": random.randint(100000, 150000),
            "successfulRequests": random.randint(95000, 140000),
            "failedRequests": random.randint(500, 2000),
            "avgResponseTime": "245ms",
            "peakConcurrentUsers": random.randint(1000, 1500),
            "dataProcessed": "2.5TB"
        }
    }

# API Routes
@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Guide Intelligence API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/agents/search")
async def search_agent_performance(request: AgentSearchRequest):
    """Search for agent performance data using MCP server"""
    try:
        logger.info(f"Searching performance for agent: {request.agentId}")
        
        # Call MCP tool to get real conversation data
        mcp_arguments = {
            "contactCenterId": "liveperson:30187337",  # Default contact center
            "jomaxId": request.agentId
        }
        
        # Add date range if provided
        if request.startDate:
            mcp_arguments["startDate"] = f"{request.startDate} 00:00"
        if request.endDate:
            mcp_arguments["endDate"] = f"{request.endDate} 23:59"
        
        # Call MCP tool
        mcp_result = await call_mcp_tool("conversation_state_search", mcp_arguments)
        
        if mcp_result.get("status") == "error":
            raise Exception(f"MCP tool error: {mcp_result.get('error', 'Unknown error')}")
        
        # Process the MCP result
        conversations = mcp_result.get("data", [])
        
        # Calculate metrics from real data
        total_conversations = len(conversations)
        avg_response_time = calculate_avg_response_time(conversations)
        customer_satisfaction = calculate_customer_satisfaction(conversations)
        active_hours = calculate_active_hours(conversations, request.startDate, request.endDate)
        
        # Get agent info from first conversation if available
        agent_info = {}
        if conversations:
            first_conv = conversations[0].get("conversationInfo", {})
            agent_info = {
                "jomaxId": request.agentId,
                "contactCenterId": first_conv.get("contactCenterId"),
                "platform": first_conv.get("platform"),
                "channel": first_conv.get("channel")
            }
        
        result = {
            "agent": agent_info,
            "totalConversations": total_conversations,
            "avgResponseTime": f"{avg_response_time} min",
            "customerSatisfaction": f"{customer_satisfaction}/5",
            "activeHours": f"{active_hours} hrs",
            "recentConversations": conversations[:5]  # Last 5 conversations
        }
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error searching agent performance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents/{agent_id}/performance")
async def get_agent_performance(agent_id: str, timeRange: str = "7d"):
    """Get detailed agent performance data"""
    try:
        logger.info(f"Getting performance for agent: {agent_id}, timeRange: {timeRange}")
        
        # Generate mock performance data
        result = {
            "agent": {
                "jomaxId": agent_id,
                "contactCenterId": "center-1",
                "platform": "amazonconnect",
                "channel": "app"
            },
            "metrics": {
                "totalConversations": 99,
                "avgResponseTime": "3.2 min",
                "customerSatisfaction": "4.2/5",
                "resolutionRate": "87%",
                "activeHours": "42.5 hrs",
                "escalationRate": "8%"
            },
            "conversations": [],  # Would contain actual conversation data
            "responseTime": [],   # Would contain response time data
            "satisfaction": []    # Would contain satisfaction data
        }
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error getting agent performance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/agents/active")
async def get_active_agents():
    """Get list of active agents with real-time data using MCP server"""
    global active_agents_cache, last_agents_update
    
    try:
        # Update cache every 30 seconds
        now = datetime.now()
        if (last_agents_update is None or 
            (now - last_agents_update).total_seconds() > 30):
            
            # Get recent conversations to find active agents
            mcp_arguments = {
                "contactCenterId": "liveperson:30187337",
                "startDate": (now - timedelta(hours=24)).strftime("%Y-%m-%d %H:%M"),
                "endDate": now.strftime("%Y-%m-%d %H:%M"),
                "limit": 100
            }
            
            # Call MCP tool to get recent conversations
            mcp_result = await call_mcp_tool("conversation_state_search", mcp_arguments)
            
            if mcp_result.get("status") == "success":
                conversations = mcp_result.get("data", [])
                active_agents_cache = process_conversations_to_agents(conversations)
            else:
                # Fallback to mock data if MCP fails
                active_agents_cache = generate_mock_active_agents()
            
            last_agents_update = now
            logger.info(f"Updated active agents cache: {len(active_agents_cache)} agents")
        
        return JSONResponse(content={
            "agents": active_agents_cache,
            "lastUpdate": last_agents_update.isoformat(),
            "totalCount": len(active_agents_cache)
        })
        
    except Exception as e:
        logger.error(f"Error getting active agents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/conversations")
async def get_conversation_analytics(timeRange: str = "7d"):
    """Get conversation analytics data using MCP server"""
    try:
        logger.info(f"Getting conversation analytics for timeRange: {timeRange}")
        
        # Calculate date range
        now = datetime.now()
        if timeRange == "7d":
            start_date = now - timedelta(days=7)
        else:  # 30d
            start_date = now - timedelta(days=30)
        
        # Call MCP tool to get conversation data
        mcp_arguments = {
            "contactCenterId": "liveperson:30187337",
            "startDate": start_date.strftime("%Y-%m-%d %H:%M"),
            "endDate": now.strftime("%Y-%m-%d %H:%M"),
            "limit": 1000  # Get more data for analytics
        }
        
        mcp_result = await call_mcp_tool("conversation_state_search", mcp_arguments)
        
        if mcp_result.get("status") == "success":
            conversations = mcp_result.get("data", [])
            result = process_conversations_to_analytics(conversations, timeRange)
        else:
            # Fallback to mock data if MCP fails
            result = generate_mock_conversation_analytics(timeRange)
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error getting conversation analytics: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/system/health")
async def get_system_health():
    """Get system health data"""
    global system_health_cache, last_health_update
    
    try:
        # Update cache every 60 seconds
        now = datetime.now()
        if (last_health_update is None or 
            (now - last_health_update).total_seconds() > 60):
            
            system_health_cache = generate_mock_system_health()
            last_health_update = now
            logger.info("Updated system health cache")
        
        return JSONResponse(content=system_health_cache)
        
    except Exception as e:
        logger.error(f"Error getting system health: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/mcp/call-tool")
async def call_mcp_tool(request: MCPToolRequest):
    """Call MCP tool (placeholder for MCP server integration)"""
    try:
        logger.info(f"Calling MCP tool: {request.toolName}")
        
        # This would integrate with the actual MCP server
        # For now, return mock data
        result = {
            "toolName": request.toolName,
            "result": f"Mock result for {request.toolName}",
            "timestamp": datetime.now().isoformat()
        }
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error calling MCP tool: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/mcp/tools")
async def list_mcp_tools():
    """List available MCP tools"""
    try:
        logger.info("Listing MCP tools")
        
        # This would query the actual MCP server
        tools = [
            {
                "name": "conversation_state_search",
                "description": "Search conversation state data",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "contactCenterId": {"type": "string"},
                        "jomaxId": {"type": "string"},
                        "startDate": {"type": "string"},
                        "endDate": {"type": "string"}
                    }
                }
            }
        ]
        
        return JSONResponse(content={"tools": tools})
        
    except Exception as e:
        logger.error(f"Error listing MCP tools: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
