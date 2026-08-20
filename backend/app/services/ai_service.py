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

from app.schemas.outreach import OutreachDraft

def generate_outreach_with_ai(
    campaign,
    opportunity,
    match_result
) -> OutreachDraft:

    prompt = f"""
You are drafting PR outreach for a consultant.

Use ONLY the information provided below.
Do not invent facts, previous interactions, statistics,
event details, or journalist coverage.

Create a concise professional outreach message.

Return valid JSON only.

Use exactly this structure:

{{
  "subject": "subject line",
  "body": "outreach message"
}}

CAMPAIGN:
Client: {campaign.client_name}
Campaign: {campaign.name}
Description: {campaign.description}
Target audience: {campaign.target_audience}
Target location: {campaign.target_location}
Topics: {campaign.key_topics}
Goal: {campaign.campaign_goal}

OPPORTUNITY:
Name: {opportunity.name}
Type: {opportunity.type}
Organization: {opportunity.organization}
Description: {opportunity.description}
Location: {opportunity.location}
Topics: {opportunity.topics}
Date: {opportunity.date}

MATCH ANALYSIS:
Score: {match_result.total_score}/100
Reasons: {match_result.reasons}
Concerns: {match_result.concerns}

The message must:
- Explain why the client is relevant to the opportunity.
- Be professional and concise.
- Avoid unsupported claims.
- Avoid pretending there has been previous contact.
- Avoid saying the client has been accepted or approved.
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

    raw_text = "\n".join(text_blocks).strip()

    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")

        if raw_text.startswith("json"):
            raw_text = raw_text[4:].strip()

    data = json.loads(raw_text)

    return OutreachDraft(**data)