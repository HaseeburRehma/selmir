import { Marquee } from "@/components/ui/Marquee";

// Curated event photos (removed: bearded-networking + red-room mic shots)
const PHOTOS = [
  "/gallery/g1.jpg",
  "/gallery/g2.jpg",
  "/gallery/g4.jpg",
  "/gallery/g5.jpg",
];

function Photo({ src }: { src: string }) {
  return (
    <div className="h-[260px] w-[400px] shrink-0 overflow-hidden rounded-2xl md:h-[320px] md:w-[520px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Sales Mastery Days — Impressionen"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default function GallerySection() {
  return (
    <section id="gallery" className="overflow-hidden bg-bg py-16 md:py-24">
      <Marquee gap={24} speed="marquee-slow">
        {PHOTOS.map((src, i) => (
          <Photo key={i} src={src} />
        ))}
      </Marquee>
    </section>
  );
}
