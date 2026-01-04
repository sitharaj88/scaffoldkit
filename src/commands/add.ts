/**
 * Add Command
 * Interactive generator for adding components, hooks, and utilities to existing projects
 */
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { input, select, confirm } from '@inquirer/prompts';
import { logger } from '../core/logger.js';
import type { Framework } from '../types/index.js';

/**
 * Add command options
 */
export interface AddOptions {
    type?: 'component' | 'hook' | 'util' | 'store';
    name?: string;
    props?: string;
    withTest?: boolean;
}

/**
 * Detected project info
 */
interface ProjectInfo {
    framework: Framework;
    srcPath: string;
    hasTests: boolean;
    usesTypescript: boolean;
}

/**
 * Run the add command
 */
export async function addCommand(itemType?: string, itemName?: string, options: AddOptions = {}): Promise<void> {
    logger.header('Add to Project');
    logger.blank();

    // Detect project
    const projectPath = process.cwd();
    const projectInfo = await detectProject(projectPath);

    if (!projectInfo) {
        logger.error('Could not detect project type. Make sure you are in a scaffold-generated project.');
        process.exit(1);
    }

    logger.keyValue('Framework', projectInfo.framework);
    logger.keyValue('Source', projectInfo.srcPath);
    logger.blank();

    // Determine what to add
    const type = itemType as AddOptions['type'] || await select({
        message: 'What would you like to add?',
        choices: getTypeChoices(projectInfo.framework),
    });

    // Get name
    const name = itemName || options.name || await input({
        message: `${capitalize(type)} name:`,
        validate: (value) => {
            if (!value.trim()) return 'Name is required';
            if (!/^[A-Z][a-zA-Z0-9]*$/.test(value) && type === 'component') {
                return 'Component name should be PascalCase (e.g., Button)';
            }
            if (!/^use[A-Z][a-zA-Z0-9]*$/.test(value) && type === 'hook') {
                return 'Hook name should start with "use" (e.g., useToggle)';
            }
            return true;
        },
    });

    // Get props/params for components/hooks
    let props: string[] = [];
    if (type === 'component' || type === 'hook') {
        const propsInput = options.props || await input({
            message: `${type === 'component' ? 'Props' : 'Parameters'} (comma-separated, optional):`,
            default: '',
        });
        props = propsInput ? propsInput.split(',').map(p => p.trim()).filter(Boolean) : [];
    }

    // Include test?
    const withTest = options.withTest ?? await confirm({
        message: 'Include test file?',
        default: true,
    });

    // Generate files
    console.log();
    console.log(chalk.bold('📝 Generating files...'));
    console.log();

    const files = await generateFiles(projectInfo, type, name, props, withTest);

    for (const file of files) {
        await fs.ensureDir(path.dirname(file.path));
        await fs.writeFile(file.path, file.content);
        console.log(`  ${chalk.green('✔')} ${path.relative(projectPath, file.path)}`);
    }

    console.log();
    logger.success(`${capitalize(type)} "${name}" created successfully!`);

    // Show next steps
    console.log();
    console.log(chalk.bold('Next steps:'));
    console.log(`  • Import from "${getImportPath(projectInfo, type, name)}"`);
    if (withTest) {
        console.log(`  • Run tests: ${chalk.cyan('npm test')}`);
    }
}

/**
 * Detect project framework and configuration
 */
async function detectProject(projectPath: string): Promise<ProjectInfo | null> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
        return null;
    }

    const packageJson = await fs.readJson(packageJsonPath);
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies, ...packageJson.peerDependencies };

    let framework: Framework = 'vanilla';

    if (deps.react) {
        framework = 'react';
    } else if (deps.vue) {
        framework = 'vue';
    } else if (deps.svelte) {
        framework = 'svelte';
    } else if (packageJson.name?.includes('cli') || deps.commander) {
        framework = 'node';
    }

    // Check for src directory
    let srcPath = 'src';
    if (framework === 'svelte' && await fs.pathExists(path.join(projectPath, 'src/lib'))) {
        srcPath = 'src/lib';
    }

    // Check for tests
    const hasTests = await fs.pathExists(path.join(projectPath, srcPath)) &&
        (await fs.readdir(path.join(projectPath, srcPath))).some((f: string) => f.includes('.test.') || f.includes('.spec.'));

    // Check for TypeScript
    const usesTypescript = await fs.pathExists(path.join(projectPath, 'tsconfig.json'));

    return {
        framework,
        srcPath,
        hasTests,
        usesTypescript,
    };
}

