/**
 * Migrate Command
 * Migration assistant for build systems and module formats
 */
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { select, confirm } from '@inquirer/prompts';
import { logger } from '../core/logger.js';

/**
 * Migrate command options
 */
export interface MigrateOptions {
    from?: string;
    to?: string;
    dryRun?: boolean;
}

/**
 * Migration plan step
 */
interface MigrationStep {
    type: 'file_create' | 'file_delete' | 'file_modify' | 'package_update';
    description: string;
    path?: string;
    content?: string;
    changes?: { field: string; from: unknown; to: unknown }[];
}

/**
 * Migration strategy
 */
interface MigrationStrategy {
    name: string;
    description: string;
    from: string;
    to: string;
    migrate: (projectPath: string) => Promise<MigrationStep[]>;
}

/**
 * Available migration strategies
 */
const strategies: MigrationStrategy[] = [
    {
        name: 'Vite to tsup',
        description: 'Migrate from Vite library mode to tsup',
        from: 'vite',
        to: 'tsup',
        migrate: migrateViteToTsup,
    },
    {
        name: 'Rollup to tsup',
        description: 'Migrate from Rollup to tsup',
        from: 'rollup',
        to: 'tsup',
        migrate: migrateRollupToTsup,
    },
    {
        name: 'CJS to ESM',
        description: 'Migrate from CommonJS to ES Modules',
        from: 'cjs',
        to: 'esm',
        migrate: migrateCjsToEsm,
    },
    {
        name: 'Jest to Vitest',
        description: 'Migrate from Jest to Vitest',
        from: 'jest',
        to: 'vitest',
        migrate: migrateJestToVitest,
    },
];

/**
 * Run the migrate command
 */
export async function migrateCommand(options: MigrateOptions = {}): Promise<void> {
    const projectPath = process.cwd();

    logger.header('Migration Assistant');
    logger.blank();

    // Check if in a valid project
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
        logger.error('No package.json found. Run this command in your project root.');
        process.exit(1);
    }

    // Select migration strategy
    let strategy: MigrationStrategy | undefined;

    if (options.from && options.to) {
        strategy = strategies.find(s => s.from === options.from && s.to === options.to);
        if (!strategy) {
            logger.error(`No migration strategy found for ${options.from} → ${options.to}`);
            console.log();
            console.log('Available migrations:');
            for (const s of strategies) {
                console.log(`  • ${s.from} → ${s.to}: ${s.description}`);
            }
            process.exit(1);
        }
    } else {
        strategy = await select({
            message: 'Select migration:',
            choices: strategies.map(s => ({
                value: s,
                name: `${s.from} → ${s.to}`,
                description: s.description,
            })),
        });
    }

    logger.keyValue('Migration', `${strategy.from} → ${strategy.to}`);
    logger.blank();

    // Generate migration plan
    console.log(chalk.bold('📋 Analyzing project...'));
    console.log();

    const steps = await strategy.migrate(projectPath);

    if (steps.length === 0) {
        logger.success('No changes needed. Project already migrated or compatible.');
        return;
    }

    // Show migration plan
    console.log(chalk.bold('📝 Migration Plan:'));
    console.log();

    for (const step of steps) {
        const icon = step.type === 'file_create' ? chalk.green('+') :
            step.type === 'file_delete' ? chalk.red('-') :
                step.type === 'file_modify' ? chalk.yellow('~') :
                    chalk.cyan('⬡');

        console.log(`  ${icon} ${step.description}`);
        if (step.path) {
            console.log(`    ${chalk.dim(step.path)}`);
        }
    }

    console.log();

    // Confirm
    if (options.dryRun) {
        console.log(chalk.yellow('📝 Dry run mode - no changes will be made'));
        return;
    }

    const confirmed = await confirm({
        message: `Apply ${steps.length} changes?`,
        default: true,
    });

    if (!confirmed) {
        logger.warn('Migration cancelled.');
        return;
    }

    // Execute migration
    console.log();
    console.log(chalk.bold('🔄 Applying changes...'));
    console.log();

    for (const step of steps) {
        await executeStep(projectPath, step);
        console.log(`  ${chalk.green('✔')} ${step.description}`);
    }

    console.log();
    logger.success('Migration completed!');

    // Next steps
    console.log();
    console.log(chalk.bold('Next steps:'));
    console.log(`  • Run: ${chalk.cyan('npm install')}`);
    console.log(`  • Run: ${chalk.cyan('npm run build')}`);
    console.log(`  • Review changes and commit`);
}

