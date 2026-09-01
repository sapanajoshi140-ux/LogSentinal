# backend/detection/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ingest")
def ingest(payload: dict):
    print("received:", payload)
    return {"status": "received"}