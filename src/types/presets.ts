/**
 * Preset Types
 * Defines the structure for template presets
 */
import type { BuildSystem, PackageManager, RuntimeTarget, ModuleFormat } from './index.js';

/**
 * Available preset names
 */
export type PresetName = 'minimal' | 'standard' | 'enterprise' | 'component-library';

/**
 * CI Provider options
 */
export type CIProvider = 'github-actions' | 'gitlab-ci' | 'none';

/**
 * Preset configuration that overrides wizard defaults
 */
export interface PresetConfig {
    /** Preset identifier */
    name: PresetName;

    /** Human-readable description */
    description: string;

    /** Build system to use */
    buildSystem?: BuildSystem;

    /** Module format */
    moduleFormat?: ModuleFormat;

    /** Runtime target */
    runtimeTarget?: RuntimeTarget;

    /** Include example application */
    includeExample?: boolean;

    /** Include CI configuration */
    ciProvider?: CIProvider;

    /** Include git hooks (husky) */
    includeHusky?: boolean;

    /** Include commitlint for conventional commits */
    includeCommitlint?: boolean;

    /** Include semantic-release */
    includeSemanticRelease?: boolean;

    /** Include Storybook (for component libraries) */
    includeStorybook?: boolean;

    /** Include Changesets for versioning */
    includeChangesets?: boolean;

    /** Additional dev dependencies to include */
    additionalDevDeps?: Record<string, string>;

    /** Additional scripts to include in package.json */
    additionalScripts?: Record<string, string>;

    /** Additional files to generate */
    additionalFiles?: Array<{ path: string; template: string }>;
}

/**
 * Extended generator config with preset options
 */
export interface ExtendedGeneratorConfig {
    /** CI provider to use */
    ciProvider?: CIProvider;

    /** Include git hooks */
    includeHusky?: boolean;

    /** Include commitlint */
    includeCommitlint?: boolean;

    /** Include semantic-release */
    includeSemanticRelease?: boolean;

    /** Include Storybook */
    includeStorybook?: boolean;

    /** Include Changesets */
    includeChangesets?: boolean;
}
