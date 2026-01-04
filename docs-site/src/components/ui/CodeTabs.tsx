import { useState } from 'react';

interface Tab {
    label: string;
    language?: string;
    code: string;
}

interface CodeTabsProps {
    tabs: Tab[];
}

export function CodeTabs({ tabs }: CodeTabsProps) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 my-6 shadow-lg">
            {/* Tab Headers */}
            <div className="flex bg-slate-800 border-b border-slate-700">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === index
                                ? 'bg-slate-900 text-white border-b-2 border-brand-500'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-slate-50 leading-relaxed">
                    <code>{tabs[activeTab].code}</code>
                </pre>
            </div>
        </div>
    );
}
