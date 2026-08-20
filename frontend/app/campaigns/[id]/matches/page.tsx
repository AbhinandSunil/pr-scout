type Match = {
  opportunity_id: number;
  opportunity_name: string;
  opportunity_type: string;
  topic_score: number;
  audience_score: number;
  geographic_score: number;
  promotion_score: number;
  timing_score: number;
  total_score: number;
  reasons: string[];
  concerns: string[];
};

type MatchResponse = {
  campaign_id: number;
  campaign_name: string;
  total_opportunities: number;
  successful_evaluations: number;
  failed_evaluations: number;
  matches: Match[];
};

async function getMatches(
  campaignId: string
): Promise<MatchResponse> {
  const response = await fetch(
    `http://127.0.0.1:8000/matches/campaign/${campaignId}`,
    {
      method: "POST",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to analyze opportunities");
  }

  return response.json();
}

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getMatches(id);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <a
          href={`/campaigns/${id}`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to campaign
        </a>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Opportunity Matches
          </h1>

          <p className="mt-2 text-gray-600">
            {data.campaign_name}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {data.successful_evaluations} of{" "}
            {data.total_opportunities} opportunities evaluated
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {data.matches.map((match, index) => (
            <div
              key={match.opportunity_id}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    #{index + 1} · {match.opportunity_type}
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-gray-900">
                    {match.opportunity_name}
                  </h2>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
  {match.total_score}
</div>

<div className="text-sm text-gray-500">
  / 100
</div>

<div className="mt-1 text-xs font-medium text-gray-700">
  {getMatchLabel(match.total_score)}
</div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <Score
                  label="Topic"
                  value={`${match.topic_score}/35`}
                />

                <Score
                  label="Audience"
                  value={`${match.audience_score}/25`}
                />

                <Score
                  label="Geography"
                  value={`${match.geographic_score}/15`}
                />

                <Score
                  label="Promotion"
                  value={`${match.promotion_score}/15`}
                />

                <Score
                  label="Timing"
                  value={`${match.timing_score}/10`}
                />
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Why it matches
                  </h3>

                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {match.reasons.map((reason) => (
                      <li key={reason}>
                        • {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Concerns
                  </h3>

                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {match.concerns.length > 0 ? (
                      match.concerns.map((concern) => (
                        <li key={concern}>
                          • {concern}
                        </li>
                      ))
                    ) : (
                      <li>No major concerns identified.</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href={`/campaigns/${id}/outreach/${match.opportunity_id}`}
                  className="inline-block rounded-lg bg-black px-4 py-2 text-white"
                >
                  Generate Outreach
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function getMatchLabel(score: number) {
  if (score >= 85) return "Excellent match";
  if (score >= 70) return "Strong match";
  if (score >= 50) return "Moderate match";
  return "Weak match";
}

function Score({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}