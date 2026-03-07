const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');

const execAsync = promisify(exec);

class DriverManager {
    async installDriver(driverType) {
        const driversDir = path.resolve(__dirname, '..', '..', 'drivers');
        const driverMap = {
            'adb': 'adb_installer.exe',
            'samsung': 'samsung_usb_driver.exe',
            'qualcomm': 'qualcomm_hs_usb.exe',
            'mediatek': 'mtk_driver_installer.exe',
            'universal': 'universal_adb_driver.exe'
        };

        const driverFile = driverMap[driverType];
        if (!driverFile) {
            return { success: false, error: `Unknown driver type: ${driverType}` };
        }

        const installerPath = path.join(driversDir, driverFile);

        if (!installerPath.startsWith(driversDir + path.sep)) {
            return { success: false, error: 'Invalid installer path' };
        }

        if (!fs.existsSync(installerPath)) {
            return { success: false, error: `Driver installer not found: ${driverFile}` };
        }

        try {
            await execAsync(`"${installerPath}"`);
            return { success: true, message: `Driver ${driverType} installation started` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async checkDriverStatus() {
        const statuses = {};
        try {
            await execAsync('adb version');
            statuses.adb = { installed: true };
        } catch {
            statuses.adb = { installed: false };
        }

        try {
            await execAsync('fastboot --version');
            statuses.fastboot = { installed: true };
        } catch {
            statuses.fastboot = { installed: false };
        }

        return { success: true, drivers: statuses };
    }
}

module.exports = DriverManager;
