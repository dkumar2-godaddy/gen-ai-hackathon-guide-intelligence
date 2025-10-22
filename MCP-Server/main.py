#!/usr/bin/env python3
"""
Main entry point for the Flexible MCP Server
"""
import argparse
import asyncio
import logging
import os
import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.server import MCPServer, MCPServerRunner
from src.tools.css_search_tool import CSSSearchTool
from src.tools.css_contact_detail_tool import CSSContactDetailTool
from src.tools.css_transcripts_tool import CSSTranscriptsTool


def setup_logging(level: str = "INFO"):
    """Setup logging configuration"""
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stderr)
        ]
    )


def create_server_with_tools(server_name: str = "Conversation State Service MCP Server") -> MCPServer:
    """Create server instance with conversation service tools registered"""
    server = MCPServer(name=server_name)
    
    server.register_tool(CSSSearchTool())
    
    server.register_tool(CSSContactDetailTool())
    
    server.register_tool(CSSTranscriptsTool())
    
    return server


async def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Conversation State Service MCP Server")
    parser.add_argument(
        "--name", 
        default="Conversation State Service MCP Server",
        help="Server name (default: Conversation State Service MCP Server)"
    )
    parser.add_argument(
        "--log-level",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        default="INFO",
        help="Logging level (default: INFO)"
    )
    parser.add_argument(
        "--host",
        default="localhost",
        help="Host to bind to (default: localhost)"
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="Port to bind to (default: 8000)"
    )
    parser.add_argument(
        "--stdio",
        action="store_true",
        help="Use stdio transport instead of HTTP"
    )
    
    args = parser.parse_args()
    
    # Setup logging
    setup_logging(args.log_level)
    logger = logging.getLogger(__name__)
    
    # Create server
    server = create_server_with_tools(args.name)
    runner = MCPServerRunner(server, args.host, args.port)
    
    logger.info(f"Starting {args.name}")
    logger.info(f"Registered {len(server.tool_registry.list_tools())} tools:")
    for tool in server.tool_registry.list_tools():
        logger.info(f"  - {tool.name}: {tool.description}")
    
    try:
        if args.stdio:
            logger.info("Using stdio transport")
            await runner.run_stdio()
        else:
            logger.info(f"Server would run on {args.host}:{args.port}")
            logger.info("Note: HTTP transport not implemented yet, use --stdio for now")
            # For now, fallback to stdio
            await runner.run_stdio()
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
