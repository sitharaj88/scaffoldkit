import { DocPage, CodeBlock } from '../../components/DocPage';

export default function CliCommands() {
    return (
        <DocPage title="CLI Reference">
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600">
                    A definitive guide to all ScaffoldKit commands, options, and flags.
                </p>

                <hr className="my-8" />

                <h2 id="create" className="font-mono text-2xl">create</h2>
                <p>Initializes a new project.</p>
                <CodeBlock code="scaffoldkit create [name] [options]" />

                <h4 className="font-bold mt-4">Arguments</h4>
                <ul className="list-disc pl-6 mb-4">
                    <li><code>name</code> (optional): The name of the directory/package to create.</li>
                </ul>

                <h4 className="font-bold">Options</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b-2 border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Flag</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Default</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="bg-slate-50">
                                <td className="px-4 py-2 font-mono text-brand-600">--preset &lt;name&gt;</td>
                                <td className="px-4 py-2">Use a pre-defined configuration template</td>
                                <td className="px-4 py-2 text-slate-400">-</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-mono text-brand-600">--dry-run</td>
                                <td className="px-4 py-2">Preview changes without writing to disk</td>
                                <td className="px-4 py-2 text-slate-400">false</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <hr className="my-8" />

                <h2 id="check" className="font-mono text-2xl">check</h2>
                <p>Validates an existing package against quality standards.</p>
                <CodeBlock code="scaffoldkit check [path] [options]" />

                <h4 className="font-bold">Options</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="uppercase tracking-wider border-b-2 border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Flag</th>
                                <th className="px-4 py-3">Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <tr className="bg-slate-50">
                                <td className="px-4 py-2 font-mono text-brand-600">--score</td>
                                <td className="px-4 py-2">Calculate and display a quality score (0-100)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-mono text-brand-600">--size-limit &lt;kb&gt;</td>
                                <td className="px-4 py-2">Fail if bundle size exceeds limit (e.g. "50KB")</td>
                            </tr>
                            <tr className="bg-slate-50">
                                <td className="px-4 py-2 font-mono text-brand-600">--fix</td>
                                <td className="px-4 py-2">Attempt to automatically fix issues</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <hr className="my-8" />

                <h2 id="publish" className="font-mono text-2xl">publish</h2>
                <p>Publishes the package to npm with safety checks.</p>
                <CodeBlock code="scaffoldkit publish [options]" />

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
                    <p className="m-0 text-sm text-amber-800">
                        <strong>Note:</strong> This command will fail if any pre-flight checks (git clean, tests pass, build success) fail.
                    </p>
                </div>

                <hr className="my-8" />

                <h2 id="add" className="font-mono text-2xl">add</h2>
                <p>Generates new code assets within an existing project.</p>
                <CodeBlock code="scaffoldkit add <type> <name>" />

                <h4 className="font-bold mt-4">Examples</h4>
                <CodeBlock code={`scaffoldkit add component Button
scaffoldkit add hook useLocalStorage
scaffoldkit add util formatDate`} />

            </div>
        </DocPage>
    );
}
