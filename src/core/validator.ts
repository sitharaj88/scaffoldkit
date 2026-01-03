/**
 * Package Validator
 * Validates packages against modern npm best practices
 */
import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import type {
    ValidationResult,
    ValidationIssue,
    CheckCategory,
    CheckResult,
} from '../types/index.js';
import { logger } from './logger.js';

/**
 * Validator class for checking package correctness
 */
export class PackageValidator {
    private packagePath: string;
    private packageJson: Record<string, unknown> | null = null;

    constructor(packagePath: string) {
        this.packagePath = packagePath;
    }

    /**
     * Run all validation checks
     */
    async validateAll(): Promise<CheckResult[]> {
        const results: CheckResult[] = [];

        // Load package.json
        await this.loadPackageJson();

        if (!this.packageJson) {
            return [{
                category: 'exports',
                passed: false,
                issues: [{
                    severity: 'error',
                    category: 'exports',
                    message: 'No package.json found',
                }],
                duration: 0,
            }];
        }

        // Run each check
        const checks: CheckCategory[] = [
            'exports',
            'types',
            'sideEffects',
            'treeShaking',
            'peerDeps',
            'deprecated',
            'buildOutput',
        ];

        for (const category of checks) {
            const start = Date.now();
            const issues = await this.runCheck(category);
            const duration = Date.now() - start;

            results.push({
                category,
                passed: !issues.some((i) => i.severity === 'error'),
                issues,
                duration,
            });
        }

        return results;
    }

    /**
     * Run a specific check
     */
    private async runCheck(category: CheckCategory): Promise<ValidationIssue[]> {
        switch (category) {
            case 'exports':
                return this.checkExports();
            case 'types':
                return this.checkTypes();
            case 'sideEffects':
                return this.checkSideEffects();
            case 'treeShaking':
                return this.checkTreeShaking();
            case 'peerDeps':
                return this.checkPeerDeps();
            case 'deprecated':
                return this.checkDeprecated();
            case 'buildOutput':
                return this.checkBuildOutput();
            default:
                return [];
        }
    }

    /**
     * Load package.json
     */
    private async loadPackageJson(): Promise<void> {
        const packageJsonPath = path.join(this.packagePath, 'package.json');

        if (await fs.pathExists(packageJsonPath)) {
            this.packageJson = await fs.readJson(packageJsonPath);
        }
    }

    /**
     * Check exports field
     */
    private checkExports(): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const pkg = this.packageJson!;

        // Check if exports field exists
        if (!pkg.exports) {
            issues.push({
                severity: 'warning',
                category: 'exports',
                message: 'No "exports" field found in package.json',
                suggestion: 'Add an "exports" field to specify package entry points',
                jsonPath: 'exports',
            });
            return issues;
        }

        const exports = pkg.exports as Record<string, unknown>;

        // Check main export
        if (!exports['.']) {
            issues.push({
                severity: 'error',
                category: 'exports',
                message: 'No main export (".") found in exports field',
                suggestion: 'Add a "." entry to exports for the main package entry point',
                jsonPath: 'exports["."]',
            });
        } else {
            const mainExport = exports['.'] as Record<string, unknown>;

            // Check for types
            if (!mainExport.types) {
                issues.push({
                    severity: 'warning',
                    category: 'exports',
                    message: 'No "types" entry in main export',
                    suggestion: 'Add "types" entry pointing to your .d.ts file',
                    jsonPath: 'exports["."].types',
                });
            }

            // Check for import/default
            if (!mainExport.import && !mainExport.default) {
                issues.push({
                    severity: 'error',
                    category: 'exports',
                    message: 'No "import" or "default" entry in main export',
                    suggestion: 'Add an "import" entry for ESM consumers',
                    jsonPath: 'exports["."].import',
                });
            }

            // Verify export files exist
            for (const [key, value] of Object.entries(mainExport)) {
                if (typeof value === 'string') {
                    const filePath = path.join(this.packagePath, value);
                    if (!fs.existsSync(filePath)) {
                        issues.push({
                            severity: 'warning',
                            category: 'exports',
                            message: `Export file does not exist: ${value}`,
                            suggestion: 'Run build command or fix the path',
                            jsonPath: `exports["."].${key}`,
                            file: value,
                        });
                    }
                }
            }
        }

