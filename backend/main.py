from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from db import Base, engine
from routes import orders, risk
from fastapi.middleware.cors import CORSMiddleware
from websocket_manager import manager

app = FastAPI()

# create tables
Base.metadata.create_all(bind=engine)

app.include_router(orders.router)
app.include_router(risk.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "AI Risk Engine Running"}

@app.websocket("/ws/orders")
async def websocket_orders(websocket: WebSocket):
    await manager.connect(websocket)

    try:
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(websocket)
