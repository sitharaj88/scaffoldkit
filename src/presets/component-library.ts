/**
 * Component Library Preset
 * Optimized for UI component libraries
 * Includes: Storybook, visual testing setup, CSS handling
 */
import type { PresetConfig } from '../types/presets.js';

export const componentLibraryPreset: PresetConfig = {
    name: 'component-library',
    description: 'Optimized for UI component libraries with Storybook and visual testing',
    buildSystem: 'vite', // Better for component libraries with CSS
    moduleFormat: 'esm',
    runtimeTarget: 'browser',
    includeExample: true,
    ciProvider: 'github-actions',
    includeHusky: true,
    includeCommitlint: true,
    includeSemanticRelease: false,
    includeStorybook: true,
    includeChangesets: true,
    additionalDevDeps: {
        'storybook': '^8.5.0',
        '@storybook/addon-essentials': '^8.5.0',
        '@storybook/addon-interactions': '^8.5.0',
        '@storybook/addon-a11y': '^8.5.0',
        '@storybook/test': '^8.5.0',
        'husky': '^9.1.0',
        '@commitlint/cli': '^19.6.0',
        '@commitlint/config-conventional': '^19.6.0',
        '@changesets/cli': '^2.27.0',
    },
    additionalScripts: {
        'prepare': 'husky',
        'storybook': 'storybook dev -p 6006',
        'build-storybook': 'storybook build',
        'changeset': 'changeset',
        'version': 'changeset version',
    },
};

export default componentLibraryPreset;
