/**
 * Template engine for processing Handlebars templates
 * Handles loading and rendering of generator templates
 */
import Handlebars from 'handlebars';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import type { TemplateContext } from '../types/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Find templates directory - works from both src and dist
function findTemplatesRoot(): string {
    // When running from dist, we need to go up to the package root
    // Try multiple possible locations
    const possiblePaths = [
        path.resolve(__dirname, '../../templates'),      // from dist/core or dist/
        path.resolve(__dirname, '../templates'),         // from dist/
        path.resolve(__dirname, '../../../templates'),   // from dist/chunk files
        path.resolve(process.cwd(), 'templates'),        // CWD based (when running as installed package)
    ];

    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            return p;
        }
    }

    // If running as an npm package, find templates in node_modules
    const packageRoot = findPackageRoot(__dirname);
    if (packageRoot) {
        const pkgTemplates = path.join(packageRoot, 'templates');
        if (fs.existsSync(pkgTemplates)) {
            return pkgTemplates;
        }
    }

    // Default fallback
    return path.resolve(__dirname, '../../templates');
}

function findPackageRoot(startDir: string): string | null {
    let dir = startDir;
    while (dir !== path.dirname(dir)) {
        if (fs.existsSync(path.join(dir, 'package.json'))) {
            return dir;
        }
        dir = path.dirname(dir);
    }
    return null;
}

const TEMPLATES_ROOT = findTemplatesRoot();

/**
 * Template engine class for processing templates
 */
export class TemplateEngine {
    private handlebars: typeof Handlebars;
    private cache: Map<string, Handlebars.TemplateDelegate> = new Map();

    constructor() {
        this.handlebars = Handlebars.create();
        this.registerHelpers();
    }

    /**
     * Register custom Handlebars helpers
     */
    private registerHelpers() {
        // Equality helper - works both as block helper and subexpression
        this.handlebars.registerHelper('eq', function (this: unknown, a: unknown, b: unknown, options?: Handlebars.HelperOptions) {
            const result = a === b;
            // If used as block helper (has fn function)
            if (options && typeof options.fn === 'function') {
                return result ? options.fn(this) : (options.inverse ? options.inverse(this) : '');
            }
            // If used as subexpression, return boolean
            return result;
        });

        // Not equal helper - works both as block helper and subexpression
        this.handlebars.registerHelper('neq', function (this: unknown, a: unknown, b: unknown, options?: Handlebars.HelperOptions) {
            const result = a !== b;
            if (options && typeof options.fn === 'function') {
                return result ? options.fn(this) : (options.inverse ? options.inverse(this) : '');
            }
            return result;
        });

        // Or helper - works both as block helper and subexpression
        this.handlebars.registerHelper('or', function (this: unknown, ...args: unknown[]) {
            const lastArg = args[args.length - 1] as Handlebars.HelperOptions | unknown;
            const isBlockHelper = lastArg && typeof (lastArg as Handlebars.HelperOptions).fn === 'function';

            const values = isBlockHelper ? args.slice(0, -1) : args;
            const result = values.some(Boolean);

            if (isBlockHelper) {
                const options = lastArg as Handlebars.HelperOptions;
                return result ? options.fn(this) : (options.inverse ? options.inverse(this) : '');
            }
            return result;
        });

        // And helper - works both as block helper and subexpression
        this.handlebars.registerHelper('and', function (this: unknown, ...args: unknown[]) {
            const lastArg = args[args.length - 1] as Handlebars.HelperOptions | unknown;
            const isBlockHelper = lastArg && typeof (lastArg as Handlebars.HelperOptions).fn === 'function';

            const values = isBlockHelper ? args.slice(0, -1) : args;
            const result = values.every(Boolean);

            if (isBlockHelper) {
                const options = lastArg as Handlebars.HelperOptions;
                return result ? options.fn(this) : (options.inverse ? options.inverse(this) : '');
            }
            return result;
        });

        // Include helper - works both as block helper and subexpression
        this.handlebars.registerHelper('includes', function (this: unknown, arr: unknown[], value: unknown, options?: Handlebars.HelperOptions) {
            const result = Array.isArray(arr) && arr.includes(value);
            if (options && typeof options.fn === 'function') {
                return result ? options.fn(this) : (options.inverse ? options.inverse(this) : '');
            }
            return result;
        });

        // JSON stringify helper
        this.handlebars.registerHelper('json', (obj: unknown, indent = 2) => {
            return JSON.stringify(obj, null, typeof indent === 'number' ? indent : 2);
        });

        // Lowercase helper
        this.handlebars.registerHelper('lower', (str: string) => {
            return str?.toLowerCase();
        });

        // Uppercase helper
        this.handlebars.registerHelper('upper', (str: string) => {
            return str?.toUpperCase();
        });

        // Capitalize helper
        this.handlebars.registerHelper('capitalize', (str: string) => {
            return str?.charAt(0).toUpperCase() + str?.slice(1);
        });

        // Kebab to camel case
        this.handlebars.registerHelper('camelCase', (str: string) => {
            return str?.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        });

        // Kebab to Pascal case
        this.handlebars.registerHelper('pascalCase', (str: string) => {
            const camel = str?.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            return camel?.charAt(0).toUpperCase() + camel?.slice(1);
        });

        // Extract package name from scoped name
        this.handlebars.registerHelper('packageShortName', (name: string) => {
            const match = name?.match(/^(?:@[^/]+\/)?(.+)$/);
            return match ? match[1] : name;
        });

        // Check if package is scoped
        this.handlebars.registerHelper('isScoped', (name: string) => {
            return name?.startsWith('@');
        });

        // Get current year
        this.handlebars.registerHelper('year', () => {
            return new Date().getFullYear();
        });

        // Conditional block based on module format
        this.handlebars.registerHelper('ifDual', function (this: unknown, moduleFormat: string, options: Handlebars.HelperOptions) {
            if (moduleFormat === 'dual') {
                return options.fn(this);
            }
            return options.inverse(this);
        });

        // Array join helper
        this.handlebars.registerHelper('join', (arr: unknown[], separator = ', ') => {
            return Array.isArray(arr) ? arr.join(separator) : '';
        });
    }