/**
 * Get type choices based on framework
 */
function getTypeChoices(framework: Framework): Array<{ value: string; name: string }> {
    const choices = [
        { value: 'component', name: 'Component' },
        { value: 'util', name: 'Utility Function' },
    ];

    if (framework === 'react') {
        choices.splice(1, 0, { value: 'hook', name: 'Hook' });
    } else if (framework === 'vue') {
        choices.splice(1, 0, { value: 'hook', name: 'Composable' });
    } else if (framework === 'svelte') {
        choices.splice(1, 0, { value: 'store', name: 'Store' });
    }

    return choices;
}

/**
 * Generate files based on type and framework
 */
async function generateFiles(
    project: ProjectInfo,
    type: string,
    name: string,
    props: string[],
    withTest: boolean
): Promise<Array<{ path: string; content: string }>> {
    const files: Array<{ path: string; content: string }> = [];
    const projectPath = process.cwd();

    switch (project.framework) {
        case 'react':
            files.push(...generateReactFiles(projectPath, project.srcPath, type, name, props, withTest));
            break;
        case 'vue':
            files.push(...generateVueFiles(projectPath, project.srcPath, type, name, props, withTest));
            break;
        case 'svelte':
            files.push(...generateSvelteFiles(projectPath, project.srcPath, type, name, props, withTest));
            break;
        default:
            files.push(...generateVanillaFiles(projectPath, project.srcPath, type, name, props, withTest));
    }

    return files;
}

/**
 * Generate React component/hook files
 */
function generateReactFiles(
    projectPath: string,
    srcPath: string,
    type: string,
    name: string,
    props: string[],
    withTest: boolean
): Array<{ path: string; content: string }> {
    const files: Array<{ path: string; content: string }> = [];

    if (type === 'component') {
        const componentDir = path.join(projectPath, srcPath, 'components', name);

        // Props interface
        const propsInterface = props.length > 0
            ? `export interface ${name}Props {\n${props.map(p => `  ${p}?: string;`).join('\n')}\n  children?: React.ReactNode;\n}`
            : `export interface ${name}Props {\n  children?: React.ReactNode;\n}`;

        // Component file
        files.push({
            path: path.join(componentDir, `${name}.tsx`),
            content: `import React from 'react';

${propsInterface}

/**
 * ${name} component
 */
export function ${name}({ ${props.join(', ')}${props.length ? ', ' : ''}children }: ${name}Props) {
  return (
    <div className="${name.toLowerCase()}">
      {children}
    </div>
  );
}

export default ${name};
`,
        });

        // Index file
        files.push({
            path: path.join(componentDir, 'index.ts'),
            content: `export { ${name}, type ${name}Props } from './${name}.js';\nexport { default } from './${name}.js';\n`,
        });

        // Test file
        if (withTest) {
            files.push({
                path: path.join(componentDir, `${name}.test.tsx`),
                content: `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders children', () => {
    render(<${name}>Hello</${name}>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
`,
            });
        }
    } else if (type === 'hook') {
        const hooksDir = path.join(projectPath, srcPath, 'hooks');

        // Hook file
        files.push({
            path: path.join(hooksDir, `${name}.ts`),
            content: `import { useState, useCallback } from 'react';

/**
 * ${name} hook
 */
export function ${name}(${props.map(p => `${p}: unknown`).join(', ')}) {
  const [state, setState] = useState<unknown>(null);

  const update = useCallback((value: unknown) => {
    setState(value);
  }, []);

  return { state, update };
}

export default ${name};
`,
        });

        // Test file
        if (withTest) {
            files.push({
                path: path.join(hooksDir, `${name}.test.ts`),
                content: `import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('initializes with null state', () => {
    const { result } = renderHook(() => ${name}());
    expect(result.current.state).toBe(null);
  });

  it('updates state', () => {
    const { result } = renderHook(() => ${name}());
    act(() => {
      result.current.update('test');
    });
    expect(result.current.state).toBe('test');
  });
});
`,
            });
        }
    } else if (type === 'util') {
        files.push(...generateUtilFiles(projectPath, srcPath, name, withTest));
    }

    return files;
}

