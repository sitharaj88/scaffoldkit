import { DocPage, CodeBlock } from '../../components/DocPage';
import { Callout } from '../../components/ui';

export default function DocsGenerator() {
    return (
        <DocPage title="Documentation Generator">
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
                The <code>scaffoldkit docs</code> command automatically generates API documentation
                from your TypeScript source code using JSDoc/TSDoc comments.
            </p>

            <h2 id="basic-usage" className="text-2xl font-bold mt-10 mb-4">Basic Usage</h2>

            <CodeBlock code="scaffoldkit docs generate" />

            <p className="my-4">This scans your <code>src/</code> directory and generates documentation in <code>docs/API.md</code>.</p>

            <h2 id="output-formats" className="text-2xl font-bold mt-12 mb-4">Output Formats</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Format</th>
                            <th className="px-4 py-3 text-left font-semibold">Command</th>
                            <th className="px-4 py-3 text-left font-semibold">Output</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-4 py-3">Markdown</td>
                            <td className="px-4 py-3 font-mono text-sm">scaffoldkit docs generate --format md</td>
                            <td className="px-4 py-3">docs/API.md</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3">JSON</td>
                            <td className="px-4 py-3 font-mono text-sm">scaffoldkit docs generate --format json</td>
                            <td className="px-4 py-3">docs/api.json</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="live-server" className="text-2xl font-bold mt-12 mb-4">Live Documentation Server</h2>

            <p className="mb-4">
                Preview your documentation locally with hot-reloading:
            </p>

            <CodeBlock code="scaffoldkit docs serve" />

            <p className="my-4">
                This starts a development server at <code>http://localhost:3000</code> that automatically
                updates when you modify your source files.
            </p>

            <Callout type="tip" title="Great for README">
                Use the generated Markdown output directly in your README.md or GitHub Wiki
                for always up-to-date API documentation.
            </Callout>

            <h2 id="writing-docs" className="text-2xl font-bold mt-12 mb-4">Writing Good Documentation</h2>

            <p className="mb-4">
                ScaffoldKit extracts documentation from your TSDoc/JSDoc comments:
            </p>

            <CodeBlock language="typescript" code={`/**
 * Formats a date into a human-readable string.
 * 
 * @param date - The date to format
 * @param options - Formatting options
 * @returns A formatted date string
 * 
 * @example
 * \`\`\`ts
 * formatDate(new Date(), { locale: 'en-US' })
 * // => "January 1, 2024"
 * \`\`\`
 */
export function formatDate(
  date: Date, 
  options?: FormatOptions
): string {
  // implementation
}`} />

            <h3 className="text-xl font-semibold mt-8 mb-3">Generated Output</h3>

            <CodeBlock language="markdown" code={`## formatDate

Formats a date into a human-readable string.

### Parameters

| Name | Type | Description |
|------|------|-------------|
| date | \`Date\` | The date to format |
| options | \`FormatOptions\` | Formatting options |

### Returns

\`string\` - A formatted date string

### Example

\`\`\`ts
formatDate(new Date(), { locale: 'en-US' })
// => "January 1, 2024"
\`\`\``} />

            <h2 id="options" className="text-2xl font-bold mt-12 mb-4">Command Options</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold">Flag</th>
                            <th className="px-4 py-3 text-left font-semibold">Description</th>
                            <th className="px-4 py-3 text-left font-semibold">Default</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-4 py-3 font-mono text-brand-600">--format</td>
                            <td className="px-4 py-3">Output format (md, json)</td>
                            <td className="px-4 py-3">md</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-mono text-brand-600">--output</td>
                            <td className="px-4 py-3">Output directory</td>
                            <td className="px-4 py-3">docs/</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-mono text-brand-600">--port</td>
                            <td className="px-4 py-3">Server port (for serve)</td>
                            <td className="px-4 py-3">3000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </DocPage>
    );
}
