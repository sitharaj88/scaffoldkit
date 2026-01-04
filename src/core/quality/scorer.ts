/**
 * Package Quality Scorer
 * Evaluates package quality based on multiple criteria
 */
import fs from 'fs-extra';
import path from 'path';
import type { ValidationIssue } from '../../types/index.js';

/**
 * Quality score breakdown by category
 */
export interface QualityScoreBreakdown {
    /** TypeScript type coverage (0-20) */
    types: number;
    /** Modern exports configuration (0-20) */
    exports: number;
    /** Bundle size optimization (0-20) */
    size: number;
    /** Documentation quality (0-20) */
    docs: number;
    /** Test coverage (0-20) */
    tests: number;
}

/**
 * Complete quality score result
 */
export interface QualityScore {
    /** Total score (0-100) */
    total: number;
    /** Grade (A, B, C, D, F) */
    grade: string;
    /** Score breakdown by category */
    categories: QualityScoreBreakdown;
    /** Improvement suggestions */
    suggestions: string[];
    /** Detailed issues */
    issues: ValidationIssue[];
}

/**
 * Calculate the quality score for a package
 */
export async function calculateQualityScore(packagePath: string): Promise<QualityScore> {
    const categories: QualityScoreBreakdown = {
        types: 0,
        exports: 0,
        size: 0,
        docs: 0,
        tests: 0,
    };

    const suggestions: string[] = [];
    const issues: ValidationIssue[] = [];

    // Load package.json
    const packageJsonPath = path.join(packagePath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
        return {
            total: 0,
            grade: 'F',
            categories,
            suggestions: ['No package.json found'],
            issues: [{ severity: 'error', category: 'general', message: 'package.json not found' }],
        };
    }

    const packageJson = await fs.readJson(packageJsonPath);

    // === Types Score (0-20) ===
    categories.types = await scoreTypes(packagePath, packageJson, suggestions, issues);

    // === Exports Score (0-20) ===
    categories.exports = scoreExports(packageJson, suggestions, issues);

    // === Size Score (0-20) ===
    categories.size = await scoreSize(packagePath, suggestions, issues);

    // === Docs Score (0-20) ===
    categories.docs = await scoreDocs(packagePath, packageJson, suggestions, issues);

    // === Tests Score (0-20) ===
    categories.tests = await scoreTests(packagePath, packageJson, suggestions, issues);

    // Calculate total
    const total = Object.values(categories).reduce((sum, score) => sum + score, 0);

    // Calculate grade
    const grade = calculateGrade(total);

    return {
        total,
        grade,
        categories,
        suggestions,
        issues,
    };
}

/**
 * Score TypeScript types presence and quality
 */
async function scoreTypes(
    packagePath: string,
    packageJson: Record<string, unknown>,
    suggestions: string[],
    issues: ValidationIssue[]
): Promise<number> {
    let score = 0;

    // Check for types field in package.json
    if (packageJson.types || packageJson.typings) {
        score += 5;
    } else {
        suggestions.push('Add "types" field to package.json pointing to your type declarations');
    }

    // Check for exports with types
    const exports = packageJson.exports as Record<string, unknown> | undefined;
    if (exports) {
        const mainExport = exports['.'] as Record<string, unknown> | undefined;
        if (mainExport?.types) {
            score += 5;
        } else {
            suggestions.push('Add "types" condition to exports["."] for better TypeScript support');
        }
    }

    // Check for .d.ts files in dist
    const distPath = path.join(packagePath, 'dist');
    if (await fs.pathExists(distPath)) {
        const files = await fs.readdir(distPath);
        const hasDts = files.some((f: string) => f.endsWith('.d.ts'));
        if (hasDts) {
            score += 5;
        } else {
            suggestions.push('Generate TypeScript declaration files (.d.ts)');
        }
    }

    // Check for tsconfig.json
    const tsconfigPath = path.join(packagePath, 'tsconfig.json');
    if (await fs.pathExists(tsconfigPath)) {
        score += 5;
    }

    return score;
}

/**
 * Score exports configuration
 */
function scoreExports(
    packageJson: Record<string, unknown>,
    suggestions: string[],
    issues: ValidationIssue[]
): number {
    let score = 0;

    // Check for exports field
    if (packageJson.exports) {
        score += 8;

        const exports = packageJson.exports as Record<string, unknown>;
        const mainExport = exports['.'] as Record<string, unknown> | undefined;

        if (mainExport) {
            // Check for import condition
            if (mainExport.import) {
                score += 4;
            } else {
                suggestions.push('Add "import" condition to exports for ESM support');
            }

            // Check for types condition (should come first)
            if (mainExport.types) {
                score += 4;
            }

            // Check for require condition (dual format)
            if (mainExport.require) {
                score += 4;
            }
        }
    } else {
        suggestions.push('Add "exports" field for modern package resolution');

        // Fallback: check for main/module
        if (packageJson.main) score += 4;
        if (packageJson.module) score += 4;
    }

    // Check for type: module
    if (packageJson.type === 'module') {
        score = Math.min(score + 2, 20);
    }

    return Math.min(score, 20);
}