/**
 * Generate Vue component/composable files
 */
function generateVueFiles(
    projectPath: string,
    srcPath: string,
    type: string,
    name: string,
    props: string[],
    withTest: boolean
): Array<{ path: string; content: string }> {
    const files: Array<{ path: string; content: string }> = [];

    if (type === 'component') {
        const componentDir = path.join(projectPath, srcPath, 'components', name);

        // Vue component
        files.push({
            path: path.join(componentDir, `${name}.vue`),
            content: `<script setup lang="ts">
${props.length > 0 ? `defineProps<{
${props.map(p => `  ${p}?: string;`).join('\n')}
}>();` : '// Props can be defined here'}

const slots = defineSlots<{
  default(): unknown;
}>();
</script>

<template>
  <div class="${name.toLowerCase()}">
    <slot />
  </div>
</template>

<style scoped>
.${name.toLowerCase()} {
  /* Component styles */
}
</style>
`,
        });

        // Index file
        files.push({
            path: path.join(componentDir, 'index.ts'),
            content: `export { default as ${name} } from './${name}.vue';\n`,
        });

        // Test file
        if (withTest) {
            files.push({
                path: path.join(componentDir, `${name}.test.ts`),
                content: `import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ${name} from './${name}.vue';

describe('${name}', () => {
  it('renders slot content', () => {
    const wrapper = mount(${name}, {
      slots: {
        default: 'Hello',
      },
    });
    expect(wrapper.text()).toContain('Hello');
  });
});
`,
            });
        }
    } else if (type === 'hook') {
        const composablesDir = path.join(projectPath, srcPath, 'composables');

        // Composable file
        files.push({
            path: path.join(composablesDir, `${name}.ts`),
            content: `import { ref, computed } from 'vue';

/**
 * ${name} composable
 */
export function ${name}(${props.map(p => `${p}: unknown`).join(', ')}) {
  const state = ref<unknown>(null);

  const update = (value: unknown) => {
    state.value = value;
  };

  return {
    state: computed(() => state.value),
    update,
  };
}

export default ${name};
`,
        });

        // Test file
        if (withTest) {
            files.push({
                path: path.join(composablesDir, `${name}.test.ts`),
                content: `import { describe, it, expect } from 'vitest';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('initializes with null state', () => {
    const { state } = ${name}();
    expect(state.value).toBe(null);
  });

  it('updates state', () => {
    const { state, update } = ${name}();
    update('test');
    expect(state.value).toBe('test');
  });
});
`,
            });
        }
    } else if (type === 'util') {
        files.push(...generateUtilFiles(projectPath, srcPath, name, withTest));
    }

    return files;
}

/**
 * Generate Svelte component/store files
 */
