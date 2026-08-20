import Link from "next/link";

type OutreachResponse = {
  campaign_id: number;
  opportunity_id: number;
  match_score: number;
  subject: string;
  body: string;
  review_required: boolean;
  warning: string;
};

async function getOutreach(
  campaignId: string,
  opportunityId: string
): Promise<OutreachResponse> {
  const response = await fetch(
    `http://127.0.0.1:8000/outreach/${campaignId}/${opportunityId}`,
    {
      method: "POST",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate outreach");
  }

  return response.json();
}

export default async function OutreachPage({
  params,
}: {
  params: Promise<{
    id: string;
    opportunityId: string;
  }>;
}) {
  const { id, opportunityId } = await params;

  const outreach = await getOutreach(id, opportunityId);

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/campaigns/${id}/matches`}
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to matches
        </Link>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Outreach Draft
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900">
                Generated PR Outreach
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Review and edit the AI-generated message before using it.
              </p>
            </div>

            <div className="rounded-xl bg-gray-100 px-5 py-3 text-center">
              <div className="text-3xl font-bold text-gray-900">
                {outreach.match_score}
              </div>

              <div className="text-xs text-gray-500">
                Match Score
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-700">
              Subject
            </label>

            <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-900">
              {outreach.subject}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold text-gray-700">
              Message
            </label>

            <textarea
              defaultValue={outreach.body}
              rows={18}
              className="mt-2 w-full rounded-lg border border-gray-200 p-4 text-gray-900 outline-none focus:border-gray-400"
            />
          </div>

          {outreach.review_required && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="font-medium text-amber-900">
                Review before sending
              </p>

              <p className="mt-1 text-sm text-amber-800">
                {outreach.warning}
              </p>

              <p className="mt-2 text-sm text-amber-800">
                Verify event details, factual claims, and any suggested
                participation opportunities before contacting the recipient.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}