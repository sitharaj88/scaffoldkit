/**
 * Standard Preset
 * Balanced setup for most projects - tests, CI, example app
 */
import type { PresetConfig } from '../types/presets.js';

export const standardPreset: PresetConfig = {
    name: 'standard',
    description: 'Balanced setup with tests, CI, and example app',
    buildSystem: 'tsup',
    moduleFormat: 'esm',
    includeExample: true,
    ciProvider: 'github-actions',
    includeHusky: false,
    includeCommitlint: false,
    includeSemanticRelease: false,
    includeStorybook: false,
    includeChangesets: false,
};

export default standardPreset;
