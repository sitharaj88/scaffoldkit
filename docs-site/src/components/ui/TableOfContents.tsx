interface TOCItem {
    id: string;
    title: string;
    level: 2 | 3;
}

interface TableOfContentsProps {
    items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
    return (
        <nav className="sticky top-24 hidden xl:block w-56 shrink-0">
            <div className="border-l border-slate-200 pl-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    On this page
                </p>
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={`block text-sm transition-colors hover:text-brand-600 ${item.level === 3 ? 'pl-3 text-slate-500' : 'text-slate-700 font-medium'
                                    }`}
                            >
                                {item.title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