/**
 * Execute a single migration step
 */
async function executeStep(projectPath: string, step: MigrationStep): Promise<void> {
    switch (step.type) {
        case 'file_create':
            if (step.path && step.content) {
                await fs.ensureDir(path.dirname(path.join(projectPath, step.path)));
                await fs.writeFile(path.join(projectPath, step.path), step.content);
            }
            break;

        case 'file_delete':
            if (step.path) {
                await fs.remove(path.join(projectPath, step.path));
            }
            break;

        case 'file_modify':
            // For simplicity, file_modify is handled by creating new content
            if (step.path && step.content) {
                await fs.writeFile(path.join(projectPath, step.path), step.content);
            }
            break;

        case 'package_update':
            const packageJsonPath = path.join(projectPath, 'package.json');
            const packageJson = await fs.readJson(packageJsonPath);

            if (step.changes) {
                for (const change of step.changes) {
                    // Handle nested paths like "scripts.build"
                    const parts = change.field.split('.');
                    let target = packageJson;

                    for (let i = 0; i < parts.length - 1; i++) {
                        if (!target[parts[i]]) target[parts[i]] = {};
                        target = target[parts[i]];
                    }

                    const lastPart = parts[parts.length - 1];
                    if (change.to === null) {
                        delete target[lastPart];
                    } else {
                        target[lastPart] = change.to;
                    }
                }
            }

            await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
            break;
    }
}

/**
 * Migrate from Vite to tsup
 */
async function migrateViteToTsup(projectPath: string): Promise<MigrationStep[]> {
    const steps: MigrationStep[] = [];
    const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));

    // Check if using Vite
    const deps = { ...packageJson.devDependencies, ...packageJson.dependencies };
    if (!deps.vite) {
        return [];
    }

    // Create tsup config
    const isReact = !!deps.react;
    const tsupConfig = `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,${isReact ? `
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },` : ''}
});
`;

    steps.push({
        type: 'file_create',
        description: 'Create tsup.config.ts',
        path: 'tsup.config.ts',
        content: tsupConfig,
    });

    // Remove old Vite config
    if (await fs.pathExists(path.join(projectPath, 'vite.config.ts'))) {
        steps.push({
            type: 'file_delete',
            description: 'Remove vite.config.ts',
            path: 'vite.config.ts',
        });
    }

    // Update package.json
    steps.push({
        type: 'package_update',
        description: 'Update package.json dependencies and scripts',
        changes: [
            { field: 'devDependencies.vite', from: deps.vite, to: null },
            { field: 'devDependencies.vite-plugin-dts', from: deps['vite-plugin-dts'], to: null },
            { field: 'devDependencies.tsup', from: undefined, to: '^8.3.0' },
            { field: 'scripts.build', from: packageJson.scripts?.build, to: 'tsup' },
            { field: 'scripts.dev', from: packageJson.scripts?.dev, to: 'tsup --watch' },
        ],
    });

    return steps;
}

/**
 * Migrate from Rollup to tsup
 */
async function migrateRollupToTsup(projectPath: string): Promise<MigrationStep[]> {
    const steps: MigrationStep[] = [];
    const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));

    const deps = { ...packageJson.devDependencies, ...packageJson.dependencies };
    if (!deps.rollup) {
        return [];
    }

    // Create tsup config
    steps.push({
        type: 'file_create',
        description: 'Create tsup.config.ts',
        path: 'tsup.config.ts',
        content: `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
});
`,
    });

    // Remove Rollup config
    for (const configFile of ['rollup.config.js', 'rollup.config.ts', 'rollup.config.mjs']) {
        if (await fs.pathExists(path.join(projectPath, configFile))) {
            steps.push({
                type: 'file_delete',
                description: `Remove ${configFile}`,
                path: configFile,
            });
        }
    }

    // Update package.json - remove rollup deps and add tsup
    const rollupDeps = Object.keys(deps).filter(d => d.startsWith('@rollup/') || d === 'rollup');
    const depChanges: { field: string; from: unknown; to: unknown }[] = rollupDeps.map(d => ({
        field: `devDependencies.${d}`,
        from: deps[d],
        to: null,
    }));

    depChanges.push(
        { field: 'devDependencies.tsup', from: undefined, to: '^8.3.0' },
        { field: 'scripts.build', from: packageJson.scripts?.build, to: 'tsup' },
        { field: 'scripts.dev', from: packageJson.scripts?.dev, to: 'tsup --watch' },
    );

    steps.push({
        type: 'package_update',
        description: 'Update package.json dependencies and scripts',
        changes: depChanges,
    });

    return steps;
}

