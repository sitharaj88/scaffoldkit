/**
 * Base Generator Class
 * Provides common functionality for all framework generators
 * Framework-specific generators extend this class
 */
import type {
    Generator,
    GeneratorMeta,
    GeneratorConfig,
    DependencySpec,
    ExportConfig,
    GeneratedFile,
    ValidationResult,
    ValidationIssue,
    GeneratorResult,
    PackageType,
    RuntimeTarget,
    BuildSystem,
} from '../types/index.js';

/**
 * Abstract base class for generators
 * Implements common logic, leaving framework-specific details to subclasses
 */
export abstract class BaseGenerator implements Generator {
    abstract readonly meta: GeneratorMeta;

    /**
     * Get framework-specific dependencies
     * Override in subclass
     */
    protected abstract getFrameworkDependencies(config: GeneratorConfig): DependencySpec[];

    /**
     * Get framework-specific files to generate
     * Override in subclass
     */
    protected abstract getFrameworkFiles(config: GeneratorConfig): GeneratedFile[];

    /**
     * Get framework-specific package.json fields
     * Override in subclass
     */
    protected abstract getFrameworkPackageJsonExtras(config: GeneratorConfig): Record<string, unknown>;

    /**
     * Get all dependencies including common ones
     */
    getDependencies(config: GeneratorConfig): DependencySpec[] {
        const common = this.getCommonDependencies(config);
        const framework = this.getFrameworkDependencies(config);
        return [...common, ...framework];
    }

    /**
     * Common dependencies shared across generators
     */
    protected getCommonDependencies(config: GeneratorConfig): DependencySpec[] {
        const deps: DependencySpec[] = [
            // TypeScript is always included
            { name: 'typescript', version: '^5.7.0', type: 'devDependency' },
            { name: '@types/node', version: '^22.0.0', type: 'devDependency' },
        ];

        // Build system dependencies
        switch (config.buildSystem) {
            case 'tsup':
                deps.push({ name: 'tsup', version: '^8.3.0', type: 'devDependency' });
                break;
            case 'vite':
                deps.push(
                    { name: 'vite', version: '^6.0.0', type: 'devDependency' },
                    { name: 'vite-plugin-dts', version: '^4.3.0', type: 'devDependency' }
                );
                break;
            case 'rollup':
                deps.push(
                    { name: 'rollup', version: '^4.28.0', type: 'devDependency' },
                    { name: '@rollup/plugin-typescript', version: '^12.1.0', type: 'devDependency' },
                    { name: '@rollup/plugin-node-resolve', version: '^16.0.0', type: 'devDependency' }
                );
                break;
            case 'unbuild':
                deps.push({ name: 'unbuild', version: '^3.0.0', type: 'devDependency' });
                break;
            case 'esbuild':
                deps.push({ name: 'esbuild', version: '^0.24.0', type: 'devDependency' });
                break;
        }

        // Testing dependencies
        deps.push(
            { name: 'vitest', version: '^2.1.0', type: 'devDependency' }
        );

        return deps;
    }

    /**
     * Get exports configuration for package.json
     */
    getExports(config: GeneratorConfig): ExportConfig[] {
        const exports: ExportConfig[] = [];

        // Main export
        const mainExport: ExportConfig = {
            path: '.',
            types: './dist/index.d.ts',
            import: './dist/index.js',
        };

        // Add CJS if dual format
        if (config.moduleFormat === 'dual') {
            mainExport.require = './dist/index.cjs';
        }

        // Add default fallback
        mainExport.default = './dist/index.js';

        exports.push(mainExport);

        return exports;
    }

    /**
     * Get files to generate
     */
    getFiles(config: GeneratorConfig): GeneratedFile[] {
        const common = this.getCommonFiles(config);
        const framework = this.getFrameworkFiles(config);
        return [...common, ...framework];
    }

