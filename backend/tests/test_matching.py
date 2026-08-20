from types import SimpleNamespace

from app.services.matching_service import evaluate_match


def test_shared_topic_increases_score():
    campaign = SimpleNamespace(
        key_topics="sustainability,technology",
        target_location="UAE"
    )

    opportunity = SimpleNamespace(
        topics="sustainability,innovation",
        location="Dubai, UAE",
        date="2026-10-15"
    )

    result = evaluate_match(campaign, opportunity)

    assert result.topic_score == 15
    assert result.geographic_score == 15
    assert result.total_score == 60
    assert "Shared topics: sustainability" in result.reasons


def test_no_shared_topics_adds_concern():
    campaign = SimpleNamespace(
        key_topics="finance,banking",
        target_location="UAE"
    )

    opportunity = SimpleNamespace(
        topics="fashion,sustainability",
        location="Dubai, UAE",
        date=None
    )

    result = evaluate_match(campaign, opportunity)

    assert result.topic_score == 0
    assert "No shared campaign topics were found." in result.concerns


def test_missing_location_does_not_get_geographic_score():
    campaign = SimpleNamespace(
        key_topics="technology",
        target_location="UAE"
    )

    opportunity = SimpleNamespace(
        topics="technology",
        location=None,
        date=None
    )

    result = evaluate_match(campaign, opportunity)

    assert result.geographic_score == 0
    assert "Opportunity location is unavailable." in result.concerns