function generateSvelteFiles(
    projectPath: string,
    srcPath: string,
    type: string,
    name: string,
    props: string[],
    withTest: boolean
): Array<{ path: string; content: string }> {
    const files: Array<{ path: string; content: string }> = [];

    if (type === 'component') {
        const componentDir = path.join(projectPath, srcPath, 'components', name);

        // Svelte component
        files.push({
            path: path.join(componentDir, `${name}.svelte`),
            content: `<script lang="ts">
${props.length > 0 ? `interface Props {\n${props.map(p => `  ${p}?: string;`).join('\n')}\n}\n\nlet { ${props.join(', ')} }: Props = $props();` : '// Props can be defined here'}
</script>

<div class="${name.toLowerCase()}">
  <slot />
</div>

<style>
  .${name.toLowerCase()} {
    /* Component styles */
  }
</style>
`,
        });

        // Index file
        files.push({
            path: path.join(componentDir, 'index.ts'),
            content: `export { default as ${name} } from './${name}.svelte';\n`,
        });

        // Test file
        if (withTest) {
            files.push({
                path: path.join(componentDir, `${name}.test.ts`),
                content: `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ${name} from './${name}.svelte';

describe('${name}', () => {
  it('renders without errors', () => {
    const { container } = render(${name});
    expect(container.querySelector('.${name.toLowerCase()}')).toBeTruthy();
  });
});
`,
            });
        }
    } else if (type === 'store') {
        const storesDir = path.join(projectPath, srcPath, 'stores');

        // Store file
        files.push({
            path: path.join(storesDir, `${name}.ts`),
            content: `import { writable, derived } from 'svelte/store';

/**
 * ${name} store
 */
function create${name}() {
  const { subscribe, set, update } = writable<unknown>(null);

  return {
    subscribe,
    set,
    update,
    reset: () => set(null),
  };
}

export const ${name.charAt(0).toLowerCase() + name.slice(1)} = create${name}();

export default ${name.charAt(0).toLowerCase() + name.slice(1)};
`,
        });

        // Test file
        if (withTest) {
            files.push({
                path: path.join(storesDir, `${name}.test.ts`),
                content: `import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { ${name.charAt(0).toLowerCase() + name.slice(1)} } from './${name}';

describe('${name}', () => {
  it('initializes with null', () => {
    expect(get(${name.charAt(0).toLowerCase() + name.slice(1)})).toBe(null);
  });

  it('updates value', () => {
    ${name.charAt(0).toLowerCase() + name.slice(1)}.set('test');
    expect(get(${name.charAt(0).toLowerCase() + name.slice(1)})).toBe('test');
  });

  it('resets to null', () => {
    ${name.charAt(0).toLowerCase() + name.slice(1)}.set('test');
    ${name.charAt(0).toLowerCase() + name.slice(1)}.reset();
    expect(get(${name.charAt(0).toLowerCase() + name.slice(1)})).toBe(null);
  });
});
`,
            });
        }
    } else if (type === 'util') {
        files.push(...generateUtilFiles(projectPath, srcPath, name, withTest));
    }

    return files;
}

/**
 * Generate vanilla TypeScript utility files
 */
function generateVanillaFiles(
    projectPath: string,
    srcPath: string,
    type: string,
    name: string,
    props: string[],
    withTest: boolean
): Array<{ path: string; content: string }> {
    return generateUtilFiles(projectPath, srcPath, name, withTest);
}

/**
 * Generate utility function files (shared across frameworks)
 */
function generateUtilFiles(
    projectPath: string,
    srcPath: string,
    name: string,
    withTest: boolean
): Array<{ path: string; content: string }> {
    const files: Array<{ path: string; content: string }> = [];
    const utilsDir = path.join(projectPath, srcPath, 'utils');
    const functionName = name.charAt(0).toLowerCase() + name.slice(1);

    // Utility file
    files.push({
        path: path.join(utilsDir, `${functionName}.ts`),
        content: `/**
 * ${name} utility function
 */
export function ${functionName}(input: unknown): unknown {
  // Implement your utility logic here
  return input;
}

export default ${functionName};
`,
    });

    // Test file
    if (withTest) {
        files.push({
            path: path.join(utilsDir, `${functionName}.test.ts`),
            content: `import { describe, it, expect } from 'vitest';
import { ${functionName} } from './${functionName}';

describe('${functionName}', () => {
  it('returns input unchanged', () => {
    const input = 'test';
    expect(${functionName}(input)).toBe(input);
  });
});
`,
        });
    }

    return files;
}

/**
 * Get import path for the generated item
 */
function getImportPath(project: ProjectInfo, type: string, name: string): string {
    if (type === 'component') {
        return `./components/${name}`;
    } else if (type === 'hook') {
        return project.framework === 'vue' ? `./composables/${name}` : `./hooks/${name}`;
    } else if (type === 'store') {
        return `./stores/${name}`;
    } else {
        return `./utils/${name.charAt(0).toLowerCase() + name.slice(1)}`;
    }
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default addCommand;
