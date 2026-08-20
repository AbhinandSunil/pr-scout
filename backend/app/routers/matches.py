from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.campaign import Campaign
from app.models.opportunity import Opportunity
from app.services.matching_service import evaluate_match


router = APIRouter(prefix="/matches", tags=["matches"])


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/{campaign_id}/{opportunity_id}")
def match_campaign_to_opportunity(
    campaign_id: int,
    opportunity_id: int,
    db: Session = Depends(get_db)
):
    campaign = (
        db.query(Campaign)
        .filter(Campaign.id == campaign_id)
        .first()
    )

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    opportunity = (
        db.query(Opportunity)
        .filter(Opportunity.id == opportunity_id)
        .first()
    )

    if not opportunity:
        raise HTTPException(
            status_code=404,
            detail="Opportunity not found"
        )

    result = evaluate_match(campaign, opportunity)

    return {
        "campaign_id": campaign.id,
        "opportunity_id": opportunity.id,
        "topic_score": result.topic_score,
        "audience_score": result.audience_score,
        "geographic_score": result.geographic_score,
        "promotion_score": result.promotion_score,
        "timing_score": result.timing_score,
        "total_score": result.total_score,
        "reasons": result.reasons,
        "concerns": result.concerns
    }