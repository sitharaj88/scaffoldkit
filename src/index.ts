/**
 * Scaffold CLI - Main Entry Point
 * Re-exports all public APIs
 */

// Types
export * from './types/index.js';

// Core
export { logger } from './core/logger.js';
export { templateEngine, TemplateEngine } from './core/template-engine.js';
export { registry } from './core/registry.js';
export { BaseGenerator } from './core/base-generator.js';
export { generatePackage } from './core/generator.js';
export { validatePackage, PackageValidator } from './core/validator.js';

// Generators
export { initializeGenerators } from './generators/index.js';
export { reactGenerator } from './generators/react/index.js';
export { vueGenerator } from './generators/vue/index.js';
export { svelteGenerator } from './generators/svelte/index.js';
export { vanillaGenerator } from './generators/vanilla/index.js';
export { nodeGenerator } from './generators/node/index.js';

// Commands
export { createCommand } from './commands/create.js';
export { checkCommand } from './commands/check.js';
export { releaseCommand } from './commands/release.js';
