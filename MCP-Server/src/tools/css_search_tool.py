"""
Conversation State Service Tools for MCP Server
"""
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional, Union
import os
import aiohttp

from ..server import MCPTool
from ..utils.oauth_client import make_authenticated_request

logger = logging.getLogger(__name__)


class CSSSearchTool(MCPTool):
    """Tool for calling Conversation State Service API with date range parameters"""
    
    @property
    def name(self) -> str:
        return "conversation_state_search"
    
    @property
    def description(self) -> str:
        return "Call Conversation State Service API to retrieve conversation data based on date range and contact center ID"
    
    @property
    def input_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "contactCenterId": {
                    "type": "string",
                    "description": "The contact center ID to query conversations for",
                    "example": "liveperson:30187337"
                },
                "startDate": {
                    "type": "string",
                    "description": "Start date for the range filter in YYYY-MM-DD HH:MM format (conversations on or after this date)",
                    "example": "2024-01-01 00:00"
                },
                "endDate": {
                    "type": "string",
                    "description": "End date for the range filter in YYYY-MM-DD HH:MM format (conversations on or before this date)",
                    "example": "2024-01-31 23:59"
                },
                "customerId": {
                    "type": "string",
                    "description": "Customer ID to filter by",
                    "example": "customer-12345"
                },
                "jomaxId": {
                    "type": "string",
                    "description": "Jomax (agent/guide) ID to filter by",
                    "example": "jomax-67890"
                },
                "conversationId": {
                    "type": "string",
                    "description": "Conversation ID to filter by",
                    "example": "f2194d38-6549-47c0-94d0-6680b287d03f"
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of records to fetch. Default is 20, max is 100.",
                    "minimum": 1,
                    "maximum": 100,
                    "default": 20,
                    "example": 20
                },
                "nextToken": {
                    "type": "string",
                    "description": "Pagination token for retrieving the next page of results. Use the nextToken from the previous response.",
                    "example": "eyJzaGFyZCI6MX0="
                }
            },
            "required": ["contactCenterId"]
        }
    
    @property
    def output_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "status": {
                    "type": "string",
                    "description": "Status of the API response",
                    "example": "success"
                },
                "message": {
                    "type": "string",
                    "description": "Response message",
                    "example": "Conversation data retrieved successfully"
                },
                "data": {
                    "type": "array",
                    "description": "Array of conversation information objects",
                    "items": {
                        "type": "object",
                        "properties": {
                            "conversationInfo": {
                                "type": "object",
                                "properties": {
                                    "ucid": {
                                        "type": "string",
                                        "description": "Unique Conversation ID",
                                        "example": "f2194d38-6549-47c0-94d0-6680b287d03f"
                                    },
                                    "contactCenterId": {
                                        "type": "string",
                                        "description": "Contact center ID",
                                        "example": "contactCenterId#gd-dev-us-001#1"
                                    },
                                    "customerAuthenticated": {
                                        "type": "boolean",
                                        "description": "Whether customer is authenticated",
                                        "example": False
                                    },
                                    "customerDisplayName": {
                                        "type": "string",
                                        "description": "Customer display name",
                                        "example": "Valued Customer"
                                    },
                                    "brandCustomerId": {
                                        "type": "string",
                                        "description": "Brand customer ID",
                                        "example": "test123"
                                    },
                                    "customerId": {
                                        "type": "string",
                                        "description": "Customer ID",
                                        "example": "unknown"
                                    },
                                    "createdAt": {
                                        "type": "string",
                                        "format": "date-time",
                                        "description": "Creation timestamp",
                                        "example": "2025-04-07T04:03:32.459Z"
                                    },
                                    "updatedAt": {
                                        "type": "string",
                                        "format": "date-time",
                                        "description": "Last update timestamp",
                                        "example": "2025-04-07T04:03:32.459Z"
                                    },
                                    "platform": {
                                        "type": "string",
                                        "description": "Platform name",
                                        "example": "amazonconnect"
                                    },
                                    "channel": {
                                        "type": "string",
                                        "description": "Channel type",
                                        "example": "app"
                                    },
                                    "conversations": {
                                        "type": "array",
                                        "description": "Array of conversation details",
                                        "items": {"type": "object"}
                                    }
                                }
                            }
                        }
                    }
                },
                "pagination": {
                    "type": "object",
                    "properties": {
                        "limit": {
                            "type": "integer",
                            "description": "Maximum number of records per page",
                            "example": 20
                        },
                        "offset": {
                            "type": "integer",
                            "description": "Current page offset",
                            "example": 0
                        },
                        "total": {
                            "type": "integer",
                            "description": "Total number of records",
                            "example": 100
                        },
                        "hasMore": {
                            "type": "boolean",
                            "description": "Whether there are more records",
                            "example": True
                        },
                        "nextOffset": {
                            "type": "integer",
                            "description": "Next page offset",
                            "example": 20
                        }
                    }
                },
                "error": {
                    "type": "string",
                    "description": "Error message if the request failed"
                }
            },
            "required": ["status"]
        }
    

    async def execute(self, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Execute the conversation state service API call"""
        start_time = datetime.now()
        
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

