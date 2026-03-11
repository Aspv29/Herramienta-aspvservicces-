#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;

console.log(cyan('╔══════════════════════════════════════════════════════════╗'));
console.log(cyan('║') + bold('    AspvServices - Build Script                       ') + cyan('║'));
console.log(cyan('╚══════════════════════════════════════════════════════════╝'));
console.log('');

const steps = [
    {
        name: 'Checking environment',
        action: () => {
            // Check Node.js version
            const nodeVersion = process.version;
            console.log(`  Node.js version: ${nodeVersion}`);

            // Check if electron-builder is installed
            try {
                execSync('npx electron-builder --version', { stdio: 'pipe' });
                console.log('  electron-builder: OK');
            } catch (error) {
                throw new Error('electron-builder not found. Run npm install first.');
            }
        }
    },
    {
        name: 'Creating required directories',
        action: () => {
            const dirs = ['dist', 'assets', 'tools', 'drivers'];
            dirs.forEach(dir => {
                const dirPath = path.join(__dirname, '..', dir);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                    console.log(`  Created: ${dir}/`);
                }
            });
        }
    },
    {
        name: 'Checking required files',
        action: () => {
            const requiredFiles = [
                'package.json',
                'src/main.js',
                'src/ui/index.html',
                'LICENSE.txt'
            ];

            requiredFiles.forEach(file => {
                const filePath = path.join(__dirname, '..', file);
                if (!fs.existsSync(filePath)) {
                    throw new Error(`Required file missing: ${file}`);
                }
                console.log(`  ✓ ${file}`);
            });
        }
    },
    {
        name: 'Installing dependencies',
        action: () => {
            console.log('  Running npm install...');
            execSync('npm install', { stdio: 'inherit' });
        }
    },
    {
        name: 'Building application',
        action: () => {
            console.log('  Building Windows installer...');
            execSync('npm run build:win', { stdio: 'inherit' });
        }
    },
    {
        name: 'Build complete',
        action: () => {
            const distPath = path.join(__dirname, '..', 'dist');
            console.log('');
            console.log(green('  ✓ Build completed successfully!'));
            console.log('');
            console.log('  Output files:');

            if (fs.existsSync(distPath)) {
                const files = fs.readdirSync(distPath);
                files.forEach(file => {
                    const stats = fs.statSync(path.join(distPath, file));
                    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
                    console.log(`    - ${file} (${sizeMB} MB)`);
                });
            }

            console.log('');
            console.log(cyan('  Installation files are in the dist/ directory'));
        }
    }
];

async function build() {
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        console.log(yellow(`[${i + 1}/${steps.length}]`) + ` ${step.name}...`);

        try {
            await step.action();
            console.log(green('  ✓ Done'));
            console.log('');
        } catch (error) {
            console.log(red('  ✖ Failed'));
            console.error(red('Error:'), error.message);
            process.exit(1);
        }
    }
}

build().catch(error => {
    console.error(red('Build failed:'), error);
    process.exit(1);
});
