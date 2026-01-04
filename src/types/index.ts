/**
 * Core types for the Scaffold CLI
 * These types define the plugin architecture and configuration system
 */

// ============================================================================
// Framework & Package Type Definitions
// ============================================================================

/**
 * Supported JavaScript frameworks
 * The system is extensible - new frameworks can be added without modifying core logic
 */
export type Framework =
    | 'react'
    | 'vue'
    | 'svelte'
    | 'angular'
    | 'solid'
    | 'qwik'
    | 'preact'
    | 'lit'
    | 'astro'
    | 'node'
    | 'deno'
    | 'bun'
    | 'vanilla';

/**
 * Package types that can be generated
 */
export type PackageType =
    | 'library'      // UI component library
    | 'plugin'       // Framework plugin/extension
    | 'utility'      // Utility/helper library
    | 'cli'          // Command-line tool
    | 'sdk'          // SDK for external service
    | 'integration'  // Framework integration (e.g., Astro integration)
    | 'adapter';     // Framework adapter

/**
 * Target runtime environments
 */
export type RuntimeTarget = 'browser' | 'node' | 'edge' | 'universal';

/**
 * Module format for the output
 */
export type ModuleFormat = 'esm' | 'cjs' | 'dual';

/**
 * Supported package managers
 */
export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

/**
 * Build system options
 */
export type BuildSystem = 'tsup' | 'vite' | 'rollup' | 'unbuild' | 'esbuild';

// ============================================================================
// Generator Plugin System Types
// ============================================================================

/**
 * Metadata about a generator plugin
 */
export interface GeneratorMeta {
    /** Unique identifier for the generator */
    id: string;

    /** Human-readable name */
    name: string;

    /** Framework this generator targets */
    framework: Framework;

    /** Description of what this generator creates */
    description: string;

    /** Version of the generator */
    version: string;

    /** Package types this generator supports */
    supportedPackageTypes: PackageType[];

    /** Runtime targets this generator can output for */
    supportedRuntimeTargets: RuntimeTarget[];

    /** Recommended build system for this generator */
    recommendedBuildSystem: BuildSystem;
}

/**
 * Dependency specification with version and type
 */
export interface DependencySpec {
    name: string;
    version: string;
    type: 'dependency' | 'devDependency' | 'peerDependency' | 'optionalDependency';
    /** Optional condition for when this dependency should be included */
    condition?: (config: GeneratorConfig) => boolean;
}

/**
 * Export configuration for package.json exports field
 */
export interface ExportConfig {
    /** Export path (e.g., ".", "./components") */
    path: string;
    /** Types entry point */
    types?: string;
    /** ESM entry point */
    import?: string;
    /** CJS entry point */
    require?: string;
    /** Default entry point */
    default?: string;
}

/**
 * File to be generated from a template
 */
export interface GeneratedFile {
    /** Relative path from package root */
    path: string;
    /** Template name or literal content */
    template: string;
    /** Whether this is a template to be processed or literal content */
    isTemplate: boolean;
    /** Optional condition for generating this file */
    condition?: (config: GeneratorConfig) => boolean;
}

/**
 * Configuration passed to a generator
 */
export interface GeneratorConfig {
    /** Package name */
    name: string;

    /** Package description */
    description: string;

    /** Package type being generated */
    packageType: PackageType;

    /** Target runtime */
    runtimeTarget: RuntimeTarget;

    /** Output module format */
    moduleFormat: ModuleFormat;

    /** Build system to use */
    buildSystem: BuildSystem;

    /** Package manager */
    packageManager: PackageManager;

    /** License type */
    license: string;

    /** Author name */
    author: string;

    /** Repository URL */
    repository?: string;

    /** Output directory */
    outDir: string;

    /** Additional options specific to the framework */
    frameworkOptions?: Record<string, unknown>;

    /** Whether to include an example application */
    includeExample?: boolean;

    // === Extended options from presets ===

    /** CI provider to use */
    ciProvider?: 'github-actions' | 'gitlab-ci' | 'none';

    /** Include Husky git hooks */
    includeHusky?: boolean;

    /** Include commitlint for conventional commits */
    includeCommitlint?: boolean;

    /** Include semantic-release for automated releases */
    includeSemanticRelease?: boolean;

    /** Include Changesets for versioning */
    includeChangesets?: boolean;

    /** Include Storybook (for component libraries) */
    includeStorybook?: boolean;

    /** Additional dev dependencies from preset */
    additionalDevDeps?: Record<string, string>;

    /** Additional scripts from preset */
    additionalScripts?: Record<string, string>;
}

