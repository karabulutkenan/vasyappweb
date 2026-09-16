type VideoBlockProps = {
  url: string;
  title?: string;
  description?: string;
  poster?: string;
};

export function VideoBlock({ url, title, description, poster }: VideoBlockProps) {
  return (
    <section className="w-full">
      {title ? (
        <h3 className="mb-3 text-[16px] font-extrabold text-header">{title}</h3>
      ) : null}
      <div className="overflow-hidden rounded-[22px] bg-black">
        <video
          controls
          playsInline
          preload="metadata"
          poster={poster}
          className="aspect-video w-full bg-black"
          aria-label={title ?? "Vasiyet videosu"}
        >
          <source src={url} />
          Tarayıcınız video oynatmayı desteklemiyor.
        </video>
      </div>
      {description ? (
        <p className="mt-3 text-[14px] font-medium leading-6 text-outline">
          {description}
        </p>
      ) : null}
      <div className="mt-3">
        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-pill border border-header/20 bg-white px-4 text-[14px] font-bold text-header transition hover:bg-header/[0.04]"
        >
          Videoyu indir
        </a>
      </div>
    </section>
  );
}
