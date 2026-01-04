
import { Link } from 'react-router-dom';
import { Terminal, Github, Menu, X } from 'lucide-react';
import { useState } from 'react';


export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-lg shadow-brand-500/30">
                            <Terminal size={20} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">ScaffoldKit</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link to="/docs" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Documentation</Link>
                    <Link to="/docs/features" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Features</Link>
                    <a href="https://github.com/sitharaj88/scaffoldkit" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 transition-colors">
                        <Github size={20} />
                    </a>
                    <Link to="/docs/getting-started" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-all hover:shadow-lg">
                        Get Started
                    </Link>
                </nav>

                <button
                    className="md:hidden p-2 text-slate-500"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 shadow-lg">
                    <div className="flex flex-col space-y-4">
                        <Link to="/docs" className="text-base font-medium text-slate-700">Documentation</Link>
                        <Link to="/docs/features" className="text-base font-medium text-slate-700">Features</Link>
                        <a href="https://github.com/sitharaj88/scaffoldkit" target="_blank" rel="noopener noreferrer" className="text-base font-medium text-slate-700">GitHub</a>
                    </div>
                </div>
            )}
        </header>
    );
}
