import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const sidebarLinks = [
    {
        title: 'Getting Started',
        items: [
            { to: '/docs/introduction', label: 'Introduction' },
            { to: '/docs/installation', label: 'Installation' },
            { to: '/docs/quick-start', label: 'Quick Start' },
        ]
    },
    {
        title: 'Core Concepts',
        items: [
            { to: '/docs/architecture', label: 'Architecture' },
            { to: '/docs/cli-commands', label: 'CLI Commands' },
            { to: '/docs/configuration', label: 'Configuration' },
        ]
    },
    {
        title: 'Features',
        items: [
            { to: '/docs/presets', label: 'Template Presets' },
            { to: '/docs/ci-templates', label: 'CI Templates' },
            { to: '/docs/quality-score', label: 'Quality Score' },
            { to: '/docs/bundle-guardian', label: 'Bundle Guardian' },
            { to: '/docs/publishing', label: 'Publish Wizard' },
            { to: '/docs/component-generator', label: 'Component Generator' },
            { to: '/docs/migration', label: 'Migration Assistant' },
            { to: '/docs/docs-generator', label: 'Docs Generator' },
        ]
    }
];

export function DocsLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    return (
        <>
            {/* Mobile Sidebar Toggle - Fixed Position */}
            <div className="md:hidden fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={clsx(
                        "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300",
                        isSidebarOpen
                            ? "bg-slate-900 text-white rotate-180"
                            : "bg-brand-600 text-white hover:bg-brand-700 hover:scale-105"
                    )}
                    aria-label="Toggle Documentation Menu"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Overlay Menu */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                            onClick={() => setIsSidebarOpen(false)}
                        />

                        {/* Slide-out Menu */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="md:hidden fixed right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl overflow-y-auto"
                        >
                            {/* Menu Header */}
                            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900">Documentation</h2>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Menu Content */}
                            <nav className="px-4 py-6 space-y-6">
                                {sidebarLinks.map((group, groupIndex) => (
                                    <motion.div
                                        key={group.title}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: groupIndex * 0.1 }}
                                    >
                                        <h3 className="font-semibold text-slate-400 mb-3 text-xs uppercase tracking-wider px-2">
                                            {group.title}
                                        </h3>
                                        <ul className="space-y-1">
                                            {group.items.map((item) => (
                                                <li key={item.to}>
                                                    <NavLink
                                                        to={item.to}
                                                        className={({ isActive }: { isActive: boolean }) => clsx(
                                                            "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all",
                                                            isActive
                                                                ? "bg-brand-50 text-brand-700 font-medium"
                                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                        )}
                                                    >
                                                        {item.label}
                                                        <ChevronRight size={16} className="text-slate-400" />
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Layout */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-64 flex-shrink-0 border-r border-slate-200 py-8 pr-8">
                        <nav className="space-y-8 sticky top-24">
                            {sidebarLinks.map((group) => (
                                <div key={group.title}>
                                    <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">
                                        {group.title}
                                    </h3>
                                    <ul className="space-y-2">
                                        {group.items.map((item) => (
                                            <li key={item.to}>
                                                <NavLink
                                                    to={item.to}
                                                    className={({ isActive }: { isActive: boolean }) => clsx(
                                                        "block text-sm transition-colors border-l-2 pl-4 -ml-px",
                                                        isActive
                                                            ? "border-brand-600 text-brand-600 font-medium"
                                                            : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
                                                    )}
                                                >
                                                    {item.label}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 py-8 md:py-12 md:pl-12">
                        <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-sm md:prose-lg">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
