"""
Flexible MCP Server Implementation
"""
import asyncio
import json
import logging
from typing import Any, Dict, List, Optional, Union
from abc import ABC, abstractmethod

from mcp.server import Server
from mcp.server.models import InitializationOptions, ServerCapabilities
from mcp.server.stdio import stdio_server
from mcp.types import (
    CallToolRequest,
    CallToolResult,
    ListToolsRequest,
    ListToolsResult,
    Tool,
    TextContent,
    ToolsCapability
)

logger = logging.getLogger(__name__)


class MCPTool(ABC):
    """Abstract base class for MCP tools"""
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Tool name"""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """Tool description"""
        pass
    
    @property
    @abstractmethod
    def input_schema(self) -> Dict[str, Any]:
        """JSON schema for tool input"""
        pass
    
    @property
    def output_schema(self) -> Dict[str, Any]:
        """JSON schema for tool output (optional, defaults to string)"""
        return {
            "type": "string",
            "description": "Tool execution result"
        }
    
    @abstractmethod
    async def execute(self, arguments: Dict[str, Any]) -> Union[str, Dict[str, Any]]:
        """Execute the tool with given arguments"""
        pass


class ToolRegistry:
    """Registry for managing MCP tools"""
    
    def __init__(self):
        self._tools: Dict[str, MCPTool] = {}
    
    def register_tool(self, tool: MCPTool) -> None:
        """Register a new tool"""
        self._tools[tool.name] = tool
        logger.info(f"Registered tool: {tool.name}")
    
    def unregister_tool(self, name: str) -> None:
        """Unregister a tool"""
        if name in self._tools:
            del self._tools[name]
            logger.info(f"Unregistered tool: {name}")
    
    def get_tool(self, name: str) -> Optional[MCPTool]:
        """Get a tool by name"""
        return self._tools.get(name)
    
    def list_tools(self) -> List[MCPTool]:
        """List all registered tools"""
        return list(self._tools.values())
    
    def get_tool_names(self) -> List[str]:
        """Get list of tool names"""
        return list(self._tools.keys())


class MCPServer:
    """Flexible MCP Server that can be extended with different tools"""
    
    def __init__(self, name: str = "Flexible MCP Server", version: str = "1.0.0"):
        self.name = name
        self.version = version
        self.server = Server(name)
        self.tool_registry = ToolRegistry()
        self._setup_handlers()
    
    def _setup_handlers(self):
        """Setup MCP server handlers"""
        
        @self.server.list_tools()
        async def handle_list_tools() -> ListToolsResult:
            """Handle list tools request"""
            tools = []
            for tool in self.tool_registry.list_tools():
                tools.append(Tool(
                    name=tool.name,
                    description=tool.description,
                    inputSchema=tool.input_schema,
                    outputSchema=tool.output_schema
                ))
            return ListToolsResult(tools=tools)
        
        @self.server.call_tool()
        async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> CallToolResult:
            """Handle tool execution request"""
            tool = self.tool_registry.get_tool(name)
            if not tool:
                raise ValueError(f"Tool '{name}' not found")
            
            try:
                result = await tool.execute(arguments)
                
                # Handle different result types
                if isinstance(result, str):
                    content = [TextContent(type="text", text=result)]
                elif isinstance(result, dict):
                    content = [TextContent(type="text", text=json.dumps(result, indent=2))]
                else:
                    content = [TextContent(type="text", text=str(result))]
                
                return CallToolResult(content=content)
                
            except Exception as e:
                logger.error(f"Error executing tool '{name}': {str(e)}")
                return CallToolResult(
                    content=[TextContent(type="text", text=f"Error: {str(e)}")],
                    isError=True
                )
    
    def register_tool(self, tool: MCPTool) -> None:
        """Register a tool with the server"""
        self.tool_registry.register_tool(tool)
    
    def unregister_tool(self, name: str) -> None:
        """Unregister a tool from the server"""
        self.tool_registry.unregister_tool(name)
    
    async def run_stdio(self):
        """Run the server using stdio transport"""
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name=self.name,
                    server_version=self.version,
                    capabilities=ServerCapabilities(
                        tools=ToolsCapability()
                    )
                )
            )


class MCPServerRunner:
    """Runner for the MCP server with configuration options"""
    
    def __init__(self, server: MCPServer, host: str = "localhost", port: int = 8000):
        self.server = server
        self.host = host
        self.port = port
    
    async def run_stdio(self):
        """Run server with stdio transport"""
        logger.info(f"Starting {self.server.name} with stdio transport")
        await self.server.run_stdio()
    
    def run_stdio_sync(self):
        """Run server with stdio transport (synchronous wrapper)"""
        asyncio.run(self.run_stdio())
