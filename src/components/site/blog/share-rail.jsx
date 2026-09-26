"use client";

import { toast } from "sonner";

export function ShareLinks({ title, inline }) {
  function handleCopy() {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast.success("Link copied"));
    else toast.success("Link copied");
  }

  const [url, text] = typeof window !== "undefined" ? [encodeURIComponent(window.location.href), encodeURIComponent(title)] : ["", ""];

  return (
    <>
      {inline && <span>Share</span>}
      <a className="share-btn is-wa" href={`https://wa.me/?text=${text}%20${url}`} target="_blank" rel="noopener" aria-label="Share on WhatsApp"><i className="bi bi-whatsapp" /></a>
      <a className="share-btn is-fb" href={`https://www.facebook.com/sharer/sharer.php?u=${url}`} target="_blank" rel="noopener" aria-label="Share on Facebook"><i className="bi bi-facebook" /></a>
      <a className="share-btn is-x" href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`} target="_blank" rel="noopener" aria-label="Share on X"><i className="bi bi-twitter-x" /></a>
      <a className="share-btn is-in" href={`https://www.linkedin.com/sharing/share-offsite/?url=${url}`} target="_blank" rel="noopener" aria-label="Share on LinkedIn"><i className="bi bi-linkedin" /></a>
      <button type="button" className="share-btn" aria-label="Copy link" onClick={handleCopy}><i className="bi bi-link-45deg" /></button>
    </>
  );
}
