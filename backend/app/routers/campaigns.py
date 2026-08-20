from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.campaign import Campaign
from app.schemas.campaign import CampaignCreate


router = APIRouter(prefix="/campaigns", tags=["campaigns"])


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("")
def create_campaign(
    campaign: CampaignCreate,
    db: Session = Depends(get_db)
):
    db_campaign = Campaign(
        name=campaign.name,
        client_name=campaign.client_name,
        description=campaign.description,
        target_audience=campaign.target_audience,
        target_location=campaign.target_location,
        key_topics=",".join(campaign.key_topics),
        campaign_goal=campaign.campaign_goal
    )

    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)

    return {
        "message": "Campaign created successfully",
        "campaign_id": db_campaign.id
    }

@router.get("")
def get_campaigns(db: Session = Depends(get_db)):
    campaigns = db.query(Campaign).all()

    return [
        {
            "id": campaign.id,
            "name": campaign.name,
            "client_name": campaign.client_name,
            "description": campaign.description,
            "target_audience": campaign.target_audience,
            "target_location": campaign.target_location,
            "key_topics": campaign.key_topics.split(","),
            "campaign_goal": campaign.campaign_goal
        }
        for campaign in campaigns
    ]