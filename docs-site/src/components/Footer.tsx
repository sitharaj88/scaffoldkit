import { Link } from 'react-router-dom';
import { Terminal, Heart, Github, Coffee, Mail, ExternalLink } from 'lucide-react';

const footerLinks = {
    product: [
        { label: 'Documentation', to: '/docs/introduction' },
        { label: 'Features', to: '/docs/features' },
        { label: 'Quick Start', to: '/docs/quick-start' },
        { label: 'CLI Commands', to: '/docs/cli-commands' },
    ],
    resources: [
        { label: 'Template Presets', to: '/docs/presets' },
        { label: 'Migration Guide', to: '/docs/migration' },
        { label: 'API Docs', to: '/docs/docs-generator' },
        { label: 'Examples', href: 'https://github.com/sitharaj88/scaffoldkit/tree/main/examples' },
    ],
    community: [
        { label: 'GitHub', href: 'https://github.com/sitharaj88/scaffoldkit' },
        { label: 'Issues', href: 'https://github.com/sitharaj88/scaffoldkit/issues' },
        { label: 'Discussions', href: 'https://github.com/sitharaj88/scaffoldkit/discussions' },
        { label: 'npm Package', href: 'https://www.npmjs.com/package/scaffoldkit' },
    ],
};

export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-50">
            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/20">
                                <Terminal size={20} />
                            </div>
                            <span className="text-xl font-bold text-slate-900">ScaffoldKit</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            Production-grade CLI for creating, validating, and publishing JavaScript/TypeScript libraries.
                        </p>
                        <a
                            href="https://buymeacoffee.com/sitharaj88"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors text-sm font-medium"
                        >
                            <Coffee size={16} />
                            Buy me a coffee
                        </a>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4 text-sm">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-slate-600 hover:text-brand-600 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4 text-sm">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    {'to' in link ? (
                                        <Link
                                            to={link.to!}
                                            className="text-sm text-slate-600 hover:text-brand-600 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-slate-600 hover:text-brand-600 transition-colors inline-flex items-center gap-1"
                                        >
                                            {link.label}
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community Links */}
                    <div>
                        <h3 className="font-semibold text-slate-900 mb-4 text-sm">Community</h3>
                        <ul className="space-y-3">
                            {footerLinks.community.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-slate-600 hover:text-brand-600 transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        <ExternalLink size={12} />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-slate-500">
                            © {new Date().getFullYear()} ScaffoldKit. Released under the MIT License.
                        </div>

                        <div className="flex items-center gap-6">
                            <a
                                href="https://github.com/sitharaj88/scaffoldkit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label="GitHub"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="https://buymeacoffee.com/sitharaj88"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-amber-500 transition-colors"
                                aria-label="Buy me a coffee"
                            >
                                <Coffee size={20} />
                            </a>
                            <a
                                href="mailto:sitharaj88@gmail.com"
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                                aria-label="Email"
                            >
                                <Mail size={20} />
                            </a>
                        </div>

                        <div className="text-sm text-slate-400 flex items-center gap-1">
                            Made with <Heart size={14} className="fill-red-500 text-red-500" /> by{' '}
                            <a
                                href="https://github.com/sitharaj88"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-600 hover:text-brand-600 font-medium"
                            >
                                Sitharaj Seenvivasan
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
