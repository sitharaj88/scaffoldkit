/**
 * Create Command
 * Interactive wizard for creating new packages
 */
import path from 'path';
import chalk from 'chalk';
import {
    input,
    select,
    confirm,
} from '@inquirer/prompts';
import validateNpmPackageName from 'validate-npm-package-name';
import type {
    Framework,
    PackageType,
    PackageManager,
    BuildSystem,
    RuntimeTarget,
    ModuleFormat,
    GeneratorConfig,
} from '../types/index.js';
import { registry } from '../core/registry.js';
import { generatePackage } from '../core/generator.js';
import { logger } from '../core/logger.js';

/**
 * Wizard prompts for package creation
 */
interface WizardAnswers {
    name: string;
    description: string;
    framework: Framework;
    packageType: PackageType;
    packageManager: PackageManager;
    buildSystem: BuildSystem;
    runtimeTarget: RuntimeTarget;
    moduleFormat: ModuleFormat;
    license: string;
    author: string;
    repository?: string;
    includeExample: boolean;
}

/**
 * Run the create command
 */
export async function createCommand(name?: string): Promise<void> {
    logger.header('Create New Package');
    logger.blank();

    try {
        // Gather all wizard answers
        const answers = await runWizard(name);

        // Build configuration
        const config: GeneratorConfig = {
            name: answers.name,
            description: answers.description,
            packageType: answers.packageType,
            runtimeTarget: answers.runtimeTarget,
            moduleFormat: answers.moduleFormat,
            buildSystem: answers.buildSystem,
            packageManager: answers.packageManager,
            license: answers.license,
            author: answers.author,
            repository: answers.repository,
            includeExample: answers.includeExample,
            outDir: path.resolve(process.cwd(), getPackageDir(answers.name)),
        };

        // Confirm before generating
        logger.blank();
        logger.box('Package Configuration', [
            `Name: ${config.name}`,
            `Framework: ${answers.framework}`,
            `Type: ${config.packageType}`,
            `Build: ${config.buildSystem}`,
            `Target: ${config.runtimeTarget}`,
            `Format: ${config.moduleFormat}`,
            `License: ${config.license}`,
            `Output: ${config.outDir}`,
        ]);

        const shouldProceed = await confirm({
            message: 'Generate package with these settings?',
            default: true,
        });

        if (!shouldProceed) {
            logger.info('Package creation cancelled');
            return;
        }

        logger.blank();

        // Generate the package
        const result = await generatePackage(answers.framework, config);

        if (!result.success) {
            logger.error(`Generation failed: ${result.error}`);
            process.exit(1);
        }

        // Display success message
        logger.blank();
        logger.success(`Package ${chalk.bold(config.name)} created successfully!`);
        logger.blank();

        // Display warnings if any
        if (result.warnings.length > 0) {
            logger.warn('Warnings:');
            result.warnings.forEach((w) => logger.list([w]));
            logger.blank();
        }

        // Display generated files
        logger.info(`Generated ${result.files.length} files:`);
        result.files.slice(0, 10).forEach((f) => logger.file(f));
        if (result.files.length > 10) {
            logger.info(`... and ${result.files.length - 10} more`);
        }
        logger.blank();

        // Display next steps
        logger.header('Next Steps');
        logger.blank();
        result.nextSteps.forEach((step, i) => {
            logger.command(step);
        });
        logger.blank();

    } catch (error) {
        if (error instanceof Error && error.message.includes('User force closed')) {
            logger.info('Operation cancelled');
            return;
        }
        throw error;
    }
}

/**
 * Run the interactive wizard
 */
