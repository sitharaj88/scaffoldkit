/**
 * Release Command
 * Safe versioning and publishing to npm
 */
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import semver from 'semver';
import { execa } from 'execa';
import {
    select,
    confirm,
    input,
} from '@inquirer/prompts';
import type { VersionBumpType, ReleaseConfig, ReleaseResult } from '../types/index.js';
import { logger } from '../core/logger.js';
import { validatePackage } from '../core/validator.js';

/**
 * Release command options
 */
interface ReleaseOptions {
    dryRun?: boolean;
    skipValidation?: boolean;
    skipBuild?: boolean;
    tag?: string;
    access?: 'public' | 'restricted';
}

/**
 * Run the release command
 */
export async function releaseCommand(options: ReleaseOptions = {}): Promise<void> {
    const packagePath = process.cwd();
    const packageJsonPath = path.join(packagePath, 'package.json');

    logger.header('Release Package');

    try {
        // Check if package.json exists
        if (!await fs.pathExists(packageJsonPath)) {
            logger.error('No package.json found in current directory');
            process.exit(1);
        }

        // Load package.json
        const pkg = await fs.readJson(packageJsonPath);
        const currentVersion = pkg.version || '0.0.0';

        logger.keyValue('Package', pkg.name);
        logger.keyValue('Current version', currentVersion);
        logger.blank();

        // Run validation unless skipped
        if (!options.skipValidation) {
            logger.info('Validating package...');
            const validationResults = await validatePackage(packagePath);
            const hasErrors = validationResults.some(
                (r) => r.issues.some((i) => i.severity === 'error')
            );

            if (hasErrors) {
                logger.error('Package validation failed. Run "scaffold check" for details.');
                const proceed = await confirm({
                    message: 'Continue despite validation errors?',
                    default: false,
                });

                if (!proceed) {
                    process.exit(1);
                }
            } else {
                logger.success('Validation passed');
            }

            logger.blank();
        }

        // Prompt for version bump
        const bumpType = await select<VersionBumpType>({
            message: 'Version bump:',
            choices: [
                {
                    value: 'patch',
                    name: `patch (${chalk.dim(semver.inc(currentVersion, 'patch'))})`,
                    description: 'Bug fixes, no new features',
                },
                {
                    value: 'minor',
                    name: `minor (${chalk.dim(semver.inc(currentVersion, 'minor'))})`,
                    description: 'New features, backwards compatible',
                },
                {
                    value: 'major',
                    name: `major (${chalk.dim(semver.inc(currentVersion, 'major'))})`,
                    description: 'Breaking changes',
                },
                {
                    value: 'prepatch',
                    name: `prepatch (${chalk.dim(semver.inc(currentVersion, 'prepatch', 'alpha'))})`,
                },
                {
                    value: 'preminor',
                    name: `preminor (${chalk.dim(semver.inc(currentVersion, 'preminor', 'alpha'))})`,
                },
                {
                    value: 'premajor',
                    name: `premajor (${chalk.dim(semver.inc(currentVersion, 'premajor', 'alpha'))})`,
                },
            ],
        });

        // Get pre-release identifier if needed
        let preId: string | undefined;
        if (bumpType.startsWith('pre')) {
            preId = await input({
                message: 'Pre-release identifier:',
                default: 'alpha',
            });
        }

        // Calculate new version
        const newVersion = preId
            ? semver.inc(currentVersion, bumpType, preId)
            : semver.inc(currentVersion, bumpType);

        if (!newVersion) {
            logger.error('Failed to calculate new version');
            process.exit(1);
        }

        logger.blank();
        logger.keyValue('New version', chalk.green(newVersion));
        logger.blank();

        // Ask about changelog
        const updateChangelog = await confirm({
            message: 'Update CHANGELOG.md?',
            default: true,
        });

        let changelogEntry = '';
        if (updateChangelog) {
            changelogEntry = await input({
                message: 'Changelog entry (leave empty for auto-generate):',
            });
        }

        // Build the package
        if (!options.skipBuild) {
            logger.blank();
            logger.info('Building package...');

            try {
                await execa('npm', ['run', 'build'], { stdio: 'inherit' });
                logger.success('Build successful');
            } catch (error) {
                logger.error('Build failed');
                process.exit(1);
            }
        }

        // Dry run mode
        if (options.dryRun) {
            logger.blank();
            logger.header('Dry Run Mode');
            logger.info('The following actions would be performed:');
            logger.list([
                `Update package.json version to ${newVersion}`,
                updateChangelog ? 'Update CHANGELOG.md' : 'Skip changelog update',
                `Run npm publish${options.tag ? ` --tag ${options.tag}` : ''}`,
            ]);
            logger.blank();
            logger.info('No changes were made (dry run)');
            return;
        }

        // Confirm before publishing
        logger.blank();
        const confirmPublish = await confirm({
            message: `Publish ${pkg.name}@${newVersion} to npm?`,
            default: true,
        });

        if (!confirmPublish) {
            logger.info('Release cancelled');
            return;
        }

        logger.blank();

        // Update version in package.json
        logger.info('Updating package.json...');
        pkg.version = newVersion;
        await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
        logger.success(`Updated version to ${newVersion}`);

        // Update changelog
        if (updateChangelog) {
            logger.info('Updating CHANGELOG.md...');
            await updateChangelogFile(packagePath, newVersion, changelogEntry);
            logger.success('Updated CHANGELOG.md');
        }

        // Publish to npm
        logger.info('Publishing to npm...');

        const publishArgs = ['publish'];

        if (options.tag) {
            publishArgs.push('--tag', options.tag);
        }

        if (options.access) {
            publishArgs.push('--access', options.access);
        } else if (pkg.name.startsWith('@')) {
            // Scoped packages need explicit access
            publishArgs.push('--access', 'public');
        }

        try {
            await execa('npm', publishArgs, { stdio: 'inherit' });
            logger.success(`Published ${pkg.name}@${newVersion}`);
        } catch (error) {
            logger.error('Publish failed');
            logger.info('You can retry with: npm publish');
            process.exit(1);
        }

        logger.blank();
        logger.success('Release complete! 🎉');
        logger.blank();
        logger.info('Next steps:');
        logger.list([
            'Create a git tag: git tag v' + newVersion,
            'Push changes: git push && git push --tags',
            'Create a GitHub release',
        ]);

    } catch (error) {
        if (error instanceof Error && error.message.includes('User force closed')) {
            logger.info('Operation cancelled');
            return;
        }
        throw error;
    }
}

/**
 * Update CHANGELOG.md file
 */
async function updateChangelogFile(
    packagePath: string,
    version: string,
    entry?: string
): Promise<void> {
    const changelogPath = path.join(packagePath, 'CHANGELOG.md');
    const date = new Date().toISOString().split('T')[0];

    const newEntry = `
## [${version}] - ${date}

${entry || '### Changed\n\n- Update version to ' + version}

`;

    if (await fs.pathExists(changelogPath)) {
        const content = await fs.readFile(changelogPath, 'utf-8');

        // Find where to insert (after the first header line)
        const headerMatch = content.match(/^# .+\n+/m);

        if (headerMatch) {
            const insertPoint = headerMatch[0].length;
            const newContent =
                content.slice(0, insertPoint) +
                newEntry +
                content.slice(insertPoint);

            await fs.writeFile(changelogPath, newContent);
        } else {
            // Prepend to file
            await fs.writeFile(changelogPath, newEntry + content);
        }
    } else {
        // Create new changelog
        const content = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
${newEntry}`;

        await fs.writeFile(changelogPath, content);
    }
}

export default releaseCommand;
