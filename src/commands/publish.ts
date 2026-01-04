/**
 * Publish Wizard Command
 * Interactive wizard for publishing packages with pre-flight checks
 */
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { confirm, input } from '@inquirer/prompts';
import { execSync } from 'child_process';
import { logger } from '../core/logger.js';
import { calculateQualityScore } from '../core/quality/index.js';
import { analyzeBundleSize, formatBytes } from '../core/analyzer/index.js';

/**
 * Publish command options
 */
export interface PublishOptions {
    dryRun?: boolean;
    skipChecks?: boolean;
    tag?: string;
    access?: 'public' | 'restricted';
}

/**
 * Pre-flight check result
 */
interface PreflightCheck {
    name: string;
    passed: boolean;
    message: string;
    severity: 'error' | 'warning' | 'info';
}

/**
 * Run the publish wizard
 */
export async function publishCommand(options: PublishOptions = {}): Promise<void> {
    const packagePath = process.cwd();

    logger.header('Publish Wizard');
    logger.blank();

    // Load package.json
    const packageJsonPath = path.join(packagePath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
        logger.error('No package.json found in current directory');
        process.exit(1);
    }

    const packageJson = await fs.readJson(packageJsonPath);
    const { name, version } = packageJson;

    logger.keyValue('Package', name);
    logger.keyValue('Version', version);
    logger.blank();

    // Run pre-flight checks unless skipped
    if (!options.skipChecks) {
        console.log(chalk.bold('🔍 Running pre-flight checks...'));
        console.log();

        const checks = await runPreflightChecks(packagePath, packageJson);
        let hasErrors = false;

        for (const check of checks) {
            const icon = check.passed
                ? chalk.green('✔')
                : check.severity === 'error'
                    ? chalk.red('✖')
                    : chalk.yellow('⚠');

            console.log(`  ${icon} ${check.name}: ${check.message}`);

            if (!check.passed && check.severity === 'error') {
                hasErrors = true;
            }
        }

        console.log();

        if (hasErrors) {
            logger.error('Pre-flight checks failed. Please fix the issues above.');
            if (!options.dryRun) {
                process.exit(1);
            }
        } else {
            logger.success('All pre-flight checks passed!');
        }
        console.log();
    }

    // Show quality score summary
    const score = await calculateQualityScore(packagePath);
    console.log(chalk.bold(`📊 Quality Score: ${score.grade} (${score.total}/100)`));
    console.log();

    // Show bundle size
    const analysis = await analyzeBundleSize(packagePath);
    if (analysis.totalSize > 0) {
        console.log(chalk.bold(`📦 Bundle Size: ${formatBytes(analysis.totalSize)} (gzip: ${formatBytes(analysis.totalGzipSize)})`));
        console.log();
    }

    // Confirm publish
    if (!options.dryRun) {
        const confirmed = await confirm({
            message: `Ready to publish ${chalk.cyan(name)}@${chalk.yellow(version)} to npm?`,
            default: true,
        });

        if (!confirmed) {
            logger.warn('Publish cancelled.');
            return;
        }

        // Build publish command
        let publishCmd = 'npm publish';

        if (options.tag) {
            publishCmd += ` --tag ${options.tag}`;
        }

        if (options.access) {
            publishCmd += ` --access ${options.access}`;
        } else if (name.startsWith('@')) {
            // Scoped packages default to restricted, prompt for access
            const isPublic = await confirm({
                message: 'This is a scoped package. Publish as public?',
                default: true,
            });
            if (isPublic) {
                publishCmd += ' --access public';
            }
        }

        console.log();
        console.log(chalk.dim(`Running: ${publishCmd}`));
        console.log();

        try {
            execSync(publishCmd, { stdio: 'inherit' });
            console.log();
            logger.success(`🎉 Successfully published ${name}@${version}!`);

            // Suggest next steps
            console.log();
            console.log(chalk.bold('Next steps:'));
            console.log(`  • Create a git tag: ${chalk.cyan(`git tag v${version} && git push --tags`)}`);
            console.log(`  • Update CHANGELOG.md`);
            console.log(`  • Create a GitHub release`);
        } catch (error) {
            logger.error('Publish failed. Check the error above.');
            process.exit(1);
        }
    } else {
        console.log(chalk.yellow('📝 Dry run mode - no changes will be made'));
        console.log();
        console.log(chalk.dim('Would run: npm publish'));
    }
}

