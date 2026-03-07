const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const DeviceManager = require('./modules/DeviceManager');
const AndroidTools = require('./modules/AndroidTools');
const iOSTools = require('./modules/iOSTools');
const MDMBypass = require('./modules/MDMBypass');
const CarrierUnlock = require('./modules/CarrierUnlock');
const DriverManager = require('./modules/DriverManager');

let mainWindow;
let deviceManager;
let androidTools;
let iosTools;
let mdmBypass;
let carrierUnlock;
let driverManager;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    title: 'AspvServicces - Professional Device Service Tool',
    icon: path.join(__dirname, '../assets/icon.png'),
    backgroundColor: '#0a0e27',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    frame: true,
    autoHideMenuBar: true,
    resizable: true
  });

  mainWindow.loadFile(path.join(__dirname, 'ui/index.html'));

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

function setupIpcHandlers() {
  // Device Detection
  ipcMain.handle('detect-devices', async () => {
    return await deviceManager.detectDevices();
  });

  ipcMain.handle('get-device-info', async (event, deviceId) => {
    return await deviceManager.getDeviceInfo(deviceId);
  });

  // Android Tools
  ipcMain.handle('android-remove-frp', async (event, deviceId, method) => {
    return await androidTools.removeFRP(deviceId, method);
  });

  ipcMain.handle('android-remove-screen-lock', async (event, deviceId) => {
    return await androidTools.removeScreenLock(deviceId);
  });

  ipcMain.handle('android-flash-firmware', async (event, deviceId, firmwarePath) => {
    return await androidTools.flashFirmware(deviceId, firmwarePath);
  });

  ipcMain.handle('android-remove-mdm', async (event, deviceId, mdmType) => {
    return await androidTools.removeMDM(deviceId, mdmType);
  });

  ipcMain.handle('android-repair-imei', async (event, deviceId, imei) => {
    return await androidTools.repairIMEI(deviceId, imei);
  });

  ipcMain.handle('android-bypass-mi-account', async (event, deviceId) => {
    return await androidTools.bypassMiAccount(deviceId);
  });

  ipcMain.handle('android-unlock-bootloader', async (event, deviceId) => {
    return await androidTools.unlockBootloader(deviceId);
  });

  ipcMain.handle('android-advanced-repair', async (event, deviceId, operation) => {
    return await androidTools.advancedRepair(deviceId, operation);
  });

  // iOS Tools
  ipcMain.handle('ios-check-icloud', async (event, deviceId) => {
    return await iosTools.checkiCloudStatus(deviceId);
  });

  ipcMain.handle('ios-bypass-icloud', async (event, deviceId, method) => {
    return await iosTools.bypassiCloud(deviceId, method);
  });

  ipcMain.handle('ios-activate-device', async (event, deviceId) => {
    return await iosTools.activateDevice(deviceId);
  });

  ipcMain.handle('ios-jailbreak', async (event, deviceId) => {
    return await iosTools.jailbreakDevice(deviceId);
  });

  // MDM Bypass
  ipcMain.handle('mdm-generate-qr', async (event, deviceType, carrier) => {
    return await mdmBypass.generateQRCode(deviceType, carrier);
  });

  ipcMain.handle('mdm-bypass-knox', async (event, deviceId) => {
    return await mdmBypass.bypassKnox(deviceId);
  });

  ipcMain.handle('mdm-remove-company-app', async (event, deviceId, appPackage) => {
    return await mdmBypass.removeCompanyApp(deviceId, appPackage);
  });

  // Carrier Unlock
  ipcMain.handle('carrier-unlock-telcel', async (event, deviceId, imei) => {
    return await carrierUnlock.unlockTelcel(deviceId, imei);
  });

  ipcMain.handle('carrier-unlock-att', async (event, deviceId, imei) => {
    return await carrierUnlock.unlockATT(deviceId, imei);
  });

  ipcMain.handle('carrier-unlock-payjoy', async (event, deviceId) => {
    return await carrierUnlock.unlockPayjoy(deviceId);
  });

  // Driver Management
  ipcMain.handle('driver-install', async (event, driverType) => {
    return await driverManager.installDriver(driverType);
  });

  ipcMain.handle('driver-check-status', async () => {
    return await driverManager.checkDriverStatus();
  });

  // File dialogs
  ipcMain.handle('select-firmware-file', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Firmware Files', extensions: ['zip', 'tar', 'md5', 'bin', 'img'] }
      ]
    });
    return result.filePaths[0];
  });

  // Logging
  ipcMain.on('log-message', (event, level, message) => {
    console.log(`[${level.toUpperCase()}] ${message}`);
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
