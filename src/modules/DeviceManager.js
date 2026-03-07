const adb = require('adbkit');
const usb = require('usb-detection');
const { exec, execFile } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

// Valid ADB/Fastboot device ID: serial numbers, IP:port, or emulator identifiers.
const DEVICE_ID_RE = /^[a-zA-Z0-9._:\-]+$/;

function validateDeviceId(deviceId) {
    if (!deviceId || !DEVICE_ID_RE.test(deviceId)) {
        throw new Error(`Invalid device ID: ${deviceId}`);
    }
}

class DeviceManager {
    constructor() {
        this.adbClient = adb.createClient();
        this.devices = new Map();
        this.initializeUSBDetection();
    }

    initializeUSBDetection() {
        usb.startMonitoring();

        usb.on('add', (device) => {
            console.log('Device connected:', device);
            this.detectDevices();
        });

        usb.on('remove', (device) => {
            console.log('Device disconnected:', device);
            this.detectDevices();
        });
    }

    async detectDevices() {
        const detectedDevices = [];

        try {
            // Detect Android devices via ADB
            const adbDevices = await this.detectAndroidDevices();
            detectedDevices.push(...adbDevices);

            // Detect iOS devices
            const iosDevices = await this.detectiOSDevices();
            detectedDevices.push(...iosDevices);

            // Detect devices in Fastboot mode
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
            const devices = await this.adbClient.listDevices();
            const androidDevices = [];

            for (const device of devices) {
                try {
                    const properties = await this.getAndroidProperties(device.id);
                    androidDevices.push({
                        id: device.id,
                        type: 'android',
                        state: device.type,
                        brand: properties['ro.product.brand'] || 'Unknown',
                        model: properties['ro.product.model'] || 'Unknown',
                        manufacturer: properties['ro.product.manufacturer'] || 'Unknown',
                        androidVersion: properties['ro.build.version.release'] || 'Unknown',
                        sdk: properties['ro.build.version.sdk'] || 'Unknown',
                        chipset: this.detectChipset(properties),
                        serialNumber: properties['ro.serialno'] || device.id,
                        imei: await this.getIMEI(device.id),
                        bootloader: properties['ro.bootloader'] || 'Unknown',
                        securityPatch: properties['ro.build.version.security_patch'] || 'Unknown'
                    });
                } catch (error) {
                    console.error(`Error getting properties for ${device.id}:`, error);
                }
            }

            return androidDevices;
        } catch (error) {
            console.error('Error detecting Android devices:', error);
            return [];
        }
    }

    async getAndroidProperties(deviceId) {
        try {
            const properties = {};
            const output = await this.adbClient.shell(deviceId, 'getprop');
            const lines = output.toString().split('\n');

            lines.forEach(line => {
                const match = line.match(/\[(.*?)\]: \[(.*?)\]/);
                if (match) {
                    properties[match[1]] = match[2];
                }
            });

            return properties;
        } catch (error) {
            console.error('Error getting Android properties:', error);
            return {};
        }
    }

    async getIMEI(deviceId) {
        try {
            const output = await this.adbClient.shell(deviceId, 'service call iphonesubinfo 1');
            const imei = output.toString().match(/\d+/g)?.join('').substring(0, 15);
            return imei || 'Unknown';
        } catch (error) {
            return 'Unknown';
        }
    }

    detectChipset(properties) {
        const hardware = properties['ro.hardware'] || '';
        const platform = properties['ro.board.platform'] || '';
        const soc = properties['ro.soc.model'] || '';

        if (hardware.includes('qcom') || platform.includes('msm') || platform.includes('sdm')) {
            return 'Qualcomm';
        } else if (hardware.includes('mt') || platform.includes('mt')) {
            return 'MediaTek';
        } else if (hardware.includes('kirin') || platform.includes('hi')) {
            return 'HiSilicon Kirin';
        } else if (hardware.includes('exynos')) {
            return 'Samsung Exynos';
        } else if (platform.includes('unisoc') || platform.includes('sc')) {
            return 'UNISOC';
        }

        return 'Unknown';
    }

    async detectiOSDevices() {
        try {
            const { stdout } = await execAsync('idevice_id -l');
            const deviceIds = stdout.trim().split('\n').filter(id => id);

            const iosDevices = [];
            for (const deviceId of deviceIds) {
                try {
                    const { stdout: infoOutput } = await execAsync(`ideviceinfo -u ${deviceId}`);
                    const info = this.parseiOSInfo(infoOutput);

                    iosDevices.push({
                        id: deviceId,
                        type: 'ios',
                        state: 'device',
                        brand: 'Apple',
                        model: info.ProductType || 'Unknown',
                        manufacturer: 'Apple',
                        iosVersion: info.ProductVersion || 'Unknown',
                        serialNumber: info.SerialNumber || 'Unknown',
                        deviceName: info.DeviceName || 'Unknown',
                        uniqueDeviceID: info.UniqueDeviceID || deviceId
                    });
                } catch (error) {
                    console.error(`Error getting info for iOS device ${deviceId}:`, error);
                }
            }

            return iosDevices;
        } catch (error) {
            // idevice tools not installed or no iOS devices
            return [];
        }
    }

    parseiOSInfo(output) {
        const info = {};
        const lines = output.split('\n');

        lines.forEach(line => {
            const match = line.match(/^(.*?):\s*(.*)$/);
            if (match) {
                info[match[1].trim()] = match[2].trim();
            }
        });

        return info;
    }

    async detectFastbootDevices() {
        try {
            const { stdout } = await execAsync('fastboot devices');
            const lines = stdout.trim().split('\n').filter(line => line);

            return lines.map((line, index) => {
                const [deviceId] = line.split('\t');
                return {
                    id: deviceId,
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
        return this.devices.get(deviceId);
    }

    async rebootDevice(deviceId, mode = 'system') {
        validateDeviceId(deviceId);
        const device = this.devices.get(deviceId);
        if (!device) throw new Error('Device not found');

        if (device.type === 'android') {
            const modes = {
                'system': 'reboot',
                'bootloader': 'reboot bootloader',
                'recovery': 'reboot recovery',
                'fastboot': 'reboot bootloader',
                'download': 'reboot download'
            };

            await execAsync(`adb -s ${deviceId} ${modes[mode] || modes.system}`);
        }
    }

    async executeADBCommand(deviceId, command) {
        try {
            validateDeviceId(deviceId);
            // Note: command is split on whitespace; quoted arguments are not supported.
            const args = ['-s', deviceId, ...command.trim().split(/\s+/)];
            const { stdout, stderr } = await execFileAsync('adb', args);
            return { success: true, output: stdout, error: stderr };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async executeFastbootCommand(deviceId, command) {
        try {
            validateDeviceId(deviceId);
            // Note: command is split on whitespace; quoted arguments are not supported.
            const args = ['-s', deviceId, ...command.trim().split(/\s+/)];
            const { stdout, stderr } = await execFileAsync('fastboot', args);
            return { success: true, output: stdout, error: stderr };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    cleanup() {
        usb.stopMonitoring();
        if (this.adbClient) {
            this.adbClient.kill();
        }
    }
}

module.exports = DeviceManager;
