import httpx
import json
import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

class PterodactylClient:
    def __init__(self):
        self.base_url = os.getenv("PTERODACTYL_URL", "").rstrip("/")
        self.api_key = os.getenv("PTERODACTYL_API_KEY", "")
        self.admin_token = os.getenv("PTERODACTYL_ADMIN_TOKEN", "")
        
        if not all([self.base_url, self.api_key, self.admin_token]):
            raise ValueError("Pterodactyl configuration is incomplete. Check your environment variables.")
    
    def _get_headers(self, admin: bool = False):
        token = self.admin_token if admin else self.api_key
        return {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    async def create_user(self, username: str, email: str, password: str) -> Optional[Dict[str, Any]]:
        """Create a user in Pterodactyl panel"""
        url = f"{self.base_url}/api/application/users"
        data = {
            "username": username,
            "email": email,
            "first_name": username,
            "last_name": "User",
            "password": password
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url, 
                    json=data, 
                    headers=self._get_headers(admin=True),
                    timeout=30
                )
                if response.status_code == 201:
                    return response.json()
                else:
                    print(f"Failed to create user: {response.status_code} - {response.text}")
                    return None
            except Exception as e:
                print(f"Error creating user: {e}")
                return None
    
    async def get_user(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get user information from Pterodactyl"""
        url = f"{self.base_url}/api/application/users/{user_id}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    url,
                    headers=self._get_headers(admin=True),
                    timeout=30
                )
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception as e:
                print(f"Error getting user: {e}")
                return None
    
    async def create_server(self, user_id: int, server_name: str, config: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a server in Pterodactyl panel"""
        url = f"{self.base_url}/api/application/servers"
        
        # Load default config
        with open("/home/runner/work/mchostpanel/mchostpanel/config.json", "r") as f:
            default_config = json.load(f)
        
        server_config = default_config["server_config"]
        
        data = {
            "name": server_name,
            "user": user_id,
            "egg": server_config["default_egg"],
            "docker_image": server_config["image"],
            "startup": server_config["startup_command"],
            "environment": server_config["environment"],
            "limits": {
                "memory": server_config["default_memory"],
                "swap": 0,
                "disk": server_config["default_disk"],
                "io": 500,
                "cpu": server_config["default_cpu"]
            },
            "feature_limits": {
                "databases": server_config["default_databases"],
                "allocations": server_config["default_allocations"],
                "backups": server_config["default_backups"]
            },
            "allocation": {
                "default": config.get("allocation_id", 1)
            }
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url,
                    json=data,
                    headers=self._get_headers(admin=True),
                    timeout=60
                )
                if response.status_code == 201:
                    return response.json()
                else:
                    print(f"Failed to create server: {response.status_code} - {response.text}")
                    return None
            except Exception as e:
                print(f"Error creating server: {e}")
                return None
    
    async def get_user_servers(self, user_id: int) -> Optional[Dict[str, Any]]:
        """Get all servers for a user"""
        url = f"{self.base_url}/api/client"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    url,
                    headers=self._get_headers(admin=False),
                    timeout=30
                )
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception as e:
                print(f"Error getting user servers: {e}")
                return None
    
    async def get_server_status(self, server_id: str) -> Optional[Dict[str, Any]]:
        """Get server status and information"""
        url = f"{self.base_url}/api/client/servers/{server_id}"
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    url,
                    headers=self._get_headers(admin=False),
                    timeout=30
                )
                if response.status_code == 200:
                    return response.json()
                return None
            except Exception as e:
                print(f"Error getting server status: {e}")
                return None
    
    async def start_server(self, server_id: str) -> bool:
        """Start a server"""
        url = f"{self.base_url}/api/client/servers/{server_id}/power"
        data = {"signal": "start"}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url,
                    json=data,
                    headers=self._get_headers(admin=False),
                    timeout=30
                )
                return response.status_code == 204
            except Exception as e:
                print(f"Error starting server: {e}")
                return False
    
    async def stop_server(self, server_id: str) -> bool:
        """Stop a server"""
        url = f"{self.base_url}/api/client/servers/{server_id}/power"
        data = {"signal": "stop"}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url,
                    json=data,
                    headers=self._get_headers(admin=False),
                    timeout=30
                )
                return response.status_code == 204
            except Exception as e:
                print(f"Error stopping server: {e}")
                return False
    
    async def restart_server(self, server_id: str) -> bool:
        """Restart a server"""
        url = f"{self.base_url}/api/client/servers/{server_id}/power"
        data = {"signal": "restart"}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url,
                    json=data,
                    headers=self._get_headers(admin=False),
                    timeout=30
                )
                return response.status_code == 204
            except Exception as e:
                print(f"Error restarting server: {e}")
                return False

# Global instance
pterodactyl_client = PterodactylClient()