import type { ReactNode } from 'react';
import { AlertCircle, Info, Lightbulb, AlertTriangle, XCircle } from 'lucide-react';

type CalloutType = 'info' | 'tip' | 'warning' | 'danger' | 'note';

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: ReactNode;
}

const config: Record<CalloutType, { icon: ReactNode; bg: string; border: string; text: string }> = {
    info: {
        icon: <Info size={20} />,
        bg: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-800',
    },
    tip: {
        icon: <Lightbulb size={20} />,
        bg: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-800',
    },
    warning: {
        icon: <AlertTriangle size={20} />,
        bg: 'bg-amber-50',
        border: 'border-amber-500',
        text: 'text-amber-800',
    },
    danger: {
        icon: <XCircle size={20} />,
        bg: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-800',
    },
    note: {
        icon: <AlertCircle size={20} />,
        bg: 'bg-slate-50',
        border: 'border-slate-400',
        text: 'text-slate-700',
    },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
    const styles = config[type];

    return (
        <div className={`${styles.bg} ${styles.text} border-l-4 ${styles.border} p-4 my-6 rounded-r-lg`}>
            <div className="flex items-start gap-3">
                <span className="flex-shrink-0 mt-0.5">{styles.icon}</span>
                <div>
                    {title && <p className="font-semibold mb-1">{title}</p>}
                    <div className="text-sm">{children}</div>
                </div>
            </div>
        </div>
    );
}
