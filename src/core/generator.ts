/**
 * Package Generator
 * Orchestrates the generation process using registered generators
 */
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import type {
    Generator,
    GeneratorConfig,
    GeneratorResult,
    TemplateContext,
    DependencySpec,
    Framework,
} from '../types/index.js';
import prettier from 'prettier';
import { registry } from './registry.js';
import { templateEngine } from './template-engine.js';
import { logger } from './logger.js';

/**
 * Format content string using Prettier
 */
async function formatContent(content: string, filepath: string): Promise<string> {
    try {
        const ext = path.extname(filepath);
        let parser = 'babel';

        switch (ext) {
            case '.ts':
            case '.tsx':
                parser = 'typescript';
                break;
            case '.js':
            case '.jsx':
            case '.mjs':
            case '.cjs':
                parser = 'babel';
                break;
            case '.json':
                parser = 'json';
                break;
            case '.md':
                parser = 'markdown';
                break;
            case '.html':
                parser = 'html';
                break;
            case '.css':
            case '.scss':
                parser = 'css';
                break;
            case '.yaml':
            case '.yml':
                parser = 'yaml';
                break;
            default:
                return content;
        }

        return await prettier.format(content, {
            parser,
            semi: true,
            singleQuote: true,
            trailingComma: 'es5',
            tabWidth: 2,
            printWidth: 100,
        });
    } catch (error) {
        logger.warn(`Failed to format ${filepath}: ${error instanceof Error ? error.message : String(error)}`);
        return content;
    }
}

/**
 * Generate a package using the appropriate generator
 */
export async function generatePackage(
    framework: Framework,
    config: GeneratorConfig
): Promise<GeneratorResult> {
    const spinner = ora();
    const files: string[] = [];
    const warnings: string[] = [];

    try {
        // Get generator for the framework
        const generator = registry.getPrimary(framework);

        if (!generator) {
            return {
                success: false,
                files: [],
                warnings: [],
                error: `No generator found for framework: ${framework}`,
                nextSteps: [],
            };
        }

        // Validate configuration
        spinner.start('Validating configuration...');
        const validation = generator.validate(config);

        if (!validation.valid) {
            spinner.fail('Configuration validation failed');
            const errorMessages = validation.issues
                .filter((i) => i.severity === 'error')
                .map((i) => i.message);
            return {
                success: false,
                files: [],
                warnings: [],
                error: errorMessages.join('\n'),
                nextSteps: [],
            };
        }

        // Add warnings from validation
        validation.issues
            .filter((i) => i.severity === 'warning')
            .forEach((i) => warnings.push(i.message));

        spinner.succeed('Configuration valid');

        // Create output directory
        spinner.start('Creating project directory...');
        await fs.ensureDir(config.outDir);
        spinner.succeed(`Created ${config.outDir}`);

        // Build template context
        const context = buildTemplateContext(config, generator);

        // Get files to generate
        const filesToGenerate = generator.getFiles(config);

        // Generate each file
        spinner.start('Generating files...');

        for (const file of filesToGenerate) {
            // Check condition if specified
            if (file.condition && !file.condition(config)) {
                continue;
            }

            const filePath = path.join(config.outDir, file.path);
            await fs.ensureDir(path.dirname(filePath));

            let content: string;

            if (file.isTemplate) {
                // Log templates root for debugging
                logger.debug(`Templates root: ${templateEngine.getTemplatesRoot()}`);

                try {
                    content = await templateEngine.render(file.template, context);
                } catch (error) {
                    // If template not found, try alternate paths
                    const alternatePaths = [
                        `${framework}/${file.template.replace(`${framework}/`, '').replace('common/', '')}`,
                        file.template.replace(`${framework}/`, ''),
                    ];

                    let found = false;
                    for (const altPath of alternatePaths) {
                        try {
                            content = await templateEngine.render(altPath, context);
                            found = true;
                            break;
                        } catch {
                            // Continue trying
                        }
                    }

                    if (!found) {
                        // Log error with details
                        logger.warn(`Template not found: ${file.template}, tried: ${alternatePaths.join(', ')}`);
                        logger.warn(`Templates root: ${templateEngine.getTemplatesRoot()}`);
                        throw new Error(`Template not found: ${file.template}`);
                    }
                }
            } else {
                content = file.template;
            }

            // Format content with Prettier
            const formattedContent = await formatContent(content!, filePath);
            await fs.writeFile(filePath, formattedContent, 'utf-8');
            files.push(file.path);
            logger.debug(`Generated: ${file.path}`);
        }

        spinner.succeed(`Generated ${files.length} files`);

        // Create package.json with dependencies
        spinner.start('Setting up package.json...');
        await generatePackageJson(generator, config, context);
        spinner.succeed('Created package.json');

        // Run post-generation hooks
        const result: GeneratorResult = {
            success: true,
            files,
            warnings,
            nextSteps: generateNextSteps(config),
        };

        if (generator.postGenerate) {
            spinner.start('Running post-generation hooks...');
            await generator.postGenerate(config, result);
            spinner.succeed('Post-generation complete');
        }

        return result;

    } catch (error) {
        spinner.fail('Generation failed');
        return {
            success: false,
            files,
            warnings,
            error: error instanceof Error ? error.message : String(error),
            nextSteps: [],
        };
    }
}

/**
 * Build template context from config
 */
