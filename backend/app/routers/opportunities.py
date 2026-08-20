from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.opportunity import Opportunity
from app.schemas.opportunity import OpportunityCreate


router = APIRouter(prefix="/opportunities", tags=["opportunities"])


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("")
def create_opportunity(
    opportunity: OpportunityCreate,
    db: Session = Depends(get_db)
):
    db_opportunity = Opportunity(
        name=opportunity.name,
        type=opportunity.type,
        description=opportunity.description,
        organization=opportunity.organization,
        location=opportunity.location,
        topics=",".join(opportunity.topics),
        url=opportunity.url,
        date=opportunity.date
    )

    db.add(db_opportunity)
    db.commit()
    db.refresh(db_opportunity)

    return {
        "message": "Opportunity created successfully",
        "opportunity_id": db_opportunity.id
    }


@router.get("")
def get_opportunities(db: Session = Depends(get_db)):
    opportunities = db.query(Opportunity).all()

    return [
        {
            "id": opportunity.id,
            "name": opportunity.name,
            "type": opportunity.type,
            "description": opportunity.description,
            "organization": opportunity.organization,
            "location": opportunity.location,
            "topics": opportunity.topics.split(","),
            "url": opportunity.url,
            "date": opportunity.date
        }
        for opportunity in opportunities
    ]