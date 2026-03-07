const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aspvAPI', {
    // Device Detection
    detectDevices: () => ipcRenderer.invoke('detect-devices'),
    getDeviceInfo: (deviceId) => ipcRenderer.invoke('get-device-info', deviceId),

    // Android Tools
    androidRemoveFRP: (deviceId, method) => ipcRenderer.invoke('android-remove-frp', deviceId, method),
    androidRemoveScreenLock: (deviceId) => ipcRenderer.invoke('android-remove-screen-lock', deviceId),
    androidFlashFirmware: (deviceId, firmwarePath) => ipcRenderer.invoke('android-flash-firmware', deviceId, firmwarePath),
    androidRemoveMDM: (deviceId, mdmType) => ipcRenderer.invoke('android-remove-mdm', deviceId, mdmType),
    androidRepairIMEI: (deviceId, imei) => ipcRenderer.invoke('android-repair-imei', deviceId, imei),
    androidBypassMiAccount: (deviceId) => ipcRenderer.invoke('android-bypass-mi-account', deviceId),
    androidUnlockBootloader: (deviceId) => ipcRenderer.invoke('android-unlock-bootloader', deviceId),
    androidLockBootloader: (deviceId) => ipcRenderer.invoke('android-lock-bootloader', deviceId),
    androidAdvancedRepair: (deviceId, operation) => ipcRenderer.invoke('android-advanced-repair', deviceId, operation),

    // iOS Tools
    iosCheckiCloud: (deviceId) => ipcRenderer.invoke('ios-check-icloud', deviceId),
    iosBypassiCloud: (deviceId, method) => ipcRenderer.invoke('ios-bypass-icloud', deviceId, method),
    iosActivateDevice: (deviceId) => ipcRenderer.invoke('ios-activate-device', deviceId),
    iosJailbreak: (deviceId) => ipcRenderer.invoke('ios-jailbreak', deviceId),
    iosRemovePasscode: (deviceId) => ipcRenderer.invoke('ios-remove-passcode', deviceId),
    iosBackup: (deviceId) => ipcRenderer.invoke('ios-backup', deviceId),
    iosRestore: (deviceId, backupPath) => ipcRenderer.invoke('ios-restore', deviceId, backupPath),

    // MDM Bypass
    mdmGenerateQR: (deviceType, carrier) => ipcRenderer.invoke('mdm-generate-qr', deviceType, carrier),
    mdmBypassKnox: (deviceId) => ipcRenderer.invoke('mdm-bypass-knox', deviceId),
    mdmRemoveCompanyApp: (deviceId, appPackage) => ipcRenderer.invoke('mdm-remove-company-app', deviceId, appPackage),

    // Carrier Unlock
    carrierUnlockTelcel: (deviceId, imei) => ipcRenderer.invoke('carrier-unlock-telcel', deviceId, imei),
    carrierUnlockATT: (deviceId, imei) => ipcRenderer.invoke('carrier-unlock-att', deviceId, imei),
    carrierUnlockPayjoy: (deviceId) => ipcRenderer.invoke('carrier-unlock-payjoy', deviceId),

    // Driver Management
    driverInstall: (driverType) => ipcRenderer.invoke('driver-install', driverType),
    driverCheckStatus: () => ipcRenderer.invoke('driver-check-status'),

    // Terminal
    terminalExecute: (command) => ipcRenderer.invoke('terminal-execute-command', command),

    // File dialogs
    selectFirmwareFile: () => ipcRenderer.invoke('select-firmware-file'),
    selectFile: (filters) => ipcRenderer.invoke('select-file', filters),

    // System
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    openExternal: (url) => ipcRenderer.invoke('open-external', url),

    // Event listeners
    onDeviceConnected: (callback) => {
        ipcRenderer.on('device-connected', (event, device) => callback(device));
    },
    onDeviceDisconnected: (callback) => {
        ipcRenderer.on('device-disconnected', (event, deviceId) => callback(deviceId));
    },
    onProgress: (callback) => {
        ipcRenderer.on('operation-progress', (event, data) => callback(data));
    },
    onLog: (callback) => {
        ipcRenderer.on('log-message', (event, data) => callback(data));
    }
});
