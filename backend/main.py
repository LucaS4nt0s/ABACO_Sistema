from fastapi import FastAPI

app = FastAPI(title="SGA ABACO API")

@app.get("/")
def read_root():
    return {"status": "API online e rodando perfeitamente"}