type TestamentHeaderProps = {
  title: string;
  subtleNote?: string;
};

export function TestamentHeader({ title, subtleNote }: TestamentHeaderProps) {
  return (
    <header className="mb-8 border-b border-header/10 pb-6">
      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-outline">
        Size bırakılan vasiyet
      </p>
      <h1 className="mt-3 max-w-3xl text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] text-header sm:text-[34px]">
        {title}
      </h1>
      {subtleNote ? (
        <p className="mt-3 text-[13px] font-semibold text-outline/90">
          {subtleNote}
        </p>
      ) : null}
    </header>
  );
}
