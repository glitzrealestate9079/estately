export function Field({ label, error, hint, optional, span, children }) {
  return (
    <div className={`field ${span ? "span-2" : ""} ${error ? "is-invalid" : ""}`}>
      <span className="label">{label}{optional && <span className="opt"> (optional)</span>}</span>
      {children}
      {error ? (
        <span className="error-text"><i className="bi bi-exclamation-circle" />{error}</span>
      ) : (
        hint && <span className="hint">{hint}</span>
      )}
    </div>
  );
}
