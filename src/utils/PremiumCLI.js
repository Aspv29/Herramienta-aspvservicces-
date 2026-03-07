const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class PremiumCLI {
    constructor() {
        this.colors = {
            primary: chalk.hex('#00d4ff'),
            secondary: chalk.hex('#7c3aed'),
            success: chalk.hex('#10b981'),
            warning: chalk.hex('#f59e0b'),
            error: chalk.hex('#ef4444'),
            info: chalk.hex('#3b82f6'),
            highlight: chalk.hex('#f59e0b').bold,
            gradient: (text) => {
                // Simulate gradient effect
                return chalk.hex('#00d4ff')(text.substring(0, text.length / 2)) +
                       chalk.hex('#7c3aed')(text.substring(text.length / 2));
            }
        };

        this.symbols = {
            success: chalk.green('✓'),
            error: chalk.red('✖'),
            warning: chalk.yellow('⚠'),
            info: chalk.blue('ℹ'),
            arrow: chalk.cyan('➜'),
            star: chalk.yellow('★'),
            flash: chalk.yellow('⚡'),
            gear: chalk.gray('⚙'),
            phone: chalk.cyan('📱'),
            lock: chalk.red('🔒'),
            unlock: chalk.green('🔓')
        };
    }

    showBanner() {
        console.clear();
        const banner = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     █████╗ ███████╗██████╗ ██╗   ██╗███████╗███████╗        ║
║    ██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝██╔════╝        ║
║    ███████║███████╗██████╔╝██║   ██║███████╗█████╗          ║
║    ██╔══██║╚════██║██╔═══╝ ╚██╗ ██╔╝╚════██║██╔══╝          ║
║    ██║  ██║███████║██║      ╚████╔╝ ███████║███████╗        ║
║    ╚═╝  ╚═╝╚══════╝╚═╝       ╚═══╝  ╚══════╝╚══════╝        ║
║                                                               ║
║              Professional Device Service Tool                 ║
║                      Version 1.0 Premium                      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        `;

        console.log(this.colors.gradient(banner));
        console.log(this.colors.primary('━'.repeat(65)));
        console.log('');
    }

    showHeader(title, subtitle = '') {
        console.log('');
        console.log(this.colors.primary('╔' + '═'.repeat(63) + '╗'));
        console.log(this.colors.primary('║') + this.colors.highlight(` ${title.padEnd(61)} `) + this.colors.primary('║'));
        if (subtitle) {
            console.log(this.colors.primary('║') + chalk.gray(` ${subtitle.padEnd(61)} `) + this.colors.primary('║'));
        }
        console.log(this.colors.primary('╚' + '═'.repeat(63) + '╝'));
        console.log('');
    }

    showSection(title) {
        console.log('');
        console.log(this.colors.secondary('┌─ ') + this.colors.highlight(title));
        console.log(this.colors.secondary('│'));
    }

    endSection() {
        console.log(this.colors.secondary('└─'));
        console.log('');
    }

    success(message) {
        console.log(`${this.symbols.success} ${this.colors.success(message)}`);
    }

    error(message) {
        console.log(`${this.symbols.error} ${this.colors.error(message)}`);
    }

    warning(message) {
        console.log(`${this.symbols.warning} ${this.colors.warning(message)}`);
    }

    info(message) {
        console.log(`${this.symbols.info} ${this.colors.info(message)}`);
    }

    log(message, color = 'white') {
        const colorFunc = this.colors[color] || chalk.white;
        console.log(`  ${colorFunc(message)}`);
    }

    printBox(title, content, type = 'info') {
        const colors = {
            info: this.colors.info,
            success: this.colors.success,
            warning: this.colors.warning,
            error: this.colors.error
        };

        const color = colors[type] || this.colors.info;
        const width = 63;

        console.log('');
        console.log(color('┏' + '━'.repeat(width) + '┓'));
        console.log(color('┃ ') + chalk.bold.white(title.padEnd(width - 1)) + color('┃'));
        console.log(color('┣' + '━'.repeat(width) + '┫'));

        const lines = Array.isArray(content) ? content : [content];
        lines.forEach(line => {
            console.log(color('┃ ') + chalk.white(line.toString().padEnd(width - 1)) + color('┃'));
        });

        console.log(color('┗' + '━'.repeat(width) + '┛'));
        console.log('');
    }

    async executeWithSpinner(message, task) {
        const spinner = ora({
            text: this.colors.primary(message),
            spinner: {
                interval: 80,
                frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
            },
            color: 'cyan'
        }).start();

        try {
            const result = await task();
            spinner.succeed(this.colors.success(message + ' - Completado'));
            return { success: true, result };
        } catch (error) {
            spinner.fail(this.colors.error(message + ' - Error'));
            return { success: false, error };
        }
    }

    showProgress(current, total, label = 'Progreso') {
        const percentage = Math.round((current / total) * 100);
        const filled = Math.round(percentage / 2);
        const empty = 50 - filled;

        const bar = this.colors.success('█'.repeat(filled)) +
                   chalk.gray('░'.repeat(empty));

        process.stdout.write(`\r${this.symbols.arrow} ${label}: [${bar}] ${percentage}%`);

        if (current === total) {
            console.log(''); // New line when complete
        }
    }

    async showMenu(title, options) {
        console.log('');
        console.log(this.colors.highlight(title));
        console.log(this.colors.secondary('─'.repeat(65)));
        console.log('');

        const choices = options.map((opt, index) => ({
            name: `${this.colors.primary((index + 1) + '.')} ${opt.name}`,
            value: opt.value
        }));

        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selection',
                message: this.colors.primary('Selecciona una opción:'),
                choices: choices,
                pageSize: 15
            }
        ]);

        return answer.selection;
    }

    async confirm(message) {
        const answer = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmed',
                message: this.colors.warning(message),
                default: false
            }
        ]);

        return answer.confirmed;
    }

    async input(message, defaultValue = '') {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'value',
                message: this.colors.primary(message),
                default: defaultValue
            }
        ]);

        return answer.value;
    }

    showDeviceInfo(device) {
        this.showSection('Información del Dispositivo');

        const info = [
            `${this.colors.highlight('Marca:')} ${device.brand}`,
            `${this.colors.highlight('Modelo:')} ${device.model}`,
            `${this.colors.highlight('Fabricante:')} ${device.manufacturer}`,
            `${this.colors.highlight('Android:')} ${device.androidVersion || device.iosVersion || 'N/A'}`,
            `${this.colors.highlight('IMEI:')} ${device.imei || 'N/A'}`,
            `${this.colors.highlight('Serial:')} ${device.serialNumber}`,
            `${this.colors.highlight('Chipset:')} ${device.chipset || 'N/A'}`
        ];

        info.forEach(line => this.log(line));

        this.endSection();
    }

    showTable(headers, rows) {
        const columnWidths = headers.map((header, i) => {
            const maxContentWidth = Math.max(...rows.map(row => String(row[i]).length));
            return Math.max(header.length, maxContentWidth) + 2;
        });

        // Top border
        console.log(this.colors.primary('┌' + columnWidths.map(w => '─'.repeat(w)).join('┬') + '┓'));

        // Headers
        const headerRow = headers.map((h, i) => chalk.bold(h.padEnd(columnWidths[i]))).join(this.colors.primary('│'));
        console.log(this.colors.primary('│') + headerRow + this.colors.primary('│'));

        // Header separator
        console.log(this.colors.primary('├' + columnWidths.map(w => '─'.repeat(w)).join('┼') + '┤'));

        // Rows
        rows.forEach(row => {
            const rowStr = row.map((cell, i) => String(cell).padEnd(columnWidths[i])).join(this.colors.primary('│'));
            console.log(this.colors.primary('│') + rowStr + this.colors.primary('│'));
        });

        // Bottom border
        console.log(this.colors.primary('└' + columnWidths.map(w => '─'.repeat(w)).join('┴') + '┘'));
        console.log('');
    }

    async executeADBCommand(command, deviceId = null) {
        const fullCommand = deviceId ? `adb -s ${deviceId} ${command}` : `adb ${command}`;

        this.info(`Ejecutando: ${this.colors.secondary(fullCommand)}`);

        const spinner = ora({
            text: 'Procesando comando...',
            color: 'cyan'
        }).start();

        try {
            const { stdout, stderr } = await execAsync(fullCommand);

            spinner.stop();

            if (stdout) {
                console.log(this.colors.success('Salida:'));
                console.log(chalk.gray(stdout));
            }

            if (stderr) {
                console.log(this.colors.warning('Advertencias:'));
                console.log(chalk.yellow(stderr));
            }

            this.success('Comando ejecutado correctamente');
            return { success: true, output: stdout, error: stderr };
        } catch (error) {
            spinner.stop();
            this.error(`Error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }

    showInstructions(title, steps) {
        this.showSection(title);

        steps.forEach((step, index) => {
            console.log(this.colors.primary(`  ${index + 1}.`) + ` ${chalk.white(step)}`);
        });

        this.endSection();
    }

    countdown(seconds, message = 'Esperando') {
        return new Promise((resolve) => {
            let remaining = seconds;

            const interval = setInterval(() => {
                process.stdout.write(`\r${this.symbols.info} ${message}: ${this.colors.warning(remaining + 's')}  `);
                remaining--;

                if (remaining < 0) {
                    clearInterval(interval);
                    console.log(''); // New line
                    resolve();
                }
            }, 1000);
        });
    }

    showSeparator() {
        console.log(this.colors.secondary('━'.repeat(65)));
    }

    clearScreen() {
        console.clear();
    }

    pause() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'continue',
                message: this.colors.primary('Presiona Enter para continuar...')
            }
        ]);
    }
}

module.exports = PremiumCLI;
