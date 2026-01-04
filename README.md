# Scaffold-Kit

<p align="center">
  <img src="https://img.shields.io/npm/v/@sitharaj08/scaffold-kit?color=blue&label=npm" alt="npm version" />
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen" alt="node version" />
  <img src="https://img.shields.io/npm/l/@sitharaj08/scaffold-kit" alt="license" />
  <img src="https://img.shields.io/github/stars/sitharaj88/scaffoldkit?style=social" alt="stars" />
</p>

<p align="center">
  <strong>Production-grade CLI for creating, validating, and publishing JavaScript/TypeScript packages across all modern frameworks.</strong>
</p>

```
   _____            __  __      _    _  ___ __ 
  / ____|          / _|/ _|    | |  | |/ (_)  |
 | (___   ___ __ _| |_| |_ ___ | | __| |/ /| |_ 
  \___ \ / __/ _` |  _|  _/ _ \| |/ _` |   < | __|
  ____) | (_| (_| | | | || (_) | | (_| | . \| |_ 
 |_____/ \___\\__,_|_| |_| \___/|_|\__,_|_|\_\\__|
```

---

## ✨ Features

- 🎯 **Framework-Agnostic** — Support for React, Vue, Svelte, Node.js, and vanilla TypeScript
- 🚀 **Production-Ready Templates** — Modern best practices out of the box
- ✅ **Package Validation** — Validate against npm standards with quality scoring
- 📦 **Safe Publishing** — 8 pre-flight checks before publishing
- 🔄 **Migration Assistant** — Modernize legacy projects automatically
- 📚 **Docs Generator** — Auto-generate API documentation from TypeScript

---

## 📦 Installation

```bash
# Using npx (recommended)
npx @sitharaj08/scaffold-kit create my-lib

# Global installation
npm install -g @sitharaj08/scaffold-kit

# Or with other package managers
pnpm add -g @sitharaj08/scaffold-kit
yarn global add @sitharaj08/scaffold-kit
```

---

## 🚀 Quick Start

```bash
# Create a new library
npx @sitharaj08/scaffold-kit create my-awesome-lib

# The interactive wizard guides you through:
# ✓ Framework selection (React, Vue, Svelte, TypeScript, Node.js)
# ✓ Package type (library, plugin, utility, CLI, SDK)
# ✓ Build system (tsup, Vite, Rollup, unbuild)
# ✓ Module format (ESM, CJS, dual)
# ✓ CI/CD setup (GitHub Actions, GitLab CI)
```

---

## 📖 Commands

| Command | Description |
|---------|-------------|
| `scaffold-kit create [name]` | Create a new package with interactive wizard |
| `scaffold-kit check [path]` | Validate package against npm best practices |
| `scaffold-kit publish` | Publish with pre-flight checks |
| `scaffold-kit add [type] [name]` | Add component, hook, or utility |
| `scaffold-kit migrate` | Migrate build system or module format |
| `scaffold-kit docs` | Generate API documentation |
| `scaffold-kit release` | Version bumping and changelog |
| `scaffold-kit info` | Display CLI information |

### `scaffold-kit create`

```bash
scaffold-kit create my-lib
```

Interactive wizard for:
- Framework selection (React, Vue, Svelte, TypeScript, Node.js)
- Package type (library, plugin, utility, CLI, SDK)
- Build system (tsup, Vite, Rollup, unbuild, esbuild)
- Module format (ESM, CJS, dual)

### `scaffold-kit check`

```bash
scaffold-kit check --score
scaffold-kit check --fix
scaffold-kit check --size-limit 50KB
```

Validates:
- ✔ `exports` field validity
- ✔ TypeScript types presence
- ✔ Tree-shaking compatibility
- ✔ Bundle size limits
- ✔ Peer dependency correctness

### `scaffold-kit publish`

```bash
scaffold-kit publish --dry-run
scaffold-kit publish --tag beta
```

8 Pre-flight checks:
1. Git status clean
2. On main/master branch
3. Tests pass
4. Build succeeds
5. Registry reachable
6. Version available
7. Changelog updated
8. No secrets exposed

### `scaffold-kit migrate`

```bash
scaffold-kit migrate --from rollup --to tsup
scaffold-kit migrate --from cjs --to esm
scaffold-kit migrate --from jest --to vitest
```

### `scaffold-kit docs`

```bash
scaffold-kit docs --format markdown
scaffold-kit docs serve --port 3000
```

---

## 🎨 Supported Frameworks

| Framework | Package Types | Build System |
|-----------|---------------|--------------|
| React | library, plugin, utility | tsup, Vite |
| Vue 3 | library, plugin, utility | tsup, Vite |
| Svelte | library, plugin, utility | Vite |
| TypeScript | utility, library, SDK | tsup |
| Node.js | utility, library, CLI, SDK | tsup |

---

## 🔧 Template Presets

| Preset | Features |
|--------|----------|
| **Minimal** | TypeScript, tsup, basic setup |
| **Standard** | + Vitest, ESLint, GitHub Actions |
| **Enterprise** | + Husky, Commitlint, Semantic Release, Changesets |
| **Component Library** | + Storybook, Visual testing |

---

## 📚 Documentation

**Live Documentation**: [https://sitharaj88.github.io/scaffoldkit/](https://sitharaj88.github.io/scaffoldkit/)

Or run locally:
```bash
cd docs-site
npm install
npm run dev
```

Documentation covers:
- **Getting Started** - Installation, Quick Start
- **Core Concepts** - Architecture, CLI Commands, Configuration
- **Features** - Presets, CI Templates, Quality Score, Migration, and more

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

```bash
# Clone the repository
git clone https://github.com/sitharaj88/scaffoldkit.git

# Install dependencies
cd scaffoldkit
npm install

# Build
npm run build

# Run locally
node dist/bin/scaffold.js --help
```

---

## ☕ Support

If you find Scaffold-Kit helpful, consider buying me a coffee!

<a href="https://buymeacoffee.com/sitharaj88" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" width="180">
</a>

---

## 📄 License

MIT © [Sitharaj Seenvivasan](https://github.com/sitharaj88)

---

## 🔗 Links

- [GitHub Repository](https://github.com/sitharaj88/scaffoldkit)
- [npm Package](https://www.npmjs.com/package/@sitharaj08/scaffold-kit)
- [Issue Tracker](https://github.com/sitharaj88/scaffoldkit/issues)
- [Changelog](CHANGELOG.md)
- [Buy Me a Coffee](https://buymeacoffee.com/sitharaj88)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/sitharaj88">Sitharaj Seenvivasan</a>
</p>
