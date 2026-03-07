const ipcRenderer = window.electronAPI;

// State
let currentDevice = null;
let currentSection = 'android-frp';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeDeviceDetection();
    loadSection('android-frp');
    setupConsoleControls();
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const section = item.getAttribute('data-section');
            loadSection(section);
        });
    });
}

// Device Detection
function initializeDeviceDetection() {
    document.getElementById('refreshDevices').addEventListener('click', detectDevices);
    detectDevices();
    setInterval(detectDevices, 5000);
}

async function detectDevices() {
    try {
        const devices = await ipcRenderer.invoke('detect-devices');
        updateDeviceStatus(devices);
    } catch (error) {
        logToConsole('error', `Error detectando dispositivos: ${error.message}`);
    }
}

function updateDeviceStatus(devices) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('statusText');

    const previousDevice = currentDevice;
    const newDevice = (devices && devices.length > 0) ? devices[0] : null;
    const wasConnected = !!previousDevice;
    const isConnected = !!newDevice;

    if (isConnected) {
        statusDot.classList.add('connected');
        statusText.textContent = `${newDevice.brand} ${newDevice.model} conectado`;
    } else {
        statusDot.classList.remove('connected');
        statusText.textContent = 'Sin dispositivo conectado';
    }

    // Only log when connection state or device actually changes
    if (!wasConnected && isConnected) {
        // Device just connected
        logToConsole('success', `Dispositivo detectado: ${newDevice.brand} ${newDevice.model}`);
    } else if (wasConnected && !isConnected) {
        // Device just disconnected
        logToConsole('info', 'Dispositivo desconectado');
    } else if (wasConnected && isConnected) {
        // Device stayed connected but may have changed
        const sameBrand = previousDevice && previousDevice.brand === newDevice.brand;
        const sameModel = previousDevice && previousDevice.model === newDevice.model;
        if (!sameBrand || !sameModel) {
            logToConsole('success', `Nuevo dispositivo detectado: ${newDevice.brand} ${newDevice.model}`);
        }
    }

    currentDevice = newDevice;
}

// Section Loading
function loadSection(sectionName) {
    currentSection = sectionName;
    const container = document.getElementById('content-container');

    const sections = {
        'android-frp': createFRPSection,
        'android-screen': createScreenLockSection,
        'android-firmware': createFirmwareSection,
        'android-mdm': createMDMSection,
        'android-imei': createIMEISection,
        'android-xiaomi': createXiaomiSection,
        'android-bootloader': createBootloaderSection,
        'ios-icloud': createiCloudSection,
        'ios-activation': createActivationSection,
        'ios-jailbreak': createJailbreakSection,
        'carrier-telcel': createTelcelSection,
        'carrier-att': createATTSection,
        'carrier-payjoy': createPayjoySection,
        'drivers': createDriversSection,
        'mdm-qr': createQRSection,
        'terminal': createTerminalSection
    };

    const sectionCreator = sections[sectionName];
    if (sectionCreator) {
        container.innerHTML = sectionCreator();
        attachSectionHandlers(sectionName);
    }
}

