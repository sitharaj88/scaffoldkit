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
import { publishCommand } from '../commands/publish.js';
import { addCommand } from '../commands/add.js';
import { migrateCommand } from '../commands/migrate.js';
import { docsCommand } from '../commands/docs.js';
import { initializeGenerators } from '../generators/index.js';
import { logger } from '../core/logger.js';

// Initialize generators
initializeGenerators();

// Package info
const VERSION = '1.0.0-alpha.1';
const NAME = 'scaffold-kit';

// ASCII art banner
const BANNER = chalk.cyan(`
   _____            __  __      _    _  ___ __ 
  / ____|          / _|/ _|    | |  | |/ (_)  |
 | (___   ___ __ _| |_| |_ ___ | | __| |/ /| |_ 
  \\___ \\ / __/ _\` |  _|  _/ _ \\| |/ _\` |   < | __|
  ____) | (_| (_| | | | || (_) | | (_| | . \\| |_ 
 |_____/ \\___\\__,_|_| |_| \\___/|_|\\__,_|_|\\_\\\\__|
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
    .option('-s, --score', 'Display package quality score (0-100)')
    .option('--size-limit <limit>', 'Bundle size limit (e.g., 50KB, 1MB)')
    .action(async (packagePath?: string, options?) => {
        try {
            const categories = options?.categories?.split(',');
            await checkCommand(packagePath, {
                categories,
                fix: options?.fix,
                score: options?.score,
                sizeLimit: options?.sizeLimit,
            });
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

// Publish command (wizard)
program
    .command('publish')
    .description('Publish package with pre-flight checks and interactive wizard')
    .option('-d, --dry-run', 'Preview publish without making changes')
    .option('--skip-checks', 'Skip pre-flight validation checks')
    .option('-t, --tag <tag>', 'npm publish tag (e.g., beta, next)')
    .option('--access <access>', 'npm access level (public or restricted)')
    .action(async (options) => {
        try {
            await publishCommand({
                dryRun: options.dryRun,
                skipChecks: options.skipChecks,
                tag: options.tag,
                access: options.access,
            });
        } catch (error) {
            handleError(error);
        }
    });

// Add command (component generator)
program
    .command('add [type] [name]')
    .description('Add component, hook, or utility to existing project')
    .option('-p, --props <props>', 'Comma-separated props/parameters')
    .option('-t, --with-test', 'Include test file', true)
    .option('--no-test', 'Skip test file generation')
    .action(async (type?: string, name?: string, options?) => {
        try {
            await addCommand(type, name, {
                props: options?.props,
                withTest: options?.withTest ?? !options?.noTest,
            });
        } catch (error) {
            handleError(error);
        }
    });

// Migrate command
program
    .command('migrate')
    .description('Migrate build system or module format')
    .option('-f, --from <from>', 'Source (vite, rollup, cjs, jest)')
    .option('-t, --to <to>', 'Target (tsup, esm, vitest)')
    .option('-d, --dry-run', 'Preview changes without applying')
    .action(async (options) => {
        try {
            await migrateCommand({
                from: options.from,
                to: options.to,
                dryRun: options.dryRun,
            });
        } catch (error) {
            handleError(error);
        }
    });

// Docs command
program
    .command('docs [subcommand]')
    .description('Generate or serve API documentation')
    .option('-o, --output <path>', 'Output directory for docs')
    .option('-f, --format <format>', 'Output format (markdown, json)', 'markdown')
    .action(async (subcommand?: string, options?) => {
        try {
            await docsCommand(subcommand, {
                output: options?.output,
                format: options?.format,
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
