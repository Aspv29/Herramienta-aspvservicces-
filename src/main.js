const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const DeviceManager = require('./modules/DeviceManager');
const AndroidTools = require('./modules/AndroidTools');
const iOSTools = require('./modules/iOSTools');
const MDMBypass = require('./modules/MDMBypass');
const CarrierUnlock = require('./modules/CarrierUnlock');
const DriverManager = require('./modules/DriverManager');

const execAsync = promisify(exec);

let mainWindow;
let deviceManager;
let androidTools;
let iosTools;
let mdmBypass;
let carrierUnlock;
let driverManager;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1440,
        height: 920,
        minWidth: 1100,
        minHeight: 750,
        title: 'AspvServices v2.0 - Professional Device Service Tool',
        icon: path.join(__dirname, '../assets/icon.png'),
        backgroundColor: '#080b1a',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: false,
            sandbox: false
        },
        frame: true,
        autoHideMenuBar: true,
        resizable: true,
        show: false
    });

    mainWindow.loadFile(path.join(__dirname, 'ui/index.html'));

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function initializeModules() {
    deviceManager = new DeviceManager();
    androidTools = new AndroidTools();
    iosTools = new iOSTools();
    mdmBypass = new MDMBypass();
    carrierUnlock = new CarrierUnlock();
    driverManager = new DriverManager();

    setupIpcHandlers();
}

function sendLog(level, message) {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('log-message', { level, message });
    }
}

