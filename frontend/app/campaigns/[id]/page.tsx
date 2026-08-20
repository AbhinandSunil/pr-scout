type Campaign = {
  id: number;
  name: string;
  client_name: string;
  description: string;
  target_audience: string;
  target_location: string | null;
  key_topics: string[];
  campaign_goal: string;
};

async function getCampaigns(): Promise<Campaign[]> {
  const response = await fetch("http://127.0.0.1:8000/campaigns", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load campaigns");
  }

  return response.json();
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const campaigns = await getCampaigns();

  const campaign = campaigns.find(
    (item) => item.id === Number(id)
  );

  if (!campaign) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-red-600">
            Campaign not found.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <a
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to campaigns
        </a>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            {campaign.client_name}
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            {campaign.name}
          </h1>

          <p className="mt-4 text-gray-700">
            {campaign.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {campaign.key_topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {topic}
              </span>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Target audience
              </p>
              <p className="mt-1 text-gray-900">
                {campaign.target_audience}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500">
                Target location
              </p>
              <p className="mt-1 text-gray-900">
                {campaign.target_location || "Not specified"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">
              Campaign goal
            </p>
            <p className="mt-1 text-gray-900">
              {campaign.campaign_goal}
            </p>
          </div>

          <div className="mt-8">
            <a
              href={`/campaigns/${campaign.id}/matches`}
              className="inline-block rounded-lg bg-black px-4 py-2 text-white"
            >
              Analyze Opportunities
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}