import { DocPage, CodeBlock } from '../../components/DocPage';

export default function Configuration() {
    return (
        <DocPage title="Configuration Guide">
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600">
                    ScaffoldKit embraces a <strong>"Convention over Configuration"</strong> philosophy.
                    However, all generated tools are fully exposed, meaning you configure them exactly as you would in a standard project.
                </p>

                <h2>Configuring Build (tsup)</h2>
                <p>
                    Libraries are built using <a href="https://tsup.egoist.dev/" target="_blank" className="text-brand-600 underline">tsup</a>.
                    The configuration lives in <code>tsup.config.ts</code>.
                </p>
                <CodeBlock language="typescript" code={`import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'], // Dual build support
  dts: true,              // Generate types
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,        // Enterprise optimization
});`} />

                <h2>Configuring Tests (Vitest)</h2>
                <p>
                    Testing is handled by <a href="https://vitest.dev/" target="_blank" className="text-brand-600 underline">Vitest</a>.
                    Settings are in <code>vitest.config.ts</code>.
                </p>
                <CodeBlock language="typescript" code={`import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom', // or 'jsdom' / 'node'
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});`} />

                <h2>Environment Variables</h2>
                <p>
                    ScaffoldKit respects standard environment variables:
                </p>
                <ul className="list-disc pl-6">
                    <li><code>CI=true</code>: Suppresses interactive prompts and some animations.</li>
                    <li><code>NODE_ENV</code>: Affects build output optimizations.</li>
                </ul>

            </div>
        </DocPage>
    );
}
