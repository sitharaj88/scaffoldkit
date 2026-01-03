/**
 * Check Command
 * Validates packages against modern npm best practices
 */
import path from 'path';
import chalk from 'chalk';
import { validatePackage } from '../core/validator.js';
import { logger } from '../core/logger.js';
import type { CheckCategory, ValidationSeverity } from '../types/index.js';

/**
 * Check command options
 */
interface CheckOptions {
    categories?: CheckCategory[];
    fix?: boolean;
}

/**
 * Run the check command
 */
export async function checkCommand(packagePath?: string, options: CheckOptions = {}): Promise<void> {
    const targetPath = packagePath ? path.resolve(process.cwd(), packagePath) : process.cwd();

    logger.header('Package Validation');
    logger.keyValue('Path', targetPath);
    logger.blank();

    // Run validation
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
