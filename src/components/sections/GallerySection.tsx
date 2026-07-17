import { Marquee } from "@/components/ui/Marquee";

const ROW_A = [
  "/gallery/g1.jpg",
  "/gallery/g2.jpg",
  "/gallery/g3.jpg",
  "/gallery/g4.jpg",
  "/gallery/g5.jpg",
  "/gallery/g6.jpg",
];
const ROW_B = [
  "/gallery/g4.jpg",
  "/gallery/g6.jpg",
  "/gallery/g2.jpg",
  "/gallery/g5.jpg",
  "/gallery/g1.jpg",
  "/gallery/g3.jpg",
];

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
