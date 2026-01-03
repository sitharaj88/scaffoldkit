/**
 * Generator Registry
 * Central registry for all framework generators
 * Enables pluggable architecture without modifying core logic
 */
import type { Generator, Framework, GeneratorMeta } from '../types/index.js';
import { logger } from './logger.js';

/**
 * Registry for managing generator plugins
 */
class GeneratorRegistry {
    private generators: Map<string, Generator> = new Map();
    private frameworkMap: Map<Framework, Generator[]> = new Map();

    /**
     * Register a generator plugin
     */
    register(generator: Generator): void {
        const { id, framework } = generator.meta;

        if (this.generators.has(id)) {
            logger.warn(`Generator "${id}" is already registered. Overwriting.`);
        }

        this.generators.set(id, generator);

        // Update framework map
        const existing = this.frameworkMap.get(framework) || [];
        this.frameworkMap.set(framework, [...existing, generator]);

        logger.debug(`Registered generator: ${id} (${framework})`);
    }

    /**
     * Unregister a generator
     */
    unregister(id: string): boolean {
        const generator = this.generators.get(id);
        if (!generator) {
            return false;
        }

        this.generators.delete(id);

        // Update framework map
        const framework = generator.meta.framework;
        const existing = this.frameworkMap.get(framework) || [];
        this.frameworkMap.set(
            framework,
            existing.filter((g) => g.meta.id !== id)
        );

        return true;
    }

    /**
     * Get a generator by ID
     */
    get(id: string): Generator | undefined {
        return this.generators.get(id);
    }

    /**
     * Get all generators for a framework
     */
    getByFramework(framework: Framework): Generator[] {
        return this.frameworkMap.get(framework) || [];
    }

    /**
     * Get the primary generator for a framework
     */
    getPrimary(framework: Framework): Generator | undefined {
        const generators = this.getByFramework(framework);
        return generators[0]; // First registered is primary
    }

    /**
     * Get all registered generators
     */
    getAll(): Generator[] {
        return Array.from(this.generators.values());
    }

    /**
     * Get metadata for all registered generators
     */
    getAllMeta(): GeneratorMeta[] {
        return this.getAll().map((g) => g.meta);
    }

    /**
     * Get list of all supported frameworks
     */
    getSupportedFrameworks(): Framework[] {
        return Array.from(this.frameworkMap.keys());
    }

    /**
     * Check if a generator exists
     */
    has(id: string): boolean {
        return this.generators.has(id);
    }

    /**
     * Check if a framework is supported
     */
    hasFramework(framework: Framework): boolean {
        return this.frameworkMap.has(framework) && this.frameworkMap.get(framework)!.length > 0;
    }

    /**
     * Clear all generators
     */
    clear(): void {
        this.generators.clear();
        this.frameworkMap.clear();
    }
}

// Export singleton instance
export const registry = new GeneratorRegistry();
export default registry;
