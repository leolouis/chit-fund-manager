interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h2 className="text-xl font-semibold text-slate-900">
        {title}
      </h2>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          Offline
        </span>

        <button
          type="button"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Backup
        </button>
      </div>
    </header>
  );
}

export default Header;
