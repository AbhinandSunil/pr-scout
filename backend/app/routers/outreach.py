from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.campaign import Campaign
from app.models.opportunity import Opportunity
from app.services.ai_service import (
    evaluate_opportunity_with_ai,
    generate_outreach_with_ai
)


router = APIRouter(prefix="/outreach", tags=["outreach"])


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/{campaign_id}/{opportunity_id}")
def generate_outreach(
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

    try:
        match_result = evaluate_opportunity_with_ai(
            campaign,
            opportunity
        )

        draft = generate_outreach_with_ai(
            campaign,
            opportunity,
            match_result
        )

    except Exception as e:
        print("AI ERROR:", repr(e))

        raise HTTPException(
            status_code=502,
            detail="Outreach generation failed"
        )

    return {
        "campaign_id": campaign.id,
        "opportunity_id": opportunity.id,
        "match_score": match_result.total_score,
        "subject": draft.subject,
        "body": draft.body,
        "review_required": True,
        "warning": (
            "AI-generated draft. Review factual claims "
            "and suitability before use."
        )
    }