/**
 * Run all pre-flight checks
 */
async function runPreflightChecks(
    packagePath: string,
    packageJson: Record<string, unknown>
): Promise<PreflightCheck[]> {
    const checks: PreflightCheck[] = [];

    // 1. Check if package name is available on npm (or matches current)
    checks.push(await checkPackageNameAvailability(packageJson.name as string, packageJson.version as string));

    // 2. Check for uncommitted changes
    checks.push(checkUncommittedChanges());

    // 3. Check for secrets in code
    checks.push(await checkForSecrets(packagePath));

    // 4. Check build output exists
    checks.push(await checkBuildOutput(packagePath));

    // 5. Check version is not already published
    checks.push(await checkVersionNotPublished(packageJson.name as string, packageJson.version as string));

    // 6. Check changelog has entry for current version
    checks.push(await checkChangelogEntry(packagePath, packageJson.version as string));

    // 7. Check package.json has required fields
    checks.push(checkRequiredFields(packageJson));

    // 8. Check for .npmignore or files field
    checks.push(checkPackageFiles(packagePath, packageJson));

    return checks;
}

/**
 * Check if package name is available or owned
 */
async function checkPackageNameAvailability(name: string, version: string): Promise<PreflightCheck> {
    try {
        const result = execSync(`npm view ${name} version 2>/dev/null`, { encoding: 'utf-8' }).trim();
        // Package exists - that's expected for updates
        return {
            name: 'Package Registry',
            passed: true,
            message: `Package exists (current: ${result})`,
            severity: 'info',
        };
    } catch {
        // Package doesn't exist - it's a new package
        return {
            name: 'Package Registry',
            passed: true,
            message: 'New package - name is available',
            severity: 'info',
        };
    }
}

/**
 * Check for uncommitted git changes
 */
function checkUncommittedChanges(): PreflightCheck {
    try {
        const status = execSync('git status --porcelain 2>/dev/null', { encoding: 'utf-8' }).trim();
        if (status) {
            return {
                name: 'Git Status',
                passed: false,
                message: 'Uncommitted changes detected',
                severity: 'warning',
            };
        }
        return {
            name: 'Git Status',
            passed: true,
            message: 'Working directory clean',
            severity: 'info',
        };
    } catch {
        return {
            name: 'Git Status',
            passed: true,
            message: 'Not a git repository',
            severity: 'info',
        };
    }
}

/**
 * Check for potential secrets in code
 */
