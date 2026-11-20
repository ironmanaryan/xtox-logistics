export interface City {
  slug: string;
  name: string;
  state: string;
  /** Rough one-way road distance from Bengaluru, km. Used for indicative copy only. */
  fromBengaluruKm: number;
  blurb: string;
  areas: string[];
}

export const cities: City[] = [
  {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    fromBengaluruKm: 0,
    blurb:
      "Our home base — same-day surveys and next-day pickups across BTM, HSR, Whitefield, Indiranagar and the ORR tech belt.",
    areas: ["BTM Layout", "HSR Layout", "Whitefield", "Indiranagar", "Electronic City", "Yelahanka"],
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    fromBengaluruKm: 575,
    blurb:
      "A dense IT corridor move on the Bengaluru–Hyderabad lane, usually a single overnight drive on the NH44 route.",
    areas: ["HITEC City", "Gachibowli", "Kukatpally", "Banjara Hills", "Secunderabad"],
  },
  {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    fromBengaluruKm: 350,
    blurb:
      "Short-haul intercity moves and part-load freight, with regular departures through Hosur and Krishnagiri.",
    areas: ["OMR", "T. Nagar", "Velachery", "Anna Nagar", "Guindy"],
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    fromBengaluruKm: 985,
    blurb:
      "Long-haul household and office moves; building access, lift dimensions and society NOCs are checked before the move date.",
    areas: ["Andheri", "Powai", "Thane", "Navi Mumbai", "Bandra"],
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    fromBengaluruKm: 840,
    blurb:
      "A common lane for relocating employees between the two tech hubs, with shared-load options for smaller homes.",
    areas: ["Hinjewadi", "Kharadi", "Baner", "Kothrud", "Viman Nagar"],
  },
  {
    slug: "delhi",
    name: "Delhi NCR",
    state: "Delhi",
    fromBengaluruKm: 2150,
    blurb:
      "Our longest domestic corridor — typically a 4–6 day transit with a dedicated vehicle and daily position updates.",
    areas: ["Gurugram", "Noida", "Dwarka", "Saket", "Rohini"],
  },
  {
    slug: "kochi",
    name: "Kochi",
    state: "Kerala",
    fromBengaluruKm: 545,
    blurb:
      "Coastal and hill-route moves handled by crews used to narrow access roads, with optional storage in transit.",
    areas: ["Kakkanad", "Edappally", "Fort Kochi", "Aluva"],
  },
  {
    slug: "coimbatore",
    name: "Coimbatore",
    state: "Tamil Nadu",
    fromBengaluruKm: 360,
    blurb:
      "A steady SME freight lane for textiles and engineering goods, plus household shifts on the same route.",
    areas: ["Peelamedu", "RS Puram", "Gandhipuram", "Saravanampatti"],
  },
];

export interface Corridor {
  from: City;
  to: City;
  slug: string;
}

/** Ordered pairs, both directions, used for static generation. */
export const corridors: Corridor[] = cities.flatMap((from) =>
  cities
    .filter((to) => to.slug !== from.slug)
    .map((to) => ({ from, to, slug: `${from.slug}-to-${to.slug}` }))
);

export function corridorDistance(from: City, to: City): number {
  if (from.slug === "bengaluru") return to.fromBengaluruKm;
  if (to.slug === "bengaluru") return from.fromBengaluruKm;
  // Fall back to the longer of the two legs via Bengaluru.
  return Math.round((from.fromBengaluruKm + to.fromBengaluruKm) * 0.9);
}
