const AUTH_IMG = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80";

export function AuthSide({ compact }) {
  return (
    <aside className={`auth-side ${compact ? "is-compact" : ""}`} style={{ "--auth-img": `url('${AUTH_IMG}')` }}>
      <h2>Find a place you&apos;ll love to call home.</h2>
      <ul>
        <li><i className="bi bi-heart-fill" />Save properties and searches across devices</li>
        <li><i className="bi bi-telephone-fill" />Contact sellers and schedule site visits</li>
        <li><i className="bi bi-house-add-fill" />Post your property for free and manage leads</li>
      </ul>
    </aside>
  );
}
