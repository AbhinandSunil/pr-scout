from pydantic import BaseModel, Field


class OutreachDraft(BaseModel):
    subject: str = Field(min_length=1)
    body: str = Field(min_length=1)