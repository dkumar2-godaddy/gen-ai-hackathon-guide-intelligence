"""
OAuth 2.0 Client Utility for GoDaddy APIs
"""
import asyncio
import base64
import logging
import os
from typing import Optional, Dict, Any
import aiohttp

logger = logging.getLogger(__name__)


class GoDaddyOAuthClient:
    """OAuth 2.0 client for GoDaddy APIs"""
    
    def __init__(self):
        self.oauth_url = "https://oauth.api.dev-godaddy.com/v2/oauth2/token"
        self.client_id = os.getenv("OAUTH_CLIENT_ID", "3a732f46-c240-4344-91ed-5e7ab1a04b4a")
        self.client_secret = os.getenv("OAUTH_CLIENT_SECRET", "9a6UOEykPfz9AIKoSaqsLEnE2avJgUqk")
        self.scope = os.getenv("OAUTH_SCOPE", "care.dataplane.read:all")
        self._cached_token = None
        self._token_expires_at = None
    
    async def get_access_token(self, force_refresh: bool = False) -> Optional[str]:
        """
        Get OAuth 2.0 access token with caching
        
        Args:
            force_refresh: Force refresh the token even if cached
            
        Returns:
            Access token string or None if failed
        """
        # Check if we have a valid cached token
        if not force_refresh and self._cached_token and self._is_token_valid():
            logger.debug("Using cached OAuth token")
            return self._cached_token
        
        try:
            # Prepare OAuth 2.0 request parameters as form data
            oauth_data = {
                "scope": self.scope,
                "grant_type": "client_credentials"
            }
            
            # Create Basic Auth header
            credentials = f"{self.client_id}:{self.client_secret}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()
            
            # Headers for OAuth request
            oauth_headers = {
                "Cookie": '_policy={"restricted_market":true,"tracking_market":"explicit"}; visitor=vid=0ea6a4d0-b678-488a-b043-88ceb7048afb',
                "Authorization": f"Basic {encoded_credentials}",
                "Content-Type": "application/x-www-form-urlencoded"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(self.oauth_url, data=oauth_data, headers=oauth_headers) as response:
                    if response.status == 200:
                        token_data = await response.json()
                        access_token = token_data.get("access_token")
                        
                        if access_token:
                            # Cache the token
                            self._cached_token = access_token
                            # Set expiration (default to 1 hour if not provided)
                            expires_in = token_data.get("expires_in", 3600)
                            self._token_expires_at = asyncio.get_event_loop().time() + expires_in
                            
                            logger.info("OAuth token acquired successfully")
                            return access_token
                        else:
                            logger.error("No access_token in OAuth response")
                            return None
                    else:
                        error_text = await response.text()
                        logger.error(f"OAuth token request failed: {response.status} - {error_text}")
                        return None
                        
        except Exception as e:
            logger.error(f"Error getting OAuth token: {str(e)}")
            return None
    
    def _is_token_valid(self) -> bool:
        """Check if the cached token is still valid"""
        if not self._cached_token or not self._token_expires_at:
            return False
        
        # Add 5 minute buffer before expiration
        buffer_time = 300  # 5 minutes
        return asyncio.get_event_loop().time() < (self._token_expires_at - buffer_time)
    
    async def make_authenticated_request(
        self, 
        method: str, 
        url: str, 
        headers: Optional[Dict[str, str]] = None,
        params: Optional[Dict[str, Any]] = None,
        data: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Optional[aiohttp.ClientResponse]:
        """
        Make an authenticated request to a GoDaddy API
        
        Args:
            method: HTTP method (GET, POST, etc.)
            url: API endpoint URL
            headers: Additional headers
            params: Query parameters
            data: Request body data
            **kwargs: Additional arguments for aiohttp
            
        Returns:
            aiohttp.ClientResponse or None if failed
        """
        # Get access token
        token = await self.get_access_token()
        if not token:
            logger.error("Failed to get access token for authenticated request")
            return None
        
        # Prepare headers
        request_headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        
        if headers:
            request_headers.update(headers)
        
        try:
            # Use aiohttp connector with proper settings to avoid connection issues
            connector = aiohttp.TCPConnector(
                limit=10,
                limit_per_host=5,
                ttl_dns_cache=300,
                use_dns_cache=True,
            )
            
            timeout = aiohttp.ClientTimeout(total=30, connect=10)
            
            async with aiohttp.ClientSession(connector=connector, timeout=timeout) as session:
                if method.upper() == "GET":
                    response = await session.get(url, headers=request_headers, params=params, **kwargs)
                    return response
                elif method.upper() == "POST":
                    response = await session.post(url, headers=request_headers, params=params, data=data, **kwargs)
                    return response
                elif method.upper() == "PUT":
                    response = await session.put(url, headers=request_headers, params=params, data=data, **kwargs)
                    return response
                elif method.upper() == "DELETE":
                    response = await session.delete(url, headers=request_headers, params=params, **kwargs)
                    return response
                else:
                    logger.error(f"Unsupported HTTP method: {method}")
                    return None
                    
        except Exception as e:
            logger.error(f"Error making authenticated request: {str(e)}")
            return None
    
    def clear_token_cache(self):
        """Clear the cached token"""
        self._cached_token = None
        self._token_expires_at = None
        logger.info("OAuth token cache cleared")


# Global OAuth client instance
oauth_client = GoDaddyOAuthClient()


async def get_oauth_token() -> Optional[str]:
    """
    Convenience function to get OAuth token
    
    Returns:
        Access token string or None if failed
    """
    return await oauth_client.get_access_token()


async def make_authenticated_request(
    method: str,
    url: str,
    headers: Optional[Dict[str, str]] = None,
    params: Optional[Dict[str, Any]] = None,
    data: Optional[Dict[str, Any]] = None,
    **kwargs
) -> Optional[aiohttp.ClientResponse]:
    """
    Convenience function to make authenticated requests
    
    Args:
        method: HTTP method (GET, POST, etc.)
        url: API endpoint URL
        headers: Additional headers
        params: Query parameters
        data: Request body data
        **kwargs: Additional arguments for aiohttp
        
    Returns:
        aiohttp.ClientResponse or None if failed
    """
    return await oauth_client.make_authenticated_request(
        method, url, headers, params, data, **kwargs
    )
