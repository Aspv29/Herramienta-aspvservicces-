const { execFile } = require('child_process');
const { promisify } = require('util');
const QRCode = require('qrcode');

const execFileAsync = promisify(execFile);

class MDMBypass {
    constructor() {}

    async generateQRCode(deviceType, carrier) {
        try {
            const enrollmentUrl = `https://mdm.aspvservicces.local/enroll?type=${encodeURIComponent(deviceType)}&carrier=${encodeURIComponent(carrier)}`;
            const qrDataUrl = await QRCode.toDataURL(enrollmentUrl);
            return { success: true, qrCode: qrDataUrl, url: enrollmentUrl };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async bypassKnox(deviceId) {
        try {
            const packages = [
                'com.samsung.android.knox.containercore',
                'com.samsung.android.knox.attestation'
            ];
            for (const pkg of packages) {
                await execFileAsync('adb', ['-s', deviceId, 'shell', 'pm', 'disable-user', '--user', '0', pkg]);
            }
            return { success: true, message: 'Knox MDM desactivado correctamente' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async removeCompanyApp(deviceId, appPackage) {
        try {
            await execFileAsync('adb', ['-s', deviceId, 'shell', 'pm', 'uninstall', '--user', '0', appPackage]);
            return { success: true, message: `Aplicación ${appPackage} eliminada correctamente` };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = MDMBypass;
