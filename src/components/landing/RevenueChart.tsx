/**
 * "Umsatzentwicklung" card used by the four case studies.
 *
 * Figma: 568px-wide card, 32px padding, 504×180 plot. The curve, gridlines and
 * gradient are the exact vectors from the "Growth Curve" group; the two guides
 * sit at x=212 and x=363 with their labels 8px to the right. The design also
 * carries a "Monat 6 … 24" axis under the plot, but it is hidden on every one
 * of the four cards, so it isn't rendered here.
 */
const GUIDES = [
  { x: 212 / 504, labelTop: 96 / 180 },
  { x: 363 / 504, labelTop: 58 / 180 },
] as const;

export function RevenueChart({
  title,
  wordmark,
  stat,
  marks,
}: {
  title: string;
  wordmark: string;
  stat: string;
  marks: [string, string];
}) {
  const gradientId = `revenue-fill-${wordmark.replace(/\W/g, "").toLowerCase()}`;

  return (
    <figure className="rounded-[20px] border border-white/[0.06] bg-white/[0.04] p-6 md:p-7 lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <figcaption className="min-w-0">
          <span className="block font-serif text-[15px] leading-[22px] text-white/80 lg:text-[16px]">
            {title}
          </span>
          <span className="mt-1.5 block font-display text-[24px] leading-[38px] tracking-[-0.5px] text-purple-2 lg:text-[30px]">
            {stat}
          </span>
          <span className="block font-serif text-[13px] leading-[20px] text-white/65 lg:text-[15px]">
            in den ersten zwei Jahren der Zusammenarbeit
          </span>
        </figcaption>
        <span className="shrink-0 font-display text-[11px] uppercase leading-[17px] tracking-[1.5px] text-white/[0.28] lg:text-[13px]">
          {wordmark}
        </span>
      </div>

      <div className="relative mt-6 aspect-[504/180] w-full lg:mt-[24px]">
        <svg
          viewBox="0 0 504 180"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          fill="none"
          aria-hidden
        >
          {[36, 78, 120, 162].map((y) => (
            <path
              key={y}
              d={`M0 ${y}H504`}
              stroke="white"
              strokeOpacity="0.06"
              strokeWidth="2"
            />
          ))}
          {[212, 363].map((x) => (
            <path
              key={x}
              d={`M${x} 50V170`}
              stroke="white"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
          ))}
          <path
            d="M0 162C60.48 157.2 80.64 150 126 144C181.44 136.8 211.68 129 252 114C307.44 94.8 332.64 84 378 66C423.36 49.2 458.64 40.8 504 33V180H0V162Z"
            fill={`url(#${gradientId})`}
          />
          <path
            d="M0 162C60.48 157.2 80.64 150 126 144C181.44 136.8 211.68 129 252 114C307.44 94.8 332.64 84 378 66C423.36 49.2 458.64 40.8 504 33"
            stroke="#B089FF"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <defs>
            <linearGradient
              id={gradientId}
              x1="0"
              y1="33"
              x2="0"
              y2="180"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#B089FF" stopOpacity="0.35" />
              <stop offset="1" stopColor="#B089FF" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* value labels, 8px to the right of each guide */}
        {GUIDES.map((g, i) => (
          <span
            key={marks[i]}
            style={{ left: `calc(${g.x * 100}% + 8px)`, top: `${g.labelTop * 100}%` }}
            className="absolute whitespace-nowrap font-body text-[11px] leading-[13px] text-white/55"
          >
            {marks[i]}
          </span>
        ))}
      </div>
    </figure>
  );
}
