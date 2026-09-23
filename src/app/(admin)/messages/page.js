"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/page-header";
import { Card } from "@/components/ui/card";
import { MessageThreadList } from "@/components/messages/MessageThreadList";
import { MessageThreadView } from "@/components/messages/MessageThreadView";
import { MESSAGE_THREADS } from "@/data/message-threads";

export default function MessagesPage() {
  const [threads, setThreads] = useState(MESSAGE_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(MESSAGE_THREADS[0]?.id ?? null);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [threads, activeThreadId]
  );

  function handleSelect(threadId) {
    setActiveThreadId(threadId);
    setThreads((prev) =>
      prev.map((thread) => (thread.id === threadId ? { ...thread, unreadCount: 0 } : thread))
    );
  }

  function handleSendMessage(threadId, text) {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== threadId) return thread;
        const newMessage = {
          id: `${thread.id}-m${thread.messages.length + 1}`,
          from: "me",
          text,
          time: "Just now",
        };
        return { ...thread, messages: [...thread.messages, newMessage], lastMessageTime: "Just now" };
      })
    );
    toast.success("Message sent");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Messages" subtitle="Communicate with leads, agents and developers." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
        <Card className="h-[70vh] animate-fade-in overflow-hidden">
          <MessageThreadList threads={threads} activeThreadId={activeThreadId} onSelect={handleSelect} />
        </Card>
        <Card className="h-[70vh] animate-fade-in overflow-hidden">
          <MessageThreadView thread={activeThread} onSendMessage={handleSendMessage} />
        </Card>
      </div>
    </div>
  );
}