/**
 * Score bundle size optimization
 */
async function scoreSize(
    packagePath: string,
    suggestions: string[],
    issues: ValidationIssue[]
): Promise<number> {
    let score = 10; // Start with base score

    // Check for sideEffects field
    const packageJsonPath = path.join(packagePath, 'package.json');
    const packageJson = await fs.readJson(packageJsonPath);

    if (packageJson.sideEffects !== undefined) {
        score += 5;
    } else {
        suggestions.push('Add "sideEffects": false for better tree-shaking');
    }

    // Check dist folder size if it exists
    const distPath = path.join(packagePath, 'dist');
    if (await fs.pathExists(distPath)) {
        const stat = await fs.stat(distPath);
        const sizeKB = stat.size / 1024;

        // Bonus points for small bundles
        if (sizeKB < 10) {
            score += 5;
        } else if (sizeKB < 50) {
            score += 3;
        } else if (sizeKB < 100) {
            score += 1;
        } else {
            suggestions.push(`Bundle size is ${sizeKB.toFixed(1)}KB - consider code splitting or reducing dependencies`);
        }
    }

    return Math.min(score, 20);
}

/**
 * Score documentation quality
 */
async function scoreDocs(
    packagePath: string,
    packageJson: Record<string, unknown>,
    suggestions: string[],
    issues: ValidationIssue[]
): Promise<number> {
    let score = 0;

    // Check for README
    const readmePath = path.join(packagePath, 'README.md');
    if (await fs.pathExists(readmePath)) {
        const readme = await fs.readFile(readmePath, 'utf-8');
        const wordCount = readme.split(/\s+/).length;

        if (wordCount > 500) {
            score += 8; // Comprehensive README
        } else if (wordCount > 200) {
            score += 5; // Good README
        } else if (wordCount > 50) {
            score += 3; // Basic README
        } else {
            suggestions.push('Expand README with usage examples and API documentation');
        }
    } else {
        suggestions.push('Add a README.md file');
    }

    // Check for description in package.json
    if (packageJson.description) {
        score += 3;
    } else {
        suggestions.push('Add a description to package.json');
    }

    // Check for keywords
    if (Array.isArray(packageJson.keywords) && packageJson.keywords.length > 0) {
        score += 3;
    } else {
        suggestions.push('Add keywords to package.json for discoverability');
    }

    // Check for repository
    if (packageJson.repository) {
        score += 3;
    }

    // Check for CHANGELOG
    const changelogPath = path.join(packagePath, 'CHANGELOG.md');
    if (await fs.pathExists(changelogPath)) {
        score += 3;
    } else {
        suggestions.push('Add a CHANGELOG.md to track version history');
    }

    return Math.min(score, 20);
}

/**
 * Score test coverage
 */
async function scoreTests(
    packagePath: string,
    packageJson: Record<string, unknown>,
    suggestions: string[],
    issues: ValidationIssue[]
): Promise<number> {
    let score = 0;

    // Check for test script
    const scripts = packageJson.scripts as Record<string, string> | undefined;
    if (scripts?.test && !scripts.test.includes('no test specified')) {
        score += 5;
    } else {
        suggestions.push('Add a test script to package.json');
    }

    // Check for test files
    const srcPath = path.join(packagePath, 'src');
    if (await fs.pathExists(srcPath)) {
        const allFiles = await getFilesRecursive(srcPath);
        const testFiles = allFiles.filter((f: string) => f.includes('.test.') || f.includes('.spec.'));
        const sourceFiles = allFiles.filter((f: string) =>
            (f.endsWith('.ts') || f.endsWith('.tsx')) &&
            !f.includes('.test.') &&
            !f.includes('.spec.') &&
            !f.includes('.d.ts')
        );

        if (testFiles.length > 0) {
            const testRatio = testFiles.length / Math.max(sourceFiles.length, 1);
            if (testRatio >= 0.5) {
                score += 10; // Good test coverage
            } else if (testRatio >= 0.25) {
                score += 6; // Moderate test coverage
            } else {
                score += 3;
                suggestions.push('Increase test coverage - aim for at least one test per source file');
            }
        } else {
            suggestions.push('Add test files for your source code');
        }
    }

    // Check for vitest or jest config
    const hasVitestConfig = await fs.pathExists(path.join(packagePath, 'vitest.config.ts'));
    const hasJestConfig = await fs.pathExists(path.join(packagePath, 'jest.config.ts')) ||
        await fs.pathExists(path.join(packagePath, 'jest.config.js'));

    if (hasVitestConfig || hasJestConfig) {
        score += 5;
    }

    return Math.min(score, 20);
}

/**
 * Recursively get all files in a directory
 */
async function getFilesRecursive(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules') {
            files.push(...await getFilesRecursive(fullPath));
        } else if (entry.isFile()) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Calculate grade from total score
 */
function calculateGrade(total: number): string {
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B';
    if (total >= 60) return 'C';
    if (total >= 50) return 'D';
    return 'F';
}
