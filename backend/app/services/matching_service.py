from app.schemas.match import MatchResult


def evaluate_match(campaign, opportunity) -> MatchResult:
    campaign_topics = {
        topic.strip().lower()
        for topic in campaign.key_topics.split(",")
    }

    opportunity_topics = {
        topic.strip().lower()
        for topic in opportunity.topics.split(",")
    }

    shared_topics = campaign_topics.intersection(opportunity_topics)

    topic_score = min(len(shared_topics) * 15, 35)

    geographic_score = 0
    if campaign.target_location and opportunity.location:
        if campaign.target_location.lower() in opportunity.location.lower():
            geographic_score = 15

    audience_score = 15
    promotion_score = 10
    timing_score = 5 if opportunity.date else 0

    reasons = []

    if shared_topics:
        reasons.append(
            f"Shared topics: {', '.join(sorted(shared_topics))}"
        )

    if geographic_score > 0:
        reasons.append("Opportunity matches the campaign location.")

    if not reasons:
        reasons.append("Limited direct match found.")

    concerns = []

    if not shared_topics:
        concerns.append("No shared campaign topics were found.")

    if not opportunity.location:
        concerns.append("Opportunity location is unavailable.")

    return MatchResult(
        topic_score=topic_score,
        audience_score=audience_score,
        geographic_score=geographic_score,
        promotion_score=promotion_score,
        timing_score=timing_score,
        reasons=reasons,
        concerns=concerns
    )