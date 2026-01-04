import { DocPage, CodeBlock } from '../../components/DocPage';
import { Callout, CodeTabs } from '../../components/ui';

export default function Installation() {
    return (
        <DocPage title="Installation">
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
                ScaffoldKit is distributed via npm and designed to be lightweight.
                You can use it on-demand with <code>npx</code> or install it globally.
            </p>

            <h2 id="prerequisites" className="text-2xl font-bold mt-10 mb-4">Prerequisites</h2>

            <p className="mb-4">Before installing, ensure your environment meets these requirements:</p>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Requirement</th>
                            <th className="px-4 py-3 text-left font-semibold">Minimum Version</th>
                            <th className="px-4 py-3 text-left font-semibold">Recommended</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-4 py-3">Node.js</td>
                            <td className="px-4 py-3">18.0.0</td>
                            <td className="px-4 py-3">20.x LTS</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3">npm / pnpm / yarn</td>
                            <td className="px-4 py-3">npm 9+ / pnpm 8+ / yarn 1.22+</td>
                            <td className="px-4 py-3">pnpm 9+</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3">Git</td>
                            <td className="px-4 py-3">2.x</td>
                            <td className="px-4 py-3">Latest</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="installation-methods" className="text-2xl font-bold mt-12 mb-4">Installation Methods</h2>

            <h3 id="npx" className="text-xl font-semibold mt-8 mb-3">Method 1: On-Demand with npx (Recommended)</h3>

            <p className="mb-4">
                The most common way to use ScaffoldKit. This ensures you always use the latest version:
            </p>

            <CodeBlock code="npx scaffoldkit create my-lib" />

            <Callout type="tip" title="Why npx?">
                Using <code>npx</code> means no global installation, no version conflicts, and always the latest features.
                Perfect for occasional use or CI environments.
            </Callout>

            <h3 id="global" className="text-xl font-semibold mt-10 mb-3">Method 2: Global Installation</h3>

            <p className="mb-4">
                If you use ScaffoldKit frequently, install it globally for faster access:
            </p>

            <CodeTabs
                tabs={[
                    { label: 'npm', code: 'npm install -g scaffoldkit' },
                    { label: 'pnpm', code: 'pnpm add -g scaffoldkit' },
                    { label: 'yarn', code: 'yarn global add scaffoldkit' },
                    { label: 'bun', code: 'bun add -g scaffoldkit' },
                ]}
            />

            <h3 id="local" className="text-xl font-semibold mt-10 mb-3">Method 3: Project-Local Installation</h3>

            <p className="mb-4">
                Add ScaffoldKit as a dev dependency to access CLI tools within npm scripts:
            </p>

            <CodeBlock code="npm install -D scaffoldkit" />

            <p className="mt-4">Then use it in your <code>package.json</code> scripts:</p>

            <CodeBlock language="json" code={`{
  "scripts": {
    "check": "scaffoldkit check --score",
    "add:component": "scaffoldkit add component"
  }
}`} />

            <h2 id="verify" className="text-2xl font-bold mt-12 mb-4">Verifying Installation</h2>

            <p className="mb-4">Run the version command to confirm ScaffoldKit is installed correctly:</p>

            <CodeBlock code="scaffoldkit --version" />

            <p className="mt-4">You should see output like:</p>

            <CodeBlock language="text" code="scaffoldkit v1.0.0" />

            <Callout type="warning" title="Permission Errors?">
                <p>
                    If you encounter <code>EACCES</code> errors when installing globally, fix your npm permissions or use a Node version manager like <strong>nvm</strong> or <strong>volta</strong>.
                </p>
                <p className="mt-2">
                    <strong>Never use <code>sudo</code></strong> for npm global installs.
                </p>
            </Callout>

            <h2 id="updating" className="text-2xl font-bold mt-12 mb-4">Updating ScaffoldKit</h2>

            <CodeTabs
                tabs={[
                    { label: 'npm', code: 'npm update -g scaffoldkit' },
                    { label: 'pnpm', code: 'pnpm update -g scaffoldkit' },
                    { label: 'yarn', code: 'yarn global upgrade scaffoldkit' },
                ]}
            />
        </DocPage>
    );
}
