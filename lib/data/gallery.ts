export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  /** "large" tiles span 2 columns and 2 rows in the mosaic grid. */
  size: "large" | "normal";
}

export const communityGallery: GalleryPhoto[] = [
  {
    id: "hanging-white-tee",
    src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/gallery/hanging-white-tee.webp",
    alt: "Plain white heavyweight tee hanging against a raw concrete wall",
    size: "large",
  },
  {
    id: "waterside-oversized",
    src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/gallery/waterside-oversized.webp",
    alt: "Model wearing an oversized charcoal tee by the water",
    size: "normal",
  },
  {
    id: "foliage-white-tee",
    src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/gallery/foliage-white-tee.webp",
    alt: "Model wearing a plain white tee against warm autumn foliage",
    size: "normal",
  },
  {
    id: "color-flatlay",
    src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/gallery/color-flatlay.webp",
    alt: "Flat lay of tees in mustard, bone, sand, and teal laid out in tall grass",
    size: "large",
  },
  {
    id: "street-white-tee",
    src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/gallery/street-white-tee.webp",
    alt: "Model wearing a boxy white tee on a quiet street",
    size: "normal",
  },
  {
    id: "arch-mustard-tee",
    src: "https://pub-2cb32e2648bb4c01902ca5287660394f.r2.dev/gallery/arch-mustard-tee.webp",
    alt: "Model wearing a mustard tee under a sunlit archway",
    size: "normal",
  },
];
