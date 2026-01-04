
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Zap, Shield, CheckCircle2, Terminal,
    Layers, GitBranch, FileCode, Package, Sparkles, Globe
} from 'lucide-react';
import { FeatureCard, FeatureGrid } from '../components/ui';

const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

export function Landing() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100 via-slate-50 to-white"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-brand-200/30 to-transparent rounded-full blur-3xl"></div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div {...fadeInUp}>
                                <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-8 shadow-sm">
                                    <Sparkles size={14} />
                                    <span>v1.0 - Now available on npm</span>
                                </div>

                                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl mb-6 leading-tight">
                                    Build production-ready{' '}
                                    <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600 bg-clip-text text-transparent">
                                        libraries
                                    </span>{' '}
                                    in minutes
                                </h1>

                                <p className="mx-auto lg:mx-0 max-w-2xl text-xl text-slate-600 mb-10 leading-relaxed">
                                    The enterprise-grade CLI for generating, validating, and publishing JavaScript & TypeScript packages.
                                    First-class support for React, Vue, Svelte, and Node.js.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                                    <Link
                                        to="/docs/introduction"
                                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 hover:-translate-y-1 hover:shadow-2xl"
                                    >
                                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                    <a
                                        href="https://github.com/sitharaj88/scaffoldkit"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-semibold text-slate-900 shadow-lg ring-1 ring-slate-900/5 transition-all hover:bg-slate-50 hover:-translate-y-1"
                                    >
                                        <Globe className="mr-2 h-5 w-5" /> View on GitHub
                                    </a>
                                </div>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-slate-500">
                                    {['Zero Config', 'Type Safe', 'Tree Shakeable', 'MIT License'].map((item) => (
                                        <div key={item} className="flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-green-500" />
                                            <span className="text-sm font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Terminal Preview */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex-1 w-full max-w-[600px] lg:max-w-none"
                        >
                            <div className="relative rounded-2xl bg-slate-900 p-1 shadow-2xl shadow-slate-900/30">
                                <div className="absolute -top-px left-20 right-20 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"></div>
                                <div className="rounded-xl border border-white/10 bg-slate-950 p-6">
                                    <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-4">
                                        <div className="flex gap-1.5">
                                            <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                                            <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                                            <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                                        </div>
                                        <div className="ml-4 text-xs text-slate-500 font-mono flex items-center gap-2">
                                            <Terminal size={12} /> terminal
                                        </div>
                                    </div>

                                    <div className="font-mono text-sm space-y-3">
                                        <div className="flex items-center">
                                            <span className="text-green-400 mr-2">$</span>
                                            <span className="text-slate-300">npx scaffoldkit create my-lib</span>
                                            <motion.span
                                                className="ml-1 w-2 h-4 bg-white/80"
                                                animate={{ opacity: [1, 0] }}
                                                transition={{ duration: 0.8, repeat: Infinity }}
                                            />
                                        </div>

                                        <div className="text-slate-500 space-y-1 pl-4">
                                            <div>? Select framework: <span className="text-cyan-400">React</span></div>
                                            <div>? TypeScript: <span className="text-cyan-400">Yes</span></div>
                                            <div>? Preset: <span className="text-cyan-400">Enterprise</span></div>
                                        </div>

                                        <div className="pt-2 border-t border-white/5 space-y-1">
                                            <div className="text-green-400">✓ Created package.json</div>
                                            <div className="text-green-400">✓ Generated tsconfig.json</div>
                                            <div className="text-green-400">✓ Added GitHub Actions CI</div>
                                            <div className="text-green-400">✓ Configured Vitest</div>
                                            <div className="text-green-400">✓ Setup complete!</div>
                                        </div>

                                        <div className="pt-3 text-brand-400 font-semibold">
                                            Ready in 2.4s ⚡️
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <p className="text-brand-600 font-semibold uppercase tracking-wider text-sm mb-3">
                            Complete Toolkit
                        </p>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-6">
                            Everything you need to ship quality code
                        </h2>
                        <p className="text-lg text-slate-600">
                            From project scaffolding to npm publishing, ScaffoldKit handles the entire lifecycle of your JavaScript libraries.
                        </p>
                    </motion.div>

                    <FeatureGrid columns={3}>
                        <FeatureCard
                            icon={Layers}
                            title="Multi-Framework Support"
                            description="First-class generators for React, Vue, Svelte, and vanilla TypeScript with framework-specific best practices."
                            href="/docs/architecture"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Blazing Fast Builds"
                            description="Powered by tsup and esbuild for sub-second builds. Generates optimized ESM and CJS bundles."
                            href="/docs/configuration"
                        />
                        <FeatureCard
                            icon={Shield}
                            title="Quality Score System"
                            description="Automated audits for types, exports, documentation, tests, and bundle size. Get a 0-100 quality rating."
                            href="/docs/quality-score"
                            badge="Popular"
                        />
                        <FeatureCard
                            icon={GitBranch}
                            title="CI/CD Templates"
                            description="Auto-generated GitHub Actions and GitLab CI pipelines with caching, testing, and release automation."
                            href="/docs/ci-templates"
                        />
                        <FeatureCard
                            icon={Package}
                            title="Publish Wizard"
                            description="Safe npm publishing with 8 pre-flight checks. Never accidentally publish broken code again."
                            href="/docs/publishing"
                        />
                        <FeatureCard
                            icon={FileCode}
                            title="Component Generator"
                            description="Add components, hooks, and utilities to existing projects with a single command."
                            href="/docs/component-generator"
                        />
                    </FeatureGrid>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '8', label: 'CLI Commands' },
                            { value: '4+', label: 'Frameworks' },
                            { value: '100%', label: 'Type Safe' },
                            { value: '<3s', label: 'Setup Time' },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="text-5xl font-bold bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-slate-400 font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-slate-50">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            Ready to build your next library?
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of developers using ScaffoldKit to ship production-ready packages faster.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/docs/quick-start"
                                className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-700 hover:-translate-y-1"
                            >
                                Start Building <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
