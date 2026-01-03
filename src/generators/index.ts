/**
 * Generators module
 * Registers all built-in generators with the registry
 */
import { registry } from '../core/registry.js';

// Import generators
import { reactGenerator } from './react/index.js';
import { vueGenerator } from './vue/index.js';
import { svelteGenerator } from './svelte/index.js';
import { vanillaGenerator } from './vanilla/index.js';
import { nodeGenerator } from './node/index.js';

/**
 * Initialize and register all built-in generators
 */
export function initializeGenerators(): void {
    registry.register(reactGenerator);
    registry.register(vueGenerator);
    registry.register(svelteGenerator);
    registry.register(vanillaGenerator);
    registry.register(nodeGenerator);
}

// Export individual generators
export { reactGenerator } from './react/index.js';
export { vueGenerator } from './vue/index.js';
export { svelteGenerator } from './svelte/index.js';
export { vanillaGenerator } from './vanilla/index.js';
export { nodeGenerator } from './node/index.js';

// Export types
export { BaseGenerator } from '../core/base-generator.js';
export type { Generator, GeneratorMeta, GeneratorConfig } from '../types/index.js';
