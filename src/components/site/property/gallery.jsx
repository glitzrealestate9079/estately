"use client";

import { useState } from "react";

function galleryStyle(count) {
  if (count === 1) return { gridTemplateColumns: "1fr", gridTemplateRows: "440px" };
  if (count < 5) return { gridTemplateColumns: "2fr 1fr", gridTemplateRows: `repeat(${count - 1}, ${Math.floor(428 / (count - 1))}px)` };
  return undefined;
}

// Ported from the prototype's gallery markup in property-view.js + its
// lightbox() helper in app.js.
export function PropertyGallery({ images, title, verifiedBadges }) {
  const [lightbox, setLightbox] = useState(null);
  const shown = images.slice(0, 5);

  return (
    <>
      <div className="gallery" style={galleryStyle(shown.length)}>
        {shown.map((src, i) => (
          <button key={i} data-g={i} aria-label={`Open photo ${i + 1}`} onClick={() => setLightbox(i)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${title} photo ${i + 1}`} loading={i ? "lazy" : undefined} />
          </button>
        ))}
        {verifiedBadges?.length > 0 && (
          <div className="gallery-tags">
            {verifiedBadges.map((v) => (
              <span key={v} className="badge" style={{ background: "#fff" }}><i className="bi bi-patch-check-fill text-success" />{v}</span>
            ))}
          </div>
        )}
        {images.length > 1 && (
          <button type="button" className="btn btn-outline btn-sm gallery-all" onClick={() => setLightbox(0)}>
            <i className="bi bi-grid-3x3-gap" />View all {images.length} photos
          </button>
        )}
      </div>

      <div className="gallery-mobile">
        <div className="track">
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt={`Photo ${i + 1}`} loading={i ? "lazy" : undefined} onClick={() => setLightbox(i)} />
          ))}
        </div>
        <span className="badge badge-dark counter"><i className="bi bi-camera" /><span>{(lightbox ?? 0) + 1}</span> / {images.length}</span>
      </div>

      {lightbox !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${title} photos`}>
          <div className="lightbox-top">
            <span>{lightbox + 1} / {images.length}</span>
            <button className="modal-x" aria-label="Close" onClick={() => setLightbox(null)}><i className="bi bi-x-lg" /></button>
          </div>
          <div className="lightbox-stage">
            <button className="lightbox-nav prev" aria-label="Previous photo" onClick={() => setLightbox((lightbox - 1 + images.length) % images.length)}>
              <i className="bi bi-chevron-left" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[lightbox]} alt={`${title} photo ${lightbox + 1}`} />
            <button className="lightbox-nav next" aria-label="Next photo" onClick={() => setLightbox((lightbox + 1) % images.length)}>
              <i className="bi bi-chevron-right" />
            </button>
          </div>
          <div className="lightbox-thumbs">
            {images.map((src, i) => (
              <button key={i} className={i === lightbox ? "is-active" : ""} onClick={() => setLightbox(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
