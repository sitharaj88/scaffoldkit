import { DocPage, CodeBlock } from '../../components/DocPage';
import { Callout } from '../../components/ui';

export default function ComponentGenerator() {
  return (
    <DocPage title="Component Generator">
      <p className="text-xl text-slate-600 leading-relaxed mb-8">
        The <code>scaffoldkit add</code> command generates new code assets within an existing project.
        Create components, hooks, utilities, and more with consistent structure and best practices.
      </p>

      <h2 id="basic-usage" className="text-2xl font-bold mt-10 mb-4">Basic Usage</h2>

      <CodeBlock code="scaffoldkit add <type> <name>" />

      <h3 id="types" className="text-xl font-semibold mt-8 mb-3">Available Types</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
              <th className="px-4 py-3 text-left font-semibold">Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-mono text-brand-600">component</td>
              <td className="px-4 py-3">React/Vue/Svelte component</td>
              <td className="px-4 py-3 font-mono text-sm">scaffoldkit add component Button</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-brand-600">hook</td>
              <td className="px-4 py-3">React hook (use prefix auto-added)</td>
              <td className="px-4 py-3 font-mono text-sm">scaffoldkit add hook LocalStorage</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-brand-600">util</td>
              <td className="px-4 py-3">Utility function</td>
              <td className="px-4 py-3 font-mono text-sm">scaffoldkit add util formatDate</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-brand-600">context</td>
              <td className="px-4 py-3">React Context provider</td>
              <td className="px-4 py-3 font-mono text-sm">scaffoldkit add context Theme</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="examples" className="text-2xl font-bold mt-12 mb-4">Examples</h2>

      <h3 className="text-xl font-semibold mt-8 mb-3">Creating a Component</h3>

      <CodeBlock code="scaffoldkit add component Button" />

      <p className="my-4">This generates:</p>

      <CodeBlock language="text" code={`src/components/Button/
├── Button.tsx           # Component implementation
├── Button.test.tsx      # Test file
├── Button.module.css    # Scoped styles (optional)
└── index.ts             # Barrel export`} />

      <h4 className="font-semibold mt-6 mb-2">Generated Component</h4>

      <CodeBlock language="tsx" code={`import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export function Button({ 
  children, 
  variant = 'primary', 
  onClick 
}: ButtonProps) {
  return (
    <button 
      className={\`\${styles.button} \${styles[variant]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}`} />

      <h3 className="text-xl font-semibold mt-10 mb-3">Creating a Hook</h3>

      <CodeBlock code="scaffoldkit add hook LocalStorage" />

      <p className="my-4">Generates <code>src/hooks/useLocalStorage.ts</code>:</p>

      <CodeBlock language="tsx" code={`import { useState, useEffect } from 'react';

export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}`} />

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
              <td className="px-4 py-3">Preview files without writing to disk</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-brand-600">--no-test</td>
              <td className="px-4 py-3">Skip generating test file</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-brand-600">--no-styles</td>
              <td className="px-4 py-3">Skip generating CSS module</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="tip" title="Auto-Detection">
        ScaffoldKit automatically detects your project's framework (React, Vue, Svelte)
        and generates the appropriate component syntax.
      </Callout>
    </DocPage>
  );
}
