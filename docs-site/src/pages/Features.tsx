import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Layers, Zap, Shield, Package, FileCode, GitBranch,
    Terminal, Settings, ArrowRight, Sparkles, CheckCircle2
} from 'lucide-react';

const features = [
    {
        icon: Layers,
        title: 'Template Presets',
        description: 'Four carefully crafted presets for different use cases: Minimal, Standard, Enterprise, and Component Library.',
        href: '/docs/presets',
        color: 'from-blue-500 to-cyan-500',
        highlights: ['Zero config start', '4 preset options', 'Full customization']
    },
    {
        icon: GitBranch,
        title: 'CI/CD Templates',
        description: 'Auto-generated GitHub Actions and GitLab CI pipelines with caching, testing, and release automation.',
        href: '/docs/ci-templates',
        color: 'from-purple-500 to-pink-500',
        highlights: ['GitHub Actions', 'GitLab CI', 'Automated releases']
    },
    {
        icon: Shield,
        title: 'Quality Score',
        description: 'Automated audits for types, exports, documentation, tests, and bundle size. Get a 0-100 quality rating.',
        href: '/docs/quality-score',
        color: 'from-green-500 to-emerald-500',
        highlights: ['5 categories', 'Auto-fix issues', 'CI integration']
    },
    {
        icon: Zap,
        title: 'Bundle Guardian',
        description: 'Prevent bloat by enforcing size limits on production builds. Catch regressions before they ship.',
        href: '/docs/bundle-guardian',
        color: 'from-amber-500 to-orange-500',
        highlights: ['Size limits', 'GZIP analysis', 'Module breakdown']
    },
    {
        icon: Package,
        title: 'Publish Wizard',
        description: 'Safe npm publishing with 8 pre-flight checks. Never accidentally publish broken code again.',
        href: '/docs/publishing',
        color: 'from-red-500 to-rose-500',
        highlights: ['8 pre-flight checks', 'Dry run mode', 'Git validation']
    },
    {
        icon: FileCode,
        title: 'Component Generator',
        description: 'Add components, hooks, utilities, and contexts to existing projects with consistent structure.',
        href: '/docs/component-generator',
        color: 'from-indigo-500 to-violet-500',
        highlights: ['React/Vue/Svelte', 'Auto-detect framework', 'Test generation']
    },
    {
        icon: Settings,
        title: 'Migration Assistant',
        description: 'Modernize legacy projects by automating migration of build systems, module formats, and test frameworks.',
        href: '/docs/migration',
        color: 'from-teal-500 to-cyan-500',
        highlights: ['Rollup → tsup', 'CJS → ESM', 'Jest → Vitest']
    },
    {
        icon: Terminal,
        title: 'Docs Generator',
        description: 'Automatically generate API documentation from TypeScript source code using JSDoc/TSDoc comments.',
        href: '/docs/docs-generator',
        color: 'from-slate-500 to-zinc-500',
        highlights: ['TSDoc parsing', 'Markdown output', 'Live server']
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function Features() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20 md:py-32">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-3xl"></div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-300 mb-6">
                            <Sparkles size={14} />
                            <span>8 Powerful Features</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                            Everything You Need to{' '}
                            <span className="bg-gradient-to-r from-brand-400 via-cyan-400 to-brand-400 bg-clip-text text-transparent">
                                Ship Quality Code
                            </span>
                        </h1>

                        <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed">
                            From project scaffolding to npm publishing, ScaffoldKit handles the entire lifecycle
                            of your JavaScript libraries with enterprise-grade tooling.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="relative -mt-16 md:-mt-24 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {features.map((feature) => (
                            <motion.div
                                key={feature.title}
                                variants={itemVariants}
                                className="group"
                            >
                                <Link
                                    to={feature.href}
                                    className="block h-full bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-slate-200"
                                >
                                    {/* Icon */}
                                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-5`}>
                                        <feature.icon size={24} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                        {feature.description}
                                    </p>

                                    {/* Highlights */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {feature.highlights.map((highlight) => (
                                            <span
                                                key={highlight}
                                                className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-full px-2.5 py-1"
                                            >
                                                <CheckCircle2 size={12} className="text-green-500" />
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Link */}
                                    <div className="flex items-center text-sm font-semibold text-brand-600 group-hover:text-brand-700">
                                        Learn more
                                        <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-slate-50 border-t border-slate-200 py-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Ready to get started?
                    </h2>
                    <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                        Create your first project in under 30 seconds with our interactive CLI wizard.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/docs/quick-start"
                            className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-700 hover:-translate-y-1"
                        >
                            Quick Start Guide
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/docs/cli-commands"
                            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:-translate-y-1"
                        >
                            View CLI Commands
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
