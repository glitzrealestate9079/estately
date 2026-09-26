export function OptCard({ icon, title, description, selected, onClick, large, row }) {
  return (
    <button
      type="button"
      className={`opt-card ${large ? "opt-card-lg" : ""} ${row ? "opt-card-row" : ""} ${selected ? "is-selected" : ""}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      <span className="opt-ico"><i className={`bi ${icon}`} /></span>
      <span>
        <span className="opt-title">{title}</span>
        {description && (
          <>
            <br /><span className="opt-desc">{description}</span>
          </>
        )}
      </span>
    </button>
  );
}
