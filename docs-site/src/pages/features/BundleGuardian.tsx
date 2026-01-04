import { DocPage, CodeBlock } from '../../components/DocPage';
import { Callout } from '../../components/ui';

export default function BundleGuardian() {
    return (
        <DocPage title="Bundle Size Guardian">
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
                The Bundle Guardian prevents bloat by enforcing size limits on your production builds.
                Catch regressions before they ship to users.
            </p>

            <h2 id="usage" className="text-2xl font-bold mt-10 mb-4">Usage</h2>

            <CodeBlock code="scaffoldkit check --size-limit 50KB" />

            <h2 id="how-it-works" className="text-2xl font-bold mt-12 mb-4">How It Works</h2>

            <ol className="list-decimal pl-6 space-y-3 my-6">
                <li>Builds your project in production mode</li>
                <li>Measures the total size of output files</li>
                <li>Calculates <strong>minified</strong>, <strong>GZIP</strong>, and <strong>Brotli</strong> sizes</li>
                <li>Compares against your specified limit</li>
                <li>Fails the check if limit is exceeded</li>
            </ol>

            <h2 id="output-example" className="text-2xl font-bold mt-12 mb-4">Output Examples</h2>

            <h3 className="text-xl font-semibold mt-8 mb-3">Passing Check</h3>

            <div className="rounded-xl bg-slate-900 p-6 my-6 font-mono text-sm">
                <div className="space-y-2 text-slate-300">
                    <div className="text-slate-400">Analyzing bundle size...</div>
                    <div className="mt-4 space-y-1">
                        <div>dist/index.js <span className="text-slate-500">─────</span> <span className="text-slate-400">42.3 KB</span> → <span className="text-green-400">12.1 KB gzip</span></div>
                        <div>dist/index.d.ts <span className="text-slate-500">────</span> <span className="text-slate-400">2.1 KB</span></div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-700">
                        <span className="text-green-400">✓</span> Total: <span className="font-bold">12.1 KB</span> (limit: 50 KB)
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">Failing Check</h3>

            <div className="rounded-xl bg-slate-900 p-6 my-6 font-mono text-sm">
                <div className="space-y-2 text-slate-300">
                    <div className="text-slate-400">Analyzing bundle size...</div>
                    <div className="mt-4 space-y-1">
                        <div>dist/index.js <span className="text-slate-500">─────</span> <span className="text-slate-400">156.8 KB</span> → <span className="text-red-400">52.4 KB gzip</span></div>
                        <div>dist/utils.js <span className="text-slate-500">──────</span> <span className="text-slate-400">23.1 KB</span> → <span className="text-amber-400">7.2 KB gzip</span></div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-700">
                        <span className="text-red-400">✗</span> Total: <span className="font-bold text-red-400">59.6 KB</span> (limit: 50 KB) - <span className="text-red-400">EXCEEDED</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-700 text-slate-400">
                        <div className="mb-2">Largest modules:</div>
                        <div className="pl-4 space-y-1 text-sm">
                            <div>1. node_modules/lodash <span className="text-red-400">24.1 KB</span></div>
                            <div>2. src/components/DataTable <span className="text-amber-400">12.3 KB</span></div>
                            <div>3. node_modules/date-fns <span className="text-amber-400">8.7 KB</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <Callout type="tip" title="Reducing Bundle Size">
                <ul className="list-disc pl-5 space-y-1">
                    <li>Use <code>import {"{ specific }"}</code> instead of <code>import *</code></li>
                    <li>Replace heavy dependencies (lodash → lodash-es or native)</li>
                    <li>Enable tree-shaking in your bundler</li>
                    <li>Lazy-load large modules</li>
                </ul>
            </Callout>

            <h2 id="ci-integration" className="text-2xl font-bold mt-12 mb-4">CI Integration</h2>

            <p className="mb-4">
                Add bundle size checks to your CI pipeline:
            </p>

            <CodeBlock language="yaml" code={`# .github/workflows/ci.yml
- name: Bundle Size Check
  run: scaffoldkit check --size-limit 50KB
  
- name: Strict Check (fail on any increase)
  run: scaffoldkit check --size-limit 50KB --fail-on-increase`} />

            <h2 id="options" className="text-2xl font-bold mt-12 mb-4">Command Options</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Flag</th>
                            <th className="px-4 py-3 text-left font-semibold">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-4 py-3 font-mono text-brand-600">--size-limit &lt;size&gt;</td>
                            <td className="px-4 py-3">Maximum allowed size (e.g., "50KB", "1MB")</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-mono text-brand-600">--fail-on-increase</td>
                            <td className="px-4 py-3">Fail if size increased from last build</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-mono text-brand-600">--json</td>
                            <td className="px-4 py-3">Output results as JSON for CI parsing</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </DocPage>
    );
}
