from fastapi import FastAPI
from app.routers.matches import router as matches_router
from app.database.connection import Base, engine
from app.models.campaign import Campaign
from app.models.opportunity import Opportunity
from app.routers.campaigns import router as campaigns_router
from app.routers.opportunities import router as opportunities_router
from app.routers.outreach import router as outreach_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PR Scout API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(campaigns_router)
app.include_router(opportunities_router)
app.include_router(matches_router)
app.include_router(outreach_router)

@app.get("/")
def read_root():
    return {"message": "PR Scout API is running"}