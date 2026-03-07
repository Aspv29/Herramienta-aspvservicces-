const { contextBridge, ipcRenderer } = require('electron');

const ALLOWED_CHANNELS = new Set([
    'detect-devices',
    'get-device-info',
    'android-remove-frp',
    'android-remove-screen-lock',
    'android-flash-firmware',
    'android-remove-mdm',
    'android-repair-imei',
    'android-bypass-mi-account',
    'android-unlock-bootloader',
    'android-advanced-repair',
    'ios-check-icloud',
    'ios-bypass-icloud',
    'ios-activate-device',
    'ios-jailbreak',
    'mdm-generate-qr',
    'mdm-bypass-knox',
    'mdm-remove-company-app',
    'carrier-unlock-telcel',
    'carrier-unlock-att',
    'carrier-unlock-payjoy',
    'driver-install',
    'driver-check-status',
    'select-firmware-file',
    'terminal-execute-command',
    'log-message'
]);

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (channel, ...args) => {
        if (!ALLOWED_CHANNELS.has(channel)) {
            return Promise.reject(new Error(`IPC channel not allowed: ${channel}`));
        }
        return ipcRenderer.invoke(channel, ...args);
    }
});
