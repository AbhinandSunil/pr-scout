from typing import Optional

from pydantic import BaseModel, Field


class CampaignCreate(BaseModel):
    name: str = Field(min_length=1)
    client_name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    target_audience: str = Field(min_length=1)
    target_location: Optional[str] = None
    key_topics: list[str] = Field(min_length=1)
    campaign_goal: str = Field(min_length=1)