        return issues;
    }

    /**
     * Check TypeScript types
     */
    private async checkTypes(): Promise<ValidationIssue[]> {
        const issues: ValidationIssue[] = [];
        const pkg = this.packageJson!;

        // Check types field
        if (!pkg.types && !pkg.typings) {
            issues.push({
                severity: 'warning',
                category: 'types',
                message: 'No "types" field in package.json',
                suggestion: 'Add a "types" field pointing to your main .d.ts file',
                jsonPath: 'types',
            });
        }

        // Check for .d.ts files in dist
        const distPath = path.join(this.packagePath, 'dist');

        if (await fs.pathExists(distPath)) {
            const dtsFiles = await glob('**/*.d.ts', { cwd: distPath });

            if (dtsFiles.length === 0) {
                issues.push({
                    severity: 'warning',
                    category: 'types',
                    message: 'No .d.ts files found in dist directory',
                    suggestion: 'Ensure TypeScript is configured to emit declaration files',
                });
            }
        }

        // Check for tsconfig.json
        const tsconfigPath = path.join(this.packagePath, 'tsconfig.json');

        if (await fs.pathExists(tsconfigPath)) {
            const tsconfig = await fs.readJson(tsconfigPath);

            if (!tsconfig.compilerOptions?.declaration) {
                issues.push({
                    severity: 'warning',
                    category: 'types',
                    message: 'TypeScript declarations are not enabled',
                    suggestion: 'Set "declaration": true in tsconfig.json compilerOptions',
                    file: 'tsconfig.json',
                });
            }
        }

        return issues;
    }

    /**
     * Check sideEffects configuration
     */
    private checkSideEffects(): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const pkg = this.packageJson!;

        if (pkg.sideEffects === undefined) {
            issues.push({
                severity: 'warning',
                category: 'sideEffects',
                message: 'No "sideEffects" field in package.json',
                suggestion: 'Add "sideEffects": false for tree-shaking optimization, or list files with side effects',
                jsonPath: 'sideEffects',
            });
        }

        return issues;
    }

    /**
     * Check tree-shaking compatibility
     */
    private async checkTreeShaking(): Promise<ValidationIssue[]> {
        const issues: ValidationIssue[] = [];
        const pkg = this.packageJson!;

        // Check module field
        if (!pkg.module && !pkg.exports) {
            issues.push({
                severity: 'warning',
                category: 'treeShaking',
                message: 'No "module" or "exports" field for ESM entry point',
                suggestion: 'Add a "module" field or "exports" for better tree-shaking',
                jsonPath: 'module',
            });
        }

        // Check type field
        if (pkg.type !== 'module') {
            issues.push({
                severity: 'info',
                category: 'treeShaking',
                message: 'Package type is not "module"',
                suggestion: 'Consider using "type": "module" for ESM-first approach',
                jsonPath: 'type',
            });
        }

        // Check for barrel exports (index.ts re-exporting everything)
        const srcPath = path.join(this.packagePath, 'src');

        if (await fs.pathExists(srcPath)) {
            const indexPath = path.join(srcPath, 'index.ts');

            if (await fs.pathExists(indexPath)) {
                const content = await fs.readFile(indexPath, 'utf-8');
                const exportAllMatches = content.match(/export \* from/g);

                if (exportAllMatches && exportAllMatches.length > 5) {
                    issues.push({
                        severity: 'info',
                        category: 'treeShaking',
                        message: `Heavy barrel exports detected (${exportAllMatches.length} re-exports)`,
                        suggestion: 'Consider using direct imports for better tree-shaking',
                        file: 'src/index.ts',
                    });
                }
            }
        }

        return issues;
    }

    /**
     * Check peer dependencies
     */
    private checkPeerDeps(): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const pkg = this.packageJson!;

        const peerDeps = pkg.peerDependencies as Record<string, string> | undefined;
        const deps = pkg.dependencies as Record<string, string> | undefined;

        if (peerDeps) {
            for (const [name, version] of Object.entries(peerDeps)) {
                // Check if peer dep is also a regular dependency
                if (deps && deps[name]) {
                    issues.push({
                        severity: 'error',
                        category: 'peerDeps',
                        message: `"${name}" is both a dependency and peerDependency`,
                        suggestion: 'Remove from dependencies if it should be a peer dependency',
                        jsonPath: `dependencies.${name}`,
                    });
                }

                // Check for overly restrictive versions
                if (!version.startsWith('^') && !version.startsWith('>=')) {
                    issues.push({
                        severity: 'warning',
                        category: 'peerDeps',
                        message: `Peer dependency "${name}" has restrictive version: ${version}`,
                        suggestion: 'Consider using a caret range (^) for better compatibility',
                        jsonPath: `peerDependencies.${name}`,
                    });
                }
            }
        }

        return issues;
    }

    /**
     * Check for deprecated patterns
     */
    private checkDeprecated(): ValidationIssue[] {
        const issues: ValidationIssue[] = [];
        const pkg = this.packageJson!;

        // Check for deprecated fields
        if (pkg.typings) {
            issues.push({
                severity: 'info',
                category: 'deprecated',
                message: '"typings" field is deprecated',
                suggestion: 'Use "types" instead of "typings"',
                jsonPath: 'typings',
            });
        }

        // Check for engines.node with old version
        const engines = pkg.engines as Record<string, string> | undefined;

        if (engines?.node) {
            const nodeVersion = engines.node.match(/\d+/)?.[0];

            if (nodeVersion && parseInt(nodeVersion) < 18) {
                issues.push({
                    severity: 'warning',
                    category: 'deprecated',
                    message: `Node.js ${nodeVersion} is end-of-life`,
                    suggestion: 'Update engines.node to >=18.0.0',
                    jsonPath: 'engines.node',
                });
            }
        }

        // Check for CommonJS when type is module
        if (pkg.type === 'module' && pkg.main?.toString().endsWith('.js') && !pkg.exports) {
            issues.push({
                severity: 'warning',
                category: 'deprecated',
                message: 'Using "main" field without "exports" is a legacy pattern',
                suggestion: 'Add an "exports" field for modern module resolution',
                jsonPath: 'main',
            });
        }

        return issues;
    }

    /**
     * Check build output
     */
    private async checkBuildOutput(): Promise<ValidationIssue[]> {
        const issues: ValidationIssue[] = [];

        const distPath = path.join(this.packagePath, 'dist');

        // Check if dist exists
        if (!await fs.pathExists(distPath)) {
            issues.push({
                severity: 'warning',
                category: 'buildOutput',
                message: 'No "dist" directory found',
                suggestion: 'Run the build command to generate output files',
            });
            return issues;
        }

        // Check for JS files
        const jsFiles = await glob('**/*.js', { cwd: distPath });

        if (jsFiles.length === 0) {
            issues.push({
                severity: 'warning',
                category: 'buildOutput',
                message: 'No JavaScript files found in dist',
                suggestion: 'Ensure build is configured correctly',
            });
        }

        // Check for source maps
        const mapFiles = await glob('**/*.map', { cwd: distPath });

        if (mapFiles.length === 0) {
            issues.push({
                severity: 'info',
                category: 'buildOutput',
                message: 'No source maps found in dist',
                suggestion: 'Consider enabling source maps for debugging',
            });
        }

        return issues;
    }
}

/**
 * Run validation on a package
 */
export async function validatePackage(packagePath: string): Promise<CheckResult[]> {
    const validator = new PackageValidator(packagePath);
    return validator.validateAll();
}

export default validatePackage;
