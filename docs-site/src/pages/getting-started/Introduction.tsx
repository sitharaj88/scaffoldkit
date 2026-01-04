import { Link } from 'react-router-dom';
import { DocPage } from '../../components/DocPage';
import { Callout } from '../../components/ui';
import { ArrowRight, Layers, Zap, Shield, Package, FileCode, GitBranch } from 'lucide-react';

export default function Introduction() {
    return (
        <DocPage title="Introduction to ScaffoldKit">
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
                ScaffoldKit is the enterprise-standard CLI for generating, validating, and managing modern JavaScript and TypeScript libraries.
                It eliminates the tedious boilerplate setup so you can focus on what matters: writing great code.
            </p>

            <Callout type="tip" title="Quick Start">
                Want to dive right in? Run <code>npx scaffoldkit create my-lib</code> and follow the interactive wizard.
                Read the <Link to="/docs/quick-start" className="text-brand-600 underline">Quick Start Guide</Link> for a walkthrough.
            </Callout>

            <h2 id="why-scaffoldkit" className="text-2xl font-bold mt-12 mb-4">Why ScaffoldKit?</h2>

            <p className="mb-6">
                Creating a production-ready JavaScript library requires configuring many interconnected tools:
            </p>

            <div className="grid md:grid-cols-2 gap-4 my-8">
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <h4 className="font-semibold text-slate-900 mb-2">Build System</h4>
                    <p className="text-sm text-slate-600">tsup, Rollup, Vite, esbuild, Webpack...</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <h4 className="font-semibold text-slate-900 mb-2">Testing</h4>
                    <p className="text-sm text-slate-600">Vitest, Jest, Testing Library, coverage...</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <h4 className="font-semibold text-slate-900 mb-2">Linting & Formatting</h4>
                    <p className="text-sm text-slate-600">ESLint, Prettier, husky, lint-staged...</p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                    <h4 className="font-semibold text-slate-900 mb-2">CI/CD</h4>
                    <p className="text-sm text-slate-600">GitHub Actions, GitLab CI, semantic-release...</p>
                </div>
            </div>

            <p className="mb-6">
                ScaffoldKit solves this fragmentation by providing a unified, opinionated, yet flexible interface for the entire lifecycle of your package—from initial creation to npm publishing.
            </p>

            <h2 id="core-features" className="text-2xl font-bold mt-12 mb-6">Core Features</h2>

            <div className="space-y-6">
                {[
                    { icon: Layers, title: 'Multi-Framework Support', desc: 'React, Vue, Svelte, Node.js, and vanilla TypeScript with framework-specific optimizations.' },
                    { icon: Zap, title: 'Zero Configuration', desc: 'Sensible defaults that work for 90% of use cases. No mandatory config files to maintain.' },
                    { icon: Shield, title: 'Quality Guardrails', desc: 'Built-in quality scoring, bundle analysis, and best-practice validation.' },
                    { icon: Package, title: 'Safe Publishing', desc: '8 pre-flight checks before every npm publish to prevent broken releases.' },
                    { icon: FileCode, title: 'Code Generation', desc: 'Add components, hooks, and utilities to existing projects with scaffoldkit add.' },
                    { icon: GitBranch, title: 'CI/CD Ready', desc: 'Auto-generated GitHub Actions and GitLab CI pipelines with caching.' },
                ].map((feature, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:shadow-md transition-shadow">
                        <div className="h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 flex-shrink-0">
                            <feature.icon size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                            <p className="text-sm text-slate-600">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2 id="philosophy" className="text-2xl font-bold mt-12 mb-4">Design Philosophy</h2>

            <ul className="list-disc pl-6 space-y-3 text-slate-700">
                <li><strong>Convention over Configuration</strong>: Works out of the box with sensible defaults.</li>
                <li><strong>Progressive Complexity</strong>: Start simple, eject or override when you need control.</li>
                <li><strong>Framework Agnostic Core</strong>: The same CLI works for React, Vue, Svelte, and more.</li>
                <li><strong>TypeScript First</strong>: Written in TypeScript, generates TypeScript, with full type safety.</li>
                <li><strong>Modern Standards</strong>: ESM-first, proper package.json exports, tree-shakeable output.</li>
            </ul>

            <h2 id="next-steps" className="text-2xl font-bold mt-12 mb-4">Next Steps</h2>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Link to="/docs/installation" className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all">
                    <div>
                        <p className="font-semibold text-slate-900">Installation</p>
                        <p className="text-sm text-slate-500">Get ScaffoldKit on your machine</p>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link to="/docs/quick-start" className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all">
                    <div>
                        <p className="font-semibold text-slate-900">Quick Start</p>
                        <p className="text-sm text-slate-500">Create your first project</p>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>
        </DocPage>
    );
}
