/**
 * Enterprise Preset
 * Full-featured setup for production libraries
 * Includes: CI/CD, Husky, Commitlint, Semantic Release, Changesets
 */
import type { PresetConfig } from '../types/presets.js';

export const enterprisePreset: PresetConfig = {
    name: 'enterprise',
    description: 'Full-featured setup with CI/CD, git hooks, conventional commits, and automated releases',
    buildSystem: 'tsup',
    moduleFormat: 'dual', // ESM + CJS for maximum compatibility
    includeExample: true,
    ciProvider: 'github-actions',
    includeHusky: true,
    includeCommitlint: true,
    includeSemanticRelease: true,
    includeStorybook: false,
    includeChangesets: true,
    additionalDevDeps: {
        'husky': '^9.1.0',
        '@commitlint/cli': '^19.6.0',
        '@commitlint/config-conventional': '^19.6.0',
        'semantic-release': '^24.2.0',
        '@changesets/cli': '^2.27.0',
        'lint-staged': '^15.3.0',
    },
    additionalScripts: {
        'prepare': 'husky',
        'commit': 'git-cz',
        'release': 'semantic-release',
        'changeset': 'changeset',
        'version': 'changeset version',
    },
};

export default enterprisePreset;
