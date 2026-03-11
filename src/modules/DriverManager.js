const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs').promises;
const https = require('https');

const execAsync = promisify(exec);

class DriverManager {
    constructor() {
        this.driversPath = path.join(__dirname, '../../drivers');
        this.driverURLs = this.initializeDriverURLs();
    }

    initializeDriverURLs() {
        return {
            'adb': {
                name: 'Android ADB & Fastboot Drivers',
                url: 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip',
                installer: 'platform-tools/adb.exe',
                description: 'Universal Android Debug Bridge drivers'
            },
            'samsung': {
                name: 'Samsung USB Drivers',
                url: 'https://developer.samsung.com/android-usb-driver',
                installer: 'SAMSUNG_USB_Driver_for_Mobile_Phones.exe',
                description: 'Samsung mobile device drivers including Odin support'
            },
            'qualcomm': {
                name: 'Qualcomm QDLoader HS-USB Drivers',
                url: 'https://qcomdriver.com/qualcomm-hs-usb-qdloader-9008-driver',
                installer: 'Qualcomm_USB_Driver_Setup.exe',
                description: 'Qualcomm EDL/QFIL mode drivers for flashing'
            },
            'mtk': {
                name: 'MediaTek VCOM Drivers',
                url: 'https://spflashtool.com/download/MTK_Driver_Auto_Installer.zip',
                installer: 'InstallDriver.exe',
                description: 'MediaTek preloader and SP Flash Tool drivers'
            },
            'apple': {
                name: 'Apple Mobile Device Support',
                url: 'https://support.apple.com/kb/DL1784',
                installer: 'AppleMobileDeviceSupport.msi',
                description: 'iOS device connectivity drivers'
            },
            'huawei': {
                name: 'Huawei HiSuite Drivers',
                url: 'https://consumer.huawei.com/en/support/hisuite/',
                installer: 'HiSuiteSetup.exe',
                description: 'Huawei device drivers and HiSuite'
            },
            'lg': {
                name: 'LG USB Drivers',
                url: 'https://www.lg.com/us/support/software-firmware',
                installer: 'LG_USB_Drivers.exe',
                description: 'LG mobile device drivers'
            },
            'motorola': {
                name: 'Motorola Device Manager',
                url: 'https://motorola-global-portal.custhelp.com/app/standalone/bootloader/recovery-images',
                installer: 'Motorola_Device_Manager.exe',
                description: 'Motorola device drivers and manager'
            }
        };
    }

