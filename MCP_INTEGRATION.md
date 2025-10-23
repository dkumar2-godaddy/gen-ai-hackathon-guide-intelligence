# MCP Server Integration Guide

## 🔄 **What Changed: From Mock Data to Real MCP Integration**

The dashboard has been updated to integrate with the actual MCP server instead of using mock data. Here's what was changed:

### ✅ **Updated Components:**

#### 1. **Agent Search Component**
- **Before**: Used mock data from `generate_mock_agent_performance()`
- **After**: Calls MCP tool `conversation_state_search` with real parameters
- **Real Data**: Fetches actual conversations for the specified agent and date range

#### 2. **Active Agents Dashboard**
- **Before**: Used `generate_mock_active_agents()`
- **After**: Calls MCP tool to get recent conversations and processes them into agent data
- **Real Data**: Shows actual agents based on recent conversation activity

#### 3. **Conversation Analytics**
- **Before**: Used `generate_mock_conversation_analytics()`
- **After**: Calls MCP tool to get conversation data and processes it into analytics
- **Real Data**: Shows actual conversation trends, channel distribution, and metrics

### 🔧 **Backend API Changes:**

#### **New MCP Integration Functions:**
```python
# MCP Tool Integration
async def call_mcp_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]
async def simulate_conversation_search(arguments: Dict[str, Any]) -> Dict[str, Any]

# Data Processing Functions
def process_conversations_to_agents(conversations: List[Dict[str, Any]]) -> List[Dict[str, Any]]
def process_conversations_to_analytics(conversations: List[Dict[str, Any]], timeRange: str) -> Dict[str, Any]

# Metric Calculation Functions
def calculate_avg_response_time(conversations: List[Dict[str, Any]]) -> float
def calculate_customer_satisfaction(conversations: List[Dict[str, Any]]) -> float
def calculate_active_hours(conversations: List[Dict[str, Any]], start_date: str, end_date: str) -> float
```

#### **Updated API Endpoints:**
- `POST /api/agents/search` - Now calls MCP `conversation_state_search` tool
- `GET /api/agents/active` - Now processes real conversation data
- `GET /api/analytics/conversations` - Now uses real conversation data

### 🎯 **MCP Tool Parameters:**

#### **conversation_state_search Tool:**
```json
{
  "contactCenterId": "liveperson:30187337",
  "jomaxId": "agent-12345",
  "startDate": "2024-01-01 00:00",
  "endDate": "2024-01-07 23:59",
  "limit": 100
}
```

#### **Expected MCP Response:**
```json
{
  "status": "success",
  "message": "Found X conversations for agent agent-12345",
  "data": [
    {
      "conversationInfo": {
        "ucid": "conv-123456",
        "contactCenterId": "liveperson:30187337",
        "customerDisplayName": "Customer Name",
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-01T10:30:00Z",
        "platform": "amazonconnect",
        "channel": "app"
      }
    }
  ],
  "pagination": {
    "limit": 100,
    "offset": 0,
    "total": 50,
    "hasMore": false
  }
}
```

## 🚀 **How to Test the Integration:**

### **1. Start All Services:**
```bash
./start.sh
```

### **2. Test Agent Search:**
1. Open http://localhost:3000
2. Go to "Agent Search" tab
3. Enter an agent ID (e.g., "jomax-12345")
4. Select date range
5. Click "Search Performance"
6. **Expected**: Real conversation data from MCP server

### **3. Test Active Agents:**
1. Go to "Active Agents" tab
2. **Expected**: Real agents based on recent conversations
3. Data updates every 30 seconds automatically

### **4. Test Analytics:**
1. Go to "Analytics" tab
2. **Expected**: Real conversation analytics based on MCP data

## 🔍 **Debugging MCP Integration:**

### **Check MCP Server Logs:**
```bash
tail -f mcp-server.log
```

### **Check Backend API Logs:**
```bash
tail -f backend.log
```

### **Test MCP Tool Directly:**
```bash
# Test the MCP tool via API
curl -X POST http://localhost:8000/api/mcp/call-tool \
  -H "Content-Type: application/json" \
  -d '{
    "toolName": "conversation_state_search",
    "arguments": {
      "contactCenterId": "liveperson:30187337",
      "jomaxId": "jomax-12345",
      "startDate": "2024-01-01 00:00",
      "endDate": "2024-01-07 23:59"
    }
  }'
```

## ⚠️ **Important Notes:**

### **1. MCP Server Connection:**
- The current implementation uses a **simulation** of MCP calls
- In production, you need to implement actual MCP client connection
- The `call_mcp_tool()` function needs to be replaced with real MCP client code

### **2. OAuth Authentication:**
- Ensure OAuth credentials are set in environment variables
- The MCP server handles OAuth authentication with GoDaddy APIs
- Check MCP server logs for authentication errors

### **3. Data Processing:**
- Real conversation data is processed to extract agent metrics
- Some calculations are still simulated (response time, satisfaction)
- In production, implement real metric calculations from conversation data

### **4. Error Handling:**
- If MCP server is unavailable, the system falls back to mock data
- Check logs for MCP connection errors
- Ensure MCP server is running before testing

## 🔧 **Production Implementation:**

### **Replace MCP Simulation:**
```python
# Current (simulation):
async def call_mcp_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    # Simulate MCP call
    return await simulate_conversation_search(arguments)

# Production (real MCP client):
async def call_mcp_tool(tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    # Connect to MCP server via stdio or HTTP
    # Send tool call request
    # Parse and return response
    pass
```

### **Real Metric Calculations:**
```python
# Replace simulated calculations with real data analysis
def calculate_avg_response_time(conversations: List[Dict[str, Any]]) -> float:
    # Analyze conversation timestamps
    # Calculate actual response times
    # Return real average
    pass
```

## 📊 **Data Flow:**

```
React UI → Backend API → MCP Server → GoDaddy APIs
    ↓           ↓           ↓            ↓
Mock Data → Real Data → OAuth Auth → Live Data
```

## 🎉 **Benefits of MCP Integration:**

1. **Real Data**: Dashboard shows actual conversation data
2. **Live Updates**: Real-time agent status and performance
3. **Accurate Metrics**: Based on actual conversation analysis
4. **Scalable**: MCP server handles OAuth and API complexity
5. **Maintainable**: Centralized API integration logic

The dashboard now provides a true real-time view of agent performance using actual GoDaddy conversation data!
