from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from ..database.connection import get_db
from ..models.database import User as UserModel, Server as ServerModel
from ..models.schemas import Server, ServerCreate
from ..auth.security import get_current_active_user
from ..pterodactyl.client import pterodactyl_client

router = APIRouter(prefix="/api/servers", tags=["servers"])

@router.get("/", response_model=List[Server])
async def get_user_servers(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    servers = db.query(ServerModel).filter(ServerModel.user_id == current_user.id).all()
    return servers

@router.post("/", response_model=Server)
async def create_server(
    server: ServerCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    # Load configuration
    with open("/home/runner/work/mchostpanel/mchostpanel/config.json", "r") as f:
        config = json.load(f)
    
    # Check if user has reached server limit
    user_servers = db.query(ServerModel).filter(ServerModel.user_id == current_user.id).count()
    max_servers = config["app_config"]["max_servers_per_user"]
    
    if user_servers >= max_servers:
        raise HTTPException(
            status_code=400,
            detail=f"You have reached the maximum number of servers ({max_servers})"
        )
    
    # Check if server name already exists for this user
    existing_server = db.query(ServerModel).filter(
        ServerModel.user_id == current_user.id,
        ServerModel.name == server.name
    ).first()
    
    if existing_server:
        raise HTTPException(
            status_code=400,
            detail="Server name already exists"
        )
    
    # Create server in Pterodactyl
    pterodactyl_server = await pterodactyl_client.create_server(
        user_id=current_user.pterodactyl_id,
        server_name=server.name,
        config={"allocation_id": 1}  # Default allocation
    )
    
    if not pterodactyl_server:
        raise HTTPException(
            status_code=500,
            detail="Failed to create server in Pterodactyl panel"
        )
    
    # Create server in local database
    db_server = ServerModel(
        user_id=current_user.id,
        pterodactyl_id=pterodactyl_server["attributes"]["id"],
        name=server.name,
        description=server.description,
        status="installing"
    )
    
    db.add(db_server)
    db.commit()
    db.refresh(db_server)
    
    return db_server

@router.get("/{server_id}", response_model=Server)
async def get_server(
    server_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    server = db.query(ServerModel).filter(
        ServerModel.id == server_id,
        ServerModel.user_id == current_user.id
    ).first()
    
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    return server

@router.delete("/{server_id}")
async def delete_server(
    server_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    server = db.query(ServerModel).filter(
        ServerModel.id == server_id,
        ServerModel.user_id == current_user.id
    ).first()
    
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    # TODO: Delete server from Pterodactyl panel
    # This would require calling the Pterodactyl API to delete the server
    
    # Delete from local database
    db.delete(server)
    db.commit()
    
    return {"message": "Server deleted successfully"}

@router.post("/{server_id}/start")
async def start_server(
    server_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    server = db.query(ServerModel).filter(
        ServerModel.id == server_id,
        ServerModel.user_id == current_user.id
    ).first()
    
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    # Start server via Pterodactyl API
    success = await pterodactyl_client.start_server(str(server.pterodactyl_id))
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to start server")
    
    return {"message": "Server start command sent"}

@router.post("/{server_id}/stop")
async def stop_server(
    server_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    server = db.query(ServerModel).filter(
        ServerModel.id == server_id,
        ServerModel.user_id == current_user.id
    ).first()
    
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    # Stop server via Pterodactyl API
    success = await pterodactyl_client.stop_server(str(server.pterodactyl_id))
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to stop server")
    
    return {"message": "Server stop command sent"}

@router.post("/{server_id}/restart")
async def restart_server(
    server_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    server = db.query(ServerModel).filter(
        ServerModel.id == server_id,
        ServerModel.user_id == current_user.id
    ).first()
    
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    # Restart server via Pterodactyl API
    success = await pterodactyl_client.restart_server(str(server.pterodactyl_id))
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to restart server")
    
    return {"message": "Server restart command sent"}