/**
 * Migrate from CJS to ESM
 */
async function migrateCjsToEsm(projectPath: string): Promise<MigrationStep[]> {
    const steps: MigrationStep[] = [];
    const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));

    // Check if already ESM
    if (packageJson.type === 'module') {
        return [];
    }

    // Update package.json
    steps.push({
        type: 'package_update',
        description: 'Set package type to "module"',
        changes: [
            { field: 'type', from: packageJson.type, to: 'module' },
        ],
    });

    // Update exports if exists
    if (packageJson.exports) {
        const newExports = JSON.parse(JSON.stringify(packageJson.exports));
        updateExportsToEsm(newExports);

        steps.push({
            type: 'package_update',
            description: 'Update exports to ESM format',
            changes: [
                { field: 'exports', from: packageJson.exports, to: newExports },
            ],
        });
    }

    // Update tsconfig if needed
    const tsconfigPath = path.join(projectPath, 'tsconfig.json');
    if (await fs.pathExists(tsconfigPath)) {
        const tsconfig = await fs.readJson(tsconfigPath);
        if (tsconfig.compilerOptions?.module !== 'NodeNext') {
            const newTsconfig = {
                ...tsconfig,
                compilerOptions: {
                    ...tsconfig.compilerOptions,
                    module: 'NodeNext',
                    moduleResolution: 'NodeNext',
                },
            };
            steps.push({
                type: 'file_modify',
                description: 'Update tsconfig.json for ESM',
                path: 'tsconfig.json',
                content: JSON.stringify(newTsconfig, null, 2) + '\n',
            });
        }
    }

    return steps;
}

/**
 * Update exports object to ESM format
 */
function updateExportsToEsm(exports: Record<string, unknown>): void {
    for (const key of Object.keys(exports)) {
        const value = exports[key];
        if (typeof value === 'object' && value !== null) {
            const exp = value as Record<string, unknown>;
            // Remove require entry, keep import
            if (exp.require) {
                delete exp.require;
            }
            // Ensure import is set
            if (exp.default && !exp.import) {
                exp.import = exp.default;
            }
        }
    }
}

/**
 * Migrate from Jest to Vitest
 */
async function migrateJestToVitest(projectPath: string): Promise<MigrationStep[]> {
    const steps: MigrationStep[] = [];
    const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));

    const deps = { ...packageJson.devDependencies, ...packageJson.dependencies };
    if (!deps.jest && !deps['@jest/globals']) {
        return [];
    }

    // Create vitest config
    steps.push({
        type: 'file_create',
        description: 'Create vitest.config.ts',
        path: 'vitest.config.ts',
        content: `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
`,
    });

    // Remove Jest config files
    for (const configFile of ['jest.config.js', 'jest.config.ts', 'jest.config.mjs', 'jest.config.json']) {
        if (await fs.pathExists(path.join(projectPath, configFile))) {
            steps.push({
                type: 'file_delete',
                description: `Remove ${configFile}`,
                path: configFile,
            });
        }
    }

    // Update package.json
    const jestDeps = Object.keys(deps).filter(d =>
        d.startsWith('@jest/') ||
        d === 'jest' ||
        d.startsWith('jest-') ||
        d === 'ts-jest'
    );

    const depChanges: { field: string; from: unknown; to: unknown }[] = jestDeps.map(d => ({
        field: `devDependencies.${d}`,
        from: deps[d],
        to: null,
    }));

    depChanges.push(
        { field: 'devDependencies.vitest', from: undefined, to: '^2.1.0' },
        { field: 'scripts.test', from: packageJson.scripts?.test, to: 'vitest' },
    );

    steps.push({
        type: 'package_update',
        description: 'Update package.json dependencies and scripts',
        changes: depChanges,
    });

    return steps;
}

export default migrateCommand;
