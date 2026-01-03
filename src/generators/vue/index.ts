/**
 * Vue 3 Library Generator
 * Generates Vue 3 component libraries with Composition API and TypeScript
 */
import type {
    GeneratorMeta,
    GeneratorConfig,
    DependencySpec,
    GeneratedFile,
    ValidationIssue,
} from '../../types/index.js';
import { BaseGenerator } from '../../core/base-generator.js';

export class VueGenerator extends BaseGenerator {
    readonly meta: GeneratorMeta = {
        id: 'vue-library',
        name: 'Vue 3 Library',
        framework: 'vue',
        description: 'Generate a Vue 3 component library with Composition API, TypeScript, and Vite',
        version: '1.0.0',
        supportedPackageTypes: ['library', 'plugin', 'utility'],
        supportedRuntimeTargets: ['browser', 'universal'],
        recommendedBuildSystem: 'vite',
    };

    protected getFrameworkDependencies(config: GeneratorConfig): DependencySpec[] {
        const deps: DependencySpec[] = [];

        // Vue as peer dependency
        deps.push(this.peerDep('vue', '^3.4.0'));

        // Vue devtools and build tools
        deps.push(this.devDep('@vitejs/plugin-vue', '^5.2.0'));
        deps.push(this.devDep('vue-tsc', '^2.2.0'));

        // Testing
        deps.push(this.devDep('@vue/test-utils', '^2.4.0'));
        deps.push(this.devDep('@testing-library/vue', '^8.1.0'));
        deps.push(this.devDep('jsdom', '^25.0.0'));
        deps.push(this.devDep('happy-dom', '^15.11.0'));

        // ESLint for Vue
        deps.push(this.devDep('eslint', '^9.17.0'));
        deps.push(this.devDep('@eslint/js', '^9.17.0'));
        deps.push(this.devDep('eslint-plugin-vue', '^9.32.0'));
        deps.push(this.devDep('typescript-eslint', '^8.18.0'));

        return deps;
    }

    protected getFrameworkFiles(config: GeneratorConfig): GeneratedFile[] {
        const files: GeneratedFile[] = [];

        // Source files
        files.push({
            path: 'src/index.ts',
            template: 'vue/src/index.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/components/Button/Button.vue',
            template: 'vue/src/components/Button/Button.vue.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/components/Button/Button.test.ts',
            template: 'vue/src/components/Button/Button.test.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/components/Button/index.ts',
            template: 'vue/src/components/Button/index.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/composables/useToggle.ts',
            template: 'vue/src/composables/useToggle.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/composables/useToggle.test.ts',
            template: 'vue/src/composables/useToggle.test.ts.hbs',
            isTemplate: true,
        });

        files.push({
            path: 'src/composables/index.ts',
            template: 'vue/src/composables/index.ts.hbs',
            isTemplate: true,
        });

        // Vue plugin for global registration
        files.push({
            path: 'src/plugin.ts',
            template: 'vue/src/plugin.ts.hbs',
            isTemplate: true,
        });

        // Config files
        files.push({
            path: 'eslint.config.js',
            template: 'vue/eslint.config.js.hbs',
            isTemplate: true,
        });

        // Vue type shim
        files.push({
            path: 'src/shims-vue.d.ts',
            template: 'vue/src/shims-vue.d.ts.hbs',
            isTemplate: true,
        });

        // Example app files (conditionally included)
        if (config.includeExample) {
            files.push({
                path: 'example/index.html',
                template: 'vue/example/index.html.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/main.ts',
                template: 'vue/example/main.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/App.vue',
                template: 'vue/example/App.vue.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/vite.config.ts',
                template: 'vue/example/vite.config.ts.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/package.json',
                template: 'vue/example/package.json.hbs',
                isTemplate: true,
            });

            files.push({
                path: 'example/tsconfig.json',
                template: 'vue/example/tsconfig.json.hbs',
                isTemplate: true,
            });
        }

        return files;
    }

    protected getFrameworkPackageJsonExtras(config: GeneratorConfig): Record<string, unknown> {
        const scripts: Record<string, string> = {
            lint: 'eslint src',
            'lint:fix': 'eslint src --fix',
            typecheck: 'vue-tsc --noEmit',
        };

        if (config.includeExample) {
            scripts['example:install'] = 'cd example && npm install';
            scripts['example:dev'] = 'cd example && npm run dev';
        }

        return {
            scripts,
        };
    }

    protected validateFrameworkConfig(config: GeneratorConfig): ValidationIssue[] {
        const issues: ValidationIssue[] = [];

        // Vue libraries should use Vite
        if (config.buildSystem !== 'vite') {
            issues.push({
                severity: 'info',
                category: 'config',
                message: 'Vite is the recommended build system for Vue libraries',
                suggestion: 'Consider using Vite for optimal Vue support',
            });
        }

        return issues;
    }
}

export const vueGenerator = new VueGenerator();
export default vueGenerator;
