# Scaffold CLI

**Production-grade CLI for creating, validating, and publishing JavaScript/TypeScript packages across all modern frameworks.**

```
   ___           __  __      _    _ 
  / __| __ __ _ / _|/ _|___ | |__| |
  \__ \/ _/ _` |  _|  _/ _ \| / _` |
  |___/\__\__,_|_| |_| \___/|_\__,_|
```

## Overview

Scaffold is a universal CLI designed to help developers create production-ready JavaScript and TypeScript libraries for any modern framework. It features:

- 🎯 **Framework-agnostic core** with pluggable generators
- 🚀 **Production-ready templates** with modern best practices
- ✅ **Package validation** against npm standards
- 📦 **Safe publishing workflow** with semantic versioning

## Installation

```bash
npm install -g @aspect/scaffold
# or
npx @aspect/scaffold create my-lib
```

## Commands

### `scaffold create [name]`

Interactive wizard for creating new packages:

```bash
scaffold create my-awesome-lib
```

The wizard guides you through:
- Framework selection (React, Vue, Svelte, TypeScript, Node.js)
- Package type (library, plugin, utility, CLI, SDK)
- Package manager (npm, pnpm, yarn, bun)
- Build system (tsup, Vite, Rollup, unbuild, esbuild)
- Runtime target (browser, Node.js, universal, edge)
- Module format (ESM, CJS, dual)
- License and metadata

### `scaffold check [path]`

Validate a package against modern npm best practices:

```bash
scaffold check
# or
scaffold check ./my-package
```

Checks include:
- ✔ `exports` field validity
- ✔ TypeScript types presence
- ✔ Side effects configuration
- ✔ Tree-shaking compatibility
- ✔ Peer dependency correctness
- ✔ Deprecated patterns detection
- ✔ Build output verification

### `scaffold release`

Safe versioning and publishing to npm:

```bash
scaffold release
# or
scaffold release --dry-run
```

Features:
- Semantic versioning (patch/minor/major)
- Automatic changelog updates
- Dry-run mode
- Pre-release support

### `scaffold info`

Display CLI information and available generators:

```bash
scaffold info
```

## Supported Frameworks

| Framework | Package Types | Status |
|-----------|---------------|--------|
| React | library, plugin, utility | ✅ v1 |
| Vue 3 | library, plugin, utility | ✅ v1 |
| Svelte | library, plugin, utility | ✅ v1 |
| TypeScript | utility, library, SDK | ✅ v1 |
| Node.js | utility, library, CLI, SDK | ✅ v1 |
| Angular | library, plugin | 🔜 Planned |
| SolidJS | library, plugin | 🔜 Planned |
| Qwik | library, integration | 🔜 Planned |
| Astro | integration | 🔜 Planned |

## Architecture

Scaffold uses a **pluggable generator architecture** that allows adding new frameworks without modifying core logic:

```
scaffold-cli/
├── src/
│   ├── bin/           # CLI entry point
│   ├── commands/      # CLI commands (create, check, release)
│   ├── core/          # Framework-agnostic core
│   │   ├── registry.ts        # Generator registry
│   │   ├── base-generator.ts  # Base generator class
│   │   ├── generator.ts       # Package generation logic
│   │   ├── validator.ts       # Package validation
│   │   ├── template-engine.ts # Handlebars templates
│   │   └── logger.ts          # Structured logging
│   ├── generators/    # Framework-specific generators
│   │   ├── react/
│   │   ├── vue/
│   │   ├── svelte/
│   │   ├── vanilla/
│   │   └── node/
│   └── types/         # TypeScript type definitions
├── templates/         # Handlebars templates
│   ├── common/        # Shared templates
│   ├── react/
│   ├── vue/
│   ├── svelte/
│   ├── vanilla/
│   └── node/
```

## Creating a Custom Generator

Extend the `BaseGenerator` class to create custom generators:

```typescript
import { BaseGenerator, GeneratorMeta, GeneratorConfig } from '@aspect/scaffold';

export class MyGenerator extends BaseGenerator {
  readonly meta: GeneratorMeta = {
    id: 'my-framework',
    name: 'My Framework',
    framework: 'my-framework',
    description: 'Generate packages for my framework',
    version: '1.0.0',
    supportedPackageTypes: ['library', 'plugin'],
    supportedRuntimeTargets: ['browser'],
    recommendedBuildSystem: 'vite',
  };

  protected getFrameworkDependencies(config: GeneratorConfig) {
    return [
      this.peerDep('my-framework', '^1.0.0'),
      this.devDep('@types/my-framework', '^1.0.0'),
    ];
  }

  protected getFrameworkFiles(config: GeneratorConfig) {
    return [
      { path: 'src/index.ts', template: 'my-framework/index.ts.hbs', isTemplate: true },
    ];
  }

  protected getFrameworkPackageJsonExtras(config: GeneratorConfig) {
    return {};
  }
}
```

## Modern JavaScript Standards

Generated packages follow modern best practices:

- ✅ ESM-first strategy with proper `exports` field
- ✅ Conditional exports for different environments
- ✅ Correct TypeScript types resolution
- ✅ Peer dependency discipline
- ✅ Tree-shaking optimizations
- ✅ Zero deprecated npm patterns

## Development

```bash
# Install dependencies
npm install

# Build the CLI
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Type check
npm run typecheck
```

## License

MIT

## Author

Sitharaj
