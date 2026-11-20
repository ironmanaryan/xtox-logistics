/**
 * Local, optimised photography (served through next/image).
 * Files live in /public/images. Replace with your own shoot when available.
 *
 * Source: Unsplash License (free for commercial use, no attribution required).
 */
export const images = {
  truckHighway: {
    src: "/images/truck-highway.jpg",
    alt: "Long-haul truck driving on an Indian highway at dusk",
  },
  loadingDock: {
    src: "/images/loading-dock.jpg",
    alt: "Cargo truck backed into a loading dock",
  },
  containerCrane: {
    src: "/images/container-crane.jpg",
    alt: "Container crane lifting freight at a port terminal",
  },
  warehouse: {
    src: "/images/warehouse.jpg",
    alt: "Warehouse aisles lined with racked pallets",
  },
  warehouseWorker: {
    src: "/images/warehouse-worker.jpg",
    alt: "Warehouse associate moving freight with a pallet truck",
  },
  movingBoxes: {
    src: "/images/moving-boxes.jpg",
    alt: "Packed and labelled moving boxes ready for relocation",
  },
  wheatField: {
    src: "/images/wheat-field.jpg",
    alt: "Golden wheat field ready for harvest",
  },
  containersAerial: {
    src: "/images/containers-aerial.jpg",
    alt: "Shipping containers stacked at an export terminal",
  },
  truckSunset: {
    src: "/images/truck-sunset.jpg",
    alt: "Freight truck on an open road at sunset",
  },
  fleetYard: {
    src: "/images/fleet-yard.jpg",
    alt: "Fleet of trucks parked at a logistics depot",
  },
  vanLoading: {
    src: "/images/van-loading.jpg",
    alt: "Worker loading parcels into a delivery van",
  },
} as const;

export type SiteImage = (typeof images)[keyof typeof images];
