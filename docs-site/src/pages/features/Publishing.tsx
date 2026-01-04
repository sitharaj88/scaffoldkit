import { DocPage, CodeBlock } from '../../components/DocPage';
import { Callout } from '../../components/ui';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function Publishing() {
    return (
        <DocPage title="Publish Wizard">
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
                The Publish Wizard guides you through safe npm publishing with 8 pre-flight checks.
                Never accidentally publish broken or incomplete code again.
            </p>

            <h2 id="usage" className="text-2xl font-bold mt-10 mb-4">Usage</h2>

            <CodeBlock code="scaffoldkit publish" />

            <h2 id="preflight-checks" className="text-2xl font-bold mt-12 mb-4">Pre-Flight Checks</h2>

            <p className="mb-6">
                Before publishing, ScaffoldKit runs these 8 verifications:
            </p>

            <div className="space-y-3 my-8">
                {[
                    { num: 1, name: 'Git Status', desc: 'Ensures no uncommitted changes exist' },
                    { num: 2, name: 'Branch Check', desc: 'Verifies you are on main or master branch' },
                    { num: 3, name: 'Tests Pass', desc: 'Runs your full test suite' },
                    { num: 4, name: 'Build Success', desc: 'Verifies clean production build' },
                    { num: 5, name: 'Registry Check', desc: 'Confirms npm registry is reachable' },
                    { num: 6, name: 'Version Check', desc: 'Ensures version does not already exist' },
                    { num: 7, name: 'Changelog', desc: 'Verifies CHANGELOG.md is updated' },
                    { num: 8, name: 'Secret Scan', desc: 'Checks for accidentally committed secrets' },
                ].map((check) => (
                    <div key={check.num} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 bg-white">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-sm font-bold">
                            {check.num}
                        </span>
                        <div>
                            <p className="font-semibold text-slate-900">{check.name}</p>
                            <p className="text-sm text-slate-600">{check.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2 id="example-output" className="text-2xl font-bold mt-12 mb-4">Example Output</h2>

            <div className="rounded-xl bg-slate-900 p-6 my-6 font-mono text-sm overflow-x-auto">
                <div className="space-y-2 text-slate-300">
                    <div className="text-brand-400 font-bold mb-4">ScaffoldKit Publish Wizard</div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Git status: clean</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Branch: main</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Tests: 42 passed</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Build: success</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Registry: reachable</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Version 1.2.0: available</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Changelog: updated</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Secrets: none found</div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-700">
                        <div className="text-green-400">All checks passed! Ready to publish.</div>
                        <div className="mt-2 text-slate-400">? Publish my-lib@1.2.0 to npm? (Y/n)</div>
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-3">When Checks Fail</h3>

            <div className="rounded-xl bg-slate-900 p-6 my-6 font-mono text-sm overflow-x-auto">
                <div className="space-y-2 text-slate-300">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Git status: clean</div>
                        <div className="flex items-center gap-2"><XCircle size={16} className="text-red-400" /> Branch: feature/new-api <span className="text-red-400">(expected: main)</span></div>
                        <div className="flex items-center gap-2"><XCircle size={16} className="text-red-400" /> Tests: 2 failed</div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-700 text-red-400">
                        ✗ Pre-flight checks failed. Cannot publish.
                    </div>
                </div>
            </div>

            <Callout type="warning" title="Safety First">
                The publish command will <strong>never</strong> publish if any check fails.
                This prevents accidentally releasing broken code to production.
            </Callout>

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
                            <td className="px-4 py-3 font-mono text-brand-600">--dry-run</td>
                            <td className="px-4 py-3">Run all checks but don't actually publish</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-mono text-brand-600">--skip-tests</td>
                            <td className="px-4 py-3">Skip running tests (use with caution)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-mono text-brand-600">--tag &lt;tag&gt;</td>
                            <td className="px-4 py-3">Publish with specific npm tag (e.g., beta)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-mono text-brand-600">--access &lt;type&gt;</td>
                            <td className="px-4 py-3">Set package access (public/restricted)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="ci-integration" className="text-2xl font-bold mt-12 mb-4">CI Integration</h2>

            <p className="mb-4">
                For automated releases (e.g., with semantic-release), use the <code>--ci</code> flag:
            </p>

            <CodeBlock language="yaml" code={`# .github/workflows/release.yml
- name: Publish
  run: scaffoldkit publish --ci
  env:
    NPM_TOKEN: \${{ secrets.NPM_TOKEN }}`} />
        </DocPage>
    );
}
