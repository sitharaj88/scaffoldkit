/**
 * React Library Generator
 * Generates React component libraries with modern best practices
 */
import type {
    GeneratorMeta,
    GeneratorConfig,
    DependencySpec,
    GeneratedFile,
    ValidationIssue,
} from '../../types/index.js';
import { BaseGenerator } from '../../core/base-generator.js';

export class ReactGenerator extends BaseGenerator {
    readonly meta: GeneratorMeta = {
        id: 'react-library',
        name: 'React Library',
        framework: 'react',
        description: 'Generate a React component library with TypeScript, modern build tools, and JSX support',
        version: '1.0.0',
        supportedPackageTypes: ['library', 'utility', 'plugin'],
        supportedRuntimeTargets: ['browser', 'universal'],
        recommendedBuildSystem: 'tsup',
    };

    protected getFrameworkDependencies(config: GeneratorConfig): DependencySpec[] {
        const deps: DependencySpec[] = [];

        // React as peer dependency
        deps.push(this.peerDep('react', '^18.0.0 || ^19.0.0'));
        deps.push(this.peerDep('react-dom', '^18.0.0 || ^19.0.0'));

        // React types as dev dependency
        deps.push(this.devDep('@types/react', '^18.0.0'));
        deps.push(this.devDep('@types/react-dom', '^18.0.0'));

        // Testing library
        deps.push(this.devDep('@testing-library/react', '^16.1.0'));
        deps.push(this.devDep('@testing-library/jest-dom', '^6.6.0'));
        deps.push(this.devDep('jsdom', '^25.0.0'));

        // ESLint for React
        deps.push(this.devDep('eslint', '^9.17.0'));
        deps.push(this.devDep('@eslint/js', '^9.17.0'));
        deps.push(this.devDep('eslint-plugin-react', '^7.37.0'));
        deps.push(this.devDep('eslint-plugin-react-hooks', '^5.1.0'));
        deps.push(this.devDep('globals', '^15.0.0'));
        deps.push(this.devDep('typescript-eslint', '^8.18.0'));

        // Vite plugin for testing
        deps.push(this.devDep('@vitejs/plugin-react', '^4.3.0'));

        return deps;
    }

    protected getFrameworkFiles(config: GeneratorConfig): GeneratedFile[] {
        const files: GeneratedFile[] = [];

        // Source files
        files.push({
            path: 'src/index.ts',
            template: 'react/src/index.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/components/Button/Button.tsx',
            template: 'react/src/components/Button/Button.tsx.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/components/Button/Button.test.tsx',
            template: 'react/src/components/Button/Button.test.tsx.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/components/Button/index.ts',
            template: 'react/src/components/Button/index.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/hooks/useToggle.ts',
            template: 'react/src/hooks/useToggle.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/hooks/useToggle.test.ts',
            template: 'react/src/hooks/useToggle.test.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/hooks/index.ts',
            template: 'react/src/hooks/index.ts.hbs',
            isTemplate: true,
        });

        // Config files
        files.push({
            path: 'eslint.config.js',
            template: 'react/eslint.config.js.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'vitest.setup.ts',
            template: 'common/vitest.setup.ts.hbs',
            isTemplate: true,
        });

        // Example app files (conditionally included)
        if (config.includeExample) {
            files.push({
                path: 'example/index.html',
                template: 'react/example/index.html.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/main.tsx',
                template: 'react/example/main.tsx.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/App.tsx',
                template: 'react/example/App.tsx.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/vite.config.ts',
                template: 'react/example/vite.config.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/package.json',
                template: 'react/example/package.json.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/tsconfig.json',
                template: 'react/example/tsconfig.json.hbs',
                isTemplate: true,
            });
        }

        return files;
    }

    protected getFrameworkPackageJsonExtras(config: GeneratorConfig): Record<string, unknown> {
        const scripts: Record<string, string> = {
            lint: 'eslint src',
            'lint:fix': 'eslint src --fix',
        };

        if (config.includeExample) {
            scripts['example:install'] = 'cd example && npm install';
            scripts['example:dev'] = 'cd example && npm run dev';
            scripts['example:prod'] = 'npm run build && cd example && npm run dev:prod';
        }

        return {
            peerDependenciesMeta: {
                'react-dom': {
                    optional: true,
                },
            },
            scripts,
        };
    }

    protected validateFrameworkConfig(config: GeneratorConfig): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        // React libraries should target browser
        if (config.runtimeTarget === 'node') {
            issues.push({
                severity: 'warning',
                category: 'config',
                message: 'React libraries typically target browser, not Node.js',
                suggestion: 'Consider using "browser" or "universal" as the runtime target',
            });
        }

        return issues;
    }
}

export const reactGenerator = new ReactGenerator();
export default reactGenerator;