async function runWizard(initialName?: string): Promise<WizardAnswers> {
    // Get supported frameworks from registry
    const supportedFrameworks = registry.getSupportedFrameworks();

    // Package name
    const name = await input({
        message: 'Package name:',
        default: initialName,
        validate: (value) => {
            const result = validateNpmPackageName(value);
            if (!result.validForNewPackages) {
                const errors = [...(result.errors || []), ...(result.warnings || [])];
                return errors[0] || 'Invalid package name';
            }
            return true;
        },
    });

    // Description
    const description = await input({
        message: 'Description:',
        default: `A ${name} package`,
    });

    // Framework
    const frameworkChoices: Array<{ value: Framework; name: string; description: string }> = [
        { value: 'react', name: 'React', description: 'React component library' },
        { value: 'vue', name: 'Vue 3', description: 'Vue 3 component library with Composition API' },
        { value: 'svelte', name: 'Svelte', description: 'Svelte component library' },
        { value: 'vanilla', name: 'TypeScript', description: 'Framework-agnostic TypeScript utility' },
        { value: 'node', name: 'Node.js', description: 'Node.js package or CLI' },
    ];

    const framework = await select<Framework>({
        message: 'Framework:',
        choices: frameworkChoices.filter((c) => supportedFrameworks.includes(c.value)),
    });

    // Package type
    const generator = registry.getPrimary(framework);
    const supportedTypes = generator?.meta.supportedPackageTypes || ['library' as PackageType];

    const packageTypeChoices: Array<{ value: PackageType; name: string; description: string }> = [
        { value: 'library', name: 'Library', description: 'Component or utility library' },
        { value: 'plugin', name: 'Plugin', description: 'Framework plugin or extension' },
        { value: 'utility', name: 'Utility', description: 'Helper utilities and functions' },
        { value: 'cli', name: 'CLI', description: 'Command-line tool' },
        { value: 'sdk', name: 'SDK', description: 'SDK for external service' },
    ];

    const packageType = await select<PackageType>({
        message: 'Package type:',
        choices: packageTypeChoices.filter((c) => supportedTypes.includes(c.value)),
    });

    // Package manager
    const packageManager = await select<PackageManager>({
        message: 'Package manager:',
        choices: [
            { value: 'npm', name: 'npm' },
            { value: 'pnpm', name: 'pnpm', description: 'Fast, disk-efficient' },
            { value: 'yarn', name: 'yarn' },
            { value: 'bun', name: 'bun', description: 'Ultra-fast JavaScript runtime' },
        ],
        default: 'npm',
    });

    // Build system
    const recommendedBuild = generator?.meta.recommendedBuildSystem || 'tsup';

    const buildSystem = await select<BuildSystem>({
        message: 'Build system:',
        choices: [
            { value: 'tsup', name: 'tsup', description: 'Zero-config bundler (recommended)' },
            { value: 'vite', name: 'Vite', description: 'Next generation frontend tooling' },
            { value: 'rollup', name: 'Rollup', description: 'Module bundler for libraries' },
            { value: 'unbuild', name: 'unbuild', description: 'Unified build system' },
            { value: 'esbuild', name: 'esbuild', description: 'Extremely fast bundler' },
        ],
        default: recommendedBuild,
    });

    // Runtime target
    const supportedTargets = generator?.meta.supportedRuntimeTargets || ['browser' as RuntimeTarget, 'node' as RuntimeTarget, 'universal' as RuntimeTarget];

    const runtimeTargetChoices: Array<{ value: RuntimeTarget; name: string; description: string }> = [
        { value: 'browser', name: 'Browser', description: 'Browser environments' },
        { value: 'node', name: 'Node.js', description: 'Node.js runtime' },
        { value: 'universal', name: 'Universal', description: 'Both browser and Node.js' },
        { value: 'edge', name: 'Edge', description: 'Edge runtime (Deno, Cloudflare Workers)' },
    ];

    const runtimeTarget = await select<RuntimeTarget>({
        message: 'Runtime target:',
        choices: runtimeTargetChoices.filter((c) => supportedTargets.includes(c.value)),
        default: framework === 'node' ? 'node' : 'browser',
    });

    // Module format
    const moduleFormat = await select<ModuleFormat>({
        message: 'Module format:',
        choices: [
            { value: 'esm', name: 'ESM only', description: 'Modern ES modules (recommended)' },
            { value: 'dual', name: 'Dual (ESM + CJS)', description: 'Both ESM and CommonJS' },
            { value: 'cjs', name: 'CJS only', description: 'CommonJS (legacy)' },
        ],
        default: 'esm',
    });

    // License
    const license = await select({
        message: 'License:',
        choices: [
            { value: 'MIT', name: 'MIT' },
            { value: 'Apache-2.0', name: 'Apache 2.0' },
            { value: 'ISC', name: 'ISC' },
            { value: 'BSD-3-Clause', name: 'BSD 3-Clause' },
            { value: 'GPL-3.0', name: 'GPL 3.0' },
            { value: 'UNLICENSED', name: 'Unlicensed' },
        ],
        default: 'MIT',
    });

    // Author
    const author = await input({
        message: 'Author:',
        default: process.env.npm_config_init_author_name || '',
    });

    // Repository (optional)
    const addRepository = await confirm({
        message: 'Add repository URL?',
        default: false,
    });

    let repository: string | undefined;
    if (addRepository) {
        repository = await input({
            message: 'Repository URL:',
            validate: (value) => {
                if (value && !value.match(/^https?:\/\//)) {
                    return 'Please enter a valid URL';
                }
                return true;
            },
        });
    }

    // Include example app
    const includeExample = await confirm({
        message: 'Include example application?',
        default: true,
    });

    return {
        name,
        description,
        framework,
        packageType,
        packageManager,
        buildSystem,
        runtimeTarget,
        moduleFormat,
        license,
        author,
        repository,
        includeExample,
    };
}

/**
 * Get directory name from package name
 */
function getPackageDir(name: string): string {
    // Remove scope if present
    return name.replace(/^@[^/]+\//, '');
}

export default createCommand;
