# 🚀 Scaffold-Kit v1.0.0-alpha.1

> Production-grade CLI for creating, validating, and publishing JavaScript/TypeScript libraries across all modern frameworks.

## ✨ Highlights

This is the first alpha release of Scaffold-Kit - a powerful CLI tool designed to streamline the creation and management of JavaScript/TypeScript libraries.

## 🎯 Features

### CLI Commands
- **`scaffold-kit create`** - Interactive wizard for creating new packages
- **`scaffold-kit check`** - Validate packages against npm best practices with quality scoring
- **`scaffold-kit publish`** - Safe publishing with 8 pre-flight checks
- **`scaffold-kit add`** - Add components, hooks, or utilities to existing projects
- **`scaffold-kit migrate`** - Migrate build systems (Rollup → tsup, CJS → ESM, Jest → Vitest)
- **`scaffold-kit docs`** - Auto-generate API documentation from TypeScript
- **`scaffold-kit release`** - Version bumping and changelog management
- **`scaffold-kit info`** - Display CLI and generator information

### Framework Generators
| Framework | Package Types |
|-----------|---------------|
| React | library, plugin, utility |
| Vue 3 | library, plugin, utility |
| Svelte | library, plugin, utility |
| TypeScript (Vanilla) | utility, library, SDK |
| Node.js | utility, library, CLI, SDK |

### Template Presets
- **Minimal** - TypeScript + tsup basics
- **Standard** - + Vitest, ESLint, GitHub Actions
- **Enterprise** - + Husky, Commitlint, Semantic Release, Changesets
- **Component Library** - + Storybook, Visual testing

## 📦 Installation

```bash
# Using npx (recommended)
npx @sitharaj08/scaffold-kit create my-lib

# Global installation
npm install -g @sitharaj08/scaffold-kit
```

## 📚 Documentation

Full documentation site included. Run locally:
```bash
cd docs-site && npm install && npm run dev
```

## 🔗 Links

- [GitHub Repository](https://github.com/sitharaj88/scaffoldkit)
- [npm Package](https://www.npmjs.com/package/@sitharaj08/scaffold-kit)
- [Documentation](https://sitharaj88.github.io/scaffoldkit/)
- [Buy Me a Coffee](https://buymeacoffee.com/sitharaj88)

## 📊 Package Stats

- **Package Size**: ~130 KB
- **Unpacked Size**: ~620 KB
- **Total Files**: 114 files
- **Node Version**: ≥18.0.0

---

Made with ❤️ by [Sitharaj Seenvivasan](https://github.com/sitharaj88)
