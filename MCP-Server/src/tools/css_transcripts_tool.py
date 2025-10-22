"""
Conversation State Service Transcripts Tool for MCP Server
"""
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional, Union
import os
import aiohttp

from ..server import MCPTool
from ..utils.oauth_client import make_authenticated_request

logger = logging.getLogger(__name__)


class CSSTranscriptsTool(MCPTool):
    """Tool for calling Conversation State Service API to retrieve conversation transcripts"""
    
    @property
    def name(self) -> str:
        return "conversation_state_transcripts"
    
    @property
    def description(self) -> str:
        return "Retrieve transcripts for a particular conversation. If no transcripts are found in the primary storage, the system will automatically attempt to fetch from archival storage."
    
    @property
    def input_schema(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "ucid": {
                    "type": "string",
                    "description": "Unique Conversation ID (UCID) for the conversation",
                    "example": "f2194d38-6549-47c0-94d0-6680b287d03f"
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
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Unique conversation ID",
                            "example": "f2194d38-6549-47c0-94d0-6680b287d03f"
                        },
                        "ucid": {
                            "type": "string",
                            "description": "Unique global conversation ID",
                            "example": "f2194d38-6549-47c0-94d0-6680b287d03f"
                        },
                        "contactId": {
                            "type": "string",
                            "description": "Contact ID associated with the conversation",
                            "example": "contact-123"
                        },
                        "lastEvaluatedKey": {
                            "type": ["string", "null"],
                            "description": "Base 64 encoded key of the last evaluated record. If null, there are no more records to fetch.",
                            "example": "eyJzaGFyZCI6MX0="
                        },
                        "transcripts": {
                            "type": "array",
                            "description": "Array of conversation transcript messages",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "messageId": {
                                        "type": "string",
                                        "description": "Message ID",
                                        "example": "msg-123"
                                    },
                                    "participantId": {
                                        "type": "string",
                                        "description": "Participant ID",
                                        "example": "f2194d38-6549-47c0-94d0-6680b287d03f"
                                    },
                                    "participantName": {
                                        "type": "string",
                                        "description": "Participant display name",
                                        "example": "John Doe"
                                    },
                                    "participantRole": {
                                        "type": "string",
                                        "description": "Role of the participant who initiated the message",
                                        "enum": ["CUSTOMER", "AGENT", "TELEPHONY"],
                                        "example": "CUSTOMER"
                                    },
                                    "content": {
                                        "type": "string",
                                        "description": "Content of the message",
                                        "example": "Hi, How can I help you today?"
                                    },
                                    "source": {
                                        "type": "string",
                                        "description": "Source system of the message",
                                        "enum": ["amazonconnect", "liveperson", "cisco"],
                                        "example": "amazonconnect"
                                    },
                                    "absoluteTime": {
                                        "type": "string",
                                        "format": "date-time",
                                        "description": "Timestamp when the message/event was sent",
                                        "example": "2025-04-07T04:03:32.459Z"
                                    },
                                    "attachments": {
                                        "type": "array",
                                        "description": "Array of message attachments",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "attachmentName": {
                                                    "type": "string",
                                                    "description": "Name of the attachment",
                                                    "example": "document.pdf"
                                                },
                                                "attachmentUrl": {
                                                    "type": "string",
                                                    "description": "URL to access the attachment",
                                                    "example": "https://example.com/attachment.pdf"
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
        """Execute the conversation state service API call to retrieve transcripts"""
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
