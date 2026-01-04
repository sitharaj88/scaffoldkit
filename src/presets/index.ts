/**
 * Presets Module
 * Exports all available presets and utilities for preset management
 */
import type { PresetConfig, PresetName } from '../types/presets.js';
import { minimalPreset } from './minimal.js';
import { standardPreset } from './standard.js';
import { enterprisePreset } from './enterprise.js';
import { componentLibraryPreset } from './component-library.js';

/**
 * All available presets
 */
export const presets: Record<PresetName, PresetConfig> = {
    minimal: minimalPreset,
    standard: standardPreset,
    enterprise: enterprisePreset,
    'component-library': componentLibraryPreset,
};

/**
 * Get a preset by name
 */
export function getPreset(name: PresetName): PresetConfig | undefined {
    return presets[name];
}

/**
 * Get all available preset names
 */
export function getPresetNames(): PresetName[] {
    return Object.keys(presets) as PresetName[];
}

/**
 * Get preset choices for inquirer select
 */
export function getPresetChoices(): Array<{ value: PresetName; name: string; description: string }> {
    return [
        { value: 'standard', name: 'Standard', description: standardPreset.description },
        { value: 'minimal', name: 'Minimal', description: minimalPreset.description },
        { value: 'enterprise', name: 'Enterprise', description: enterprisePreset.description },
        { value: 'component-library', name: 'Component Library', description: componentLibraryPreset.description },
    ];
}

// Export individual presets
export { minimalPreset } from './minimal.js';
export { standardPreset } from './standard.js';
export { enterprisePreset } from './enterprise.js';
export { componentLibraryPreset } from './component-library.js';

// Export types
export type { PresetConfig, PresetName, CIProvider } from '../types/presets.js';
