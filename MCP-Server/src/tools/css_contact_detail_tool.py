"""
Conversation State Service Contact Detail Tool for MCP Server
"""
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional, Union
import os
import aiohttp

from ..server import MCPTool
from ..utils.oauth_client import make_authenticated_request

logger = logging.getLogger(__name__)


class CSSContactDetailTool(MCPTool):
    """Tool for calling Conversation State Service API to get conversation details by UCID"""
    
    @property
    def name(self) -> str:
        return "conversation_state_ucid_detail"
    
    @property
    def description(self) -> str:
        return "Fetch conversation details using the UCID from Conversation State Service API"
    
    @property
    def input_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "ucid": {
                    "type": "string",
                    "description": "Unique Conversation ID (UCID)",
                    "example": "f2194d38-6549-47c0-94d0-6680b287d03f"
                },
                "includeConversations": {
                    "type": "boolean",
                    "description": "Include conversations as well for the given UCID. Available values: true, false. Default value: false",
                    "example": False
                }
            },
            "required": ["ucid"]
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
                    "example": "Conversation retrieved successfully."
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
                                    "market": {
                                        "type": "string",
                                        "description": "Market identifier",
                                        "example": "en-US"
                                    },
                                    "plId": {
                                        "type": "string",
                                        "description": "Platform ID",
                                        "example": "12345"
                                    },
                                    "app": {
                                        "type": "string",
                                        "description": "Application name",
                                        "example": "app"
                                    },
                                    "location": {
                                        "type": "string",
                                        "description": "Location information",
                                        "example": ""
                                    },
                                    "supportLevel": {
                                        "type": "string",
                                        "description": "Support level",
                                        "example": "l1"
                                    },
                                    "customerJoinedTimestamp": {
                                        "type": "string",
                                        "format": "date-time",
                                        "description": "Customer joined timestamp",
                                        "example": "2025-04-07T04:03:32.459Z"
                                    },
                                    "customerLastMessageTimeStamp": {
                                        "type": "string",
                                        "format": "date-time",
                                        "description": "Customer last message timestamp",
                                        "example": "2025-04-07T04:03:32.459Z"
                                    },
                                    "visitId": {
                                        "type": "string",
                                        "description": "Visit ID",
                                        "example": "2ba8bf1a-7d23-4088-b6a0-3e735de37bc9"
                                    },
                                    "visitorId": {
                                        "type": "string",
                                        "description": "Visitor ID",
                                        "example": "47861910-ae6b-4d43-8189-a5ee55b7b0d0"
                                    },
                                    "brandId": {
                                        "type": "string",
                                        "description": "Brand ID",
                                        "example": "301873"
                                    },
                                    "intent": {
                                        "type": "string",
                                        "description": "Customer intent",
                                        "example": "Purchase"
                                    },
                                    "yield": {
                                        "type": "string",
                                        "description": "Yield level",
                                        "example": "High"
                                    },
                                    "conversationEndTimestamp": {
                                        "type": "string",
                                        "format": "date-time",
                                        "description": "Conversation end timestamp",
                                        "example": "2025-04-07T05:00:00.000Z"
                                    },
                                    "interactionType": {
                                        "type": "string",
                                        "description": "Type of interaction",
                                        "example": "chat"
                                    },
                                    "durationSeconds": {
                                        "type": "integer",
                                        "description": "Duration in seconds",
                                        "example": 3600
                                    },
                                    "latestQueueStatus": {
                                        "type": "string",
                                        "description": "Latest queue status",
                                        "example": "ACTIVE"
                                    },
                                    "latestQueue": {
                                        "type": "string",
                                        "description": "Latest queue name",
                                        "example": "SupportQueue"
                                    },
                                    "deviceInfo": {
                                        "type": "string",
                                        "description": "Device information",
                                        "example": "DESKTOP"
                                    },
                                    "conversations": {
                                        "type": "array",
                                        "description": "Array of conversation details",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "ucid": {
                                                    "type": "string",
                                                    "description": "Unique Conversation ID",
                                                    "example": "ucid"
                                                },
                                                "contactId": {
                                                    "type": "string",
                                                    "description": "Contact ID",
                                                    "example": "contactId"
                                                },
                                                "state": {
                                                    "type": "string",
                                                    "description": "Conversation state",
                                                    "example": "COMPLETED"
                                                },
                                                "agentId": {
                                                    "type": "string",
                                                    "description": "Agent ID",
                                                    "example": "agentId"
                                                },
                                                "createdAt": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Creation timestamp",
                                                    "example": "2025-04-07T04:03:39.485Z"
                                                },
                                                "updatedAt": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Last update timestamp",
                                                    "example": "2025-04-07T04:04:14.282Z"
                                                },
                                                "conversationStartTimestamp": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Conversation start timestamp",
                                                    "example": "2025-04-07T04:03:39.485Z"
                                                },
                                                "conversationEndTimestamp": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Conversation end timestamp",
                                                    "example": "2025-04-07T05:00:00.000Z"
                                                },
                                                "durationSeconds": {
                                                    "type": "integer",
                                                    "description": "Duration in seconds",
                                                    "example": 3600
                                                },
                                                "agentLastMessageTimeStamp": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Agent last message timestamp",
                                                    "example": "2025-04-07T04:04:13.983Z"
                                                },
                                                "agentJoinedTimestamp": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Agent joined timestamp",
                                                    "example": "2025-04-07T04:03:39.485Z"
                                                },
                                                "agentLeftTimestamp": {
                                                    "type": "string",
                                                    "format": "date-time",
                                                    "description": "Agent left timestamp",
                                                    "example": "2025-04-07T04:04:47.157Z"
                                                },
                                                "disconnectReason": {
                                                    "type": "string",
                                                    "description": "Disconnect reason",
                                                    "example": "CUSTOMER_DISCONNECTED"
                                                },
                                                "endDescription": {
                                                    "type": "string",
                                                    "description": "End description",
                                                    "example": "Customer disconnected"
                                                },
                                                "routingProfileName": {
                                                    "type": "string",
                                                    "description": "Routing profile name",
                                                    "example": "Default Routing Profile"
                                                },
                                                "queueName": {
                                                    "type": "string",
                                                    "description": "Queue name",
                                                    "example": "SupportQueue"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
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
        """Execute the conversation state service API call to get conversation details by UCID"""
        start_time = datetime.now()
        
        try:
            # Extract and validate required parameters
            ucid = arguments.get("ucid")
            
            if not ucid:
                return {
                    "status": "error",
                    "message": "Missing required parameter: ucid is required",
                    "error": "Missing required parameter: ucid is required"
                }
            
            # Build API request parameters
            api_params = {}
            
            # Add optional includeConversations parameter if provided
            if "includeConversations" in arguments and arguments["includeConversations"] is not None:
                api_params["includeConversations"] = arguments["includeConversations"]
            
            # Get API configuration
            api_base_url = os.getenv("CONVERSATION_API_BASE_URL", "https://conversation-state-service.care.dev-godaddy.com")
            api_endpoint = os.getenv("CONVERSATION_STATE_UCID_ENDPOINT", "/conversation-state/{ucid}")
            url = f"{api_base_url}{api_endpoint.format(ucid=ucid)}"
            
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
                    "message": data.get("message", "Conversation retrieved successfully."),
                    "data": data.get("data", [])
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
            logger.error(f"Error in conversation state contact detail service: {str(e)}")
            return {
                "status": "error",
                "message": f"Internal error: {str(e)}",
                "error": f"Internal error: {str(e)}"
            }

