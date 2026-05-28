import { faqEntries } from "@/data/faq";
import { knowledgeTopics } from "@/data/knowledge";

export interface SearchResult {
  answer: string;
  sources: string[];
  confidence: "high" | "medium" | "low";
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\u0590-\u05FFa-z0-9\s]/g, " ");
}

function scoreText(query: string, text: string, keywords: string[] = []): number {
  const q = normalize(query);
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (words.length === 0) return 0;

  const normalizedText = normalize(text);
  let score = 0;

  for (const word of words) {
    if (normalizedText.includes(word)) score += 2;
    for (const kw of keywords) {
      if (normalize(kw).includes(word)) score += 3;
    }
  }

  if (normalizedText.includes(q)) score += 5;
  return score;
}

export function searchAssistant(query: string): SearchResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      answer: "שאל/י שאלה בנושא גירושין, מזונות, רכוש, משמורת או הליכים.",
      sources: [],
      confidence: "low",
    };
  }

  let bestFaq = { entry: faqEntries[0], score: 0 };
  for (const entry of faqEntries) {
    const score =
      scoreText(trimmed, entry.question, entry.keywords) +
      scoreText(trimmed, entry.answer, entry.keywords);
    if (score > bestFaq.score) {
      bestFaq = { entry, score };
    }
  }

  let bestTopic = { topic: knowledgeTopics[0], score: 0 };
  for (const topic of knowledgeTopics) {
    const contentScore = topic.content.reduce(
      (sum, p) => sum + scoreText(trimmed, p, topic.tags),
      0,
    );
    const score =
      scoreText(trimmed, topic.title, topic.tags) +
      scoreText(trimmed, topic.summary, topic.tags) +
      contentScore;
    if (score > bestTopic.score) {
      bestTopic = { topic, score };
    }
  }

  const faqWins = bestFaq.score >= bestTopic.score && bestFaq.score >= 3;

  if (faqWins) {
    const sources = [bestFaq.entry.question];
    if (bestFaq.entry.topicId) {
      const topic = knowledgeTopics.find((t) => t.id === bestFaq.entry.topicId);
      if (topic) sources.push(topic.title);
    }
    return {
      answer: bestFaq.entry.answer,
      sources,
      confidence: bestFaq.score >= 8 ? "high" : "medium",
    };
  }

  if (bestTopic.score >= 3) {
    const relevantParagraph = bestTopic.topic.content.find(
      (p) => scoreText(trimmed, p) > 0,
    );
    return {
      answer:
        relevantParagraph ??
        `${bestTopic.topic.summary}\n\n${bestTopic.topic.content[0]}`,
      sources: [bestTopic.topic.title],
      confidence: bestTopic.score >= 8 ? "high" : "medium",
    };
  }

  return {
    answer:
      "לא מצאתי תשובה מדויקת במאגר. מומלץ לעיין ב\"מה החוק אומר\" או להתייעץ עם עורך/ת דין. נסה/י לנסח אחרת — למשל: \"מזונות ילדים גיל 6\", \"יישוב סכסוך\", \"חלוקת רכוש\".",
    sources: [],
    confidence: "low",
  };
}

export const suggestedQuestions = [
  "האם חייבים יישוב סכסוך?",
  "מי משלם מזונות עד גיל 6?",
  "מה זה 919/15?",
  "איך מחלקים רכוש?",
  "מה זה קצבת מזונות מביטוח לאומי?",
];
