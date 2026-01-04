/**
 * Docs Command
 * Auto-generate API documentation from TSDoc comments
 */
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { select } from '@inquirer/prompts';
import { logger } from '../core/logger.js';
import { execSync } from 'child_process';

/**
 * Docs command options
 */
export interface DocsOptions {
    output?: string;
    format?: 'markdown' | 'html' | 'json';
}

/**
 * Parsed documentation entry
 */
interface DocEntry {
    name: string;
    type: 'function' | 'class' | 'interface' | 'type' | 'const' | 'variable';
    description: string;
    params: ParamDoc[];
    returns?: ReturnDoc;
    examples: string[];
    deprecated?: string;
    since?: string;
    file: string;
    line: number;
    exported: boolean;
}

interface ParamDoc {
    name: string;
    type: string;
    description: string;
    optional: boolean;
    defaultValue?: string;
}

interface ReturnDoc {
    type: string;
    description: string;
}

/**
 * Run the docs command
 */
export async function docsCommand(subcommand?: string, options: DocsOptions = {}): Promise<void> {
    const projectPath = process.cwd();

    logger.header('Documentation Generator');
    logger.blank();

    // Check if in a valid project
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
        logger.error('No package.json found. Run this command in your project root.');
        process.exit(1);
    }

    const command = subcommand || await select({
        message: 'What would you like to do?',
        choices: [
            { value: 'generate', name: 'Generate docs', description: 'Generate API documentation from source' },
            { value: 'serve', name: 'Serve docs', description: 'Start local documentation server' },
        ],
    });

    switch (command) {
        case 'generate':
            await generateDocs(projectPath, options);
            break;
        case 'serve':
            await serveDocs(projectPath, options);
            break;
        default:
            logger.error(`Unknown subcommand: ${command}`);
            process.exit(1);
    }
}

/**
 * Generate documentation
 */
async function generateDocs(projectPath: string, options: DocsOptions): Promise<void> {
    const srcPath = path.join(projectPath, 'src');
    const outputDir = options.output || path.join(projectPath, 'docs');
    const format = options.format || 'markdown';

    if (!await fs.pathExists(srcPath)) {
        logger.error('No src directory found.');
        process.exit(1);
    }

    console.log(chalk.bold('📖 Parsing source files...'));
    console.log();

    // Find all TypeScript files
    const files = await getTypeScriptFiles(srcPath);
    console.log(`  Found ${files.length} TypeScript files`);

    // Parse documentation from each file
    const allDocs: DocEntry[] = [];
    for (const file of files) {
        const docs = await parseFile(file, projectPath);
        allDocs.push(...docs);
    }

    const exportedDocs = allDocs.filter(d => d.exported);
    console.log(`  Extracted ${exportedDocs.length} documented exports`);
    console.log();

    // Generate output
    console.log(chalk.bold('📝 Generating documentation...'));
    console.log();

    await fs.ensureDir(outputDir);

    if (format === 'markdown') {
        await generateMarkdownDocs(exportedDocs, outputDir, projectPath);
    } else if (format === 'json') {
        await generateJsonDocs(exportedDocs, outputDir);
    }

    console.log(`  Output: ${path.relative(projectPath, outputDir)}`);
    console.log();
    logger.success('Documentation generated successfully!');
}

/**
 * Serve documentation locally
 */
async function serveDocs(projectPath: string, options: DocsOptions): Promise<void> {
    const docsPath = options.output || path.join(projectPath, 'docs');

    if (!await fs.pathExists(docsPath)) {
        console.log(chalk.yellow('No docs folder found. Generating documentation first...'));
        console.log();
        await generateDocs(projectPath, options);
        console.log();
    }

    console.log(chalk.bold('🚀 Starting documentation server...'));
    console.log();

    // Create a simple HTML index if serving markdown
    const indexPath = path.join(docsPath, 'index.html');
    if (!await fs.pathExists(indexPath)) {
        const apiMdPath = path.join(docsPath, 'API.md');
        if (await fs.pathExists(apiMdPath)) {
            const apiMd = await fs.readFile(apiMdPath, 'utf-8');
            const html = markdownToHtml(apiMd);
            await fs.writeFile(indexPath, html);
        }
    }

    // Try to use npx serve or python
    try {
        console.log(`  ${chalk.cyan('→')} http://localhost:3000`);
        console.log();
        console.log(chalk.dim('Press Ctrl+C to stop'));
        execSync(`npx -y serve ${docsPath} -p 3000`, { stdio: 'inherit' });
    } catch (error) {
        // User cancelled
    }
}

