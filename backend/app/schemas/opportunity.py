from typing import Optional

from pydantic import BaseModel, Field


class OpportunityCreate(BaseModel):
    name: str = Field(min_length=1)
    type: str = Field(min_length=1)
    description: str = Field(min_length=1)
    organization: Optional[str] = None
    location: Optional[str] = None
    topics: list[str] = Field(min_length=1)
    url: Optional[str] = None
    date: Optional[str] = None