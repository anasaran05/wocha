"use client";

import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&h=640&fit=crop&q=70&auto=format`;

const SLIDES = [
  {
    src: UNSPLASH("1503342217505-b0a15ec3261c"),
    alt: "Drop-Shoulder Boxy Streetwear Tee in Black",
    title: "Drop-Shoulder Tees",
    subtitle: "Heavyweight Boxy Cut",
    meta: [
      { label: "Fabric", value: "280 GSM Cotton" },
      { label: "Fit", value: "Oversized Boxy" },
      { label: "Available", value: "Live Now" },
    ],
  },
  {
    src: UNSPLASH("1556905055-8f358a7a47b2"),
    alt: "Heavyweight Fleece Hoodie in Off-Black",
    title: "Heavy Hoodies",
    subtitle: "Double-Layer Hood",
    meta: [
      { label: "Fabric", value: "460 GSM Fleece" },
      { label: "Fit", value: "Drop Shoulder" },
      { label: "Available", value: "Live Now" },
    ],
  },
  {
    src: UNSPLASH("1578632767115-351597cf2477"),
    alt: "Cyberpunk Anime Graphic Back Print Tee",
    title: "Anime Art Series",
    subtitle: "Direct-To-Film High Definition",
    meta: [
      { label: "Prints", value: "Anime & Cyber" },
      { label: "Durability", value: "100+ Washes" },
      { label: "Available", value: "Coming Soon" },
    ],
  },
  {
    src: UNSPLASH("1503342394128-c104d54dba01"),
    alt: "Vintage Mineral Washed Oversized T-Shirt",
    title: "Acid Wash Series",
    subtitle: "Custom Hand-Treated Wash",
    meta: [
      { label: "Finish", value: "Mineral Washed" },
      { label: "Feel", value: "Ultra Soft" },
      { label: "Available", value: "Coming Soon" },
    ],
  },
  {
    src: UNSPLASH("1521572267360-ee0c2909d518"),
    alt: "Clean Minimalist Heavy Tee in Chalk White",
    title: "Minimal Blanks",
    subtitle: "Everyday Clean Silhouettes",
    meta: [
      { label: "Fabric", value: "300 GSM Organic" },
      { label: "Collar", value: "Thick 1.25\" Rib" },
      { label: "Available", value: "Live Now" },
    ],
  },
  {
    src: UNSPLASH("1556905055-8f358a7a47b2"),
    alt: "Fleece Zip Hoodie with Custom Silver Pull",
    title: "Zip Hoodies & Outerwear",
    subtitle: "Cold Weather Essentials",
    meta: [
      { label: "Hardware", value: "Silver YKK" },
      { label: "Lining", value: "Brushed Fleece" },
      { label: "Available", value: "Coming Soon" },
    ],
  },
];

export default function CoverflowDemo() {
  return (
    <div className="w-full overflow-hidden bg-background py-6">
      <CoverflowCarousel
        slides={SLIDES}
        showCaption
        showNavigation
        showPagination
        cardWidth="clamp(220px, 24vw, 320px)"
      />
    </div>
  );
}
