import { Marquee } from "@/components/ui/Marquee";

// Curated event photos (removed: bearded-networking + red-room mic shots)
const PHOTOS = [
  "/gallery/g1.jpg",
  "/gallery/g2.jpg",
  "/gallery/g4.jpg",
  "/gallery/g5.jpg",
];

const ROW_A = [...PHOTOS, ...PHOTOS];
const ROW_B = [...[...PHOTOS].reverse(), ...[...PHOTOS].reverse()];

function Photo({ src }: { src: string }) {
  return (
    <div className="h-[200px] shrink-0 overflow-hidden rounded-2xl md:h-[260px]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Sales Mastery Days — Impressionen"
        loading="lazy"
        className="h-full w-auto max-w-none object-cover"
      />
    </div>
  );
}

export default function GallerySection() {
  return (
    <section id="gallery" className="overflow-hidden bg-bg py-16 md:py-24">
      <div className="flex flex-col gap-4 md:gap-6">
        <Marquee gap={24} speed="marquee-slow">
          {ROW_A.map((src, i) => (
            <Photo key={`a-${i}`} src={src} />
          ))}
        </Marquee>
        <Marquee gap={24} speed="marquee-slow" reverse>
          {ROW_B.map((src, i) => (
            <Photo key={`b-${i}`} src={src} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
