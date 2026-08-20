# PR Scout — Product Requirements Document

## 1. Overview

PR Scout is an AI-assisted research and opportunity matching tool for PR professionals.

The idea was inspired by a real PR workflow I encountered while helping with research for client campaigns. Finding relevant events, publications, articles, and journalists often involves manually reviewing many opportunities and deciding which ones best align with a client's goals.

PR Scout helps structure this process by evaluating potential PR opportunities against a client campaign and explaining why they may or may not be relevant.

---

## 2. Problem

PR professionals often need to research potential opportunities for their clients, including:

- Events
- Publications
- Articles
- Journalists

Determining which opportunities are worth pursuing requires comparing them against the client's industry, target audience, location, campaign topics, and goals.

This research can become fragmented across search results, spreadsheets, and notes.

PR Scout provides a structured way to evaluate and prioritize these opportunities.

---

## 3. Target User

The primary user is a PR consultant who researches promotional and media opportunities for client campaigns.

---

## 4. Core User Flow

1. Create a client campaign.
2. Add potential PR opportunities.
3. Run AI-assisted matching.
4. View opportunities ranked by relevance.
5. Review the score, reasons, and concerns.
6. Generate an outreach draft for a selected opportunity.
7. Review and edit the draft before use.

---

## 5. Campaign Information

A campaign contains:

- Campaign name
- Client name
- Description
- Target audience
- Target location
- Key topics
- Campaign goal

---

## 6. Opportunity Information

Supported opportunity types:

- Event
- Publication
- Article
- Journalist

An opportunity can contain:

- Name
- Type
- Description
- Organization or publication
- Location
- Topics
- URL
- Date or timing information

---

## 7. Opportunity Matching

Each opportunity is evaluated against the selected campaign.

The scoring framework is:

| Criteria | Maximum Score |
|---|---:|
| Topic relevance | 35 |
| Target audience fit | 25 |
| Geographic relevance | 15 |
| Promotion potential | 15 |
| Timing suitability | 10 |
| **Total** | **100** |

The AI evaluates each category independently.

The application calculates the final total score rather than trusting an AI-generated total.

---

## 8. AI Output

For each opportunity, the AI should return:

- Topic score
- Audience score
- Geographic score
- Promotion score
- Timing score
- Reasons for the recommendation
- Potential concerns

The application must validate that every score is within its allowed range.

Invalid AI responses must not be stored as valid evaluations.

---

## 9. Outreach Generation

Users can generate an outreach draft for a selected opportunity.

The AI may only use information provided in the campaign, opportunity, and match evaluation.

It must not invent:

- Client facts
- Statistics
- Previous interactions
- Journalist coverage
- Event information

All generated outreach must be presented as a draft requiring human review.

---

## 10. Non-Goals

The MVP will not include:

- Automatic email sending
- Automatic web scraping
- CRM integrations
- User authentication
- Multi-user collaboration
- Autonomous outreach
- Real-time news monitoring

The goal is to keep the first version small, reliable, and finished.

---

## 11. Acceptance Criteria

The MVP is complete when a user can:

- Create a campaign.
- Add PR opportunities.
- Evaluate opportunities against a campaign.
- Receive validated relevance scores.
- View opportunities ranked from highest to lowest relevance.
- Review reasons and concerns for each match.
- Generate an editable outreach draft.
- Run automated tests covering the core matching and validation logic.

---

## 12. AI Safety and Reliability

AI output is treated as untrusted input.

The application is responsible for:

- Validating score ranges.
- Calculating total scores.
- Rejecting malformed responses.
- Handling AI API failures.
- Preventing unsupported AI-generated information from being treated as verified fact.
- Requiring human review before outreach is considered ready.