// FRP Section
function createFRPSection() {
    return `
        <div class="section-header">
            <h2>🔓 FRP Bypass (Factory Reset Protection)</h2>
            <p>Elimina la protección FRP de dispositivos Android de múltiples marcas</p>
        </div>

        <div class="card">
            <div class="card-header">
                <span class="card-title">Seleccionar Marca del Dispositivo</span>
            </div>
            <div class="brand-grid">
                <div class="brand-card" data-brand="samsung">
                    <div class="brand-icon">📱</div>
                    <div class="brand-name">Samsung</div>
                </div>
                <div class="brand-card" data-brand="xiaomi">
                    <div class="brand-icon">📱</div>
                    <div class="brand-name">Xiaomi</div>
                </div>
                <div class="brand-card" data-brand="huawei">
                    <div class="brand-icon">📱</div>
                    <div class="brand-name">Huawei</div>
                </div>
                <div class="brand-card" data-brand="motorola">
                    <div class="brand-icon">📱</div>
                    <div class="brand-name">Motorola</div>
                </div>
                <div class="brand-card" data-brand="oppo">
                    <div class="brand-icon">📱</div>
                    <div class="brand-name">Oppo</div>
                </div>
                <div class="brand-card" data-brand="vivo">
                    <div class="brand-icon">📱</div>
                    <div class="brand-name">Vivo</div>
                </div>
                <div class="brand-card" data-brand="realme">
                    <div class="brand-icon">📱</div>
                    <div class="brand-name">Realme</div>
                </div>
                <div class="brand-card" data-brand="tecno">
                    <div class="brand-icon">📱</div>
                    <div class="brand-name">Tecno</div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <span class="card-title">Métodos de Bypass</span>
            </div>
            <div class="form-group">
                <label class="form-label">Seleccionar Método</label>
                <select class="form-select" id="frpMethod">
                    <option value="adb">ADB Method</option>
                    <option value="odin">Odin/Flash Method (Samsung)</option>
                    <option value="fastboot">Fastboot Method</option>
                    <option value="combination">Combination File (Samsung)</option>
                    <option value="test-point">Test Point Method</option>
                    <option value="miracle">Miracle Box Protocol</option>
                </select>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" id="executeFRP">🚀 Ejecutar FRP Bypass</button>
                <button class="btn btn-secondary" id="checkFRPStatus">📊 Verificar Estado FRP</button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <span class="card-title">Progreso</span>
            </div>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" id="frpProgress" style="width: 0%">0%</div>
                </div>
            </div>
        </div>
    `;
}

// Screen Lock Section
function createScreenLockSection() {
    return `
        <div class="section-header">
            <h2>🔐 Screen Lock Removal</h2>
            <p>Elimina bloqueos de pantalla (PIN, Pattern, Password, Fingerprint)</p>
        </div>

        <div class="card">
            <div class="card-header">
                <span class="card-title">Tipo de Bloqueo</span>
            </div>
            <div class="form-group">
                <label class="form-label">Seleccionar Tipo</label>
                <select class="form-select" id="lockType">
                    <option value="pin">PIN</option>
                    <option value="pattern">Pattern</option>
                    <option value="password">Password</option>
                    <option value="fingerprint">Fingerprint</option>
                    <option value="face">Face Recognition</option>
                    <option value="all">Todos los métodos</option>
                </select>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" id="removeScreenLock">🔓 Eliminar Bloqueo</button>
                <button class="btn btn-warning" id="resetScreenLock">🔄 Reset to Factory</button>
            </div>
        </div>
    `;
}

// Firmware Section
function createFirmwareSection() {
    return `
        <div class="section-header">
            <h2>💾 Firmware Flash</h2>
            <p>Flashea firmware oficial y custom para múltiples dispositivos</p>
        </div>

        <div class="card">
            <div class="card-header">
                <span class="card-title">Seleccionar Firmware</span>
            </div>
            <div class="form-group">
                <label class="form-label">Archivo de Firmware</label>
                <div class="btn-group">
                    <button class="btn btn-secondary" id="selectFirmware">📁 Seleccionar Archivo</button>
                    <span id="firmwareFileName" style="color: var(--text-secondary); margin-left: 15px;">No seleccionado</span>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Método de Flash</label>
                <select class="form-select" id="flashMethod">
                    <option value="odin">Odin (Samsung)</option>
                    <option value="sp-flash">SP Flash Tool (MediaTek)</option>
                    <option value="qfil">QFIL (Qualcomm)</option>
                    <option value="hisuite">HiSuite (Huawei)</option>
                    <option value="miflash">Mi Flash (Xiaomi)</option>
                    <option value="fastboot">Fastboot</option>
                </select>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" id="flashFirmware">⚡ Flash Firmware</button>
                <button class="btn btn-warning" id="backupFirmware">💾 Backup Current</button>
            </div>
        </div>
    `;
}

