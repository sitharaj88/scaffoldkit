/**
 * Check Command
 * Validates packages against modern npm best practices
 */
import path from 'path';
import chalk from 'chalk';
import { validatePackage } from '../core/validator.js';
import { logger } from '../core/logger.js';
import { calculateQualityScore } from '../core/quality/index.js';
import { analyzeBundleSize, formatBytes } from '../core/analyzer/index.js';
import type { CheckCategory, ValidationSeverity } from '../types/index.js';

/**
 * Check command options
 */
export interface CheckOptions {
    categories?: CheckCategory[];
    fix?: boolean;
    score?: boolean;
    sizeLimit?: string;
}

/**
 * Run the check command
 */
export async function checkCommand(packagePath?: string, options: CheckOptions = {}): Promise<void> {
    const targetPath = packagePath ? path.resolve(process.cwd(), packagePath) : process.cwd();

    logger.header('Package Validation');
    logger.keyValue('Path', targetPath);
    logger.blank();

    // If score flag is set, show quality score
    if (options.score) {
        await showQualityScore(targetPath);
        logger.blank();
    }

    // If size-limit is set, analyze bundle size
    if (options.sizeLimit) {
        await showBundleSize(targetPath, options.sizeLimit);
        logger.blank();
    }

    // Run standard validation
    const results = await validatePackage(targetPath);

    // Filter by categories if specified
    const filteredResults = options.categories
        ? results.filter((r) => options.categories!.includes(r.category))
        : results;

    // Display results
    let hasErrors = false;
    let hasWarnings = false;

    for (const result of filteredResults) {
        const icon = result.passed ? chalk.green('✔') : chalk.red('✖');
        const categoryName = getCategoryDisplayName(result.category);
        const duration = chalk.dim(`(${result.duration}ms)`);

        console.log(`${icon} ${categoryName} ${duration}`);

        if (!result.passed) {
            hasErrors = true;
        }

        // Display issues
        for (const issue of result.issues) {
            const severityIcon = getSeverityIcon(issue.severity);
            const indent = '    ';

            if (issue.severity === 'warning') {
                hasWarnings = true;
            }

            console.log(`${indent}${severityIcon} ${issue.message}`);

            if (issue.suggestion) {
                console.log(`${indent}  ${chalk.dim('→')} ${chalk.dim(issue.suggestion)}`);
            }

            if (issue.file) {
                console.log(`${indent}  ${chalk.dim('File:')} ${issue.file}`);
            }

            if (issue.jsonPath) {
                console.log(`${indent}  ${chalk.dim('Path:')} ${issue.jsonPath}`);
            }
        }

        if (result.issues.length > 0) {
            logger.blank();
        }
    }

    // Summary
    logger.blank();
    const totalPassed = filteredResults.filter((r) => r.passed).length;
    const total = filteredResults.length;
    const errorsCount = filteredResults.reduce((acc, r) => acc + r.issues.filter((i) => i.severity === 'error').length, 0);
    const warningsCount = filteredResults.reduce((acc, r) => acc + r.issues.filter((i) => i.severity === 'warning').length, 0);

    console.log(chalk.bold('Summary:'));
    console.log(`  Passed: ${chalk.green(totalPassed)}/${total}`);

    if (errorsCount > 0) {
        console.log(`  Errors: ${chalk.red(errorsCount)}`);
    }

    if (warningsCount > 0) {
        console.log(`  Warnings: ${chalk.yellow(warningsCount)}`);
    }

    logger.blank();

    if (hasErrors) {
        logger.error('Package validation failed. Please fix the errors above.');
        process.exit(1);
    } else if (hasWarnings) {
        logger.warn('Package validation passed with warnings.');
    } else {
        logger.success('Package validation passed! Ready to publish.');
    }
}

/**
 * Show quality score
 */
