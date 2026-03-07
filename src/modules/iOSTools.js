const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

class iOSTools {
    constructor() {
        this.devices = new Map();
    }

    async checkiCloudStatus(deviceId) {
        try {
            const { stdout } = await execFileAsync('ideviceinfo', ['-u', deviceId, '-k', 'ActivationState']);
            const state = stdout.trim();
            return {
                success: true,
                locked: state !== 'Activated',
                state
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async bypassiCloud(deviceId, method) {
        try {
            switch (method) {
                case 'checkra1n':
                    await execFileAsync('checkra1n', ['-c', '-s', '-u', deviceId]);
                    break;
                default:
                    throw new Error(`Método de bypass no soportado: ${method}`);
            }
            return { success: true, message: 'Bypass de iCloud completado' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async activateDevice(deviceId) {
        try {
            await execFileAsync('ideviceactivation', ['-u', deviceId, 'activate']);
            return { success: true, message: 'Dispositivo activado correctamente' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async jailbreakDevice(deviceId) {
        try {
            await execFileAsync('checkra1n', ['-c', '-u', deviceId]);
            return { success: true, message: 'Jailbreak completado' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = iOSTools;
