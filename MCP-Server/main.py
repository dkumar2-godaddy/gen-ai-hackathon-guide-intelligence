#!/usr/bin/env python3
"""
FastMCP entry point for the Conversation State Service tools
"""
import argparse
import asyncio
import logging
import os
import sys
from pathlib import Path
from typing import Optional

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent / "src"))

from src.tools.css_search_tool import CSSSearchTool
from src.tools.css_contact_detail_tool import CSSContactDetailTool
from src.tools.css_transcripts_tool import CSSTranscriptsTool

from fastmcp import FastMCP


def setup_logging(level: str = "INFO"):
    """Setup logging configuration"""
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stderr)
        ]
    )


def register_tools(mcp: FastMCP) -> None:
    """Register all Conversation State Service tools as FastMCP tools"""

    @mcp.tool
    async def conversation_state_search(
        contactCenterId: str,
        startDate: Optional[str] = None,
        endDate: Optional[str] = None,
        customerId: Optional[str] = None,
        jomaxId: Optional[str] = None,
        conversationId: Optional[str] = None,
        limit: Optional[int] = None,
        nextToken: Optional[str] = None,
    ) -> dict:
        """Call Conversation State Service API to retrieve conversation data based on date range and contact center ID.
        - contactCenterId: Contact center ID (e.g., "liveperson:30187337")
        - startDate, endDate: YYYY-MM-DD HH:MM
        - Optional filters: customerId, jomaxId, conversationId, limit, nextToken
        """
        tool = CSSSearchTool()
        args = {
            "contactCenterId": contactCenterId,
            "startDate": startDate,
            "endDate": endDate,
            "customerId": customerId,
            "jomaxId": jomaxId,
            "conversationId": conversationId,
            "limit": limit,
            "nextToken": nextToken,
        }
        return await tool.execute(args)

    @mcp.tool
    async def conversation_state_ucid_detail(
        ucid: str,
        includeConversations: bool = False,
    ) -> dict:
        """Fetch conversation details using the UCID from Conversation State Service API.
        - ucid: Unique Conversation ID
        - includeConversations: Include conversations for the given UCID (default: False)
        """
        tool = CSSContactDetailTool()
        args = {"ucid": ucid, "includeConversations": includeConversations}
        return await tool.execute(args)

    @mcp.tool
    async def conversation_state_transcripts(
        ucid: str,
    ) -> dict:
        """Retrieve transcripts for a particular conversation by UCID."""
        tool = CSSTranscriptsTool()
        args = {"ucid": ucid}
        return await tool.execute(args)


async def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description="Conversation State Service FastMCP Server (HTTP)")
    parser.add_argument(
        "--name",
        default="Conversation State Service MCP Server",
        help="Server name (default: Conversation State Service MCP Server)",
    )
    parser.add_argument(
        "--log-level",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        default="INFO",
        help="Logging level (default: INFO)",
    )
    # Always run over HTTP
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="HTTP host to bind (default: 127.0.0.1)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8000,
        help="HTTP port to bind (default: 8000)",
    )

    args = parser.parse_args()

    # Setup logging
    setup_logging(args.log_level)
    logger = logging.getLogger(__name__)

    # Create FastMCP server and register tools
    mcp = FastMCP(args.name)
    register_tools(mcp)

    logger.info(f"Starting {args.name} (FastMCP)")
    logger.info("Transport: HTTP")

    try:
        # Always run over HTTP (streaming)
        mcp.run(transport="http", host=args.host, port=args.port)
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
