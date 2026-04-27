import Link from 'next/link';

const items = [
  { href: '/', label: 'Início' },
  { href: '/login', label: 'Login' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50 p-4">
      <nav className="space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