function buildTemplateContext(
    config: GeneratorConfig,
    generator: Generator
): TemplateContext {
    const deps = generator.getDependencies(config);
    const exports = generator.getExports(config);
    const extras = generator.getPackageJsonExtras(config);

    return {
        ...config,
        year: new Date().getFullYear(),
        date: new Date().toISOString().split('T')[0],
        cliVersion: '1.0.0-alpha.1', // TODO: Get from package.json
        dependencies: groupDependencies(deps, 'dependency'),
        devDependencies: groupDependencies(deps, 'devDependency'),
        peerDependencies: groupDependencies(deps, 'peerDependency'),
        optionalDependencies: groupDependencies(deps, 'optionalDependency'),
        exports,
        ...extras,
        framework: generator.meta.framework,
        generatorId: generator.meta.id,
    };
}

/**
 * Group dependencies by type
 */
function groupDependencies(
    deps: DependencySpec[],
    type: DependencySpec['type']
): Record<string, string> {
    return deps
        .filter((d) => d.type === type)
        .reduce(
            (acc, dep) => {
                acc[dep.name] = dep.version;
                return acc;
            },
            {} as Record<string, string>
        );
}

/**
 * Generate package.json
 */
async function generatePackageJson(
    generator: Generator,
    config: GeneratorConfig,
    context: TemplateContext
): Promise<void> {
    const deps = generator.getDependencies(config);
    const exports = generator.getExports(config);
    const extras = generator.getPackageJsonExtras(config);

    // Build exports field
    const exportsField: Record<string, unknown> = {};

    for (const exp of exports) {
        if (config.moduleFormat === 'dual' && exp.require) {
            exportsField[exp.path] = {
                types: exp.types,
                import: exp.import,
                require: exp.require,
                default: exp.default || exp.import,
            };
        } else {
            exportsField[exp.path] = {
                types: exp.types,
                import: exp.import,
                default: exp.default || exp.import,
            };
        }
    }

    // Base scripts
    const baseScripts: Record<string, string> = {
        build: getBuildScript(config.buildSystem),
        dev: getDevScript(config.buildSystem),
        test: 'vitest',
        'test:coverage': 'vitest --coverage',
        typecheck: 'tsc --noEmit',
        prepublishOnly: 'npm run build',
    };

    // Merge with extra scripts from generator
    const extraScripts = (extras.scripts as Record<string, string>) || {};
    const mergedScripts = { ...baseScripts, ...extraScripts };

    // Remove scripts from extras to avoid overwriting
    const { scripts: _, ...restExtras } = extras;

    const packageJson: Record<string, unknown> = {
        name: config.name,
        version: '0.0.1',
        description: config.description,
        type: 'module',
        main: './dist/index.js',
        module: './dist/index.js',
        types: './dist/index.d.ts',
        exports: exportsField,
        files: ['dist', 'README.md', 'LICENSE', 'CHANGELOG.md'],
        scripts: mergedScripts,
        keywords: [],
        author: config.author,
        license: config.license,
        sideEffects: false,
        ...restExtras,
    };

    // Add repository if provided
    if (config.repository) {
        packageJson.repository = {
            type: 'git',
            url: config.repository,
        };
    }

    // Add dependencies
    const dependencies = groupDependencies(deps, 'dependency');
    const devDependencies = groupDependencies(deps, 'devDependency');
    const peerDependencies = groupDependencies(deps, 'peerDependency');
    const optionalDependencies = groupDependencies(deps, 'optionalDependency');

    if (Object.keys(dependencies).length > 0) {
        packageJson.dependencies = dependencies;
    }

    if (Object.keys(devDependencies).length > 0) {
        packageJson.devDependencies = devDependencies;
    }

    if (Object.keys(peerDependencies).length > 0) {
        packageJson.peerDependencies = peerDependencies;
    }

    if (Object.keys(optionalDependencies).length > 0) {
        packageJson.optionalDependencies = optionalDependencies;
    }

    // Write package.json
    const packageJsonPath = path.join(config.outDir, 'package.json');
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

/**
 * Get build script based on build system
 */
function getBuildScript(buildSystem: string): string {
    switch (buildSystem) {
        case 'tsup':
            return 'tsup';
        case 'vite':
            return 'vite build';
        case 'rollup':
            return 'rollup -c';
        case 'unbuild':
            return 'unbuild';
        case 'esbuild':
            return 'esbuild src/index.ts --bundle --outdir=dist --format=esm';
        default:
            return 'tsc';
    }
}

/**
 * Get dev script based on build system
 */
function getDevScript(buildSystem: string): string {
    switch (buildSystem) {
        case 'tsup':
            return 'tsup --watch';
        case 'vite':
            return 'vite build --watch';
        case 'rollup':
            return 'rollup -c -w';
        case 'unbuild':
            return 'unbuild --watch';
        case 'esbuild':
            return 'esbuild src/index.ts --bundle --outdir=dist --format=esm --watch';
        default:
            return 'tsc --watch';
    }
}

/**
 * Generate next steps for the user
 */
function generateNextSteps(config: GeneratorConfig): string[] {
    const steps: string[] = [];
    const dirName = path.basename(config.outDir);

    steps.push(`cd ${dirName}`);

    switch (config.packageManager) {
        case 'pnpm':
            steps.push('pnpm install');
            break;
        case 'yarn':
            steps.push('yarn');
            break;
        case 'bun':
            steps.push('bun install');
            break;
        default:
            steps.push('npm install');
    }

    steps.push('npm run build');
    steps.push('npm run test');

    return steps;
}

export default generatePackage;
