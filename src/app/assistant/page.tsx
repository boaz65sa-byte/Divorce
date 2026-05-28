"use client";

import { useState } from "react";
import { Button, PageHeader } from "@/components/ui";
import { searchAssistant, suggestedQuestions } from "@/lib/assistant/search";
import type { ChatMessage } from "@/lib/types";

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "שלום! אני העוזר של \"תגרשן לי\". שאל/י על גירושין, מזונות, רכוש, משמורת או הליכים — אענה על בסיס מאגר הידע באפליקציה.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = (question: string) => {
    if (!question.trim()) return;
    setLoading(true);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question.trim(),
    };

    const result = searchAssistant(question);
    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: result.answer,
      sources: result.sources,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        title="עוזר חכם"
        subtitle="מבוסס מאגר ידע — לא ייעוץ משפטי ולא AI חיצוני"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => ask(q)}
            className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs text-brand-800 transition hover:bg-brand-100"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="mb-4 max-h-[50vh] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 text-slate-800"
              }`}
            >
              <p>{msg.content}</p>
              {msg.sources && msg.sources.length > 0 && (
                <p className="mt-2 text-xs opacity-70">
                  מקור: {msg.sources.join(" · ")}
                </p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-center text-sm text-slate-400">מחפש תשובה...</p>
        )}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="שאל/י שאלה..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          שלח
        </Button>
      </form>
    </div>
  );
}