/**
 * Get all TypeScript files recursively
 */
async function getTypeScriptFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'node_modules') {
            files.push(...await getTypeScriptFiles(fullPath));
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !entry.name.includes('.test.') && !entry.name.includes('.spec.')) {
            files.push(fullPath);
        }
    }

    return files;
}

/**
 * Parse a TypeScript file for documentation
 */
async function parseFile(filePath: string, projectPath: string): Promise<DocEntry[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    const relativePath = path.relative(projectPath, filePath);
    const docs: DocEntry[] = [];

    // Regex patterns for extracting documentation
    const jsDocPattern = /\/\*\*\s*([\s\S]*?)\s*\*\/\s*(?:export\s+)?(?:(async\s+)?function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*(?::\s*[^=]+)?\s*=|interface\s+(\w+)|type\s+(\w+)|class\s+(\w+))/g;

    let match;
    while ((match = jsDocPattern.exec(content)) !== null) {
        const docComment = match[1];
        const isAsync = !!match[2];
        const funcName = match[3];
        const constName = match[4];
        const interfaceName = match[5];
        const typeName = match[6];
        const className = match[7];

        const name = funcName || constName || interfaceName || typeName || className || '';
        if (!name) continue;

        const type = funcName ? 'function' :
            className ? 'class' :
                interfaceName ? 'interface' :
                    typeName ? 'type' : 'const';

        // Check if exported
        const exportMatch = content.substring(Math.max(0, match.index - 50), match.index).match(/export\s*$/);
        const isExported = !!exportMatch || content.substring(match.index, match.index + match[0].length).includes('export');

        // Parse JSDoc comment
        const parsed = parseJsDoc(docComment);

        // Get line number
        const lineNumber = content.substring(0, match.index).split('\n').length;

        docs.push({
            name,
            type,
            description: parsed.description,
            params: parsed.params,
            returns: parsed.returns,
            examples: parsed.examples,
            deprecated: parsed.deprecated,
            since: parsed.since,
            file: relativePath,
            line: lineNumber,
            exported: isExported,
        });
    }

    return docs;
}

/**
 * Parse JSDoc comment
 */
function parseJsDoc(comment: string): {
    description: string;
    params: ParamDoc[];
    returns?: ReturnDoc;
    examples: string[];
    deprecated?: string;
    since?: string;
} {
    const lines = comment.split('\n').map(l => l.replace(/^\s*\*\s?/, '').trim());

    let description = '';
    const params: ParamDoc[] = [];
    let returns: ReturnDoc | undefined;
    const examples: string[] = [];
    let deprecated: string | undefined;
    let since: string | undefined;

    let currentExample = '';
    let inExample = false;

    for (const line of lines) {
        if (line.startsWith('@param')) {
            inExample = false;
            const paramMatch = line.match(/@param\s+(?:\{([^}]+)\}\s+)?(\w+)\s*-?\s*(.*)/);
            if (paramMatch) {
                params.push({
                    name: paramMatch[2],
                    type: paramMatch[1] || 'unknown',
                    description: paramMatch[3] || '',
                    optional: paramMatch[2].startsWith('?') || line.includes('['),
                });
            }
        } else if (line.startsWith('@returns') || line.startsWith('@return')) {
            inExample = false;
            const returnMatch = line.match(/@returns?\s+(?:\{([^}]+)\}\s+)?(.*)/);
            if (returnMatch) {
                returns = {
                    type: returnMatch[1] || 'unknown',
                    description: returnMatch[2] || '',
                };
            }
        } else if (line.startsWith('@example')) {
            if (currentExample) examples.push(currentExample.trim());
            currentExample = '';
            inExample = true;
        } else if (line.startsWith('@deprecated')) {
            inExample = false;
            deprecated = line.replace('@deprecated', '').trim() || 'This is deprecated';
        } else if (line.startsWith('@since')) {
            inExample = false;
            since = line.replace('@since', '').trim();
        } else if (line.startsWith('@')) {
            inExample = false;
            // Skip other tags
        } else if (inExample) {
            currentExample += line + '\n';
        } else if (!line.startsWith('@')) {
            if (description) description += ' ';
            description += line;
        }
    }

    if (currentExample) examples.push(currentExample.trim());

    return { description: description.trim(), params, returns, examples, deprecated, since };
}

