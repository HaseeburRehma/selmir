"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Rotating portrait slider used in the "Über Selmir" section.
 *
 * Autoplays every 5 s with soft cross-fade; arrows and dots let the
 * viewer take manual control. The container is intentionally left
 * un-bordered so it matches the Figma layout — the caller can wrap
 * it in a rounded frame if the surrounding design calls for it.
 */
export type PortraitSlide = { src: string; alt: string };

type Props = {
  slides: PortraitSlide[];
  className?: string;
  aspect?: string;
  autoPlayMs?: number;
};

export default function PortraitSlider({
  slides,
  className = "",
  aspect = "aspect-[4/5]",
  autoPlayMs = 5000,
}: Props) {
  const [i, setI] = useState(0);
  const n = slides.length;

  const next = useCallback(() => setI((x) => (x + 1) % n), [n]);
  const prev = useCallback(() => setI((x) => (x - 1 + n) % n), [n]);

  useEffect(() => {
    if (n < 2 || autoPlayMs <= 0) return;
    const t = setInterval(next, autoPlayMs);
    return () => clearInterval(t);
  }, [n, autoPlayMs, next]);

  if (n === 0) return null;

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`relative w-full overflow-hidden rounded-[24px] ${aspect}`}>
        {slides.map((s, idx) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            fill
            sizes="(max-width: 1024px) 90vw, 440px"
            className={`object-cover object-center transition-opacity duration-700 ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
            priority={idx === 0}
          />
        ))}

        {/* prev / next */}
        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Vorheriges Bild"
              onClick={prev}
              className="group absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-all hover:bg-black/70 sm:left-4 sm:size-11"
            >
              <ChevronLeft className="size-5 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              aria-label="Nächstes Bild"
              onClick={next}
              className="group absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-all hover:bg-black/70 sm:right-4 sm:size-11"
            >
              <ChevronRight className="size-5 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* dots */}
            <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2">
              {slides.map((s, idx) => (
                <button
                  key={s.src}
                  type="button"
                  aria-label={`Bild ${idx + 1} anzeigen`}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? "w-6 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
