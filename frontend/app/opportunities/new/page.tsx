"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewOpportunityPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState("event");
  const [description, setDescription] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [topics, setTopics] = useState("");
  const [url, setUrl] = useState("");
  const [date, setDate] = useState("");

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSubmitting(true);

    const topicList = topics
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/opportunities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            type,
            description,
            organization: organization || null,
            location: location || null,
            topics: topicList,
            url: url || null,
            date: date || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Opportunity creation failed");
      }

      router.push("/");
      router.refresh();
    } catch {
      setError(
        "Unable to create opportunity. Check the form and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900"
            >
            ← Back to campaigns
        </Link>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Add Opportunity
          </h1>

          <p className="mt-2 text-gray-600">
            Add an event, publication, article, or journalist for PR Scout to evaluate.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <Field
              label="Opportunity name"
              value={name}
              onChange={setName}
              placeholder="UAE FinTech Forum"
            />

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Opportunity type
              </label>

              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-gray-900 outline-none focus:border-gray-400"
              >
                <option value="event">Event</option>
                <option value="publication">Publication</option>
                <option value="article">Article</option>
                <option value="journalist">Journalist</option>
              </select>
            </div>

            <TextAreaField
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="Describe the opportunity..."
            />

            <Field
              label="Organization / Publication"
              value={organization}
              onChange={setOrganization}
              placeholder="Example Media Group"
              required={false}
            />

            <Field
              label="Location"
              value={location}
              onChange={setLocation}
              placeholder="Dubai, UAE"
              required={false}
            />

            <Field
              label="Topics"
              value={topics}
              onChange={setTopics}
              placeholder="fintech, banking, artificial intelligence"
            />

            <Field
              label="URL"
              value={url}
              onChange={setUrl}
              placeholder="https://example.com"
              required={false}
            />

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-gray-900 outline-none focus:border-gray-400"
              />
            </div>

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
                ? "Adding..."
                : "Add Opportunity"}
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