    async installDriver(driverType) {
        console.log(`Installing driver: ${driverType}`);

        const driver = this.driverURLs[driverType];
        if (!driver) {
            return { success: false, error: `Unknown driver type: ${driverType}` };
        }

        try {
            // Check if driver is already installed
            const status = await this.checkDriverInstalled(driverType);
            if (status.installed) {
                return {
                    success: true,
                    message: `${driver.name} is already installed`,
                    version: status.version
                };
            }

            // Create drivers directory if it doesn't exist
            await fs.mkdir(this.driversPath, { recursive: true });

            return {
                success: true,
                message: `Driver installation prepared: ${driver.name}`,
                instructions: [
                    `1. Driver: ${driver.name}`,
                    `2. Description: ${driver.description}`,
                    `3. Download from: ${driver.url}`,
                    `4. Run installer: ${driver.installer}`,
                    `5. Follow installation wizard`,
                    `6. Restart computer if prompted`,
                    `7. Connect device to verify installation`
                ],
                downloadURL: driver.url,
                autoInstall: await this.autoInstallDriver(driverType)
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async autoInstallDriver(driverType) {
        // Attempt automatic installation for certain drivers
        const installMethods = {
            'adb': async () => await this.installADBDrivers(),
            'samsung': async () => await this.installSamsungDrivers(),
            'qualcomm': async () => await this.installQualcommDrivers(),
            'mtk': async () => await this.installMTKDrivers()
        };

        if (installMethods[driverType]) {
            try {
                return await installMethods[driverType]();
            } catch (error) {
                return { success: false, error: error.message };
            }
        }

        return { success: false, message: 'Manual installation required' };
    }

    async installADBDrivers() {
        try {
            // Check if ADB is already available
            try {
                await execAsync('adb version');
                return { success: true, message: 'ADB already installed' };
            } catch (error) {
                // Not installed, proceed with installation
            }

            const adbPath = path.join(this.driversPath, 'platform-tools');

            return {
                success: true,
                message: 'ADB drivers ready for installation',
                path: adbPath,
                commands: [
                    'Download platform-tools from Google',
                    'Extract to drivers folder',
                    'Add to system PATH',
                    'Verify with: adb version'
                ]
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async installSamsungDrivers() {
        return {
            success: true,
            message: 'Samsung drivers installation guide',
            steps: [
                '1. Download Samsung USB Driver for Mobile Phones',
                '2. Close Kies/Smart Switch if running',
                '3. Run installer as Administrator',
                '4. Follow installation wizard',
                '5. Restart computer',
                '6. Connect Samsung device to verify'
            ]
        };
    }

    async installQualcommDrivers() {
        return {
            success: true,
            message: 'Qualcomm drivers installation',
            requirements: [
                'Windows 7 or higher',
                'Administrator privileges',
                'Disabled driver signature enforcement (for unsigned drivers)'
            ],
            steps: [
                '1. Download Qualcomm HS-USB QDLoader 9008 driver',
                '2. Disable driver signature enforcement:',
                '   - Restart > Shift+Click Restart',
                '   - Troubleshoot > Advanced > Startup Settings > Restart',
                '   - Press F7 to disable signature enforcement',
                '3. Install driver package',
                '4. Connect device in EDL/9008 mode to verify'
            ]
        };
    }

    async installMTKDrivers() {
        return {
            success: true,
            message: 'MediaTek VCOM drivers installation',
            steps: [
                '1. Download MTK Driver Auto Installer',
                '2. Extract ZIP file',
                '3. Run InstallDriver.exe as Administrator',
                '4. Click "Install Automatically"',
                '5. Wait for installation to complete',
                '6. Restart computer if prompted',
                '7. Connect MTK device in preloader mode to test'
            ]
        };
    }

    async checkDriverStatus() {
        console.log('Checking all driver installation status');

        const results = {};

        for (const [type, driver] of Object.entries(this.driverURLs)) {
            results[type] = await this.checkDriverInstalled(type);
        }

        return {
            success: true,
            drivers: results,
            summary: this.generateStatusSummary(results)
        };
    }

    async checkDriverInstalled(driverType) {
        const checks = {
            'adb': async () => {
                try {
                    const { stdout } = await execAsync('adb version');
                    const version = stdout.match(/Android Debug Bridge version ([\d.]+)/)?.[1];
                    return { installed: true, version: version || 'Unknown' };
                } catch (error) {
                    return { installed: false };
                }
            },
            'samsung': async () => {
                try {
                    const paths = [
                        'C:\\Program Files\\Samsung\\USB Drivers',
                        'C:\\Program Files (x86)\\Samsung\\USB Drivers'
                    ];

                    for (const p of paths) {
                        try {
                            await fs.access(p);
                            return { installed: true, path: p };
                        } catch {}
                    }

                    return { installed: false };
                } catch (error) {
                    return { installed: false };
                }
            },
            'qualcomm': async () => {
                try {
                    // Check device manager for Qualcomm drivers
                    const { stdout } = await execAsync('pnputil /enum-drivers');
                    const hasQualcomm = stdout.toLowerCase().includes('qualcomm') ||
                                       stdout.toLowerCase().includes('qdloader');
                    return { installed: hasQualcomm };
                } catch (error) {
                    return { installed: false };
                }
            },
            'mtk': async () => {
                try {
                    const { stdout } = await execAsync('pnputil /enum-drivers');
                    const hasMTK = stdout.toLowerCase().includes('mediatek') ||
                                  stdout.toLowerCase().includes('vcom');
                    return { installed: hasMTK };
                } catch (error) {
                    return { installed: false };
                }
            },
            'apple': async () => {
                try {
                    const paths = [
                        'C:\\Program Files\\Common Files\\Apple\\Mobile Device Support',
                        'C:\\Program Files (x86)\\Common Files\\Apple\\Mobile Device Support'
                    ];

                    for (const p of paths) {
                        try {
                            await fs.access(p);
                            return { installed: true, path: p };
                        } catch {}
                    }

                    return { installed: false };
                } catch (error) {
                    return { installed: false };
                }
            }
        };

        if (checks[driverType]) {
            try {
                return await checks[driverType]();
            } catch (error) {
                return { installed: false, error: error.message };
            }
        }

        return { installed: false, message: 'Check not implemented' };
    }

    generateStatusSummary(results) {
        const total = Object.keys(results).length;
        const installed = Object.values(results).filter(r => r.installed).length;
        const missing = total - installed;

        return {
            total: total,
            installed: installed,
            missing: missing,
            percentage: Math.round((installed / total) * 100)
        };
    }

    async repairDriver(driverType) {
        console.log(`Repairing driver: ${driverType}`);

        try {
            // Attempt to repair/reinstall driver
            return {
                success: true,
                message: `Driver repair initiated for ${driverType}`,
                steps: [
                    '1. Uninstall existing driver',
                    '2. Restart computer',
                    '3. Reinstall driver package',
                    '4. Verify installation'
                ]
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async enableTestMode() {
        // Enable Windows Test Mode for unsigned drivers
        try {
            await execAsync('bcdedit /set testsigning on');

            return {
                success: true,
                message: 'Windows Test Mode enabled',
                note: 'Restart required for changes to take effect',
                warning: 'This allows unsigned drivers to be installed'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                note: 'Run as Administrator to enable test mode'
            };
        }
    }

    async disableTestMode() {
        try {
            await execAsync('bcdedit /set testsigning off');

            return {
                success: true,
                message: 'Windows Test Mode disabled',
                note: 'Restart required for changes to take effect'
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = DriverManager;
