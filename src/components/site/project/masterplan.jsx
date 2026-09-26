// Simplified port of the prototype's masterplanHtml() in project.js — the
// township-specific multi-phase/multi-project grouping is dropped (no real
// data models a township hierarchy), leaving one project's towers laid out
// directly, which is the common case anyway.
export function Masterplan({ towerNames, unitTypeNames }) {
  return (
    <div className="mp">
      <div className="mp-site">
        <span className="mp-amen is-park"><i className="bi bi-tree" />Central park</span>
        <span className="mp-amen is-club"><i className="bi bi-cup-hot" />Clubhouse</span>
        <span className="mp-entry"><i className="bi bi-signpost-2" />Main entry</span>
      </div>
      <div className="mp-road" aria-hidden="true" />
      <div className="mp-groups">
        <div className="mp-phase">
          <div className="mp-proj">
            <div className="mp-towers">
              {towerNames.map((name) => (
                <div key={name} className="tower" aria-label={name}>
                  <i className="bi bi-building" />
                  <span className="tw-n">{name}</span>
                  <span className="tw-s">{unitTypeNames}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
