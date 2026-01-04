

interface DocPageProps {
    title: string;
    children: React.ReactNode;
}

export function DocPage({ title, children }: DocPageProps) {
    return (
        <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-8">{title}</h1>
            <div className="space-y-6 text-slate-600 leading-relaxed">
                {children}
            </div>
        </div>
    );
}

export const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => (
    <div className="relative rounded-xl bg-slate-900 p-4 my-6 overflow-x-auto">
        <div className="absolute top-2 right-4 text-xs font-mono text-slate-500 uppercase">{language}</div>
        <pre className="text-sm font-mono text-slate-50">
            <code>{code}</code>
        </pre>
    </div>
);
