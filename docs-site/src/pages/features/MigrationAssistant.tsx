import { DocPage, CodeBlock } from '../../components/DocPage';
import { Callout } from '../../components/ui';

export default function MigrationAssistant() {
    return (
        <DocPage title="Migration Assistant">
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
                The <code>scaffoldkit migrate</code> command helps you modernize legacy projects by automating
                the migration of build systems, module formats, and testing frameworks.
            </p>

            <h2 id="supported-migrations" className="text-2xl font-bold mt-10 mb-4">Supported Migrations</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">From</th>
                            <th className="px-4 py-3 text-left font-semibold">To</th>
                            <th className="px-4 py-3 text-left font-semibold">Command</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-4 py-3">Vite (lib mode)</td>
                            <td className="px-4 py-3">tsup</td>
                            <td className="px-4 py-3 font-mono text-sm">scaffoldkit migrate --from vite --to tsup</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3">Rollup</td>
                            <td className="px-4 py-3">tsup</td>
                            <td className="px-4 py-3 font-mono text-sm">scaffoldkit migrate --from rollup --to tsup</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3">CommonJS</td>
                            <td className="px-4 py-3">ESM</td>
                            <td className="px-4 py-3 font-mono text-sm">scaffoldkit migrate --from cjs --to esm</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3">Jest</td>
                            <td className="px-4 py-3">Vitest</td>
                            <td className="px-4 py-3 font-mono text-sm">scaffoldkit migrate --from jest --to vitest</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="build-migration" className="text-2xl font-bold mt-12 mb-4">Build System Migration</h2>

            <h3 className="text-xl font-semibold mt-8 mb-3">Rollup to tsup</h3>

            <CodeBlock code="scaffoldkit migrate --from rollup --to tsup" />

            <p className="my-4">This migration:</p>

            <ul className="list-disc pl-6 space-y-2">
                <li>Analyzes your existing <code>rollup.config.js</code></li>
                <li>Generates an equivalent <code>tsup.config.ts</code></li>
                <li>Updates <code>package.json</code> build scripts</li>
                <li>Removes Rollup dependencies</li>
                <li>Adds tsup as a dev dependency</li>
            </ul>

            <h4 className="font-semibold mt-6 mb-2">Before (rollup.config.js)</h4>

            <CodeBlock language="javascript" code={`import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.cjs', format: 'cjs' },
    { file: 'dist/index.mjs', format: 'esm' },
  ],
  plugins: [resolve(), typescript(), terser()],
};`} />

            <h4 className="font-semibold mt-6 mb-2">After (tsup.config.ts)</h4>

            <CodeBlock language="typescript" code={`import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  minify: true,
  sourcemap: true,
  clean: true,
});`} />

            <h2 id="module-migration" className="text-2xl font-bold mt-12 mb-4">Module Format Migration</h2>

            <h3 className="text-xl font-semibold mt-8 mb-3">CommonJS to ESM</h3>

            <CodeBlock code="scaffoldkit migrate --from cjs --to esm" />

            <p className="my-4">This migration transforms:</p>

            <ul className="list-disc pl-6 space-y-2">
                <li><code>require()</code> → <code>import</code></li>
                <li><code>module.exports</code> → <code>export</code></li>
                <li>Adds <code>"type": "module"</code> to package.json</li>
                <li>Updates file extensions where needed</li>
            </ul>

            <Callout type="warning" title="Review Changes">
                Always review the migrated code before committing. Some edge cases
                (dynamic requires, __dirname usage) may need manual adjustment.
            </Callout>

            <h2 id="test-migration" className="text-2xl font-bold mt-12 mb-4">Test Framework Migration</h2>

            <h3 className="text-xl font-semibold mt-8 mb-3">Jest to Vitest</h3>

            <CodeBlock code="scaffoldkit migrate --from jest --to vitest" />

            <p className="my-4">This migration:</p>

            <ul className="list-disc pl-6 space-y-2">
                <li>Converts <code>jest.config.js</code> to <code>vitest.config.ts</code></li>
                <li>Updates test file imports</li>
                <li>Maps Jest globals to Vitest equivalents</li>
                <li>Preserves your test coverage settings</li>
            </ul>

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
                            <td className="px-4 py-3">Preview changes without modifying files</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-mono text-brand-600">--force</td>
                            <td className="px-4 py-3">Overwrite existing files without prompting</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </DocPage>
    );
}
