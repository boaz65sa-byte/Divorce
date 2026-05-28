import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { knowledgeTopics } from "@/data/knowledge";

export function generateStaticParams() {
  return knowledgeTopics.map((topic) => ({ id: topic.id }));
}

export default async function KnowledgeTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = knowledgeTopics.find((t) => t.id === id);

  if (!topic) notFound();

  return (
    <div>
      <Link
        href="/knowledge"
        className="mb-4 inline-block text-sm text-brand-700"
      >
        ← חזרה לידע
      </Link>

      <PageHeader title={topic.title} subtitle={topic.summary} />

      <div className="flex flex-wrap gap-2">
        {topic.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <ul className="mt-6 space-y-4">
        {topic.content.map((paragraph, index) => (
          <li
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-4 text-slate-700 leading-relaxed"
          >
            {paragraph}
          </li>
        ))}
      </ul>
    </div>
  );
}
