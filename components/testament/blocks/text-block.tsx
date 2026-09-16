type TextBlockProps = {
  text: string;
  title?: string;
};

export function TextBlock({ text, title }: TextBlockProps) {
  return (
    <article className="mx-auto w-full max-w-[42rem]">
      {title ? (
        <h3 className="mb-4 text-[18px] font-extrabold tracking-[-0.01em] text-header">
          {title}
        </h3>
      ) : null}
      <div className="whitespace-pre-wrap text-[17px] font-medium leading-[1.75] tracking-[-0.01em] text-header/90 sm:text-[18px] sm:leading-[1.8]">
        {text}
      </div>
    </article>
  );
}
