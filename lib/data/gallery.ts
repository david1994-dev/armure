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
    src: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=900&auto=format&fit=crop&q=80",
    alt: "Plain white heavyweight tee hanging against a raw concrete wall",
    size: "large",
  },
  {
    id: "waterside-oversized",
    src: "https://images.unsplash.com/photo-1719513686539-a4c4e9ffbc1c?w=700&auto=format&fit=crop&q=80",
    alt: "Model wearing an oversized charcoal tee by the water",
    size: "normal",
  },
  {
    id: "foliage-white-tee",
    src: "https://images.unsplash.com/photo-1646176724329-8a12512df18b?w=700&auto=format&fit=crop&q=80",
    alt: "Model wearing a plain white tee against warm autumn foliage",
    size: "normal",
  },
  {
    id: "color-flatlay",
    src: "https://images.unsplash.com/photo-1600265359911-0ecb096537c7?w=900&auto=format&fit=crop&q=80",
    alt: "Flat lay of tees in mustard, bone, sand, and teal laid out in tall grass",
    size: "large",
  },
  {
    id: "street-white-tee",
    src: "https://images.unsplash.com/photo-1672603145592-f013b5ff29bd?w=700&auto=format&fit=crop&q=80",
    alt: "Model wearing a boxy white tee on a quiet street",
    size: "normal",
  },
  {
    id: "arch-mustard-tee",
    src: "https://images.unsplash.com/photo-1665873880222-c20b98ae1bf8?w=700&auto=format&fit=crop&q=80",
    alt: "Model wearing a mustard tee under a sunlit archway",
    size: "normal",
  },
];