async function showQualityScore(targetPath: string): Promise<void> {
    console.log(chalk.bold('📊 Quality Score'));
    console.log();

    const score = await calculateQualityScore(targetPath);

    // Display grade with color
    const gradeColor = score.grade.startsWith('A') ? 'green' :
        score.grade.startsWith('B') ? 'cyan' :
            score.grade.startsWith('C') ? 'yellow' :
                'red';

    console.log(`  ${chalk.bold('Grade:')} ${chalk[gradeColor](score.grade)} (${score.total}/100)`);
    console.log();

    // Display category breakdown
    console.log(`  ${chalk.dim('Categories:')}`);
    console.log(`    Types:   ${getScoreBar(score.categories.types, 20)} ${score.categories.types}/20`);
    console.log(`    Exports: ${getScoreBar(score.categories.exports, 20)} ${score.categories.exports}/20`);
    console.log(`    Size:    ${getScoreBar(score.categories.size, 20)} ${score.categories.size}/20`);
    console.log(`    Docs:    ${getScoreBar(score.categories.docs, 20)} ${score.categories.docs}/20`);
    console.log(`    Tests:   ${getScoreBar(score.categories.tests, 20)} ${score.categories.tests}/20`);

    // Display suggestions if any
    if (score.suggestions.length > 0) {
        console.log();
        console.log(`  ${chalk.dim('Suggestions:')}`);
        for (const suggestion of score.suggestions.slice(0, 5)) {
            console.log(`    ${chalk.yellow('→')} ${suggestion}`);
        }
        if (score.suggestions.length > 5) {
            console.log(`    ${chalk.dim(`... and ${score.suggestions.length - 5} more`)}`);
        }
    }
}

/**
 * Show bundle size analysis
 */
async function showBundleSize(targetPath: string, sizeLimit: string): Promise<void> {
    console.log(chalk.bold('📦 Bundle Size Analysis'));
    console.log();

    const analysis = await analyzeBundleSize(targetPath, { sizeLimit });

    // Show totals
    const sizeColor = analysis.passesLimit ? 'green' : 'red';
    console.log(`  Total Size: ${chalk[sizeColor](formatBytes(analysis.totalSize))}`);
    console.log(`  Gzipped:    ${chalk.cyan(formatBytes(analysis.totalGzipSize))}`);

    if (analysis.sizeLimit) {
        const status = analysis.passesLimit ? chalk.green('✔ PASS') : chalk.red('✖ FAIL');
        console.log(`  Limit:      ${formatBytes(analysis.sizeLimit)} ${status}`);
    }

    // Show top 5 largest files
    if (analysis.files.length > 0) {
        console.log();
        console.log(`  ${chalk.dim('Largest files:')}`);
        for (const file of analysis.files.slice(0, 5)) {
            console.log(`    ${formatBytes(file.size).padEnd(10)} ${file.path}`);
        }
    }

    // Show suggestions
    if (analysis.suggestions.length > 0) {
        console.log();
        console.log(`  ${chalk.dim('Suggestions:')}`);
        for (const suggestion of analysis.suggestions.slice(0, 3)) {
            const icon = suggestion.severity === 'error' ? chalk.red('✖') :
                suggestion.severity === 'warning' ? chalk.yellow('⚠') :
                    chalk.blue('ℹ');
            console.log(`    ${icon} ${suggestion.message}`);
        }
    }
}

/**
 * Generate a visual score bar
 */
function getScoreBar(score: number, max: number): string {
    const filled = Math.round((score / max) * 10);
    const empty = 10 - filled;
    const color = score >= max * 0.8 ? 'green' :
        score >= max * 0.6 ? 'yellow' :
            'red';
    return chalk[color]('█'.repeat(filled) + '░'.repeat(empty));
}

/**
 * Get display name for a check category
 */
function getCategoryDisplayName(category: CheckCategory): string {
    const names: Record<CheckCategory, string> = {
        exports: 'Exports Field',
        types: 'TypeScript Types',
        sideEffects: 'Side Effects',
        treeShaking: 'Tree Shaking',
        peerDeps: 'Peer Dependencies',
        framework: 'Framework Compatibility',
        tarball: 'Tarball Inspection',
        buildOutput: 'Build Output',
        deprecated: 'Deprecated Patterns',
    };

    return names[category] || category;
}

/**
 * Get icon for severity level
 */
function getSeverityIcon(severity: ValidationSeverity): string {
    switch (severity) {
        case 'error':
            return chalk.red('✖');
        case 'warning':
            return chalk.yellow('⚠');
        case 'info':
            return chalk.blue('ℹ');
        default:
            return chalk.dim('•');
    }
}

export default checkCommand;
