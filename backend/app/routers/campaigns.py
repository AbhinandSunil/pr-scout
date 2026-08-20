from fastapi import APIRouter

from app.schemas.campaign import CampaignCreate


router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.post("")
def create_campaign(campaign: CampaignCreate):
    return {
        "message": "Campaign received successfully",
        "campaign": campaign
    }