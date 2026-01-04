import { DocPage, CodeBlock } from '../../components/DocPage';

export default function Architecture() {
    return (
        <DocPage title="Architecture">
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600">
                    ScaffoldKit is built on a modular, hex-agonal architecture designed for extensibility and testability.
                    It separates the core logic (CLI glue, file system, logging) from the specific implementations (Framework Generators).
                </p>

                <h2>High-Level Logic Flow</h2>
                <div className="my-8 p-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <CodeBlock language="mermaid" code={`graph TD
    User[User Input] --> CLI[CLI Entry Point]
    CLI --> Wizard[Interactive Wizard]
    Wizard --> Config[Generator Configuration]
    Config --> Registry[Generator Registry]
    Registry --> Gen{Specific Generator}
    
    Gen -->|React| ReactGen[React Generator]
    Gen -->|Vue| VueGen[Vue Generator]
    Gen -->|Node| NodeGen[Node Generator]
    
    ReactGen --> Base[Base Generator]
    VueGen --> Base
    NodeGen --> Base
    
    Base --> FS[File System Utils]
    Base --> Tpl[Handlebars Templates]
    Base --> Dep[Dependency Manager]
    
    FS --> Disk[Write to Disk]`} />
                </div>

                <h2>Core Components</h2>

                <h3>1. The Base Generator</h3>
                <p>
                    At the heart of ScaffoldKit is the <code>BaseGenerator</code> class. All specific framework generators extend this class.
                    It provides high-level APIs for common tasks:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                    <li><strong>File Operations</strong>: Safe writing, formatting (Prettier), and conflict resolution.</li>
                    <li><strong>Dependency Management</strong>: Adding dev/peer/prod dependencies with version resolution.</li>
                    <li><strong>Template Rendering</strong>: Compiling Handlebars templates with context.</li>
                </ul>

                <h3>2. The Registry</h3>
                <p>
                    The <code>Registry</code> pattern decouples the CLI wizard from the available generators.
                    New frameworks can be added by simply registering a new class that implements the <code>Generator</code> interface.
                </p>

                <h3>3. Universal Tools</h3>
                <p>
                    Regardless of the framework, ScaffoldKit standardizes on a modern toolchain:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Build</strong>: tsup (for libraries) / Vite (for apps)</li>
                    <li><strong>Test</strong>: Vitest (fast, Jest-compatible)</li>
                    <li><strong>Lint</strong>: ESLint (flat config)</li>
                </ul>
            </div>
        </DocPage>
    );
}