// MDM Section
function createMDMSection() {
    return `
        <div class="section-header">
            <h2>🛡️ MDM / Knox Guard Removal</h2>
            <p>Elimina MDM y Knox Guard de dispositivos empresariales</p>
        </div>

        <div class="card">
            <div class="card-header">
                <span class="card-title">Tipo de MDM</span>
            </div>
            <div class="form-group">
                <label class="form-label">Seleccionar MDM</label>
                <select class="form-select" id="mdmType">
                    <option value="knox">Samsung Knox Guard</option>
                    <option value="google-mdm">Google EMM/MDM</option>
                    <option value="airwatch">VMware Workspace ONE</option>
                    <option value="intune">Microsoft Intune</option>
                    <option value="mobileiron">MobileIron</option>
                    <option value="generic">Generic MDM</option>
                </select>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" id="removeMDM">🗑️ Eliminar MDM</button>
                <button class="btn btn-secondary" id="checkMDMStatus">📊 Verificar MDM</button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <span class="card-title">Aplicaciones de Compañía (México)</span>
            </div>
            <div class="brand-grid">
                <div class="brand-card" data-app="telcel">
                    <div class="brand-icon">📡</div>
                    <div class="brand-name">Telcel Lock</div>
                </div>
                <div class="brand-card" data-app="att">
                    <div class="brand-icon">📡</div>
                    <div class="brand-name">AT&T Lock</div>
                </div>
                <div class="brand-card" data-app="payjoy">
                    <div class="brand-icon">💳</div>
                    <div class="brand-name">Payjoy Lock</div>
                </div>
                <div class="brand-card" data-app="smart-lock">
                    <div class="brand-icon">🔒</div>
                    <div class="brand-name">Smart Lock</div>
                </div>
            </div>
            <button class="btn btn-danger" id="removeCompanyApp">🗑️ Desinstalar App Seleccionada</button>
        </div>
    `;
}

// Terminal Section
function createTerminalSection() {
    return `
        <div class="section-header">
            <h2>⌨️ Terminal Premium</h2>
            <p>Ejecuta comandos ADB, Fastboot y comandos personalizados</p>
        </div>

        <div class="card">
            <div class="card-header">
                <span class="card-title">Comandos Rápidos</span>
            </div>
            <div class="btn-group">
                <button class="btn btn-secondary" data-cmd="adb devices">ADB Devices</button>
                <button class="btn btn-secondary" data-cmd="adb shell getprop">Get Props</button>
                <button class="btn btn-secondary" data-cmd="fastboot devices">Fastboot Devices</button>
                <button class="btn btn-secondary" data-cmd="adb reboot">Reboot</button>
                <button class="btn btn-secondary" data-cmd="adb reboot bootloader">Bootloader</button>
                <button class="btn btn-secondary" data-cmd="adb reboot recovery">Recovery</button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">
                <span class="card-title">Comando Personalizado</span>
            </div>
            <div class="form-group">
                <label class="form-label">Ejecutar Comando</label>
                <input type="text" class="form-input" id="customCommand" placeholder="Ejemplo: adb shell pm list packages">
            </div>
            <button class="btn btn-primary" id="executeCommand">▶️ Ejecutar</button>
        </div>
    `;
}

// QR Section
function createQRSection() {
    return `
        <div class="section-header">
            <h2>📷 QR Code - MDM Bypass</h2>
            <p>Genera códigos QR para bypass de MDM en diferentes carriers</p>
        </div>

        <div class="card">
            <div class="form-group">
                <label class="form-label">Tipo de Dispositivo</label>
                <select class="form-select" id="qrDeviceType">
                    <option value="samsung">Samsung</option>
                    <option value="lg">LG</option>
                    <option value="motorola">Motorola</option>
                    <option value="generic">Generic Android</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Carrier</label>
                <select class="form-select" id="qrCarrier">
                    <option value="telcel">Telcel</option>
                    <option value="att">AT&T</option>
                    <option value="movistar">Movistar</option>
                    <option value="generic">Generic</option>
                </select>
            </div>
            <button class="btn btn-primary" id="generateQR">🎯 Generar QR Code</button>
        </div>

        <div class="card qr-display" id="qrDisplay" style="display: none;">
            <div class="card-header">
                <span class="card-title">Código QR Generado</span>
            </div>
            <canvas id="qrCanvas"></canvas>
            <p style="color: var(--text-secondary); margin-top: 15px;">Escanea este código durante la configuración inicial</p>
        </div>
    `;
}

