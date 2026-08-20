import Link from "next/link";

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

export default async function Home() {
  const campaigns = await getCampaigns();

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            PR Scout
          </h1>

          <p className="mt-2 text-gray-600">
            AI-assisted PR opportunity research and matching.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Campaigns
            </h2>

            <button className="rounded-lg bg-black px-4 py-2 text-white">
              Create Campaign
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="block rounded-lg border border-gray-200 p-5 transition hover:bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {campaign.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {campaign.client_name}
                </p>

                <p className="mt-3 text-gray-700">
                  {campaign.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {campaign.key_topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  Target: {campaign.target_location || "Not specified"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}