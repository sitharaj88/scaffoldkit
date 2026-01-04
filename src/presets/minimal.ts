/**
 * Minimal Preset
 * Bare-bones setup for quick prototypes or simple utilities
 */
import type { PresetConfig } from '../types/presets.js';

export const minimalPreset: PresetConfig = {
    name: 'minimal',
    description: 'Minimal setup for quick prototypes - no tests, no CI, no examples',
    buildSystem: 'tsup',
    moduleFormat: 'esm',
    includeExample: false,
    ciProvider: 'none',
    includeHusky: false,
    includeCommitlint: false,
    includeSemanticRelease: false,
    includeStorybook: false,
    includeChangesets: false,
};

export default minimalPreset;