// Other sections (simplified)
function createIMEISection() {
    return `<div class="section-header"><h2>📱 IMEI Repair</h2></div>
    <div class="card"><p>Función de reparación de IMEI disponible para dispositivos con chipset MTK y Qualcomm</p>
    <button class="btn btn-primary" id="repairIMEI">🔧 Reparar IMEI</button></div>`;
}

function createXiaomiSection() {
    return `<div class="section-header"><h2>🌐 Mi Account Bypass</h2></div>
    <div class="card"><p>Bypass de Mi Cloud para dispositivos Xiaomi</p>
    <button class="btn btn-primary" id="bypassMiAccount">🚀 Bypass Mi Account</button></div>`;
}

function createBootloaderSection() {
    return `<div class="section-header"><h2>🔧 Bootloader Unlock</h2></div>
    <div class="card"><p>Desbloqueo/Bloqueo de bootloader</p>
    <div class="btn-group">
    <button class="btn btn-primary" id="unlockBootloader">🔓 Unlock</button>
    <button class="btn btn-warning" id="lockBootloader">🔒 Lock</button></div></div>`;
}

function createiCloudSection() {
    return `<div class="section-header"><h2>☁️ iCloud Bypass</h2></div>
    <div class="card"><p>Herramientas para bypass de iCloud en dispositivos iOS</p>
    <button class="btn btn-primary" id="bypassiCloud">🚀 Bypass iCloud</button></div>`;
}

function createActivationSection() {
    return `<div class="section-header"><h2>✅ iOS Activation</h2></div>
    <div class="card"><p>Activación de dispositivos iOS</p>
    <button class="btn btn-primary" id="activateiOS">✅ Activar Dispositivo</button></div>`;
}

function createJailbreakSection() {
    return `<div class="section-header"><h2>🔓 iOS Jailbreak</h2></div>
    <div class="card"><p>Jailbreak para diferentes versiones de iOS</p>
    <button class="btn btn-primary" id="jailbreakiOS">🔓 Jailbreak</button></div>`;
}

function createTelcelSection() {
    return `<div class="section-header"><h2>📡 Telcel Unlock</h2></div>
    <div class="card"><p>Desbloqueo de red Telcel México</p>
    <button class="btn btn-primary" id="unlockTelcel">🔓 Unlock Telcel</button></div>`;
}

function createATTSection() {
    return `<div class="section-header"><h2>📡 AT&T Unlock</h2></div>
    <div class="card"><p>Desbloqueo de red AT&T México</p>
    <button class="btn btn-primary" id="unlockATT">🔓 Unlock AT&T</button></div>`;
}

function createPayjoySection() {
    return `<div class="section-header"><h2>💳 Payjoy Unlock</h2></div>
    <div class="card"><p>Desbloqueo de dispositivos Payjoy</p>
    <button class="btn btn-primary" id="unlockPayjoy">🔓 Unlock Payjoy</button></div>`;
}

function createDriversSection() {
    return `<div class="section-header"><h2>💿 Device Drivers</h2></div>
    <div class="card"><p>Instalación de drivers para dispositivos Android y iOS</p>
    <div class="btn-group">
    <button class="btn btn-primary" data-driver="adb">ADB Drivers</button>
    <button class="btn btn-primary" data-driver="samsung">Samsung Drivers</button>
    <button class="btn btn-primary" data-driver="qualcomm">Qualcomm Drivers</button>
    <button class="btn btn-primary" data-driver="mtk">MTK Drivers</button>
    <button class="btn btn-primary" data-driver="apple">Apple Mobile Device</button>
    </div></div>`;
}

