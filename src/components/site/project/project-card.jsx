"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSite } from "@/components/site/providers/site-provider";
import { inr, num } from "@/lib/site/template/format";

const STATUS_BADGE = {
  "New Launch": "badge-purple",
  Upcoming: "badge-info",
  "Under Construction": "badge-warning",
  "Ready to Move": "badge-success",
};

function SaveButton({ id }) {
  const { mounted, savedIds, toggleSave } = useSite();
  const router = useRouter();
  const isSaved = mounted && savedIds.includes(id);
  return (
    <button
      type="button"
      className={`save-btn ${isSaved ? "is-saved" : ""}`}
      aria-label={isSaved ? "Remove from saved" : "Save project"}
      aria-pressed={isSaved}
      onClick={(e) => {
        e.preventDefault();
        toggleSave(id);
        if (isSaved) {
          toast("Removed from saved", { action: { label: "Undo", onClick: () => toggleSave(id) } });
        } else {
          toast.success("Saved to your shortlist", { action: { label: "View saved", onClick: () => router.push("/saved") } });
        }
      }}
    >
      <i className="bi bi-heart" />
    </button>
  );
}

function ReraTag({ rera, pill }) {
  if (rera) {
    return (
      <span className={pill ? "rera-pill" : "rera-tag"} title="RERA registration no., as provided by the developer">
        <span className={pill ? "rp-k" : "rera-k"}><i className="bi bi-shield-check" />RERA</span>
        <span className={pill ? "rp-v" : "rera-v"}>{rera}</span>
      </span>
    );
  }
  return (
    <span className={`${pill ? "rera-pill" : "rera-tag"} is-awaited`}>
      <span className={pill ? "rp-k" : "rera-k"}><i className="bi bi-hourglass-split" />RERA</span>
      <span className={pill ? "rp-v" : "rera-v"}>{pill ? "Registration awaited" : "Awaited"}</span>
    </span>
  );
}

// Ported from the prototype's projectCard() in app.js, fed by
// toTemplateProject() instead of the prototype's own mock data shape.
export function ProjectCard({ project, layout }) {
  const list = layout === "list";
  const p = project;
  const href = `/project/${p.slug}`;
  const badge = STATUS_BADGE[p.status];
  const locLine = `${p.loc}, ${p.city}`;
  const configLabel = `${p.bhk.join(", ")} BHK ${p.ptype === "Villa" ? "Villas" : "Apartments"}`;

  if (!list) {
    return (
      <article className="pcard pcard-project" data-id={p.id}>
        <Link className="pcard-link" href={href} tabIndex={-1} aria-hidden="true" />
        <div className="pcard-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" src={p.images[0]} alt={p.name} />
          <div className="pcard-tl"><span className={`badge ${badge} badge-sm`}>{p.status}</span></div>
          <SaveButton id={p.id} />
          <div className="pcard-ov"><div className="ov-text"><ReraTag rera={p.rera} /></div></div>
        </div>
        <div className="pcard-body">
          <div>
            <h3 className="pcard-title"><Link href={href}>{p.name}</Link></h3>
            <div className="pcard-loc mt-4"><i className="bi bi-geo-alt" />{locLine}</div>
            <div className="xs muted mt-4">by <b className="ink">{p.developer}</b></div>
          </div>
          <div className="pcard-price"><span className="price">{inr(p.minPrice)} onwards</span></div>
          <div className="pcard-facts">
            <span>{configLabel}</span>
            <span>Possession: {p.possession}</span>
          </div>
          <div className="pcard-foot">
            <span><i className="bi bi-buildings" />{p.ptype === "Villa" ? "Villas" : `${p.towers} towers`}</span>
            <span>{p.units} units · {p.acres} acres</span>
          </div>
          <div className="pcard-reveal">
            <Link className="btn btn-primary btn-sm" href={href}>View project<i className="bi bi-arrow-right" /></Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`pcard ${list ? "is-list" : ""}`} data-id={p.id}>
      <div className="pcard-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="lazy" src={p.images[0]} alt={p.name} />
        <div className="pcard-tl"><span className={`badge ${badge} badge-sm`}>{p.status}</span></div>
        <SaveButton id={p.id} />
      </div>
      <div className="pcard-body">
        <div className="pcard-top">
          <div className="pcard-head">
            <h3 className="pcard-title"><Link href={href}>{p.name}</Link></h3>
            <div className="pcard-loc mt-4"><i className="bi bi-geo-alt-fill" />{locLine}</div>
            <div className="xs muted mt-4">by <b className="ink">{p.developer}</b></div>
          </div>
          <div className="pcard-price">
            <div><span className="price">{inr(p.minPrice)}</span><span className="suffix">onwards</span></div>
            <span className="per">up to {inr(p.maxPrice)}</span>
          </div>
        </div>
        <div className="pcard-kv">
          <div><div className="k">Configuration</div><div className="v">{p.bhk.join(", ")} BHK {p.ptype === "Villa" ? <small>Villas</small> : null}</div></div>
          <div><div className="k">Possession</div><div className="v">{p.possession}</div></div>
          <div><div className="k">Sizes</div><div className="v">{num(p.sizes[0])}–{num(p.sizes[1])} <small>sq.ft</small></div></div>
        </div>
        <div><ReraTag rera={p.rera} pill /></div>
        <div className="pcard-foot">
          <span className="xs">{p.units} units · {p.acres} acres</span>
          <div className="pcard-actions">
            <button type="button" className="btn btn-outline btn-sm btn-contact"><i className="bi bi-chat-left-text" />Enquire</button>
            <Link className="btn btn-primary btn-sm" href={href}>View project<i className="bi bi-arrow-right" /></Link>
          </div>
        </div>
      </div>
    </article>
  );
}
