import { DocPage, CodeBlock } from '../../components/DocPage';

export default function CiTemplates() {
    return (
        <DocPage title="CI Templates">
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600">
                    ScaffoldKit auto-generates production-grade CI pipeline configurations for GitHub Actions and GitLab CI.
                </p>

                <h2>GitHub Actions</h2>
                <p>A <code>.github/workflows/ci.yml</code> file is generated with caching and parallel execution.</p>

                <CodeBlock language="yaml" code={`name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          
      - run: npm ci
      
      - name: Lint
        run: npm run lint
        
      - name: Type Check
        run: npm run typecheck
        
      - name: Test
        run: npm run test`} />

                <h2>Key Features</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Automated Caching</strong>: Drastically reduces install times by caching <code>node_modules</code>.</li>
                    <li><strong>Parallel Checks</strong>: Linting, types, and tests run in optimized order.</li>
                    <li><strong>Branch Protection</strong>: Compatible with GitHub/GitLab branch protection rules for PRs.</li>
                </ul>
            </div>
        </DocPage>
    );
}
