interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <p className="text-sm text-slate-500">Associação ABACO</p>
        <h1 className="text-lg font-semibold text-slate-900">Sistema de Gestão Acadêmica</h1>
      </div>
      <button className="text-sm font-medium text-slate-700" type="button" onClick={onLogout}>
        Sair
      </button>
    </header>
  );
}
