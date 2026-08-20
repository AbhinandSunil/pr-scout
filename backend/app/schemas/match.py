from pydantic import BaseModel, Field


class MatchResult(BaseModel):
    topic_score: int = Field(ge=0, le=35)
    audience_score: int = Field(ge=0, le=25)
    geographic_score: int = Field(ge=0, le=15)
    promotion_score: int = Field(ge=0, le=15)
    timing_score: int = Field(ge=0, le=10)

    reasons: list[str] = Field(min_length=1)
    concerns: list[str]

    @property
    def total_score(self) -> int:
        return (
            self.topic_score
            + self.audience_score
            + self.geographic_score
            + self.promotion_score
            + self.timing_score
        )