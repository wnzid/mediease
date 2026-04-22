import Image from "next/image";

type MediaImage = { src: string; alt?: string };

interface Props {
  images: MediaImage[];
  /** CSS padding-top value to emulate aspect ratio for the large image (e.g. '75%' for 4:3) */
  largePad?: string;
  /** CSS padding-top value to emulate aspect ratio for thumbnails */
  smallPad?: string;
  className?: string;
}

export default function ServiceMediaGallery({
  images,
  largePad = "56.25%",
  smallPad = "56.25%",
  className = "",
}: Props) {
  if (!images || images.length === 0) return null;

  const thumbs = images.slice(1, 3);

  return (
    <div className={className}>
      <div className="grid gap-3">
        {/* Large / dominant image */}
        {images[0] && (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-sm">
            <div style={{ paddingTop: largePad }} />
            <Image
              src={images[0].src}
              alt={images[0].alt ?? ""}
              fill
              sizes="(min-width:1024px) 45vw, 100vw"
              className="absolute inset-0 object-cover"
            />
          </div>
        )}

        {/* Supporting thumbnails (max 2) */}
        {thumbs.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {thumbs.map((img, i) => (
              <div key={i} className="relative w-full rounded-2xl overflow-hidden shadow-sm">
                <div style={{ paddingTop: smallPad }} />
                <Image
                  src={img.src}
                  alt={img.alt ?? ""}
                  fill
                  sizes="(min-width:1024px) 22vw, 50vw"
                  className="absolute inset-0 object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
