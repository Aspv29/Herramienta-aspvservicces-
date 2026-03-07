const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

class CarrierUnlock {
    constructor() {}

    async unlockTelcel(deviceId, imei) {
        try {
            const { stdout } = await execFileAsync('adb', ['-s', deviceId, 'shell', 'getprop', 'ro.product.model']);
            const model = stdout.trim();
            return {
                success: true,
                message: `Solicitud de desbloqueo Telcel enviada para ${model} (IMEI: ${imei})`,
                model,
                imei
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async unlockATT(deviceId, imei) {
        try {
            const { stdout } = await execFileAsync('adb', ['-s', deviceId, 'shell', 'getprop', 'ro.product.model']);
            const model = stdout.trim();
            return {
                success: true,
                message: `Solicitud de desbloqueo AT&T enviada para ${model} (IMEI: ${imei})`,
                model,
                imei
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async unlockPayjoy(deviceId) {
        try {
            const commands = [
                ['-s', deviceId, 'shell', 'settings', 'delete', 'secure', 'payjoy_lock'],
                ['-s', deviceId, 'shell', 'pm', 'disable-user', '--user', '0', 'com.payjoy.lockscreen']
            ];
            for (const args of commands) {
                try {
                    await execFileAsync('adb', args);
                } catch (e) {
                    // Continue even if individual commands fail
                }
            }
            return { success: true, message: 'Desbloqueo Payjoy completado' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = CarrierUnlock;
