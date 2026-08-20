import json
import os

from anthropic import Anthropic
from dotenv import load_dotenv

from app.schemas.match import MatchResult


load_dotenv()

client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")
)


def evaluate_opportunity_with_ai(campaign, opportunity) -> MatchResult:
    prompt = f"""
You are evaluating a PR opportunity against a client campaign.

Use ONLY the information provided below.
Do not invent facts.

Score the opportunity using these limits:

- topic_score: 0 to 35
- audience_score: 0 to 25
- geographic_score: 0 to 15
- promotion_score: 0 to 15
- timing_score: 0 to 10

Return valid JSON only.

Do not include markdown.
Do not include ```json.
Do not include any explanation outside the JSON.

Use exactly this structure:

{{
  "topic_score": 0,
  "audience_score": 0,
  "geographic_score": 0,
  "promotion_score": 0,
  "timing_score": 0,
  "reasons": ["reason"],
  "concerns": ["concern"]
}}

CAMPAIGN:
Name: {campaign.name}
Client: {campaign.client_name}
Description: {campaign.description}
Target audience: {campaign.target_audience}
Target location: {campaign.target_location}
Topics: {campaign.key_topics}
Goal: {campaign.campaign_goal}

OPPORTUNITY:
Name: {opportunity.name}
Type: {opportunity.type}
Description: {opportunity.description}
Organization: {opportunity.organization}
Location: {opportunity.location}
Topics: {opportunity.topics}
Date: {opportunity.date}
"""

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1000,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    text_blocks = [
    block.text
    for block in response.content
    if block.type == "text"
]

    if not text_blocks:
        raise ValueError("Claude returned no text response")

    raw_text = "\n".join(text_blocks)

    data = json.loads(raw_text)

    return MatchResult(**data)