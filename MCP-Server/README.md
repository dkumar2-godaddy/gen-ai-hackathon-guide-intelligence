# Conversation State Service MCP Server

A specialized Python-based Model Context Protocol (MCP) server for Conversation State Service API integration, providing tools to retrieve and analyze conversation data based on date ranges and contact center IDs.

## Features

- **Conversation State Service Integration**: Direct API calls with date range filtering
- **Contact Center Support**: Filter conversations by contact center ID
- **OAuth 2.0 Authentication**: Automatic token acquisition and management
- **Flexible Architecture**: Easy to extend with additional tools
- **Production Ready**: Proper logging, error handling, and async support
- **MCP Protocol**: Full Model Context Protocol compliance

## Project Structure

```
MCP-SERVER/
├── src/
│   ├── __init__.py
│   ├── server.py                           # Core MCP server implementation
│   ├── utils/
│   │   ├── __init__.py
│   │   └── oauth_client.py                 # OAuth 2.0 utility for GoDaddy APIs
│   └── tools/
│       ├── __init__.py
│       └── conversation_service_tools.py   # Conversation State Service tools
├── main.py                                 # Main entry point with CLI
├── requirements.txt                        # Python dependencies
└── README.md                              # This file
```

## Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure OAuth credentials** (required for API access):
   ```bash
   export OAUTH_CLIENT_ID="YOUR_ACTUAL_CLIENT_ID"
   export OAUTH_CLIENT_SECRET="YOUR_ACTUAL_CLIENT_SECRET"
   export OAUTH_SCOPE="care.dataplane.read:all"
   ```

4. **Optional: Install additional dependencies**:
   ```bash
   pip install psutil  # For enhanced system monitoring (optional)
   ```

## Quick Start

### Option 1: Main Server (Recommended)
```bash
python main.py --stdio
```

### Option 2: With Custom Configuration
```bash
python main.py --name "My Conversation Server" --log-level DEBUG --stdio
```

## Usage

### Running the Server

The server supports stdio transport (recommended for MCP):

```bash
# Simple run
python run.py

# With custom name and logging
python main.py --name "My Server" --log-level DEBUG --stdio
```

### Available Tools

1. **Conversation State Search Tool** (`conversation_state_search`)
   - Call API to retrieve conversation data based on contact center ID and optional filters
   - **Required**: `contactCenterId` (the contact center ID to query conversations for)
   - **Optional**: `startDate`, `endDate`, `customerId`, `jomaxId`, `conversationId`, `limit`, `nextToken`
   - Input: `{"contactCenterId": "liveperson:30187337", "startDate": "2024-01-01 00:00", "endDate": "2024-01-31 23:59"}`

## Adding Custom Tools

### 1. Create a Tool Class

```python
from src.server import MCPTool
from typing import Any, Dict

class MyCustomTool(MCPTool):
    @property
    def name(self) -> str:
        return "my_tool"
    
    @property
    def description(self) -> str:
        return "Description of my tool"
    
    @property
    def input_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "input_param": {
                    "type": "string",
                    "description": "Input parameter description"
                }
            },
            "required": ["input_param"]
        }
    
    async def execute(self, arguments: Dict[str, Any]) -> str:
        input_param = arguments.get("input_param")
        # Your tool logic here
        return f"Result: {input_param}"
```

### 2. Register the Tool

```python
from src.server import MCPServer

# Create server
server = MCPServer("My Server")

# Register your tool
server.register_tool(MyCustomTool())

# Run server
runner = MCPServerRunner(server)
await runner.run_stdio()
```

### 3. Add to Example Tools (Optional)

Add your tool to `src/tools/example_tools.py`:

```python
# Add to EXAMPLE_TOOLS list
EXAMPLE_TOOLS = [
    CalculatorTool(),
    FileSystemTool(),
    SystemInfoTool(),
    CommandTool(),
    MyCustomTool()  # Add your tool here
]
```

## Configuration

### OAuth 2.0 Configuration

The server automatically handles OAuth 2.0 token acquisition using the client credentials flow. Set these environment variables:

```bash
# OAuth 2.0 credentials (required)
export OAUTH_CLIENT_ID="YOUR_ACTUAL_CLIENT_ID"
export OAUTH_CLIENT_SECRET="YOUR_ACTUAL_CLIENT_SECRET"
export OAUTH_SCOPE="care.dataplane.read:all"

# API endpoints (optional, defaults provided)
export CONVERSATION_API_BASE_URL="https://conversation-state-service.care.dev-godaddy.com"
export CONVERSATION_STATE_SEARCH_ENDPOINT="/conversation-state/filters/search"
```

### Other Environment Variables

```bash
# Server configuration (optional)
export SERVER_NAME="Conversation State Service MCP Server"
export LOG_LEVEL="INFO"
export HOST="localhost"
export PORT="8000"
```

### Command Line Options

```bash
python main.py --help
```

Available options:
- `--name`: Server name
- `--log-level`: Logging level (DEBUG, INFO, WARNING, ERROR)
- `--host`: Host to bind to
- `--port`: Port to bind to
- `--stdio`: Use stdio transport

## Development

### Project Structure

- `src/server.py`: Core MCP server implementation with flexible tool registry
- `src/utils/oauth_client.py`: OAuth 2.0 utility for GoDaddy APIs with token caching
- `src/tools/conversation_service_tools.py`: Conversation State Service tools
- `main.py`: Full CLI entry point with configuration options

### Adding New Tool Types

1. **Create tool class** inheriting from `MCPTool`
2. **Implement required methods**: `name`, `description`, `input_schema`, `execute`
3. **Register with server** using `server.register_tool()`
4. **Test your tool** using the MCP client

### Error Handling

The server includes comprehensive error handling:
- Tool execution errors are caught and returned as error responses
- Invalid tool names return appropriate error messages
- Logging captures all server activity

## MCP Client Integration

This server is designed to work with MCP clients. The server exposes tools that can be called by MCP-compatible clients.

### Tool Execution

Tools are executed via the MCP `call_tool` method:
- Input validation using JSON schemas
- Async execution for better performance
- Structured error responses

### Tool Discovery

Clients can discover available tools using the MCP `list_tools` method, which returns:
- Tool names and descriptions
- Input schemas for validation
- Tool capabilities

## Security Considerations

- **Command Tool**: Execute system commands with caution
- **File System Tool**: Limited to basic operations
- **Input Validation**: All tools validate input using JSON schemas
- **Error Handling**: Errors are logged but not exposed to clients

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure all dependencies are installed
   ```bash
   pip install -r requirements.txt
   ```

2. **Tool Not Found**: Check tool registration in your server setup

3. **Permission Errors**: Some tools may require specific permissions

### Debugging

Enable debug logging:
```bash
python main.py --log-level DEBUG --stdio
```

## Contributing

1. **Add new tools** by creating classes inheriting from `MCPTool`
2. **Follow the existing patterns** for tool implementation
3. **Add tests** for new functionality
4. **Update documentation** as needed

## License

This project is open source. Feel free to modify and distribute according to your needs.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the example tools for implementation patterns
3. Enable debug logging for detailed information
