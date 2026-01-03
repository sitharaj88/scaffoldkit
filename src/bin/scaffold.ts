#!/usr/bin/env node
/**
 * Scaffold CLI
 * Production-grade CLI for creating, validating, and publishing JavaScript/TypeScript packages
 */
import { Command } from 'commander';
import chalk from 'chalk';
import { createCommand } from '../commands/create.js';
import { checkCommand } from '../commands/check.js';
import { releaseCommand } from '../commands/release.js';
import { initializeGenerators } from '../generators/index.js';
import { logger } from '../core/logger.js';

// Initialize generators
initializeGenerators();

// Package info
const VERSION = '1.0.0';
const NAME = 'scaffold';

// ASCII art banner
const BANNER = chalk.cyan(`
   ___           __  __      _    _ 
  / __| __ __ _ / _|/ _|___ | |__| |
  \\__ \\/ _/ _\` |  _|  _/ _ \\| / _\` |
  |___/\\__\\__,_|_| |_| \\___/|_\\__,_|
`);

// Create CLI program
const program = new Command();

program
    .name(NAME)
    .version(VERSION)
    .description('Production-grade CLI for creating, validating, and publishing JavaScript/TypeScript packages')
    .addHelpText('beforeAll', BANNER);

// Create command
program
    .command('create [name]')
    .description('Create a new package with interactive wizard')
    .action(async (name?: string) => {
        try {
            await createCommand(name);
        } catch (error) {
            handleError(error);
        }
    });

// Check command
program
    .command('check [path]')
    .description('Validate package against npm best practices')
    .option('-c, --categories <categories>', 'Comma-separated list of categories to check')
    .option('--fix', 'Attempt to automatically fix issues')
    .action(async (packagePath?: string, options?) => {
        try {
            const categories = options?.categories?.split(',');
            await checkCommand(packagePath, { categories, fix: options?.fix });
        } catch (error) {
            handleError(error);
        }
    });

// Release command
program
    .command('release')
    .description('Release a new version of the package')
    .option('-d, --dry-run', 'Preview release without making changes')
    .option('--skip-validation', 'Skip package validation')
    .option('--skip-build', 'Skip build step')
    .option('-t, --tag <tag>', 'npm publish tag (e.g., beta, next)')
    .option('--access <access>', 'npm access level (public or restricted)')
    .action(async (options) => {
        try {
            await releaseCommand({
                dryRun: options.dryRun,
                skipValidation: options.skipValidation,
                skipBuild: options.skipBuild,
                tag: options.tag,
                access: options.access,
            });
        } catch (error) {
            handleError(error);
        }
    });

// Info command
program
    .command('info')
    .description('Display CLI information and available generators')
    .action(async () => {
        console.log(BANNER);
        console.log(chalk.bold(`Version: ${VERSION}`));
        console.log();
        console.log(chalk.bold('Available Generators:'));

        // Get generators from registry
        const { registry } = await import('../core/registry.js');
        const generators = registry.getAllMeta();

        for (const meta of generators) {
            console.log();
            console.log(`  ${chalk.cyan(meta.name)} ${chalk.dim(`(${meta.framework})`)}`);
            console.log(`    ${meta.description}`);
            console.log(`    ${chalk.dim('Types:')} ${meta.supportedPackageTypes.join(', ')}`);
            console.log(`    ${chalk.dim('Targets:')} ${meta.supportedRuntimeTargets.join(', ')}`);
        }

        console.log();
        console.log(chalk.dim('Run "scaffold create" to start creating a new package.'));
    });

// Parse arguments
program.parse();

// Handle errors
function handleError(error: unknown): void {
    if (error instanceof Error) {
        if (error.message.includes('User force closed')) {
            // User cancelled, exit silently
            process.exit(0);
        }

        logger.error(error.message);

        if (process.env.DEBUG) {
            console.error(error.stack);
        }
    } else {
        logger.error(String(error));
    }

    process.exit(1);
}
