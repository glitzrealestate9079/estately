// Curated Unsplash photo pool, grouped so mock data can pick a fitting,
// non-repeating image per property/project/card instead of one reused shot.
const u = (id) => `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

export const APARTMENT_IMAGES = [
  u("photo-1522708323590-d24dbb6b0267"),
  u("photo-1502672260266-1c1ef2d93688"),
  u("photo-1600607687939-ce8a6c25118c"),
  u("photo-1600585154340-be6161a56a0c"),
  u("photo-1512917774080-9991f1c4c750"),
];

export const VILLA_IMAGES = [
  u("photo-1613977257363-707ba9348227"),
  u("photo-1600585154526-990dced4db0d"),
  u("photo-1512918728675-ed5a9ecdebfd"),
  u("photo-1560184897-ae75f418493e"),
  u("photo-1568605114967-8130f3a36994"),
];

export const INTERIOR_IMAGES = [
  u("photo-1560518883-ce09059eeffa"),
  u("photo-1600596542815-ffad4c1539a9"),
  u("photo-1583608205776-bfd35f0d9f83"),
  u("photo-1584622650111-993a426fbf0a"),
  u("photo-1518481612222-68bbe828ecd1"),
];

export const COMMERCIAL_IMAGES = [
  u("photo-1486406146926-c627a92ad1ab"),
  u("photo-1497366216548-37526070297c"),
  u("photo-1541888946425-d81bb19240f5"),
  u("photo-1487958449943-2429e8be8625"),
];

export const PLOT_IMAGES = [
  u("photo-1500382017468-9049fed747ef"),
  u("photo-1560472354-b33ff0c44a43"),
  u("photo-1449157291145-7efd050a4d0e"),
];

export const SKYLINE_IMAGES = [
  u("photo-1449844908441-8829872d2607"),
  u("photo-1605146769289-440113cc3d00"),
  u("photo-1523217582562-09d0def993a6"),
];

const CATEGORY_MAP = {
  Apartment: APARTMENT_IMAGES,
  Villa: VILLA_IMAGES,
  "Independent House": VILLA_IMAGES,
  Plot: PLOT_IMAGES,
  Commercial: COMMERCIAL_IMAGES,
  "Office Space": COMMERCIAL_IMAGES,
  "PG / Co-living": INTERIOR_IMAGES,
  Farmhouse: VILLA_IMAGES,
};

export function imageForProperty(type, index = 0) {
  const pool = CATEGORY_MAP[type] ?? APARTMENT_IMAGES;
  return pool[index % pool.length];
}

export function imageForProject(index = 0) {
  const pool = [...SKYLINE_IMAGES, ...APARTMENT_IMAGES, ...VILLA_IMAGES];
  return pool[index % pool.length];
}

export function imageForCity(index = 0) {
  const pool = [...SKYLINE_IMAGES, ...VILLA_IMAGES, ...APARTMENT_IMAGES];
  return pool[index % pool.length];
}
