"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, initials, truncate } from "@/lib/utils";

export function MessageThreadList({ threads = [], activeThreadId, onSelect }) {
  return (
    <div className="flex h-full flex-col divide-y divide-border-subtle overflow-y-auto">
      {threads.map((thread) => {
        const lastMessage = thread.messages[thread.messages.length - 1];
        const active = thread.id === activeThreadId;
        return (
          <button
            key={thread.id}
            type="button"
            onClick={() => onSelect(thread.id)}
            className={cn(
              "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-muted",
              active && "bg-primary-50 dark:bg-primary-500/10"
            )}
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={thread.contactAvatar} alt={thread.contactName} />
              <AvatarFallback>{initials(thread.contactName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={cn(
                    "truncate text-sm text-foreground",
                    thread.unreadCount > 0 ? "font-semibold" : "font-medium"
                  )}
                >
                  {thread.contactName}
                </p>
                <span className="shrink-0 text-[11px] text-foreground-muted">{thread.lastMessageTime}</span>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <p className="truncate text-xs text-foreground-muted">
                  {lastMessage
                    ? `${lastMessage.from === "me" ? "You: " : ""}${truncate(lastMessage.text, 38)}`
                    : "No messages yet"}
                </p>
                {thread.unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary-600 px-1.5 text-[10px] font-semibold text-white">
                    {thread.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
