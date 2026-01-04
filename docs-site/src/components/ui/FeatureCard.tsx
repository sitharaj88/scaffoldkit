import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    href?: string;
    badge?: string;
}

export function FeatureCard({ icon: Icon, title, description, href, badge }: FeatureCardProps) {
    const Wrapper = href ? 'a' : 'div';
    const props = href ? { href } : {};

    return (
        <Wrapper
            {...props}
            className={`group relative block p-6 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ${href ? 'hover:shadow-xl hover:border-brand-200 hover:-translate-y-1 cursor-pointer' : ''
                }`}
        >
            {badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 text-xs font-semibold bg-brand-100 text-brand-700 rounded-full">
                    {badge}
                </span>
            )}
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform">
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </Wrapper>
    );
}

interface FeatureGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4;
}

export function FeatureGrid({ children, columns = 3 }: FeatureGridProps) {
    const colsClass = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-2 lg:grid-cols-4',
    }[columns];

    return <div className={`grid gap-6 ${colsClass}`}>{children}</div>;
}
