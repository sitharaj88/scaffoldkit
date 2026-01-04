import { DocPage, CodeBlock } from '../../components/DocPage';
import { Callout } from '../../components/ui';

export default function QualityScore() {
    return (
        <DocPage title="Quality Score System">
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
                The Quality Score system audits your project against industry best practices
                and assigns a score from 0 to 100. Use it to maintain high standards before publishing.
            </p>

            <h2 id="usage" className="text-2xl font-bold mt-10 mb-4">Usage</h2>

            <CodeBlock code="scaffoldkit check --score" />

            <h2 id="scoring-breakdown" className="text-2xl font-bold mt-12 mb-4">Scoring Breakdown</h2>

            <p className="mb-6">
                The total score (100 points) is distributed across 5 categories:
            </p>

            <div className="space-y-4 my-8">
                {[
                    { name: 'Types', points: 20, desc: 'TypeScript configuration and type safety', checks: ['Strict mode enabled', 'No any types in exports', 'Declaration files generated'] },
                    { name: 'Exports', points: 20, desc: 'Package.json exports configuration', checks: ['Modern exports field', 'Correct entry points', 'Types field set'] },
                    { name: 'Size', points: 20, desc: 'Bundle size optimization', checks: ['Bundle under limit', 'Tree-shaking enabled', 'No unused dependencies'] },
                    { name: 'Documentation', points: 20, desc: 'README and JSDoc coverage', checks: ['README exists', 'JSDoc on exports', 'Examples provided'] },
                    { name: 'Tests', points: 20, desc: 'Test coverage and configuration', checks: ['Test files exist', 'Coverage config set', 'CI runs tests'] },
                ].map((category) => (
                    <div key={category.name} className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900">{category.name}</h3>
                                <p className="text-sm text-slate-600">{category.desc}</p>
                            </div>
                            <span className="text-2xl font-bold text-brand-600">{category.points}pts</span>
                        </div>
                        <div className="px-6 py-4">
                            <ul className="space-y-1">
                                {category.checks.map((check, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                        <span className="text-green-500">✓</span> {check}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <h2 id="example-output" className="text-2xl font-bold mt-12 mb-4">Example Output</h2>

            <div className="rounded-xl bg-slate-900 p-6 my-6 font-mono text-sm overflow-x-auto">
                <div className="space-y-4 text-slate-300">
                    <div className="text-slate-400">Running quality checks...</div>
                    <div className="space-y-1">
                        <div><span className="text-green-400">✓</span> Types: <span className="text-green-400">20/20</span></div>
                        <div><span className="text-green-400">✓</span> Exports: <span className="text-green-400">20/20</span></div>
                        <div><span className="text-amber-400">!</span> Size: <span className="text-amber-400">15/20</span> <span className="text-slate-500">- Bundle exceeds recommended size</span></div>
                        <div><span className="text-green-400">✓</span> Docs: <span className="text-green-400">20/20</span></div>
                        <div><span className="text-red-400">✗</span> Tests: <span className="text-red-400">10/20</span> <span className="text-slate-500">- Coverage below 80%</span></div>
                    </div>
                    <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                        <span className="text-xl font-bold">Total Score</span>
                        <span className="text-3xl font-bold text-amber-400">85/100</span>
                    </div>
                </div>
            </div>

            <h2 id="fixing-issues" className="text-2xl font-bold mt-12 mb-4">Fixing Issues</h2>

            <p className="mb-4">
                Use the <code>--fix</code> flag to automatically resolve common issues:
            </p>

            <CodeBlock code="scaffoldkit check --fix" />

            <Callout type="info" title="What Gets Fixed">
                <ul className="list-disc pl-5 space-y-1">
                    <li>Missing exports field in package.json</li>
                    <li>Incorrect TypeScript config options</li>
                    <li>Missing sideEffects field</li>
                    <li>Outdated ESLint configuration</li>
                </ul>
            </Callout>

            <h2 id="ci-integration" className="text-2xl font-bold mt-12 mb-4">CI Integration</h2>

            <p className="mb-4">
                Add quality checks to your CI pipeline to fail builds below a threshold:
            </p>

            <CodeBlock language="yaml" code={`# .github/workflows/ci.yml
- name: Quality Check
  run: scaffoldkit check --score --min-score 80`} />

            <Callout type="tip" title="Recommended Thresholds">
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>90+</strong>: Excellent - ready for production</li>
                    <li><strong>80-89</strong>: Good - minor improvements needed</li>
                    <li><strong>70-79</strong>: Fair - review before publishing</li>
                    <li><strong>&lt;70</strong>: Needs work - significant issues</li>
                </ul>
            </Callout>
        </DocPage>
    );
}
