# PR Scout

PR Scout is an AI-assisted tool for matching PR campaigns with relevant media and event opportunities.

It takes a client campaign brief, evaluates available opportunities against it, ranks them by relevance, explains the reasoning behind each match, and can generate a draft outreach message for human review.

## Why I Built It

The idea came from a real PR workflow.

I occasionally help a friend working in PR research relevant events and media opportunities for clients. Given a client's campaign or what they are trying to promote, the process involves finding suitable opportunities, assessing whether they are actually relevant, preparing a shortlist, and then contacting the appropriate organizations or writers.

A lot of the work is repetitive, but the final judgement still requires context.

PR Scout explores how AI can assist with that research and evaluation process without removing human oversight.

## What It Does

A user can:

1. Create a PR campaign with a client brief, target audience, location, topics, and campaign goal.
2. Add potential PR opportunities such as events, publications, articles, or journalists.
3. Ask PR Scout to analyze all available opportunities for a campaign.
4. Receive a ranked list with a score out of 100.
5. Inspect the reasoning and concerns behind each score.
6. Generate a personalized outreach draft for a selected opportunity.
7. Review and edit the AI-generated draft before using it.

## Example Workflow

```text
Campaign Brief
      |
      v
Available PR Opportunities
      |
      v
Claude Evaluation
      |
      v
Structured Match Scores
      |
      v
Pydantic Validation
      |
      v
Backend Score Calculation
      |
      v
Ranked Opportunities
      |
      v
Selected Opportunity
      |
      v
AI Outreach Draft
      |
      v
Human Review
```

## Architecture

PR Scout is split into a Next.js frontend and FastAPI backend.

```text
Next.js Frontend
        |
        | HTTP
        v
FastAPI Backend
        |
        +---- Campaign API
        |
        +---- Opportunity API
        |
        +---- Matching Service
        |          |
        |          v
        |      Anthropic Claude
        |
        +---- Outreach Service
        |          |
        |          v
        |      Anthropic Claude
        |
        v
      SQLite
```

The API layer is separated from the AI service so application routes are not directly coupled to a specific model implementation.

## Match Scoring

Claude evaluates each opportunity across five dimensions:

| Dimension | Maximum Score |
|---|---:|
| Topic relevance | 35 |
| Audience relevance | 25 |
| Geographic relevance | 15 |
| Promotion potential | 15 |
| Timing | 10 |
| **Total** | **100** |

The model returns the individual dimensions, reasons, and concerns.

The final total is calculated by the application rather than trusting the model to calculate it.

Results are then sorted from highest to lowest score.

## AI Usage and Verification

AI is useful in this project because opportunity matching requires qualitative judgement that is difficult to capture with simple keyword matching.

However, model output is treated as untrusted input.

PR Scout therefore:

- validates structured AI responses with Pydantic
- constrains scoring categories and maximum values
- calculates final scores in application code
- asks the model to use only supplied information
- exposes reasons and concerns rather than only returning a score
- surfaces failed evaluations instead of silently treating them as successful
- marks outreach drafts as requiring human review
- reminds the user to verify factual claims and opportunity details before sending outreach

The goal is AI-assisted decision making rather than autonomous PR outreach.

## Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- Anthropic Claude API
- Pytest

### Frontend

- TypeScript
- Next.js
- React
- Tailwind CSS

## Project Structure

```text
pr-scout/
|
+-- backend/
|   +-- app/
|   |   +-- models/
|   |   +-- routers/
|   |   +-- schemas/
|   |   +-- services/
|   |   +-- database/
|   |   +-- main.py
|   |
|   +-- tests/
|   +-- requirements.txt
|   +-- .env.example
|
+-- frontend/
|   +-- app/
|   +-- package.json
|
+-- docs/
|   +-- PRD.md
|
+-- README.md
```

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/AbhinandSunil/pr-scout.git
cd pr-scout
```

### 2. Configure the backend

```bash
cd backend
python -m venv .venv
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Copy the example environment configuration:

```powershell
Copy-Item .env.example .env
```

Add your Anthropic API key to `.env`:

```text
ANTHROPIC_API_KEY=your_key_here
```

Run FastAPI:

```bash
uvicorn app.main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

Interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The application will run at:

```text
http://localhost:3000
```

## Tests

Backend tests intentionally mock AI responses so the test suite does not depend on network access, API availability, model behaviour, or paid API calls.

Run:

```bash
cd backend
pytest
```

Current test coverage includes:

- deterministic matching logic
- match API behaviour
- missing campaign/opportunity handling
- mocked AI evaluation
- outreach generation
- human-review metadata

Frontend quality checks:

```bash
cd frontend
npm run lint
npm run build
```

## Current Limitations

PR Scout is intentionally a small MVP.

Currently:

- opportunities are manually entered rather than discovered automatically
- SQLite is used for local persistence
- AI evaluations are performed sequentially
- generated outreach is drafted but never sent automatically
- authentication and multi-user support are not implemented
- match results are generated on demand rather than persisted
- production deployment and monitoring are outside the current scope

## What I Would Build Next

The next iteration would focus on turning opportunity collection into an automated research workflow.

Potential improvements include:

- web-assisted discovery of relevant events and media opportunities
- journalist and publication research
- source URLs and evidence attached to recommendations
- persisted match history
- asynchronous or parallel AI evaluation
- background research jobs
- user authentication and client workspaces
- configurable scoring criteria
- outreach approval workflows
- production deployment, observability, and AI evaluation monitoring

## Product Principle

PR Scout is designed around a simple principle:

> AI should reduce the repetitive research and drafting work while keeping consequential PR decisions with the human consultant.
