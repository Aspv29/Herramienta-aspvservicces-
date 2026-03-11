const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class DeviceManager {
    constructor() {
        this.devices = new Map();
        this.pollingInterval = null;
    }

    async detectDevices() {
        const detectedDevices = [];

        try {
            const adbDevices = await this.detectAndroidDevices();
            detectedDevices.push(...adbDevices);

            const iosDevices = await this.detectiOSDevices();
            detectedDevices.push(...iosDevices);

            const fastbootDevices = await this.detectFastbootDevices();
            detectedDevices.push(...fastbootDevices);

            this.devices.clear();
            detectedDevices.forEach(device => {
                this.devices.set(device.id, device);
            });

            return detectedDevices;
        } catch (error) {
            console.error('Error detecting devices:', error);
            return [];
        }
    }

    async detectAndroidDevices() {
        try {
            const { stdout } = await execAsync('adb devices -l', { timeout: 10000 });
            const lines = stdout.trim().split('\n').slice(1).filter(line => line.trim());
            const androidDevices = [];

            for (const line of lines) {
                const parts = line.trim().split(/\s+/);
                const deviceId = parts[0];
                const state = parts[1];

                if (!deviceId || state === 'offline') continue;

                try {
                    const properties = await this.getAndroidProperties(deviceId);
                    androidDevices.push({
                        id: deviceId,
                        type: 'android',
                        state: state,
                        brand: (properties['ro.product.brand'] || 'Unknown').replace(/^./, c => c.toUpperCase()),
                        model: properties['ro.product.model'] || 'Unknown',
                        manufacturer: properties['ro.product.manufacturer'] || 'Unknown',
                        androidVersion: properties['ro.build.version.release'] || 'Unknown',
                        sdk: properties['ro.build.version.sdk'] || 'Unknown',
                        chipset: this.detectChipset(properties),
                        serialNumber: properties['ro.serialno'] || deviceId,
                        imei: await this.getIMEI(deviceId),
                        bootloader: properties['ro.bootloader'] || 'Unknown',
                        securityPatch: properties['ro.build.version.security_patch'] || 'Unknown',
                        buildNumber: properties['ro.build.display.id'] || 'Unknown',
                        fingerprint: properties['ro.build.fingerprint'] || 'Unknown'
                    });
                } catch (error) {
                    androidDevices.push({
                        id: deviceId,
                        type: 'android',
                        state: state,
                        brand: 'Unknown',
                        model: 'Android Device',
                        manufacturer: 'Unknown',
                        androidVersion: 'Unknown',
                        chipset: 'Unknown',
                        serialNumber: deviceId
                    });
                }
            }

            return androidDevices;
        } catch (error) {
            return [];
        }
    }

    async getAndroidProperties(deviceId) {
        try {
            const { stdout } = await execAsync(`adb -s ${deviceId} shell getprop`, { timeout: 10000 });
            const properties = {};

            stdout.split('\n').forEach(line => {
                const match = line.match(/\[(.*?)\]: \[(.*?)\]/);
                if (match) {
                    properties[match[1]] = match[2];
                }
            });

            return properties;
        } catch (error) {
            return {};
        }
    }

    async getIMEI(deviceId) {
        try {
            const { stdout } = await execAsync(
                `adb -s ${deviceId} shell service call iphonesubinfo 1`,
                { timeout: 5000 }
            );
            const imei = stdout.match(/\d+/g)?.join('').substring(0, 15);
            return imei || 'Unknown';
        } catch (error) {
            return 'Unknown';
        }
    }

    detectChipset(properties) {
        const hardware = (properties['ro.hardware'] || '').toLowerCase();
        const platform = (properties['ro.board.platform'] || '').toLowerCase();
        const soc = (properties['ro.soc.model'] || '').toLowerCase();

        if (hardware.includes('qcom') || platform.includes('msm') || platform.includes('sdm') || platform.includes('sm')) {
            return 'Qualcomm';
        } else if (hardware.includes('mt') || platform.includes('mt')) {
            return 'MediaTek';
        } else if (hardware.includes('kirin') || platform.includes('hi') || soc.includes('kirin')) {
            return 'HiSilicon Kirin';
        } else if (hardware.includes('exynos') || platform.includes('exynos')) {
            return 'Samsung Exynos';
        } else if (platform.includes('unisoc') || platform.includes('sc') || platform.includes('ums')) {
            return 'UNISOC';
        } else if (platform.includes('tensor')) {
            return 'Google Tensor';
        }

        return 'Unknown';
    }

    async detectiOSDevices() {
        try {
            const { stdout } = await execAsync('idevice_id -l', { timeout: 5000 });
            const deviceIds = stdout.trim().split('\n').filter(id => id.trim());

            const iosDevices = [];
            for (const deviceId of deviceIds) {
                try {
                    const { stdout: infoOutput } = await execAsync(
                        `ideviceinfo -u ${deviceId.trim()}`,
                        { timeout: 5000 }
                    );
                    const info = this.parseiOSInfo(infoOutput);

                    iosDevices.push({
                        id: deviceId.trim(),
                        type: 'ios',
                        state: 'device',
                        brand: 'Apple',
                        model: info.ProductType || 'iPhone',
                        manufacturer: 'Apple',
                        iosVersion: info.ProductVersion || 'Unknown',
                        serialNumber: info.SerialNumber || 'Unknown',
                        deviceName: info.DeviceName || 'iPhone',
                        uniqueDeviceID: info.UniqueDeviceID || deviceId.trim(),
                        activationState: info.ActivationState || 'Unknown'
                    });
                } catch (error) {
                    iosDevices.push({
                        id: deviceId.trim(),
                        type: 'ios',
                        state: 'device',
                        brand: 'Apple',
                        model: 'iPhone',
                        manufacturer: 'Apple'
                    });
                }
            }

            return iosDevices;
        } catch (error) {
            return [];
        }
    }

    parseiOSInfo(output) {
        const info = {};
        output.split('\n').forEach(line => {
            const match = line.match(/^(.*?):\s*(.*)$/);
            if (match) {
                info[match[1].trim()] = match[2].trim();
            }
        });
        return info;
    }

    async detectFastbootDevices() {
        try {
            const { stdout } = await execAsync('fastboot devices', { timeout: 5000 });
            const lines = stdout.trim().split('\n').filter(line => line.trim());

            return lines.map(line => {
                const [deviceId] = line.split('\t');
                return {
                    id: deviceId.trim(),
                    type: 'android',
                    state: 'fastboot',
                    brand: 'Unknown',
                    model: 'Fastboot Mode',
                    manufacturer: 'Unknown',
                    mode: 'fastboot'
                };
            });
        } catch (error) {
            return [];
        }
    }

    async getDeviceInfo(deviceId) {
        return this.devices.get(deviceId) || null;
    }

    async rebootDevice(deviceId, mode = 'system') {
        const device = this.devices.get(deviceId);
        if (!device) throw new Error('Device not found');

        if (device.type === 'android') {
            if (device.state === 'fastboot') {
                if (mode === 'system') {
                    await execAsync(`fastboot -s ${deviceId} reboot`);
                } else {
                    await execAsync(`fastboot -s ${deviceId} reboot-${mode}`);
                }
            } else {
                const modes = {
                    'system': `adb -s ${deviceId} reboot`,
                    'bootloader': `adb -s ${deviceId} reboot bootloader`,
                    'recovery': `adb -s ${deviceId} reboot recovery`,
                    'fastboot': `adb -s ${deviceId} reboot bootloader`,
                    'download': `adb -s ${deviceId} reboot download`,
                    'edl': `adb -s ${deviceId} reboot edl`
                };
                await execAsync(modes[mode] || modes.system);
            }
        }
    }

    async executeADBCommand(deviceId, command) {
        try {
            const { stdout, stderr } = await execAsync(`adb -s ${deviceId} ${command}`, { timeout: 30000 });
            return { success: true, output: stdout, error: stderr };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async executeFastbootCommand(deviceId, command) {
        try {
            const { stdout, stderr } = await execAsync(`fastboot -s ${deviceId} ${command}`, { timeout: 30000 });
            return { success: true, output: stdout, error: stderr };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    cleanup() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }
}

module.exports = DeviceManager;
