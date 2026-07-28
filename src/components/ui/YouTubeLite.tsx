"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeLiteProps {
  videoId: string;
  title?: string;
  className?: string;
  /** called when the user starts the video */
  onPlay?: () => void;
}

/**
 * Lightweight YouTube embed: renders the thumbnail + play button and only
 * loads the actual iframe on click (keeps the page fast with many videos).
 */
export function YouTubeLite({
  videoId,
  title = "Video",
  className = "",
  onPlay,
}: YouTubeLiteProps) {
  const [playing, setPlaying] = useState(false);
  // maxresdefault is the only 16:9 still (1280x720) — it fills the frame without
  // cropping. Not every upload has one, so fall back to hqdefault (4:3, always
  // present) if it 404s.
  const [thumb, setThumb] = useState(
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  );

  return (
    <div className={`relative aspect-video w-full overflow-hidden ${className}`}>
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            onPlay?.();
          }}
          aria-label={`Video abspielen – ${title}`}
          className="group absolute inset-0 h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            onError={() =>
              setThumb(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
            }
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-16 place-items-center rounded-full border border-white/40 bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-0.5 size-6 fill-white text-white" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
