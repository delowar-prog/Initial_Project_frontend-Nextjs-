type IconButtonProps = {
  children: React.ReactNode;
  label: string;
};

export default function IconButton({ children, label }: IconButtonProps) {
  return (
    <button
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50"
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}
