import Image from "next/image";
import { mosaicColumns } from "@/lib/data";

// Figma frame for the collage; every size below is a px value inside it and becomes a
// percentage so the whole mosaic scales with the layout.
const W = 530;
const H = 522.44;
const pct = (v: number, total: number) => `${(v / total) * 100}%`;
const alignClass = { left: "self-start", center: "self-center", right: "self-end" } as const;

export function PeopleMosaic() {
  return (
    <div
      role="group"
      className="relative mx-auto aspect-[530/522.44] w-full max-w-132.5"
      aria-label="International students and teachers"
    >
      {/* decorative 500x500 circle, centred in the frame */}
      <div
        aria-hidden
        className="absolute aspect-square rounded-full bg-[#E2E8FF]"
        style={{
          left: pct((W - 500) / 2, W),
          top: pct((H - 500) / 2, H),
          width: pct(500, W),
        }}
      />
      <div className="relative flex h-full w-full justify-between">
        {mosaicColumns.map((col) => (
          <div
            key={col.photos[0].src}
            className="flex flex-col justify-between"
            style={{ width: pct(col.width, W), height: pct(col.height, H), paddingTop: pct(col.paddingTop, W) }}
          >
            {col.photos.map((p) => (
              <div
                key={p.src}
                className={`relative overflow-hidden rounded-[4.01px] shadow-md ${alignClass[p.align]}`}
                style={{ width: pct(p.width, col.width), height: pct(p.height, col.height - col.paddingTop) }}
              >
                <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 140px, 22vw" className="object-cover" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