/**
 * Result of running a generator
 */
export interface GeneratorResult {
    /** Whether generation was successful */
    success: boolean;

    /** Generated files */
    files: string[];

    /** Any warnings during generation */
    warnings: string[];

    /** Error message if failed */
    error?: string;

    /** Next steps message for the user */
    nextSteps: string[];
}

/**
 * Generator plugin interface
 * All framework generators must implement this interface
 */
export interface Generator {
    /** Generator metadata */
    meta: GeneratorMeta;

    /**
     * Get the dependencies for a given configuration
     */
    getDependencies(config: GeneratorConfig): DependencySpec[];

    /**
     * Get the exports configuration for package.json
     */
    getExports(config: GeneratorConfig): ExportConfig[];

    /**
     * Get the files to generate
     */
    getFiles(config: GeneratorConfig): GeneratedFile[];

    /**
     * Get additional package.json fields
     */
    getPackageJsonExtras(config: GeneratorConfig): Record<string, unknown>;

    /**
     * Validate the configuration before generation
     */
    validate(config: GeneratorConfig): ValidationResult;

    /**
     * Run any post-generation hooks
     */
    postGenerate?(config: GeneratorConfig, result: GeneratorResult): Promise<void>;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Severity level for validation issues
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * A single validation issue
 */
export interface ValidationIssue {
    /** Severity of the issue */
    severity: ValidationSeverity;

    /** Issue category */
    category: string;

    /** Human-readable message */
    message: string;

    /** Suggested fix */
    suggestion?: string;

    /** File path if relevant */
    file?: string;

    /** JSON path if relevant (e.g., "exports.import") */
    jsonPath?: string;
}

/**
 * Result of validation
 */
export interface ValidationResult {
    /** Whether validation passed (no errors, warnings are ok) */
    valid: boolean;

    /** All issues found */
    issues: ValidationIssue[];
}

// ============================================================================
// Check Command Types
// ============================================================================

/**
 * Package check categories
 */
export type CheckCategory =
    | 'exports'         // exports field validation
    | 'types'           // TypeScript types presence
    | 'sideEffects'     // Side effects configuration
    | 'treeShaking'     // Tree-shaking compatibility
    | 'peerDeps'        // Peer dependency correctness
    | 'framework'       // Framework version compatibility
    | 'tarball'         // npm pack tarball inspection
    | 'buildOutput'     // Build output correctness
    | 'deprecated';     // Deprecated patterns

/**
 * Check result for a single category
 */
export interface CheckResult {
    /** Category that was checked */
    category: CheckCategory;

    /** Whether this check passed */
    passed: boolean;

    /** Issues found */
    issues: ValidationIssue[];

    /** Time taken for the check in ms */
    duration: number;
}

// ============================================================================
// Release Command Types
// ============================================================================

/**
 * Version bump type
 */
export type VersionBumpType = 'patch' | 'minor' | 'major' | 'prepatch' | 'preminor' | 'premajor' | 'prerelease';

/**
 * Release configuration
 */
export interface ReleaseConfig {
    /** Version bump type */
    bump: VersionBumpType;

    /** Pre-release identifier (e.g., "alpha", "beta") */
    preId?: string;

    /** Whether to do a dry run */
    dryRun: boolean;

    /** Whether to generate changelog */
    changelog: boolean;

    /** npm registry to publish to */
    registry?: string;

    /** npm tag to publish with */
    tag?: string;

    /** Access level for scoped packages */
    access?: 'public' | 'restricted';
}

/**
 * Release result
 */
export interface ReleaseResult {
    /** Whether release was successful */
    success: boolean;

    /** Previous version */
    previousVersion: string;

    /** New version */
    newVersion: string;

    /** Error message if failed */
    error?: string;

    /** npm publish output */
    publishOutput?: string;
}

// ============================================================================
// CLI Configuration Types
// ============================================================================

/**
 * Global CLI configuration
 */
export interface CLIConfig {
    /** Whether to use colors in output */
    colors: boolean;

    /** Log level */
    logLevel: 'debug' | 'info' | 'warn' | 'error';

    /** Default package manager */
    defaultPackageManager: PackageManager;

    /** Default license */
    defaultLicense: string;

    /** Default author */
    defaultAuthor?: string;
}

/**
 * Template context passed to Handlebars templates
 */
export interface TemplateContext extends GeneratorConfig {
    /** Current year for license */
    year: number;

    /** Formatted date */
    date: string;

    /** CLI version */
    cliVersion: string;

    /** Framework-specific variables */
    [key: string]: unknown;
}