function setupIpcHandlers() {
    // System
    ipcMain.handle('get-app-version', () => {
        return app.getVersion();
    });

    ipcMain.handle('open-external', async (event, url) => {
        await shell.openExternal(url);
        return { success: true };
    });

    // Device Detection
    ipcMain.handle('detect-devices', async () => {
        try {
            return await deviceManager.detectDevices();
        } catch (error) {
            return [];
        }
    });

    ipcMain.handle('get-device-info', async (event, deviceId) => {
        try {
            return await deviceManager.getDeviceInfo(deviceId);
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    // Android Tools
    ipcMain.handle('android-remove-frp', async (event, deviceId, method) => {
        sendLog('info', `Iniciando FRP Bypass - Metodo: ${method}`);
        return await androidTools.removeFRP(deviceId, method);
    });

    ipcMain.handle('android-remove-screen-lock', async (event, deviceId) => {
        sendLog('info', 'Iniciando eliminacion de bloqueo de pantalla');
        return await androidTools.removeScreenLock(deviceId);
    });

    ipcMain.handle('android-flash-firmware', async (event, deviceId, firmwarePath) => {
        sendLog('info', `Flash firmware: ${firmwarePath}`);
        return await androidTools.flashFirmware(deviceId, firmwarePath);
    });

    ipcMain.handle('android-remove-mdm', async (event, deviceId, mdmType) => {
        sendLog('info', `Eliminando MDM: ${mdmType}`);
        return await androidTools.removeMDM(deviceId, mdmType);
    });

    ipcMain.handle('android-repair-imei', async (event, deviceId, imei) => {
        sendLog('warning', 'Iniciando reparacion de IMEI');
        return await androidTools.repairIMEI(deviceId, imei);
    });

    ipcMain.handle('android-bypass-mi-account', async (event, deviceId) => {
        sendLog('info', 'Bypass Mi Account iniciado');
        return await androidTools.bypassMiAccount(deviceId);
    });

    ipcMain.handle('android-unlock-bootloader', async (event, deviceId) => {
        sendLog('warning', 'Desbloqueando bootloader');
        return await androidTools.unlockBootloader(deviceId);
    });

    ipcMain.handle('android-lock-bootloader', async (event, deviceId) => {
        sendLog('warning', 'Bloqueando bootloader');
        try {
            await execAsync(`fastboot -s ${deviceId} flashing lock`);
            return { success: true, message: 'Bootloader lock command sent' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('android-advanced-repair', async (event, deviceId, operation) => {
        sendLog('info', `Reparacion avanzada: ${operation}`);
        return await androidTools.advancedRepair(deviceId, operation);
    });

    // iOS Tools
    ipcMain.handle('ios-check-icloud', async (event, deviceId) => {
        return await iosTools.checkiCloudStatus(deviceId);
    });

    ipcMain.handle('ios-bypass-icloud', async (event, deviceId, method) => {
        sendLog('info', `iCloud Bypass - Metodo: ${method}`);
        return await iosTools.bypassiCloud(deviceId, method);
    });

    ipcMain.handle('ios-activate-device', async (event, deviceId) => {
        return await iosTools.activateDevice(deviceId);
    });

    ipcMain.handle('ios-jailbreak', async (event, deviceId) => {
        return await iosTools.jailbreakDevice(deviceId);
    });

    ipcMain.handle('ios-remove-passcode', async (event, deviceId) => {
        return await iosTools.removePasscode(deviceId);
    });

    ipcMain.handle('ios-backup', async (event, deviceId) => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory'],
            title: 'Seleccionar carpeta de backup'
        });
        if (result.canceled) return { success: false, error: 'Cancelled' };
        return await iosTools.backupDevice(deviceId, result.filePaths[0]);
    });

    ipcMain.handle('ios-restore', async (event, deviceId, backupPath) => {
        return await iosTools.restoreDevice(deviceId, backupPath);
    });

    // MDM Bypass
    ipcMain.handle('mdm-generate-qr', async (event, deviceType, carrier) => {
        sendLog('info', `Generando QR para ${deviceType} - ${carrier}`);
        return await mdmBypass.generateQRCode(deviceType, carrier);
    });

    ipcMain.handle('mdm-bypass-knox', async (event, deviceId) => {
        sendLog('warning', 'Iniciando Knox bypass');
        return await mdmBypass.bypassKnox(deviceId);
    });

    ipcMain.handle('mdm-remove-company-app', async (event, deviceId, appPackage) => {
        sendLog('info', `Removiendo app: ${appPackage}`);
        return await mdmBypass.removeCompanyApp(deviceId, appPackage);
    });

    // Carrier Unlock
    ipcMain.handle('carrier-unlock-telcel', async (event, deviceId, imei) => {
        sendLog('info', `Desbloqueando Telcel - IMEI: ${imei}`);
        return await carrierUnlock.unlockTelcel(deviceId, imei);
    });

    ipcMain.handle('carrier-unlock-att', async (event, deviceId, imei) => {
        sendLog('info', `Desbloqueando AT&T - IMEI: ${imei}`);
        return await carrierUnlock.unlockATT(deviceId, imei);
    });

    ipcMain.handle('carrier-unlock-payjoy', async (event, deviceId) => {
        sendLog('info', 'Desbloqueando Payjoy');
        return await carrierUnlock.unlockPayjoy(deviceId);
    });

    // Driver Management
    ipcMain.handle('driver-install', async (event, driverType) => {
        sendLog('info', `Instalando driver: ${driverType}`);
        return await driverManager.installDriver(driverType);
    });

    ipcMain.handle('driver-check-status', async () => {
        return await driverManager.checkDriverStatus();
    });

    // Terminal
    ipcMain.handle('terminal-execute-command', async (event, command) => {
        sendLog('info', `Terminal: ${command}`);
        try {
            const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
            return { success: true, output: stdout || stderr || 'Comando ejecutado', error: stderr };
        } catch (error) {
            return { success: false, output: error.message, error: error.message };
        }
    });

    // File dialogs
    ipcMain.handle('select-firmware-file', async () => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: [
                { name: 'Firmware Files', extensions: ['zip', 'tar', 'md5', 'bin', 'img', 'ozip', 'kdz', 'pac'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        });
        if (result.canceled) return null;
        return result.filePaths[0];
    });

    ipcMain.handle('select-file', async (event, filters) => {
        const result = await dialog.showOpenDialog(mainWindow, {
            properties: ['openFile'],
            filters: filters || [{ name: 'All Files', extensions: ['*'] }]
        });
        if (result.canceled) return null;
        return result.filePaths[0];
    });
}

app.whenReady().then(() => {
    createWindow();
    initializeModules();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    if (deviceManager) {
        deviceManager.cleanup();
    }
});
