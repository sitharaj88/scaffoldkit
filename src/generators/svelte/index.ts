/**
 * Svelte Library Generator
 * Generates Svelte component libraries with TypeScript and SvelteKit packaging
 */
import type {
    GeneratorMeta,
    GeneratorConfig,
    DependencySpec,
    GeneratedFile,
    ValidationIssue,
} from '../../types/index.js';
import { BaseGenerator } from '../../core/base-generator.js';

export class SvelteGenerator extends BaseGenerator {
    readonly meta: GeneratorMeta = {
        id: 'svelte-library',
        name: 'Svelte Library',
        framework: 'svelte',
        description: 'Generate a Svelte component library with TypeScript, Vite, and svelte-package',
        version: '1.0.0',
        supportedPackageTypes: ['library', 'plugin', 'utility'],
        supportedRuntimeTargets: ['browser', 'universal'],
        recommendedBuildSystem: 'vite',
    };

    protected getFrameworkDependencies(config: GeneratorConfig): DependencySpec[] {
        const deps: DependencySpec[] = [];

        // Svelte as peer dependency
        deps.push(this.peerDep('svelte', '^4.0.0 || ^5.0.0'));

        // Svelte build tools
        deps.push(this.devDep('@sveltejs/package', '^2.3.0'));
        deps.push(this.devDep('@sveltejs/vite-plugin-svelte', '^4.0.0'));
        deps.push(this.devDep('svelte', '^5.0.0')); // Needed for dev
        deps.push(this.devDep('svelte-check', '^4.1.0'));

        // Testing
        deps.push(this.devDep('@testing-library/svelte', '^5.2.0'));
        deps.push(this.devDep('jsdom', '^25.0.0'));

        // ESLint for Svelte
        deps.push(this.devDep('eslint', '^9.17.0'));
        deps.push(this.devDep('@eslint/js', '^9.17.0'));
        deps.push(this.devDep('eslint-plugin-svelte', '^2.46.0'));
        deps.push(this.devDep('typescript-eslint', '^8.18.0'));

        // Svelte preprocessing
        deps.push(this.devDep('svelte-preprocess', '^6.0.0'));

        return deps;
    }

    protected getFrameworkFiles(config: GeneratorConfig): GeneratedFile[] {
        const files: GeneratedFile[] = [];

        // Source files
        files.push({
            path: 'src/lib/index.ts',
            template: 'svelte/src/lib/index.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/lib/components/Button/Button.svelte',
            template: 'svelte/src/lib/components/Button/Button.svelte.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/lib/components/Button/Button.test.ts',
            template: 'svelte/src/lib/components/Button/Button.test.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/lib/components/Button/index.ts',
            template: 'svelte/src/lib/components/Button/index.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/lib/stores/toggle.ts',
            template: 'svelte/src/lib/stores/toggle.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/lib/stores/toggle.test.ts',
            template: 'svelte/src/lib/stores/toggle.test.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/lib/stores/index.ts',
            template: 'svelte/src/lib/stores/index.ts.hbs',
            isTemplate: true,
        });

        // Config files
        files.push({
            path: 'svelte.config.js',
            template: 'svelte/svelte.config.js.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'eslint.config.js',
            template: 'svelte/eslint.config.js.hbs',
            isTemplate: true,
        });

        // Example app files (conditionally included)
        if (config.includeExample) {
            files.push({
                path: 'example/index.html',
                template: 'svelte/example/index.html.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/main.ts',
                template: 'svelte/example/main.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/App.svelte',
                template: 'svelte/example/App.svelte.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/vite.config.ts',
                template: 'svelte/example/vite.config.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/package.json',
                template: 'svelte/example/package.json.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/tsconfig.json',
                template: 'svelte/example/tsconfig.json.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/svelte.config.js',
                template: 'svelte/example/svelte.config.js.hbs',
                isTemplate: true,
            });
        }

        return files;
    }

    protected getFrameworkPackageJsonExtras(config: GeneratorConfig): Record<string, unknown> {
        const scripts: Record<string, string> = {
            build: 'svelte-package -i src/lib',
            lint: 'eslint src',
            'lint:fix': 'eslint src --fix',
            check: 'svelte-check --tsconfig ./tsconfig.json',
        };

        if (config.includeExample) {
            scripts['example:install'] = 'cd example && npm install';
            scripts['example:dev'] = 'cd example && npm run dev';
        }

        return {
            svelte: './dist/index.js',
            scripts,
            files: ['dist', '!dist/**/*.test.*'],
        };
    }

    protected validateFrameworkConfig(config: GeneratorConfig): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        // Svelte libraries should use svelte-package
        if (config.buildSystem !== 'vite') {
            issues.push({
                severity: 'warning',
                category: 'config',
                message: 'Svelte libraries typically use @sveltejs/package with Vite',
                suggestion: 'Consider using Vite for the build system',
            });
        }

        return issues;
    }
}

export const svelteGenerator = new SvelteGenerator();
export default svelteGenerator;