async function checkForSecrets(packagePath: string): Promise<PreflightCheck> {
    const srcPath = path.join(packagePath, 'src');
    if (!await fs.pathExists(srcPath)) {
        return {
            name: 'Secret Detection',
            passed: true,
            message: 'No src directory to scan',
            severity: 'info',
        };
    }

    // Patterns that might indicate secrets
    const secretPatterns = [
        /(['"])(?:api[_-]?key|apikey|secret[_-]?key|secretkey|access[_-]?token|auth[_-]?token|password|passwd|pwd)\1\s*[:=]\s*(['"])[^'"]{8,}\2/i,
        /(?:sk|pk)_(?:live|test)_[a-zA-Z0-9]{24,}/,  // Stripe-like keys
        /ghp_[a-zA-Z0-9]{36,}/,  // GitHub tokens
        /npm_[a-zA-Z0-9]{36,}/,  // npm tokens
    ];

    const files = await getFilesRecursive(srcPath);
    const suspiciousFiles: string[] = [];

    for (const file of files) {
        if (file.endsWith('.test.ts') || file.endsWith('.spec.ts')) continue;

        const content = await fs.readFile(file, 'utf-8');
        for (const pattern of secretPatterns) {
            if (pattern.test(content)) {
                suspiciousFiles.push(path.relative(packagePath, file));
                break;
            }
        }
    }

    if (suspiciousFiles.length > 0) {
        return {
            name: 'Secret Detection',
            passed: false,
            message: `Potential secrets found in: ${suspiciousFiles.slice(0, 2).join(', ')}`,
            severity: 'error',
        };
    }

    return {
        name: 'Secret Detection',
        passed: true,
        message: 'No secrets detected',
        severity: 'info',
    };
}

/**
 * Check build output exists
 */
async function checkBuildOutput(packagePath: string): Promise<PreflightCheck> {
    const distPath = path.join(packagePath, 'dist');
    if (!await fs.pathExists(distPath)) {
        return {
            name: 'Build Output',
            passed: false,
            message: 'No dist folder - run build first',
            severity: 'error',
        };
    }

    const files = await fs.readdir(distPath);
    if (files.length === 0) {
        return {
            name: 'Build Output',
            passed: false,
            message: 'dist folder is empty',
            severity: 'error',
        };
    }

    return {
        name: 'Build Output',
        passed: true,
        message: `${files.length} files in dist`,
        severity: 'info',
    };
}

/**
 * Check if version is already published
 */
async function checkVersionNotPublished(name: string, version: string): Promise<PreflightCheck> {
    try {
        execSync(`npm view ${name}@${version} version 2>/dev/null`, { encoding: 'utf-8' });
        return {
            name: 'Version Check',
            passed: false,
            message: `Version ${version} already published`,
            severity: 'error',
        };
    } catch {
        return {
            name: 'Version Check',
            passed: true,
            message: `Version ${version} not yet published`,
            severity: 'info',
        };
    }
}

/**
 * Check changelog has entry for current version
 */
async function checkChangelogEntry(packagePath: string, version: string): Promise<PreflightCheck> {
    const changelogPath = path.join(packagePath, 'CHANGELOG.md');
    if (!await fs.pathExists(changelogPath)) {
        return {
            name: 'Changelog',
            passed: false,
            message: 'No CHANGELOG.md found',
            severity: 'warning',
        };
    }

    const changelog = await fs.readFile(changelogPath, 'utf-8');
    if (changelog.includes(version)) {
        return {
            name: 'Changelog',
            passed: true,
            message: `Version ${version} documented`,
            severity: 'info',
        };
    }

    return {
        name: 'Changelog',
        passed: false,
        message: `No entry for version ${version}`,
        severity: 'warning',
    };
}

/**
 * Check required package.json fields
 */
function checkRequiredFields(packageJson: Record<string, unknown>): PreflightCheck {
    const required = ['name', 'version', 'description', 'main', 'types'];
    const missing = required.filter(field => !packageJson[field]);

    if (missing.length > 0) {
        return {
            name: 'Package Fields',
            passed: false,
            message: `Missing: ${missing.join(', ')}`,
            severity: 'error',
        };
    }

    return {
        name: 'Package Fields',
        passed: true,
        message: 'All required fields present',
        severity: 'info',
    };
}

/**
 * Check for files field or .npmignore
 */
function checkPackageFiles(packagePath: string, packageJson: Record<string, unknown>): PreflightCheck {
    if (packageJson.files) {
        return {
            name: 'Package Files',
            passed: true,
            message: `"files" field configured`,
            severity: 'info',
        };
    }

    if (fs.existsSync(path.join(packagePath, '.npmignore'))) {
        return {
            name: 'Package Files',
            passed: true,
            message: '.npmignore present',
            severity: 'info',
        };
    }

    return {
        name: 'Package Files',
        passed: false,
        message: 'No "files" field or .npmignore',
        severity: 'warning',
    };
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

export default publishCommand;
