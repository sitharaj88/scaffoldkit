/**
 * Structured colored logging with consistent formatting
 */
import chalk from 'chalk';
import gradient from 'gradient-string';
import boxen from 'boxen';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
    level: LogLevel;
    colors: boolean;
}

const LOG_LEVELS: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

class Logger {
    private config: LoggerConfig = {
        level: 'info',
        colors: true,
    };

    configure(config: Partial<LoggerConfig>) {
        this.config = { ...this.config, ...config };
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
    }

    private format(prefix: string, message: string, colorFn: (s: string) => string): string {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
        if (this.config.colors) {
            return `${chalk.dim(timestamp)} ${colorFn(prefix)} ${message}`;
        }
        return `${timestamp} ${prefix} ${message}`;
    }

    debug(message: string, ...args: unknown[]) {
        if (this.shouldLog('debug')) {
            console.log(this.format('[DEBUG]', message, chalk.gray), ...args);
        }
    }

    info(message: string, ...args: unknown[]) {
        if (this.shouldLog('info')) {
            console.log(this.format('[INFO]', message, chalk.blue), ...args);
        }
    }

    success(message: string, ...args: unknown[]) {
        if (this.shouldLog('info')) {
            console.log(this.format('[OK]', message, chalk.green), ...args);
        }
    }

    warn(message: string, ...args: unknown[]) {
        if (this.shouldLog('warn')) {
            console.warn(this.format('[WARN]', message, chalk.yellow), ...args);
        }
    }

    error(message: string, ...args: unknown[]) {
        if (this.shouldLog('error')) {
            console.error(this.format('[ERROR]', message, chalk.red), ...args);
        }
    }

    /**
     * Print a blank line for visual separation
     */
    blank() {
        console.log();
    }

    /**
     * Print a header with visual emphasis
     */
    header(title: string) {
        this.blank();
        if (this.config.colors) {
            console.log(gradient.morning(`\n◆ ${title}\n`));
        } else {
            console.log(`=== ${title} ===`);
        }
    }

    /**
     * Print a step in a process
     */
    step(stepNumber: number, total: number, message: string) {
        const prefix = `[${stepNumber}/${total}]`;
        if (this.config.colors) {
            console.log(`${chalk.dim(prefix)} ${chalk.white(message)}`);
        } else {
            console.log(`${prefix} ${message}`);
        }
    }

    /**
     * Print a list item
     */
    list(items: string[]) {
        items.forEach((item) => {
            if (this.config.colors) {
                console.log(`  ${chalk.dim('•')} ${item}`);
            } else {
                console.log(`  - ${item}`);
            }
        });
    }

    /**
     * Print a key-value pair
     */
    keyValue(key: string, value: string) {
        if (this.config.colors) {
            console.log(`  ${chalk.dim(key + ':')} ${chalk.white(value)}`);
        } else {
            console.log(`  ${key}: ${value}`);
        }
    }

    /**
     * Print a box around content
     */
    box(title: string, content: string[]) {
        if (this.config.colors) {
            console.log(
                boxen(content.join('\n'), {
                    title: title,
                    titleAlignment: 'center',
                    padding: 1,
                    margin: 1,
                    borderStyle: 'round',
                    borderColor: 'blue',
                })
            );
        } else {
            const maxLength = Math.max(title.length, ...content.map((c) => c.length));
            const border = '─'.repeat(maxLength + 4);

            this.blank();
            console.log(`┌${border}┐`);
            console.log('│ ' + title.padEnd(maxLength + 2) + ' │');
            console.log(`├${border}┤`);
            content.forEach((line) => {
                console.log('│ ' + line.padEnd(maxLength + 2) + ' │');
            });
            console.log(`└${border}┘`);
        }
    }

    /**
     * Print validation result with icon
     */
    validation(passed: boolean, message: string) {
        const icon = passed ? chalk.green('✔') : chalk.red('✖');
        console.log(`  ${icon} ${message}`);
    }

    /**
     * Print command to run
     */
    command(cmd: string) {
        if (this.config.colors) {
            console.log(`  ${chalk.dim('$')} ${chalk.cyan(cmd)}`);
        } else {
            console.log(`  $ ${cmd}`);
        }
    }

    /**
     * Print a file path
     */
    file(path: string, action: 'created' | 'modified' | 'deleted' = 'created') {
        const icons = {
            created: chalk.green('+'),
            modified: chalk.yellow('~'),
            deleted: chalk.red('-'),
        };
        const icon = this.config.colors ? icons[action] : action.charAt(0).toUpperCase();
        console.log(`  ${icon} ${path}`);
    }
}

export const logger = new Logger();
export default logger;
