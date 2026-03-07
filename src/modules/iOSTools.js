const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');

const execAsync = promisify(exec);

class iOSTools {
    constructor() {
        this.toolsPath = path.join(__dirname, '../../tools/ios');
    }

    async checkiCloudStatus(deviceId) {
        console.log(`Checking iCloud status for device ${deviceId}`);

        try {
            const { stdout } = await execAsync(`ideviceinfo -u ${deviceId} -k ActivationState`);
            const activationState = stdout.trim();

            const { stdout: lockdownInfo } = await execAsync(`ideviceinfo -u ${deviceId}`);
            const hasAccount = lockdownInfo.includes('AppleAccount');

            return {
                success: true,
                activationState: activationState,
                iCloudLocked: hasAccount,
                message: `Device is ${activationState}`
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async bypassiCloud(deviceId, method) {
        console.log(`Bypassing iCloud on device ${deviceId} using method: ${method}`);

        const methods = {
            'checkra1n': async () => await this.bypassViaCheckra1n(deviceId),
            'f3arRa1n': async () => await this.bypassViaF3arRa1n(deviceId),
            'sliver': async () => await this.bypassViaSliver(deviceId),
            'signal': async () => await this.bypassViaSignal(deviceId),
            'mina': async () => await this.bypassViaMina(deviceId)
        };

        try {
            if (methods[method]) {
                return await methods[method]();
            } else {
                return await this.genericBypass(deviceId);
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async bypassViaCheckra1n(deviceId) {
        return {
            success: true,
            message: 'checkra1n bypass method',
            instructions: [
                '1. Put device in DFU mode',
                '2. Run checkra1n jailbreak',
                '3. Install checkra1n loader',
                '4. Run iCloud bypass script',
                '5. Device will bypass to home screen',
                'Note: Cellular and iCloud features will be limited'
            ]
        };
    }

    async bypassViaF3arRa1n(deviceId) {
        return {
            success: true,
            message: 'F3arRa1n bypass method (Linux required)',
            instructions: [
                '1. Boot device into DFU mode',
                '2. Run F3arRa1n tool on Linux',
                '3. Select bypass option',
                '4. Wait for process completion',
                '5. Device will reboot bypassed'
            ]
        };
    }

    async bypassViaSliver(deviceId) {
        return {
            success: true,
            message: 'Sliver macOS bypass tool',
            instructions: [
                '1. Connect device in recovery mode',
                '2. Launch Sliver application',
                '3. Follow on-screen instructions',
                '4. Jailbreak will be applied',
                '5. iCloud bypass activated'
            ]
        };
    }

    async bypassViaSignal(deviceId) {
        return {
            success: true,
            message: 'Signal iCloud bypass',
            instructions: [
                '1. Device must be jailbroken',
                '2. Install Signal bypass tool',
                '3. Run activation script',
                '4. Modify activation files',
                '5. Respring device'
            ]
        };
    }

    async bypassViaMina(deviceId) {
        return {
            success: true,
            message: 'Mina iCloud bypass',
            instructions: [
                '1. Jailbreak required first',
                '2. Install Mina cracker',
                '3. Apply iCloud bypass',
                '4. Patch activation',
                '5. Reboot device'
            ]
        };
    }

    async genericBypass(deviceId) {
        return {
            success: true,
            message: 'Generic iCloud bypass procedure',
            instructions: [
                '1. Determine iOS version',
                '2. Check if jailbreak available',
                '3. Apply appropriate bypass tool',
                '4. Modify activation files',
                '5. Limited functionality after bypass'
            ],
            warning: 'iCloud bypass results in limited device functionality'
        };
    }

    async activateDevice(deviceId) {
        console.log(`Activating iOS device ${deviceId}`);

        try {
            const { stdout } = await execAsync(`ideviceactivation activate -u ${deviceId}`);

            return {
                success: true,
                message: 'Device activation attempted',
                output: stdout
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                note: 'Activation may require valid Apple account'
            };
        }
    }

    async jailbreakDevice(deviceId) {
        console.log(`Jailbreaking device ${deviceId}`);

        try {
            // Get iOS version first
            const { stdout: versionOutput } = await execAsync(`ideviceinfo -u ${deviceId} -k ProductVersion`);
            const iosVersion = versionOutput.trim();

            const jailbreakTools = this.getJailbreakToolForVersion(iosVersion);

            return {
                success: true,
                iosVersion: iosVersion,
                recommendedTools: jailbreakTools,
                message: 'Jailbreak recommendations provided',
                instructions: [
                    '1. Backup device data',
                    '2. Use recommended jailbreak tool',
                    '3. Follow tool-specific instructions',
                    '4. Install Cydia/Sileo after jailbreak',
                    '5. Avoid OTA updates'
                ]
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    getJailbreakToolForVersion(version) {
        const major = parseInt(version.split('.')[0]);
        const minor = parseInt(version.split('.')[1]);

        const tools = [];

        // iOS 12-14
        if (major >= 12 && major <= 14) {
            tools.push({
                name: 'checkra1n',
                versions: 'iOS 12.0 - 14.8.1',
                type: 'Semi-tethered',
                devices: 'iPhone 5s - iPhone X'
            });
            tools.push({
                name: 'unc0ver',
                versions: 'iOS 11.0 - 14.8',
                type: 'Semi-untethered',
                devices: 'All devices'
            });
        }

        // iOS 14-15
        if (major >= 14 && major <= 15) {
            tools.push({
                name: 'Taurine',
                versions: 'iOS 14.0 - 14.8.1',
                type: 'Semi-untethered',
                devices: 'All devices'
            });
            tools.push({
                name: 'Odyssey',
                versions: 'iOS 13.0 - 13.7',
                type: 'Semi-untethered',
                devices: 'All devices'
            });
        }

        // iOS 15+
        if (major >= 15) {
            tools.push({
                name: 'palera1n',
                versions: 'iOS 15.0 - 16.5',
                type: 'Semi-tethered',
                devices: 'A11 and below'
            });
            tools.push({
                name: 'Dopamine',
                versions: 'iOS 15.0 - 15.4.1',
                type: 'Semi-untethered',
                devices: 'A12+'
            });
        }

        return tools.length > 0 ? tools : [{
            name: 'No jailbreak available',
            versions: version,
            type: 'N/A',
            devices: 'Update pending'
        }];
    }

    async removePasscode(deviceId) {
        console.log(`Removing passcode from device ${deviceId}`);

        return {
            success: true,
            message: 'Passcode removal methods',
            methods: [
                {
                    name: 'iTunes Restore',
                    description: 'Factory reset via iTunes (data loss)',
                    steps: ['Connect to iTunes', 'Enter recovery mode', 'Restore device']
                },
                {
                    name: 'Find My (iCloud)',
                    description: 'Remote erase via iCloud',
                    steps: ['Login to iCloud.com', 'Find My iPhone', 'Erase device']
                },
                {
                    name: 'Checkm8 Exploit',
                    description: 'Hardware exploit (A5-A11 chips)',
                    steps: ['Boot to DFU', 'Use checkra1n', 'Access filesystem', 'Remove passcode files']
                }
            ]
        };
    }

    async backupDevice(deviceId, backupPath) {
        console.log(`Backing up device ${deviceId} to ${backupPath}`);

        try {
            await execAsync(`idevicebackup2 backup -u ${deviceId} "${backupPath}"`);

            return {
                success: true,
                message: 'Backup completed',
                path: backupPath
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async restoreDevice(deviceId, backupPath) {
        console.log(`Restoring device ${deviceId} from ${backupPath}`);

        try {
            await execAsync(`idevicebackup2 restore -u ${deviceId} "${backupPath}"`);

            return {
                success: true,
                message: 'Restore completed',
                path: backupPath
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getDeviceFiles(deviceId, remotePath) {
        console.log(`Accessing files on device ${deviceId}`);

        try {
            const { stdout } = await execAsync(`ifuse --udid ${deviceId} /mnt/ios`);

            return {
                success: true,
                message: 'Device mounted',
                mountPoint: '/mnt/ios'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async installIPA(deviceId, ipaPath) {
        console.log(`Installing IPA on device ${deviceId}: ${ipaPath}`);

        try {
            await execAsync(`ideviceinstaller -u ${deviceId} -i "${ipaPath}"`);

            return {
                success: true,
                message: 'IPA installed successfully'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async uninstallApp(deviceId, bundleId) {
        console.log(`Uninstalling app ${bundleId} from device ${deviceId}`);

        try {
            await execAsync(`ideviceinstaller -u ${deviceId} -U ${bundleId}`);

            return {
                success: true,
                message: `App ${bundleId} uninstalled`
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = iOSTools;
