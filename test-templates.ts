#!/usr/bin/env npx tsx
/**
 * Template Testing Script
 * Generates test projects for all frameworks and validates they build correctly
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Import the generator and init
import { generatePackage } from './src/core/generator.js';
import { initializeGenerators } from './src/generators/index.js';
import type { GeneratorConfig, Framework } from './src/types/index.js';

// Initialize generators
initializeGenerators();

const TEST_OUTPUT_DIR = path.join(__dirname, 'test-output');

interface TestConfig {
    name: string;
    framework: Framework;
    config: Omit<GeneratorConfig, 'name' | 'outDir'>;
}

const testConfigs: TestConfig[] = [
    {
        name: 'test-react-lib',
        framework: 'react',
        config: {
            description: 'Test React component library',
            packageType: 'library',
            runtimeTarget: 'browser',
            moduleFormat: 'esm',
            buildSystem: 'tsup',
            packageManager: 'npm',
            license: 'MIT',
            author: 'Test Author',
            includeExample: true,
        },
    },
    {
        name: 'test-vue-lib',
        framework: 'vue',
        config: {
            description: 'Test Vue component library',
            packageType: 'library',
            runtimeTarget: 'browser',
            moduleFormat: 'esm',
            buildSystem: 'vite',
            packageManager: 'npm',
            license: 'MIT',
            author: 'Test Author',
            includeExample: true,
        },
    },
    {
        name: 'test-svelte-lib',
        framework: 'svelte',
        config: {
            description: 'Test Svelte component library',
            packageType: 'library',
            runtimeTarget: 'browser',
            moduleFormat: 'esm',
            buildSystem: 'vite',
            packageManager: 'npm',
            license: 'MIT',
            author: 'Test Author',
            includeExample: true,
        },
    },
    {
        name: 'test-vanilla-lib',
        framework: 'vanilla',
        config: {
            description: 'Test TypeScript utility library',
            packageType: 'utility',
            runtimeTarget: 'universal',
            moduleFormat: 'esm',
            buildSystem: 'tsup',
            packageManager: 'npm',
            license: 'MIT',
            author: 'Test Author',
            includeExample: true,
        },
    },
    {
        name: 'test-node-lib',
        framework: 'node',
        config: {
            description: 'Test Node.js library',
            packageType: 'library',
            runtimeTarget: 'node',
            moduleFormat: 'esm',
            buildSystem: 'tsup',
            packageManager: 'npm',
            license: 'MIT',
            author: 'Test Author',
            includeExample: true,
        },
    },
    {
        name: 'test-node-cli',
        framework: 'node',
        config: {
            description: 'Test Node.js CLI',
            packageType: 'cli',
            runtimeTarget: 'node',
            moduleFormat: 'esm',
            buildSystem: 'tsup',
            packageManager: 'npm',
            license: 'MIT',
            author: 'Test Author',
            includeExample: true,
        },
    },
];

async function main() {
    console.log('🚀 Starting template generation tests...\n');

    for (const test of testConfigs) {
        const outDir = path.join(TEST_OUTPUT_DIR, test.name);

        console.log(`📦 Generating ${test.name} (${test.framework})...`);

        const config: GeneratorConfig = {
            ...test.config,
            name: test.name,
            outDir,
        };

        try {
            const result = await generatePackage(test.framework, config);

            if (result.success) {
                console.log(`   ✅ Generated ${result.files.length} files`);
            } else {
                console.log(`   ❌ Failed: ${result.error}`);
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error}`);
        }
    }

    console.log('\n✨ All projects generated! Run the following to test each:');
    console.log('\n--- Test Commands ---');

    for (const test of testConfigs) {
        console.log(`\ncd test-output/${test.name} && npm install && npm run build && npm test`);
    }
}

main().catch(console.error);
