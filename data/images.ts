/**
 * Curated Unsplash photography used across the site.
 * All URLs verified live (HTTP 200) at build-authoring time.
 */
export const images = {
  truckHighway: {
    src: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=1600&auto=format&fit=crop",
    alt: "XtoX truck on the highway at dusk",
  },
  loadingDock: {
    src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1600&auto=format&fit=crop",
    alt: "Cargo truck at a loading dock",
  },
  containerCrane: {
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1600&auto=format&fit=crop",
    alt: "Container crane operations at the port",
  },
  warehouse: {
    src: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1600&auto=format&fit=crop",
    alt: "Warehouse aisles with racked pallets",
  },
  warehouseWorker: {
    src: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1600&auto=format&fit=crop",
    alt: "Warehouse associate moving freight",
  },
  movingBoxes: {
    src: "https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?q=80&w=1600&auto=format&fit=crop",
    alt: "Packed moving boxes ready for relocation",
  },
  wheatField: {
    src: "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?q=80&w=1600&auto=format&fit=crop",
    alt: "Golden wheat field at harvest time",
  },
  containersAerial: {
    src: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1600&auto=format&fit=crop",
    alt: "Shipping containers arranged at a terminal",
  },
  truckSunset: {
    src: "https://images.unsplash.com/photo-1565104781149-275a5392dabc?q=80&w=1600&auto=format&fit=crop",
    alt: "Truck driving into the sunset",
  },
  fleetYard: {
    src: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?q=80&w=1600&auto=format&fit=crop",
    alt: "Fleet of trucks parked at the depot",
  },
  vanLoading: {
    src: "https://images.unsplash.com/photo-1526394931762-90052e97b376?q=80&w=1600&auto=format&fit=crop",
    alt: "Worker loading parcels into a delivery van",
  },
} as const;

export type SiteImage = (typeof images)[keyof typeof images];
