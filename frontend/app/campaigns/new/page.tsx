"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";


export default function NewCampaignPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [targetLocation, setTargetLocation] = useState("");
  const [topics, setTopics] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    const keyTopics = topics
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/campaigns",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            client_name: clientName,
            description,
            target_audience: targetAudience,
            target_location: targetLocation || null,
            key_topics: keyTopics,
            campaign_goal: campaignGoal,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Campaign creation failed");
      }

      router.push("/");
      router.refresh();
    } catch {
      setError(
        "Unable to create campaign. Check the form and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <a
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to campaigns
        </a>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Campaign
          </h1>

          <p className="mt-2 text-gray-600">
            Add the client brief PR Scout will use to evaluate opportunities.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <Field
              label="Campaign name"
              value={name}
              onChange={setName}
              placeholder="EcoFuture Sustainability Launch"
            />

            <Field
              label="Client name"
              value={clientName}
              onChange={setClientName}
              placeholder="EcoFuture"
            />

            <TextAreaField
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Describe what the client is promoting..."
            />

            <Field
              label="Target audience"
              value={targetAudience}
              onChange={setTargetAudience}
              placeholder="Business leaders and investors"
            />

            <Field
              label="Target location"
              value={targetLocation}
              onChange={setTargetLocation}
              placeholder="UAE"
              required={false}
            />

            <Field
              label="Key topics"
              value={topics}
              onChange={setTopics}
              placeholder="sustainability, technology, innovation"
            />

            <TextAreaField
              label="Campaign goal"
              value={campaignGoal}
              onChange={setCampaignGoal}
              placeholder="Generate media coverage and identify relevant events."
            />

            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-50"
            >
              {submitting
                ? "Creating..."
                : "Create Campaign"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}


function Field({
  label,
  value,
  onChange,
  placeholder,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-gray-900 outline-none focus:border-gray-400"
      />
    </div>
  );
}


function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        rows={4}
        className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-gray-900 outline-none focus:border-gray-400"
      />
    </div>
  );
}