// Event Handlers
function attachSectionHandlers(section) {
    // FRP handlers
    if (section === 'android-frp') {
        document.getElementById('executeFRP')?.addEventListener('click', async () => {
            await executeOperation('FRP Bypass', async () => {
                const method = document.getElementById('frpMethod').value;
                return await ipcRenderer.invoke('android-remove-frp', currentDevice?.id, method);
            });
        });
    }

    // Terminal handlers
    if (section === 'terminal') {
        document.querySelectorAll('[data-cmd]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const cmd = btn.getAttribute('data-cmd');
                logToConsole('info', `Ejecutando: ${cmd}`);
                try {
                    const result = await ipcRenderer.invoke('terminal-execute-command', cmd);
                    if (result && result.output) {
                        logToConsole('info', result.output);
                    } else {
                        logToConsole('success', `Comando "${cmd}" ejecutado`);
                    }
                } catch (error) {
                    logToConsole('error', `Error ejecutando comando "${cmd}": ${error.message}`);
                }
            });
        });
    }

    // QR handlers
    if (section === 'mdm-qr') {
        document.getElementById('generateQR')?.addEventListener('click', async () => {
            const deviceType = document.getElementById('qrDeviceType').value;
            const carrier = document.getElementById('qrCarrier').value;
            const result = await ipcRenderer.invoke('mdm-generate-qr', deviceType, carrier);
            document.getElementById('qrDisplay').style.display = 'block';
            logToConsole('success', 'QR Code generado correctamente');
        });
    }

    // Generic handlers for all sections' buttons
    const sectionElement = document.getElementById(section);
    if (!sectionElement) {
        return;
    }

    // Attach handlers to any button-like element that declares an operation via data attributes.
    const operationButtons = sectionElement.querySelectorAll('[data-operation][data-ipc-channel]');
    operationButtons.forEach(btn => {
        // Avoid attaching multiple handlers if the section is reloaded.
        if (btn.getAttribute('data-handler-attached') === 'true') {
            return;
        }
        btn.setAttribute('data-handler-attached', 'true');

        const operationName =
            btn.getAttribute('data-operation') ||
            (btn.textContent ? btn.textContent.trim() : 'Operación');
        const channel = btn.getAttribute('data-ipc-channel');

        btn.addEventListener('click', async () => {
            if (!channel) {
                logToConsole('error', 'No se ha configurado el canal IPC para esta operación');
                return;
            }

            // Optional extra arguments encoded as JSON in data-ipc-args.
            let extraArgs = [];
            const argsAttr = btn.getAttribute('data-ipc-args');
            if (argsAttr && argsAttr.trim() !== '') {
                try {
                    extraArgs = JSON.parse(argsAttr);
                    if (!Array.isArray(extraArgs)) {
                        extraArgs = [extraArgs];
                    }
                } catch (e) {
                    logToConsole('error', 'Formato inválido en data-ipc-args, se ignorarán argumentos extra');
                    extraArgs = [];
                }
            }

            await executeOperation(operationName, async () => {
                // Always pass the current device id as first argument if disponible.
                return await ipcRenderer.invoke(channel, currentDevice?.id, ...extraArgs);
            });
        });
    });
}

// Utility Functions
async function executeOperation(name, operation) {
    if (!currentDevice) {
        logToConsole('error', 'No hay dispositivo conectado');
        return;
    }

    showLoading(`Ejecutando ${name}...`);
    logToConsole('info', `Iniciando ${name}...`);

    try {
        const result = await operation();
        hideLoading();
        if (result.success) {
            logToConsole('success', `${name} completado exitosamente`);
        } else {
            logToConsole('error', `${name} falló: ${result.error}`);
        }
    } catch (error) {
        hideLoading();
        logToConsole('error', `Error en ${name}: ${error.message}`);
    }
}

function showLoading(text) {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function logToConsole(level, message) {
    const consoleOutput = document.getElementById('consoleOutput');
    const entry = document.createElement('div');
    entry.className = `log-entry ${level}`;
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `[${timestamp}] ${message}`;
    consoleOutput.appendChild(entry);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function setupConsoleControls() {
    document.getElementById('clearConsole')?.addEventListener('click', () => {
        document.getElementById('consoleOutput').innerHTML = '';
        logToConsole('info', 'Console limpiada');
    });
}
