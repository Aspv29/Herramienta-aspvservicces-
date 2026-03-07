const adb = require('adbkit');
const usb = require('usb-detection');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

// Validates that a device ID contains only safe characters (alphanumeric, colon, dot, hyphen, underscore)
// ADB device IDs can be: serial numbers (alphanumeric), IP:port (e.g. 192.168.1.1:5555),
// emulator names (emulator-5554), and iOS UDIDs (hex strings with hyphens)
function validateDeviceId(deviceId) {
    if (!deviceId || typeof deviceId !== 'string') {
        throw new Error('Invalid device ID');
    }
    if (!/^[a-zA-Z0-9:.\-_]+$/.test(deviceId)) {
        throw new Error('Device ID contains invalid characters');
    }
}

// Validates a single command argument using an allowlist of safe characters
function validateArg(arg) {
    // Allow alphanumeric, hyphen, underscore, dot, slash, equals, and at-sign
    // These cover common adb/fastboot subcommands and their arguments
    if (!/^[a-zA-Z0-9\-_.\/=@]+$/.test(arg)) {
        throw new Error(`Command argument contains invalid characters: ${arg}`);
    }
}

// Splits a command string into an array of validated arguments
function splitCommand(command) {
    if (!command || typeof command !== 'string') {
        throw new Error('Invalid command');
    }
    const args = command.trim().split(/\s+/);
    for (const arg of args) {
        validateArg(arg);
    }
    return args;
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
            const { stdout } = await execFileAsync('idevice_id', ['-l']);
            const deviceIds = stdout.trim().split('\n').filter(id => id);

            const iosDevices = [];
            for (const deviceId of deviceIds) {
                try {
                    validateDeviceId(deviceId);
                    const { stdout: infoOutput } = await execFileAsync('ideviceinfo', ['-u', deviceId]);
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
            const { stdout } = await execFileAsync('fastboot', ['devices']);
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
        const device = this.devices.get(deviceId);
        if (!device) throw new Error('Device not found');

        if (device.type === 'android') {
            validateDeviceId(deviceId);
            const modeArgs = {
                'system': ['reboot'],
                'bootloader': ['reboot', 'bootloader'],
                'recovery': ['reboot', 'recovery'],
                'fastboot': ['reboot', 'bootloader'],
                'download': ['reboot', 'download']
            };

            const args = ['-s', deviceId, ...(modeArgs[mode] || modeArgs.system)];
            await execFileAsync('adb', args);
        }
    }

    async executeADBCommand(deviceId, command) {
        try {
            validateDeviceId(deviceId);
            const cmdArgs = splitCommand(command);
            const { stdout, stderr } = await execFileAsync('adb', ['-s', deviceId, ...cmdArgs]);
            return { success: true, output: stdout, error: stderr };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async executeFastbootCommand(deviceId, command) {
        try {
            validateDeviceId(deviceId);
            const cmdArgs = splitCommand(command);
            const { stdout, stderr } = await execFileAsync('fastboot', ['-s', deviceId, ...cmdArgs]);
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