/**
 * Generate Markdown documentation
 */
async function generateMarkdownDocs(docs: DocEntry[], outputDir: string, projectPath: string): Promise<void> {
    const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));

    let markdown = `# ${packageJson.name} API Documentation\n\n`;
    markdown += `${packageJson.description || ''}\n\n`;
    markdown += `---\n\n`;

    // Group by type
    const functions = docs.filter(d => d.type === 'function');
    const classes = docs.filter(d => d.type === 'class');
    const interfaces = docs.filter(d => d.type === 'interface');
    const types = docs.filter(d => d.type === 'type');
    const constants = docs.filter(d => d.type === 'const');

    if (functions.length > 0) {
        markdown += `## Functions\n\n`;
        for (const doc of functions) {
            markdown += formatDocEntry(doc);
        }
    }

    if (classes.length > 0) {
        markdown += `## Classes\n\n`;
        for (const doc of classes) {
            markdown += formatDocEntry(doc);
        }
    }

    if (interfaces.length > 0) {
        markdown += `## Interfaces\n\n`;
        for (const doc of interfaces) {
            markdown += formatDocEntry(doc);
        }
    }

    if (types.length > 0) {
        markdown += `## Types\n\n`;
        for (const doc of types) {
            markdown += formatDocEntry(doc);
        }
    }

    if (constants.length > 0) {
        markdown += `## Constants\n\n`;
        for (const doc of constants) {
            markdown += formatDocEntry(doc);
        }
    }

    await fs.writeFile(path.join(outputDir, 'API.md'), markdown);
}

/**
 * Format a single documentation entry
 */
function formatDocEntry(doc: DocEntry): string {
    let md = `### \`${doc.name}\`\n\n`;

    if (doc.deprecated) {
        md += `> ⚠️ **Deprecated:** ${doc.deprecated}\n\n`;
    }

    md += `${doc.description}\n\n`;

    if (doc.since) {
        md += `*Since: ${doc.since}*\n\n`;
    }

    if (doc.params.length > 0) {
        md += `**Parameters:**\n\n`;
        md += `| Name | Type | Description |\n`;
        md += `|------|------|-------------|\n`;
        for (const param of doc.params) {
            const optional = param.optional ? '?' : '';
            md += `| \`${param.name}${optional}\` | \`${param.type}\` | ${param.description} |\n`;
        }
        md += `\n`;
    }

    if (doc.returns) {
        md += `**Returns:** \`${doc.returns.type}\``;
        if (doc.returns.description) {
            md += ` - ${doc.returns.description}`;
        }
        md += `\n\n`;
    }

    if (doc.examples.length > 0) {
        md += `**Example:**\n\n`;
        for (const example of doc.examples) {
            md += `\`\`\`typescript\n${example}\n\`\`\`\n\n`;
        }
    }

    md += `<sub>Defined in [${doc.file}](${doc.file}#L${doc.line})</sub>\n\n`;
    md += `---\n\n`;

    return md;
}

/**
 * Generate JSON documentation
 */
async function generateJsonDocs(docs: DocEntry[], outputDir: string): Promise<void> {
    await fs.writeJson(path.join(outputDir, 'api.json'), docs, { spaces: 2 });
}

/**
 * Simple markdown to HTML converter
 */
function markdownToHtml(markdown: string): string {
    let html = markdown
        .replace(/^### `([^`]+)`/gm, '<h3><code>$1</code></h3>')
        .replace(/^## (.+)/gm, '<h2>$1</h2>')
        .replace(/^# (.+)/gm, '<h1>$1</h1>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^---$/gm, '<hr>');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Documentation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        code { background: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 1rem; overflow-x: auto; border-radius: 6px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
        hr { border: none; border-top: 1px solid #eee; margin: 2rem 0; }
        h1 { border-bottom: 2px solid #333; }
        h2 { color: #0066cc; }
    </style>
</head>
<body>
    <p>${html}</p>
</body>
</html>`;
}

export default docsCommand;
