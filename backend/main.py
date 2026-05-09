from fastapi import FastAPI
from db import Base, engine
from routes import orders, risk
from fastapi.middleware.cors import CORSMiddleware

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
