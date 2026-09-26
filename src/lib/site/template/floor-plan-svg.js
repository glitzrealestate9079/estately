// Ported from the prototype's floorPlanSvg() in property-view.js — pure
// function of bhk/bathrooms/area (or plot dims), no external data needed.
export function floorPlanSvg(p) {
  if (p.cat === "plot") {
    const dims = p.dims ?? "Irregular";
    const match = dims.match(/[\d.]+/g);
    const [w, h] = match ? match.map(Number) : [40, 60];
    const irregular = dims === "Irregular";
    return `<svg viewBox="0 0 520 340" role="img" aria-label="Plot sketch"><rect x="0" y="290" width="520" height="50" fill="#d8dee7"/><text x="260" y="320" text-anchor="middle" font-size="13" fill="#475467" font-family="DM Sans">${p.roadWidth} ft road</text>
      ${irregular ? '<path d="M110 40 L400 20 L430 270 L90 280 Z" fill="#e7f0dc" stroke="#6b8f47" stroke-width="2" stroke-dasharray="6 4"/>' : '<rect x="150" y="30" width="220" height="250" fill="#e7f0dc" stroke="#6b8f47" stroke-width="2"/>'}
      <text x="260" y="150" text-anchor="middle" font-size="16" font-weight="700" fill="#344054" font-family="Manrope">${p.orig.value.toLocaleString("en-IN")} ${p.orig.unit}</text><text x="260" y="172" text-anchor="middle" font-size="12" fill="#667085" font-family="DM Sans">${irregular ? "Irregular shape" : dims}</text>
      ${!irregular ? `<text x="260" y="22" text-anchor="middle" font-size="11" fill="#667085">${w} ft</text><text x="140" y="160" text-anchor="end" font-size="11" fill="#667085">${h}</text>` : ""}
      <text x="480" y="40" font-size="12" fill="#667085" text-anchor="middle">N</text><path d="M480 46 l-6 16 h12z" fill="#667085"/></svg>`;
  }
  const bhk = p.bhk || 2;
  const baths = p.bathrooms || 2;
  const rooms = [
    `<rect x="10" y="10" width="200" height="190" /><text x="110" y="100">Living / Dining</text><text x="110" y="118" class="d">16&#8242; &times; 14&#8242;</text>`,
    `<rect x="10" y="200" width="200" height="110" /><text x="110" y="250">Kitchen</text><text x="110" y="268" class="d">10&#8242; &times; 8&#8242;</text>`,
  ];
  const bw = 300 / bhk;
  for (let i = 0; i < bhk; i++) {
    rooms.push(
      `<rect x="${210 + i * bw}" y="10" width="${bw}" height="190" /><text x="${210 + i * bw + bw / 2}" y="100">${i === 0 ? "Master Bed" : `Bed ${i + 1}`}</text><text x="${210 + i * bw + bw / 2}" y="118" class="d">${i === 0 ? "13&#8242; &times; 12&#8242;" : "11&#8242; &times; 10&#8242;"}</text>`
    );
  }
  const bottom = [...Array.from({ length: Math.min(baths, 3) }, (_, i) => `Bath ${i + 1}`), "Balcony"];
  const w2 = 300 / bottom.length;
  bottom.forEach((r, i) => {
    rooms.push(
      `<rect x="${210 + i * w2}" y="200" width="${w2}" height="110" ${r === "Balcony" ? 'style="fill:#eef4fd"' : ""}/><text x="${210 + i * w2 + w2 / 2}" y="258">${r}</text>`
    );
  });
  return `<svg viewBox="0 0 520 320" role="img" aria-label="Indicative floor plan"><style>rect{fill:#fff;stroke:#344054;stroke-width:2}text{font:600 12.5px 'DM Sans',sans-serif;fill:#344054;text-anchor:middle}.d{font-weight:500;font-size:11px;fill:#667085}</style>${rooms.join("")}</svg>`;
}