    /**
     * Common files shared across generators
     */
    protected getCommonFiles(config: GeneratorConfig): GeneratedFile[] {
        const files: GeneratedFile[] = [
            // Config files (package.json is generated programmatically in generator.ts)
            { path: 'tsconfig.json', template: 'common/tsconfig.json.hbs', isTemplate: true },
            { path: 'README.md', template: 'common/README.md.hbs', isTemplate: true },
            { path: 'LICENSE', template: 'common/LICENSE.hbs', isTemplate: true },
            { path: '.gitignore', template: 'common/gitignore.hbs', isTemplate: true },
            { path: '.npmignore', template: 'common/npmignore.hbs', isTemplate: true },
            { path: 'CHANGELOG.md', template: 'common/CHANGELOG.md.hbs', isTemplate: true },
        ];

        // Build config based on build system
        switch (config.buildSystem) {
            case 'tsup':
                files.push({ path: 'tsup.config.ts', template: 'common/tsup.config.ts.hbs', isTemplate: true });
                break;
            case 'vite':
                files.push({ path: 'vite.config.ts', template: 'common/vite.config.ts.hbs', isTemplate: true });
                break;
            case 'rollup':
                files.push({ path: 'rollup.config.ts', template: 'common/rollup.config.ts.hbs', isTemplate: true });
                break;
            case 'unbuild':
                files.push({ path: 'build.config.ts', template: 'common/unbuild.config.ts.hbs', isTemplate: true });
                break;
        }

        // Vitest config
        files.push({ path: 'vitest.config.ts', template: 'common/vitest.config.ts.hbs', isTemplate: true });

        return files;
    }

    /**
     * Get additional package.json fields
     */
    getPackageJsonExtras(config: GeneratorConfig): Record<string, unknown> {
        const common = this.getCommonPackageJsonExtras(config);
        const framework = this.getFrameworkPackageJsonExtras(config);

        return {
            ...common,
            ...framework,
        };
    }

    /**
     * Common package.json extras
     */
    protected getCommonPackageJsonExtras(config: GeneratorConfig): Record<string, unknown> {
        const extras: Record<string, unknown> = {
            sideEffects: false,
            files: ['dist', 'README.md', 'LICENSE', 'CHANGELOG.md'],
        };

        return extras;
    }

    /**
     * Validate configuration
     */
    validate(config: GeneratorConfig): ValidationResult {
        const issues: ValidationIssue[] = [];

        // Validate package name
        if (!config.name || config.name.trim() === '') {
            issues.push({
                severity: 'error',
                category: 'config',
                message: 'Package name is required',
            });
        }

        // Validate package type is supported
        if (!this.meta.supportedPackageTypes.includes(config.packageType)) {
            issues.push({
                severity: 'error',
                category: 'config',
                message: `Package type "${config.packageType}" is not supported by ${this.meta.name}`,
                suggestion: `Supported types: ${this.meta.supportedPackageTypes.join(', ')}`,
            });
        }

        // Validate runtime target is supported
        if (!this.meta.supportedRuntimeTargets.includes(config.runtimeTarget)) {
            issues.push({
                severity: 'error',
                category: 'config',
                message: `Runtime target "${config.runtimeTarget}" is not supported by ${this.meta.name}`,
                suggestion: `Supported targets: ${this.meta.supportedRuntimeTargets.join(', ')}`,
            });
        }

        // Validate output directory
        if (!config.outDir || config.outDir.trim() === '') {
            issues.push({
                severity: 'error',
                category: 'config',
                message: 'Output directory is required',
            });
        }

        // Framework-specific validation
        const frameworkValidation = this.validateFrameworkConfig(config);
        issues.push(...frameworkValidation);

        return {
            valid: !issues.some((i) => i.severity === 'error'),
            issues,
        };
    }

    /**
     * Framework-specific validation
     * Override in subclass for custom validation
     */
    protected validateFrameworkConfig(_config: GeneratorConfig): ValidationIssue[] {
        return [];
    }

    /**
     * Post-generation hook
     * Override in subclass for custom post-generation logic
     */
    async postGenerate(_config: GeneratorConfig, _result: GeneratorResult): Promise<void> {
        // Default: no post-generation logic
    }

    /**
     * Helper to create a dependency spec
     */
    protected dep(
        name: string,
        version: string,
        type: DependencySpec['type'] = 'dependency'
    ): DependencySpec {
        return { name, version, type };
    }

    /**
     * Helper to create a peer dependency spec
     */
    protected peerDep(name: string, version: string): DependencySpec {
        return { name, version, type: 'peerDependency' };
    }

    /**
     * Helper to create a dev dependency spec
     */
    protected devDep(name: string, version: string): DependencySpec {
        return { name, version, type: 'devDependency' };
    }

    /**
     * Helper to create an optional dependency spec
     */
    protected optionalDep(name: string, version: string): DependencySpec {
        return { name, version, type: 'optionalDependency' };
    }
}
