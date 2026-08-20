from fastapi import FastAPI

from app.routers.campaigns import router as campaigns_router


app = FastAPI(title="PR Scout API")

app.include_router(campaigns_router)


@app.get("/")
def read_root():
    return {"message": "PR Scout API is running"}