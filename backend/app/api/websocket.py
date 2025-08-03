"""
WebSocket endpoints for real-time updates
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from typing import Dict, List
import json
import logging

from app.models import WebSocketMessage

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ws", tags=["websocket"])


class ConnectionManager:
    """Manages WebSocket connections"""
    
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        """Connect a new client"""
        await websocket.accept()
        
        if client_id not in self.active_connections:
            self.active_connections[client_id] = []
        
        self.active_connections[client_id].append(websocket)
        logger.info(f"Client {client_id} connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket, client_id: str):
        """Disconnect a client"""
        if client_id in self.active_connections:
            self.active_connections[client_id].remove(websocket)
            if not self.active_connections[client_id]:
                del self.active_connections[client_id]
        
        logger.info(f"Client {client_id} disconnected")
    
    async def send_personal_message(self, message: str, client_id: str):
        """Send message to specific client"""
        if client_id in self.active_connections:
            for connection in self.active_connections[client_id]:
                try:
                    await connection.send_text(message)
                except Exception as e:
                    logger.error(f"Error sending message to client {client_id}: {e}")
                    # Remove broken connection
                    self.active_connections[client_id].remove(connection)
    
    async def broadcast(self, message: str):
        """Broadcast message to all clients"""
        for client_id in list(self.active_connections.keys()):
            await self.send_personal_message(message, client_id)


# Create global connection manager
manager = ConnectionManager()


@router.websocket("/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for real-time updates
    
    Args:
        websocket: WebSocket connection
        client_id: Client identifier
    """
    await manager.connect(websocket, client_id)
    
    try:
        while True:
            # Wait for messages from client
            data = await websocket.receive_text()
            
            try:
                # Parse incoming message
                message_data = json.loads(data)
                message_type = message_data.get("type", "unknown")
                
                # Handle different message types
                if message_type == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
                elif message_type == "subscribe_project":
                    project_id = message_data.get("project_id")
                    if project_id:
                        # Subscribe to project updates
                        await websocket.send_text(json.dumps({
                            "type": "subscribed",
                            "project_id": project_id
                        }))
                else:
                    # Echo back unknown messages
                    await websocket.send_text(json.dumps({
                        "type": "echo",
                        "data": message_data
                    }))
                    
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format"
                }))
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)
    except Exception as e:
        logger.error(f"WebSocket error for client {client_id}: {e}")
        manager.disconnect(websocket, client_id)


async def broadcast_project_update(project_id: int, update_data: Dict):
    """
    Broadcast project update to all connected clients
    
    Args:
        project_id: Project ID
        update_data: Update data to broadcast
    """
    message = WebSocketMessage(
        type="project_update",
        data={
            "project_id": project_id,
            **update_data
        }
    )
    
    await manager.broadcast(message.json())


async def broadcast_agent_log(project_id: int, agent_log: Dict):
    """
    Broadcast agent log update to all connected clients
    
    Args:
        project_id: Project ID
        agent_log: Agent log data
    """
    message = WebSocketMessage(
        type="agent_log",
        data={
            "project_id": project_id,
            "agent_log": agent_log
        }
    )
    
    await manager.broadcast(message.json())


async def broadcast_payment_status(project_id: int, payment_status: Dict):
    """
    Broadcast payment status update to all connected clients
    
    Args:
        project_id: Project ID
        payment_status: Payment status data
    """
    message = WebSocketMessage(
        type="payment_status",
        data={
            "project_id": project_id,
            "payment_status": payment_status
        }
    )
    
    await manager.broadcast(message.json()) 