"""
Conversation State Service Transcripts Tool for FastMCP
"""
import logging
from typing import Any, Dict
import os
import aiohttp

from ..utils.oauth_client import make_authenticated_request

logger = logging.getLogger(__name__)


class CSSTranscriptsTool:
    async def execute(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the conversation state service API call to retrieve transcripts"""
        try:
            # Extract and validate required parameters
            ucid = arguments.get("ucid")
            
            if not ucid:
                return {
                    "status": "error",
                    "message": "Missing required parameter: ucid is required",
                    "error": "Missing required parameter: ucid is required"
                }
            
            # Get API configuration
            api_base_url = os.getenv("CONVERSATION_API_BASE_URL", "https://conversation-state-service.care.dev-godaddy.com")
            api_endpoint = os.getenv("CONVERSATION_STATE_TRANSCRIPTS_ENDPOINT", "/transcripts/ucid/{ucid}")
            url = f"{api_base_url}{api_endpoint.format(ucid=ucid)}"
            
            # Make authenticated API request using the common OAuth utility
            response = await make_authenticated_request("GET", url)
            
            if not response:
                return {
                    "status": "error",
                    "message": "Failed to make authenticated request",
                    "error": "Failed to make authenticated request to conversation API"
                }
            
            if response.status == 200:
                data = await response.json()
                print(f"\n\n CSS Transcripts Tool response: {data}")
                # Return the API response as-is to match the schema
                return {
                    "status": data.get("status", "success"),
                    "message": data.get("message", "Transcripts fetched successfully for ucid: {ucid}".format(ucid=ucid)),
                    "data": data.get("data", {})
                }
            else:
                error_text = await response.text()
                return {
                    "status": "error",
                    "message": f"API request failed with status {response.status}",
                    "error": f"API request failed with status {response.status}: {error_text}"
                }
                        
        except aiohttp.ClientError as e:
            return {
                "status": "error",
                "message": f"Network error: {str(e)}",
                "error": f"Network error: {str(e)}"
            }
        except Exception as e:
            logger.error(f"Error in conversation state transcripts service: {str(e)}")
            return {
                "status": "error",
                "message": f"Internal error: {str(e)}",
                "error": f"Internal error: {str(e)}"
            }
