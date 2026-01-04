import { Link } from 'react-router-dom';
import { DocPage, CodeBlock } from '../../components/DocPage';
import { CodeTabs } from '../../components/ui';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function QuickStart() {
    return (
        <DocPage title="Quick Start Guide">
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
                Get up and running with ScaffoldKit in under 2 minutes. This guide walks you through creating your first production-ready library.
            </p>

            <h2 id="step-1" className="text-2xl font-bold mt-10 mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-bold">1</span>
                Create a New Project
            </h2>

            <p className="mb-4">
                Run the create command with your desired project name:
            </p>

            <CodeTabs
                tabs={[
                    { label: 'npx', code: 'npx scaffoldkit create my-awesome-lib' },
                    { label: 'Global', code: 'scaffoldkit create my-awesome-lib' },
                ]}
            />

            <p className="mt-4">
                You can also use a preset to skip the wizard entirely:
            </p>

            <CodeBlock code="npx scaffoldkit create my-lib --preset enterprise" />

            <h2 id="step-2" className="text-2xl font-bold mt-12 mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-bold">2</span>
                Configure via Interactive Wizard
            </h2>

            <p className="mb-4">
                The wizard guides you through essential configuration choices:
            </p>

            <div className="relative rounded-xl bg-slate-900 p-6 my-6 font-mono text-sm shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                        <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-xs text-slate-400 ml-2">Terminal</span>
                </div>

                <div className="pt-8 space-y-4 text-slate-300">
                    <div>
                        <div className="text-green-400 mb-1">? Select framework:</div>
                        <div className="pl-4 space-y-1">
                            <div className="text-cyan-400 font-bold">❯ React</div>
                            <div className="text-slate-500">  Vue 3</div>
                            <div className="text-slate-500">  Svelte</div>
                            <div className="text-slate-500">  Node.js</div>
                            <div className="text-slate-500">  Vanilla TypeScript</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-green-400 mb-1">? Use TypeScript?</div>
                        <div className="pl-4">
                            <span className="text-cyan-400 font-bold">❯ Yes (Recommended)</span>
                        </div>
                    </div>

                    <div>
                        <div className="text-green-400 mb-1">? Select preset:</div>
                        <div className="pl-4 space-y-1">
                            <div className="text-slate-500">  Minimal</div>
                            <div className="text-cyan-400 font-bold">❯ Standard</div>
                            <div className="text-slate-500">  Enterprise</div>
                            <div className="text-slate-500">  Component Library</div>
                        </div>
                    </div>

                    <div>
                        <div className="text-green-400 mb-1">? Include CI/CD?</div>
                        <div className="pl-4 space-y-1">
                            <div className="text-cyan-400 font-bold">❯ Yes (GitHub Actions)</div>
                            <div className="text-slate-500">  Yes (GitLab CI)</div>
                            <div className="text-slate-500">  No</div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 id="step-3" className="text-2xl font-bold mt-12 mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white text-sm font-bold">3</span>
                Start Developing
            </h2>

            <p className="mb-4">
                Navigate into your new project and start the development server:
            </p>

            <CodeBlock code={`cd my-awesome-lib
npm run dev`} />

            <h2 id="whats-included" className="text-2xl font-bold mt-12 mb-4">What's Included</h2>

            <p className="mb-6">
                Your generated project comes pre-configured with:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
                {[
                    { label: 'TypeScript', desc: 'Strict mode, proper config' },
                    { label: 'tsup', desc: 'Lightning-fast builds' },
                    { label: 'Vitest', desc: 'Modern test runner' },
                    { label: 'ESLint', desc: 'Flat config, no warnings' },
                    { label: 'Prettier', desc: 'Consistent formatting' },
                    { label: 'GitHub Actions', desc: 'CI/CD pipeline' },
                ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-white">
                        <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="font-medium text-slate-900">{item.label}</p>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2 id="project-structure" className="text-2xl font-bold mt-12 mb-4">Project Structure</h2>

            <CodeBlock language="text" code={`my-awesome-lib/
├── src/
│   ├── index.ts          # Main entry point
│   └── components/       # Your components
├── tests/
│   └── index.test.ts     # Test files
├── .github/
│   └── workflows/ci.yml  # GitHub Actions
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── README.md`} />

            <h2 id="next-steps" className="text-2xl font-bold mt-12 mb-4">Next Steps</h2>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Link to="/docs/cli-commands" className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all">
                    <div>
                        <p className="font-semibold text-slate-900">CLI Commands</p>
                        <p className="text-sm text-slate-500">Explore all available commands</p>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link to="/docs/component-generator" className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-brand-300 hover:shadow-md transition-all">
                    <div>
                        <p className="font-semibold text-slate-900">Add Components</p>
                        <p className="text-sm text-slate-500">Generate code with scaffoldkit add</p>
                    </div>
                    <ArrowRight className="text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>
        </DocPage>
    );
}
