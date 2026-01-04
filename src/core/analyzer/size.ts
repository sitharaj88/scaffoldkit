/**
 * Bundle Size Analyzer
 * Analyzes the size of the built output
 */
import fs from 'fs-extra';
import path from 'path';
import { gzipSync } from 'zlib';

/**
 * Size information for a single file
 */
export interface FileSize {
    /** File path relative to dist */
    path: string;
    /** Raw size in bytes */
    size: number;
    /** Gzipped size in bytes */
    gzipSize: number;
}

/**
 * Suggestion for reducing bundle size
 */
export interface SizeSuggestion {
    /** Suggestion message */
    message: string;
    /** Potential savings description */
    savings?: string;
    /** Severity of the issue */
    severity: 'info' | 'warning' | 'error';
}

/**
 * Complete bundle analysis result
 */
export interface BundleAnalysis {
    /** Total raw size in bytes */
    totalSize: number;
    /** Total gzipped size in bytes */
    totalGzipSize: number;
    /** Individual file sizes */
    files: FileSize[];
    /** Optimization suggestions */
    suggestions: SizeSuggestion[];
    /** Whether the bundle passes the size limit */
    passesLimit: boolean;
    /** Size limit in bytes (if specified) */
    sizeLimit?: number;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Parse size limit string (e.g., "50KB", "1MB")
 */
export function parseSizeLimit(limit: string): number {
    const match = limit.match(/^([\d.]+)\s*(B|KB|MB|GB)?$/i);
    if (!match) {
        throw new Error(`Invalid size limit format: ${limit}`);
    }

    const value = parseFloat(match[1]);
    const unit = (match[2] || 'B').toUpperCase();

    const multipliers: Record<string, number> = {
        'B': 1,
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
    };

    return value * (multipliers[unit] || 1);
}

/**
 * Analyze bundle size
 */
export async function analyzeBundleSize(
    projectPath: string,
    options: { sizeLimit?: string } = {}
): Promise<BundleAnalysis> {
    const distPath = path.join(projectPath, 'dist');
    const files: FileSize[] = [];
    const suggestions: SizeSuggestion[] = [];

    // Check if dist exists
    if (!await fs.pathExists(distPath)) {
        return {
            totalSize: 0,
            totalGzipSize: 0,
            files: [],
            suggestions: [{ message: 'No dist folder found. Run build first.', severity: 'error' }],
            passesLimit: false,
        };
    }

    // Get all files in dist
    const distFiles = await getFilesRecursive(distPath);

    // Analyze each file
    for (const filePath of distFiles) {
        const relativePath = path.relative(distPath, filePath);
        const content = await fs.readFile(filePath);
        const size = content.length;
        const gzipSize = gzipSync(content).length;

        files.push({
            path: relativePath,
            size,
            gzipSize,
        });
    }

    // Sort by size descending
    files.sort((a, b) => b.size - a.size);

    // Calculate totals
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const totalGzipSize = files.reduce((sum, f) => sum + f.gzipSize, 0);

    // Generate suggestions
    generateSuggestions(files, totalSize, suggestions);

    // Check size limit
    let passesLimit = true;
    let sizeLimit: number | undefined;

    if (options.sizeLimit) {
        sizeLimit = parseSizeLimit(options.sizeLimit);
        passesLimit = totalSize <= sizeLimit;

        if (!passesLimit) {
            suggestions.unshift({
                message: `Bundle size (${formatBytes(totalSize)}) exceeds limit (${formatBytes(sizeLimit)})`,
                severity: 'error',
            });
        }
    }

    return {
        totalSize,
        totalGzipSize,
        files,
        suggestions,
        passesLimit,
        sizeLimit,
    };
}

/**
 * Generate optimization suggestions based on analysis
 */
function generateSuggestions(files: FileSize[], totalSize: number, suggestions: SizeSuggestion[]): void {
    // Check for large files
    const largeFiles = files.filter(f => f.size > 100 * 1024); // > 100KB
    for (const file of largeFiles) {
        suggestions.push({
            message: `Large file: ${file.path} (${formatBytes(file.size)})`,
            savings: 'Consider code splitting or lazy loading',
            severity: 'warning',
        });
    }

    // Check for source maps in production
    const sourceMaps = files.filter(f => f.path.endsWith('.map'));
    if (sourceMaps.length > 0) {
        const mapSize = sourceMaps.reduce((sum, f) => sum + f.size, 0);
        suggestions.push({
            message: `Source maps included: ${sourceMaps.length} files (${formatBytes(mapSize)})`,
            savings: 'Consider excluding source maps from npm package',
            severity: 'info',
        });
    }

    // Check for duplicate entries (same file with different extensions)
    const baseNames = new Map<string, string[]>();
    for (const file of files) {
        const basename = file.path.replace(/\.(js|mjs|cjs|ts|d\.ts|map)$/, '');
        if (!baseNames.has(basename)) {
            baseNames.set(basename, []);
        }
        baseNames.get(basename)!.push(file.path);
    }

    for (const [basename, variants] of baseNames) {
        if (variants.length > 3) {
            suggestions.push({
                message: `Multiple build outputs for ${basename}: ${variants.join(', ')}`,
                savings: 'Review if all output formats are necessary',
                severity: 'info',
            });
        }
    }

    // Suggest tree-shaking if bundle is large
    if (totalSize > 500 * 1024) {
        suggestions.push({
            message: 'Bundle is over 500KB',
            savings: 'Consider using tree-shaking and code splitting',
            severity: 'warning',
        });
    }
}

/**
 * Recursively get all files in a directory
 */
async function getFilesRecursive(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...await getFilesRecursive(fullPath));
        } else if (entry.isFile()) {
            files.push(fullPath);
        }
    }

    return files;
}
