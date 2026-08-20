from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.campaign import Campaign
from app.models.opportunity import Opportunity
from app.services.ai_service import evaluate_opportunity_with_ai


router = APIRouter(prefix="/matches", tags=["matches"])


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/single/{campaign_id}/{opportunity_id}")
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

    try:
        result = evaluate_opportunity_with_ai(campaign, opportunity)
    except Exception as e:
        print("AI ERROR:", repr(e))

        raise HTTPException(
            status_code=502,
            detail="AI evaluation failed"
        )

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

@router.post("/campaign/{campaign_id}")
def match_campaign_to_all_opportunities(
    campaign_id: int,
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

    opportunities = db.query(Opportunity).all()

    if not opportunities:
        raise HTTPException(
            status_code=404,
            detail="No opportunities found"
        )

    results = []
    failed_opportunities = []

    for opportunity in opportunities:
        try:
            result = evaluate_opportunity_with_ai(
                campaign,
                opportunity
            )

            results.append({
                "opportunity_id": opportunity.id,
                "opportunity_name": opportunity.name,
                "opportunity_type": opportunity.type,
                "topic_score": result.topic_score,
                "audience_score": result.audience_score,
                "geographic_score": result.geographic_score,
                "promotion_score": result.promotion_score,
                "timing_score": result.timing_score,
                "total_score": result.total_score,
                "reasons": result.reasons,
                "concerns": result.concerns
            })

        except Exception as e:
            print(
                f"AI ERROR for opportunity {opportunity.id}:",
                repr(e)
            )

            failed_opportunities.append({
                "opportunity_id": opportunity.id,
                "opportunity_name": opportunity.name,
                "error": "Evaluation failed"
            })

    results.sort(
        key=lambda match: match["total_score"],
        reverse=True
    )

    return {
        "campaign_id": campaign.id,
        "campaign_name": campaign.name,
        "total_opportunities": len(opportunities),
        "successful_evaluations": len(results),
        "failed_evaluations": len(failed_opportunities),
        "matches": results,
        "failed_opportunities": failed_opportunities
    }