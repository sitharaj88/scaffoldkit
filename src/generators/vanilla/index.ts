/**
 * TypeScript Utility Package Generator
 * Generates framework-agnostic TypeScript utility libraries
 */
import type {
    GeneratorMeta,
    GeneratorConfig,
    DependencySpec,
    GeneratedFile,
    ValidationIssue,
} from '../../types/index.js';
import { BaseGenerator } from '../../core/base-generator.js';

export class VanillaGenerator extends BaseGenerator {
    readonly meta: GeneratorMeta = {
        id: 'typescript-utility',
        name: 'TypeScript Utility Package',
        framework: 'vanilla',
        description: 'Generate a framework-agnostic TypeScript utility library',
        version: '1.0.0',
        supportedPackageTypes: ['utility', 'library', 'sdk'],
        supportedRuntimeTargets: ['browser', 'node', 'edge', 'universal'],
        recommendedBuildSystem: 'tsup',
    };

    protected getFrameworkDependencies(config: GeneratorConfig): DependencySpec[] {
        const deps: DependencySpec[] = [];

        // ESLint
        deps.push(this.devDep('eslint', '^9.17.0'));
        deps.push(this.devDep('@eslint/js', '^9.17.0'));
        deps.push(this.devDep('typescript-eslint', '^8.18.0'));
        deps.push(this.devDep('globals', '^15.0.0'));

        // Prettier
        deps.push(this.devDep('prettier', '^3.4.0'));

        return deps;
    }

    protected getFrameworkFiles(config: GeneratorConfig): GeneratedFile[] {
        const files: GeneratedFile[] = [];

        // Source files
        files.push({
            path: 'src/index.ts',
            template: 'vanilla/src/index.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/utils/string.ts',
            template: 'vanilla/src/utils/string.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/utils/string.test.ts',
            template: 'vanilla/src/utils/string.test.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/utils/array.ts',
            template: 'vanilla/src/utils/array.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/utils/array.test.ts',
            template: 'vanilla/src/utils/array.test.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/utils/index.ts',
            template: 'vanilla/src/utils/index.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/types.ts',
            template: 'vanilla/src/types.ts.hbs',
            isTemplate: true,
        });

        // Config files
        files.push({
            path: 'eslint.config.js',
            template: 'vanilla/eslint.config.js.hbs',
            isTemplate: true,
        });

        files.push({
            path: '.prettierrc',
            template: 'vanilla/.prettierrc.hbs',
            isTemplate: true,
        });

        // Example app files (conditionally included)
        if (config.includeExample) {
            files.push({
                path: 'example/index.html',
                template: 'vanilla/example/index.html.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/main.ts',
                template: 'vanilla/example/main.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/vite.config.ts',
                template: 'vanilla/example/vite.config.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/package.json',
                template: 'vanilla/example/package.json.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/tsconfig.json',
                template: 'vanilla/example/tsconfig.json.hbs',
                isTemplate: true,
            });
        }

        return files;
    }

    protected getFrameworkPackageJsonExtras(config: GeneratorConfig): Record<string, unknown> {
        const scripts: Record<string, string> = {
            lint: 'eslint src',
            'lint:fix': 'eslint src --fix',
            format: 'prettier --write src',
            'format:check': 'prettier --check src',
        };

        if (config.includeExample) {
            scripts['example:install'] = 'cd example && npm install';
            scripts['example:dev'] = 'cd example && npm run dev';
        }

        const extras: Record<string, unknown> = {
            scripts,
        };

        // Add Node.js engines if targeting Node
        if (config.runtimeTarget === 'node' || config.runtimeTarget === 'universal') {
            extras.engines = {
                node: '>=18.0.0',
            };
        }

        return extras;
    }

    protected validateFrameworkConfig(config: GeneratorConfig): ValidationIssue[] {
        return [];
    }
}

export const vanillaGenerator = new VanillaGenerator();
export default vanillaGenerator;
