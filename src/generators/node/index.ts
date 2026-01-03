/**
 * Node.js / CLI Package Generator
 * Generates Node.js packages and CLI tools
 */
import type {
    GeneratorMeta,
    GeneratorConfig,
    DependencySpec,
    GeneratedFile,
    ExportConfig,
    ValidationIssue,
} from '../../types/index.js';
import { BaseGenerator } from '../../core/base-generator.js';

export class NodeGenerator extends BaseGenerator {
    readonly meta: GeneratorMeta = {
        id: 'node-package',
        name: 'Node.js Package',
        framework: 'node',
        description: 'Generate a Node.js package or CLI tool with TypeScript',
        version: '1.0.0',
        supportedPackageTypes: ['utility', 'library', 'cli', 'sdk'],
        supportedRuntimeTargets: ['node', 'edge'],
        recommendedBuildSystem: 'tsup',
    };

    protected getFrameworkDependencies(config: GeneratorConfig): DependencySpec[] {
        const deps: DependencySpec[] = [];

        // Node.js specific types
        deps.push(this.devDep('@types/node', '^22.10.0'));

        // ESLint
        deps.push(this.devDep('eslint', '^9.17.0'));
        deps.push(this.devDep('@eslint/js', '^9.17.0'));
        deps.push(this.devDep('typescript-eslint', '^8.18.0'));
        deps.push(this.devDep('globals', '^15.0.0'));

        // CLI-specific dependencies
        if (config.packageType === 'cli') {
            deps.push(this.dep('commander', '^12.1.0'));
            deps.push(this.dep('chalk', '^5.3.0'));
            deps.push(this.dep('@inquirer/prompts', '^7.2.0'));
            deps.push(this.dep('ora', '^8.1.0'));
        }

        return deps;
    }

    protected getFrameworkFiles(config: GeneratorConfig): GeneratedFile[] {
        const files: GeneratedFile[] = [];

        if (config.packageType === 'cli') {
            // CLI files
            files.push({
                path: 'src/index.ts',
                template: 'node/src/index-cli.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'src/bin/cli.ts',
                template: 'node/src/bin/cli.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'src/commands/init.ts',
                template: 'node/src/commands/init.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'src/commands/index.ts',
                template: 'node/src/commands/index.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'src/utils/logger.ts',
                template: 'node/src/utils/logger.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'src/utils/index.ts',
                template: 'node/src/utils/index.ts.hbs',
                isTemplate: true,
            });
        } else {
            // Library files
            files.push({
                path: 'src/index.ts',
                template: 'node/src/index.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'src/core/client.ts',
                template: 'node/src/core/client.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'src/core/client.test.ts',
                template: 'node/src/core/client.test.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'src/core/index.ts',
                template: 'node/src/core/index.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'src/types.ts',
                template: 'node/src/types.ts.hbs',
                isTemplate: true,
            });
        }

        // Config files
        files.push({
            path: 'eslint.config.js',
            template: 'node/eslint.config.js.hbs',
            isTemplate: true,
        });

        // Example app files (conditionally included)
        if (config.includeExample) {
            files.push({
                path: 'example/package.json',
                template: 'node/example/package.json.hbs',
                isTemplate: true,
            });

            if (config.packageType === 'cli') {
                files.push({
                    path: 'example/demo.sh',
                    template: 'node/example/demo.sh.hbs',
                    isTemplate: true,
                });
            } else {
                files.push({
                    path: 'example/usage.ts',
                    template: 'node/example/usage.ts.hbs',
                    isTemplate: true,
                });
            }
        }

        return files;
    }

    getExports(config: GeneratorConfig): ExportConfig[] {
        const exports = super.getExports(config);

        // Add bin entry for CLI packages
        if (config.packageType === 'cli') {
            exports.push({
                path: './bin',
                types: './dist/bin/cli.d.ts',
                import: './dist/bin/cli.js',
            });
        }

        return exports;
    }

    protected getFrameworkPackageJsonExtras(config: GeneratorConfig): Record<string, unknown> {
        const extras: Record<string, unknown> = {
            engines: {
                node: '>=18.0.0',
            },
            scripts: {
                lint: 'eslint src',
                'lint:fix': 'eslint src --fix',
            },
        };

        if (config.includeExample && config.packageType !== 'cli') {
            (extras.scripts as Record<string, string>)['example:run'] = 'cd example && npx tsx usage.ts';
        }

        // Add bin for CLI packages
        if (config.packageType === 'cli') {
            const packageShortName = config.name.replace(/^@[^/]+\//, '');
            extras.bin = {
                [packageShortName]: './dist/bin/cli.js',
            };
        }

        return extras;
    }

    protected validateFrameworkConfig(config: GeneratorConfig): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        // Node packages should target node
        if (config.runtimeTarget === 'browser') {
            issues.push({
                severity: 'warning',
                category: 'config',
                message: 'Node.js packages typically target Node.js, not browser',
                suggestion: 'Consider using "node" or "universal" as the runtime target',
            });
        }

        return issues;
    }
}

export const nodeGenerator = new NodeGenerator();
export default nodeGenerator;
