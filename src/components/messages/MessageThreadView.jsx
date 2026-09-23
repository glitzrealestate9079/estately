"use client";

import { useEffect, useRef, useState } from "react";
import { MessagesSquare, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { cn, initials } from "@/lib/utils";

export function MessageThreadView({ thread, onSendMessage }) {
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [thread?.id, thread?.messages?.length]);

  if (!thread) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={MessagesSquare}
          title="Select a conversation"
          description="Choose a thread from the list to view messages and reply."
        />
      </div>
    );
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(thread.id, trimmed);
    setText("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border-subtle px-5 py-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={thread.contactAvatar} alt={thread.contactName} />
          <AvatarFallback>{initials(thread.contactName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{thread.contactName}</p>
          <p className="text-xs text-foreground-muted">Active conversation</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {thread.messages.map((message) => (
          <div key={message.id} className={cn("flex", message.from === "me" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                message.from === "me"
                  ? "rounded-br-sm bg-primary-600 text-white"
                  : "rounded-bl-sm bg-surface-muted text-foreground"
              )}
            >
              <p className="whitespace-pre-wrap break-words">{message.text}</p>
              <p
                className={cn(
                  "mt-1 text-[10px]",
                  message.from === "me" ? "text-primary-100" : "text-foreground-muted"
                )}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex w-full items-center gap-2 border-t border-border-subtle px-4 py-3">
        <Input
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button size="icon" onClick={handleSend} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
