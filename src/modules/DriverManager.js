const { execFile } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execFileAsync = promisify(execFile);

class DriverManager {
    constructor() {
        this.driversPath = path.join(process.resourcesPath || __dirname, '../../drivers');
    }

    async installDriver(driverType) {
        try {
            const driverMap = {
                'adb': 'adb_drivers',
                'samsung': 'samsung_usb_drivers',
                'universal': 'universal_adb_drivers',
                'qualcomm': 'qualcomm_hs_usb_drivers',
                'mtk': 'mtk_usb_drivers'
            };

            const driverFolder = driverMap[driverType];
            if (!driverFolder) {
                throw new Error(`Tipo de driver desconocido: ${driverType}`);
            }

            const installerPath = path.join(this.driversPath, driverFolder, 'setup.exe');
            await execFileAsync(installerPath, ['/silent']);
            return { success: true, message: `Driver ${driverType} instalado correctamente` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async checkDriverStatus() {
        const drivers = {};
        const checks = [
            { name: 'adb', bin: 'adb', args: ['version'] },
            { name: 'fastboot', bin: 'fastboot', args: ['--version'] }
        ];

        for (const check of checks) {
            try {
                const { stdout } = await execFileAsync(check.bin, check.args);
                drivers[check.name] = { installed: true, version: stdout.split('\n')[0].trim() };
            } catch {
                drivers[check.name] = { installed: false };
            }
        }

        return { success: true, drivers };
    }
}

module.exports = DriverManager;
