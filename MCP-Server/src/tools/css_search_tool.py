"""
Conversation State Service Tools for FastMCP
"""
import logging
from typing import Any, Dict
import os
import aiohttp

from ..utils.oauth_client import make_authenticated_request

logger = logging.getLogger(__name__)


class CSSSearchTool:
    async def execute(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the conversation state service API call"""
        
        try:
            # Extract and validate required parameters
            contact_center_id = arguments.get("contactCenterId")
            
            if not contact_center_id:
                return {
                    "status": "error",
                    "message": "Missing required parameter: contactCenterId is required",
                    "error": "Missing required parameter: contactCenterId is required"
                }
            
            # Build API request parameters
            api_params = {
                "contactCenterId": contact_center_id
            }
            
            # Add optional parameters
            optional_params = [
                "startDate", "endDate", "customerId", "jomaxId", 
                "conversationId", "limit", "nextToken"
            ]
            
            for param in optional_params:
                if param in arguments and arguments[param] is not None:
                    api_params[param] = arguments[param]
            
            # Get API configuration
            api_base_url = os.getenv("CONVERSATION_API_BASE_URL", "https://conversation-state-service.care.dev-godaddy.com")
            api_endpoint = os.getenv("CONVERSATION_STATE_SEARCH_ENDPOINT", "/conversation-state/filters/search")
            url = f"{api_base_url}{api_endpoint}"
            
            # Make authenticated API request using the common OAuth utility
            response = await make_authenticated_request("GET", url, params=api_params)
            
            if not response:
                return {
                    "status": "error",
                    "message": "Failed to make authenticated request",
                    "error": "Failed to make authenticated request to conversation API"
                }
            
            if response.status == 200:
                data = await response.json()
                
                # Return the API response as-is to match the schema
                return {
                    "status": data.get("status", "success"),
                    "message": data.get("message", "Conversation data retrieved successfully"),
                    "data": data.get("data", []),
                    "pagination": data.get("pagination", {})
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
            logger.error(f"Error in conversation state service: {str(e)}")
            return {
                "status": "error",
                "message": f"Internal error: {str(e)}",
                "error": f"Internal error: {str(e)}"
            }

