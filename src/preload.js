const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: (channel, ...args) => {
        const allowedChannels = [
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
            'terminal-execute-command'
        ];
        if (allowedChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, ...args);
        }
        return Promise.reject(new Error(`Channel not allowed: ${channel}`));
    },
    send: (channel, ...args) => {
        const allowedChannels = ['log-message'];
        if (allowedChannels.includes(channel)) {
            ipcRenderer.send(channel, ...args);
        }
    }
});
