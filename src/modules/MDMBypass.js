const { exec } = require('child_process');
const { promisify } = require('util');
const QRCode = require('qrcode');

const execAsync = promisify(exec);

function validateDeviceId(deviceId) {
    if (!deviceId || !/^[a-zA-Z0-9._:-]+$/.test(deviceId) || deviceId.length > 64) {
        throw new Error('Invalid device ID');
    }
}

function validatePackageName(packageName) {
    if (!packageName || !/^[a-zA-Z0-9._-]+$/.test(packageName) || packageName.length > 255) {
        throw new Error('Invalid package name');
    }
}

class MDMBypass {
    async generateQRCode(deviceType, carrier) {
        try {
            const enrollmentUrl = `https://enroll.example.com/${deviceType}/${carrier}`;
            const qrDataUrl = await QRCode.toDataURL(enrollmentUrl);
            return { success: true, qrCode: qrDataUrl, url: enrollmentUrl };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async bypassKnox(deviceId) {
        try {
            validateDeviceId(deviceId);
            const knoxPackages = [
                'com.samsung.android.knox.containeragent',
                'com.samsung.android.mdm'
            ];

            for (const pkg of knoxPackages) {
                try {
                    await execAsync(`adb -s ${deviceId} shell pm disable-user --user 0 ${pkg}`);
                } catch (err) {
                    console.error(`Knox bypass command failed for ${pkg}`, err);
                }
            }

            return { success: true, message: 'Knox bypass attempted' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async removeCompanyApp(deviceId, appPackage) {
        try {
            validateDeviceId(deviceId);
            validatePackageName(appPackage);
            await execAsync(`adb -s ${deviceId} shell pm uninstall --user 0 ${appPackage}`);
            return { success: true, message: `App ${appPackage} removal attempted` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = MDMBypass;
