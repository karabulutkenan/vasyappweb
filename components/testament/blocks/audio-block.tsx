type AudioBlockProps = {
  url: string;
  title?: string;
  description?: string;
};

export function AudioBlock({ url, title, description }: AudioBlockProps) {
  return (
    <section className="w-full rounded-[22px] border border-header/10 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(52,73,94,0.06)]">
      {title ? (
        <h3 className="mb-1 text-[16px] font-extrabold text-header">{title}</h3>
      ) : (
        <h3 className="mb-1 text-[16px] font-extrabold text-header">Ses kaydı</h3>
      )}
      {description ? (
        <p className="mb-3 text-[14px] font-medium text-outline">{description}</p>
      ) : null}
      <audio controls preload="metadata" className="w-full" src={url}>
        Tarayıcınız ses oynatmayı desteklemiyor.
      </audio>
      <div className="mt-3">
        <a
          href={url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center rounded-pill border border-header/20 bg-canvas px-4 text-[14px] font-bold text-header transition hover:bg-header/[0.04]"
        >
          İndir
        </a>
      </div>
    </section>
  );
}