    /**
     * Load and compile a template from the templates directory
     */
    async loadTemplate(templatePath: string): Promise<Handlebars.TemplateDelegate> {
        // Check cache first
        if (this.cache.has(templatePath)) {
            return this.cache.get(templatePath)!;
        }

        const fullPath = path.join(TEMPLATES_ROOT, templatePath);

        if (!await fs.pathExists(fullPath)) {
            throw new Error(`Template not found: ${templatePath}`);
        }

        const content = await fs.readFile(fullPath, 'utf-8');
        const compiled = this.handlebars.compile(content, { noEscape: true });

        this.cache.set(templatePath, compiled);
        return compiled;
    }

    /**
     * Render a template with the given context
     */
    async render(templatePath: string, context: TemplateContext): Promise<string> {
        const template = await this.loadTemplate(templatePath);
        return template(context);
    }

    /**
     * Render a string template directly
     */
    renderString(templateString: string, context: TemplateContext): string {
        const compiled = this.handlebars.compile(templateString, { noEscape: true });
        return compiled(context);
    }

    /**
     * Register a partial template
     */
    registerPartial(name: string, content: string) {
        this.handlebars.registerPartial(name, content);
    }

    /**
     * Load and register a partial from file
     */
    async loadPartial(name: string, templatePath: string) {
        const fullPath = path.join(TEMPLATES_ROOT, templatePath);
        const content = await fs.readFile(fullPath, 'utf-8');
        this.registerPartial(name, content);
    }

    /**
     * Clear the template cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get the templates root directory
     */
    getTemplatesRoot(): string {
        return TEMPLATES_ROOT;
    }
}

// Export singleton instance
export const templateEngine = new TemplateEngine();
export default templateEngine;
