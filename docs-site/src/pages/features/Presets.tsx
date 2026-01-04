import { DocPage, CodeBlock } from '../../components/DocPage';
import { Callout } from '../../components/ui';

export default function Presets() {
    return (
        <DocPage title="Template Presets">
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8">
                Presets are pre-defined configurations that bundle together common tool choices.
                Use them to skip the wizard and create projects with a single command.
            </p>

            <h2 id="usage" className="text-xl md:text-2xl font-bold mt-10 mb-4">Usage</h2>

            <CodeBlock code="scaffoldkit create my-lib --preset <preset-name>" />

            <h2 id="available-presets" className="text-xl md:text-2xl font-bold mt-12 mb-4">Available Presets</h2>

            {/* Minimal Preset */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Minimal</h3>
                    <p className="text-sm text-slate-600 mt-1">For simple utilities or quick prototyping</p>
                </div>
                <div className="px-4 md:px-6 py-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Included</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                                <li>TypeScript with strict mode</li>
                                <li>tsup for building (ESM output)</li>
                                <li>Basic package.json setup</li>
                            </ul>
                            <h4 className="font-semibold text-slate-800 mt-4 mb-2">Not Included</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-400">
                                <li>Tests</li>
                                <li>CI/CD</li>
                                <li>Example app</li>
                                <li>Git hooks</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Project Structure</h4>
                            <CodeBlock language="text" code={`my-lib/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md`} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <CodeBlock code="scaffoldkit create my-util --preset minimal" />
                    </div>
                </div>
            </div>

            {/* Standard Preset */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-lg font-bold text-slate-900">Standard</h3>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-brand-100 text-brand-700 rounded-full">Default</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">Balanced setup for most libraries</p>
                </div>
                <div className="px-4 md:px-6 py-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Included</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                                <li>TypeScript with strict mode</li>
                                <li>tsup for building (ESM output)</li>
                                <li>Vitest for testing</li>
                                <li>ESLint + Prettier</li>
                                <li>GitHub Actions CI</li>
                                <li>Example app</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Project Structure</h4>
                            <CodeBlock language="text" code={`my-lib/
├── src/
│   └── index.ts
├── tests/
│   └── index.test.ts
├── examples/
│   └── basic/
├── .github/
│   └── workflows/ci.yml
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── .eslintrc.cjs
├── .prettierrc
└── README.md`} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <CodeBlock code="scaffoldkit create my-lib --preset standard" />
                    </div>
                </div>
            </div>

            {/* Enterprise Preset */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-lg font-bold text-slate-900">Enterprise</h3>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">Recommended</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">Production-ready with all guardrails</p>
                </div>
                <div className="px-4 md:px-6 py-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Included</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                                <li>Everything in Standard, plus:</li>
                                <li>Dual build (ESM + CJS)</li>
                                <li>Husky git hooks</li>
                                <li>Commitlint (conventional commits)</li>
                                <li>Semantic Release</li>
                                <li>Changesets for versioning</li>
                                <li>lint-staged</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Project Structure</h4>
                            <CodeBlock language="text" code={`my-lib/
├── src/
│   └── index.ts
├── tests/
│   └── index.test.ts
├── examples/
│   └── basic/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── .husky/
│   ├── pre-commit
│   └── commit-msg
├── .changeset/
│   └── config.json
├── commitlint.config.js
├── release.config.js
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── vitest.config.ts`} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <CodeBlock code="scaffoldkit create my-lib --preset enterprise" />
                    </div>
                </div>
            </div>

            {/* Component Library Preset */}
            <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <div className="bg-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900">Component Library</h3>
                    <p className="text-sm text-slate-600 mt-1">Optimized for publishing UI components</p>
                </div>
                <div className="px-4 md:px-6 py-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Included</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                                <li>Vite build (better for CSS)</li>
                                <li>Storybook 8.x</li>
                                <li>Storybook addons (a11y, interactions)</li>
                                <li>Husky + Commitlint</li>
                                <li>Changesets</li>
                                <li>CSS/SCSS support</li>
                                <li>Browser runtime target</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-2">Project Structure</h4>
                            <CodeBlock language="text" code={`my-ui/
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       ├── Button.stories.tsx
│   │       ├── Button.test.tsx
│   │       └── Button.module.css
│   └── index.ts
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── .github/
│   └── workflows/ci.yml
├── .husky/
├── .changeset/
├── package.json
├── vite.config.ts
└── tsconfig.json`} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <CodeBlock code="scaffoldkit create my-ui --preset component-library" />
                    </div>
                </div>
            </div>

            <h2 id="comparison" className="text-xl md:text-2xl font-bold mt-12 mb-4">Feature Comparison</h2>

            <div className="overflow-x-auto -mx-4 px-4">
                <table className="min-w-full text-xs md:text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-2 md:px-4 py-3 text-left font-semibold">Feature</th>
                            <th className="px-2 md:px-4 py-3 text-center font-semibold">Minimal</th>
                            <th className="px-2 md:px-4 py-3 text-center font-semibold">Standard</th>
                            <th className="px-2 md:px-4 py-3 text-center font-semibold">Enterprise</th>
                            <th className="px-2 md:px-4 py-3 text-center font-semibold">Component</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[
                            ['TypeScript', '✓', '✓', '✓', '✓'],
                            ['Build (tsup/Vite)', '✓', '✓', '✓', '✓'],
                            ['ESLint + Prettier', '—', '✓', '✓', '✓'],
                            ['Vitest', '—', '✓', '✓', '✓'],
                            ['GitHub Actions', '—', '✓', '✓', '✓'],
                            ['Dual CJS+ESM', '—', '—', '✓', '—'],
                            ['Husky Hooks', '—', '—', '✓', '✓'],
                            ['Commitlint', '—', '—', '✓', '✓'],
                            ['Semantic Release', '—', '—', '✓', '—'],
                            ['Changesets', '—', '—', '✓', '✓'],
                            ['Storybook', '—', '—', '—', '✓'],
                        ].map(([feature, ...values], i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="px-2 md:px-4 py-2 font-medium">{feature}</td>
                                {values.map((v, j) => (
                                    <td key={j} className={`px-2 md:px-4 py-2 text-center ${v === '✓' ? 'text-green-600' : 'text-slate-300'}`}>
                                        {v}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Callout type="tip" title="Custom Presets">
                Need a custom preset for your organization? Presets are just TypeScript files.
                You can create your own in <code>src/presets/</code> and register them in the CLI.
            </Callout>
        </DocPage>
    );
}
