from fastapi import FastAPI

from app.database.connection import Base, engine
from app.models.campaign import Campaign
from app.models.opportunity import Opportunity
from app.routers.campaigns import router as campaigns_router
from app.routers.opportunities import router as opportunities_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="PR Scout API")

app.include_router(campaigns_router)
app.include_router(opportunities_router)


@app.get("/")
def read_root():
    return {"message": "PR Scout API is running"}