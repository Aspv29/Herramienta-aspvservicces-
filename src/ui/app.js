// AspvServices v2.0 - Frontend Application
// Uses window.aspvAPI exposed by preload.js

let currentDevice = null;
let currentSection = 'android-frp';
let selectedBrand = null;
let terminalHistory = [];

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDeviceDetection();
    initConsole();
    initModals();
    loadSection('android-frp');
    initEventListeners();
});

// ===== NAVIGATION =====
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadSection(item.getAttribute('data-section'));
        });
    });
}

// ===== DEVICE DETECTION =====
function initDeviceDetection() {
    document.getElementById('refreshDevices').addEventListener('click', detectDevices);
    detectDevices();
    setInterval(detectDevices, 5000);
}

async function detectDevices() {
    try {
        const devices = await window.aspvAPI.detectDevices();
        updateDeviceStatus(devices);
    } catch (error) {
        // Silent fail for polling
    }
}

function updateDeviceStatus(devices) {
    const dot = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    const prev = currentDevice;
    const device = (devices && devices.length > 0) ? devices[0] : null;

    if (device) {
        dot.classList.add('connected');
        text.textContent = `${device.brand} ${device.model}`;
        if (!prev) logToConsole('success', `Dispositivo detectado: ${device.brand} ${device.model}`);
    } else {
        dot.classList.remove('connected');
        text.textContent = 'Sin dispositivo conectado';
        if (prev) logToConsole('info', 'Dispositivo desconectado');
    }
    currentDevice = device;
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    if (window.aspvAPI.onLog) {
        window.aspvAPI.onLog((data) => {
            logToConsole(data.level, data.message);
        });
    }
}

// ===== SECTION LOADER =====
function loadSection(name) {
    currentSection = name;
    const container = document.getElementById('content-container');
    const creators = {
        'android-frp': sectionFRP,
        'android-screen': sectionScreenLock,
        'android-firmware': sectionFirmware,
        'android-mdm': sectionMDM,
        'android-imei': sectionIMEI,
        'android-xiaomi': sectionXiaomi,
        'android-bootloader': sectionBootloader,
        'android-advanced': sectionAdvanced,
        'ios-icloud': sectioniCloud,
        'ios-activation': sectionActivation,
        'ios-jailbreak': sectionJailbreak,
        'carrier-telcel': sectionTelcel,
        'carrier-att': sectionATT,
        'carrier-payjoy': sectionPayjoy,
        'drivers': sectionDrivers,
        'mdm-qr': sectionQR,
        'terminal': sectionTerminal
    };
    const creator = creators[name];
    if (creator) {
        container.innerHTML = creator();
        container.className = 'slide-in';
        attachHandlers(name);
    }
}

// ===== BRAND GRID HELPER =====
function brandGrid(brands) {
    return `<div class="brand-grid">${brands.map(b =>
        `<div class="brand-card" data-brand="${b.id}"><div class="brand-icon">${b.icon}</div><div class="brand-name">${b.name}</div></div>`
    ).join('')}</div>`;
}

const ALL_BRANDS = [
    { id: 'samsung', icon: 'S', name: 'Samsung' },
    { id: 'xiaomi', icon: 'Mi', name: 'Xiaomi' },
    { id: 'huawei', icon: 'H', name: 'Huawei' },
    { id: 'motorola', icon: 'M', name: 'Motorola' },
    { id: 'oppo', icon: 'O', name: 'Oppo' },
    { id: 'vivo', icon: 'V', name: 'Vivo' },
    { id: 'realme', icon: 'R', name: 'Realme' },
    { id: 'tecno', icon: 'T', name: 'Tecno' },
    { id: 'infinix', icon: 'I', name: 'Infinix' },
    { id: 'lg', icon: 'LG', name: 'LG' }
];

// ===== SECTIONS =====

function sectionFRP() {
    return `
    <div class="section-header">
        <h2>FRP Bypass (Factory Reset Protection)</h2>
        <p>Elimina la proteccion FRP de dispositivos Android multi-marca y multi-chipset</p>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Seleccionar Marca</span></div>${brandGrid(ALL_BRANDS)}</div>
    <div class="card">
        <div class="card-header"><span class="card-title">Metodo de Bypass</span></div>
        <div class="form-group">
            <label class="form-label">Chipset / Metodo</label>
            <select class="form-select" id="frpMethod">
                <option value="adb">ADB Method (Universal)</option>
                <option value="fastboot">Fastboot Method (Qualcomm/MTK)</option>
                <option value="odin">Odin / Download Mode (Samsung)</option>
                <option value="combination">Combination File (Samsung)</option>
                <option value="test-point">Test Point (MediaTek/UNISOC)</option>
                <option value="miracle">Miracle Box Protocol</option>
            </select>
        </div>
        <div class="alert alert-info">Conecta el dispositivo por USB con depuracion USB habilitada o en modo correspondiente.</div>
        <div class="btn-group">
            <button class="btn btn-primary" id="executeFRP">Ejecutar FRP Bypass</button>
            <button class="btn btn-secondary" id="checkFRPStatus">Verificar Estado</button>
        </div>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Progreso</span></div>
        <div class="progress-container"><div class="progress-bar"><div class="progress-fill" id="frpProgress" style="width:0%">0%</div></div></div>
    </div>`;
}

function sectionScreenLock() {
    return `
    <div class="section-header">
        <h2>Eliminacion de Bloqueo de Pantalla</h2>
        <p>Remueve PIN, patron, password, huella digital y reconocimiento facial</p>
    </div>
    <div class="card"><div class="card-header"><span class="card-title">Marca del Dispositivo</span></div>${brandGrid(ALL_BRANDS)}</div>
    <div class="card">
        <div class="card-header"><span class="card-title">Tipo de Bloqueo</span></div>
        <div class="form-group">
            <select class="form-select" id="lockType">
                <option value="all">Todos los metodos</option>
                <option value="pin">PIN</option>
                <option value="pattern">Patron</option>
                <option value="password">Password</option>
                <option value="fingerprint">Huella Digital</option>
                <option value="face">Reconocimiento Facial</option>
            </select>
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" id="removeScreenLock">Eliminar Bloqueo</button>
            <button class="btn btn-warning" id="resetFactory">Factory Reset</button>
        </div>
    </div>`;
}

function sectionFirmware() {
    return `
    <div class="section-header">
        <h2>Flash de Firmware</h2>
        <p>Flashea firmware oficial y custom - Soporta Qualcomm, MediaTek, Samsung Exynos, UNISOC, Kirin</p>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Archivo de Firmware</span></div>
        <div class="form-group">
            <div class="btn-group">
                <button class="btn btn-secondary" id="selectFirmware">Seleccionar Archivo</button>
                <span id="firmwareFileName" class="text-muted" style="padding:9px 0">Ningun archivo seleccionado</span>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Metodo de Flash</label>
            <select class="form-select" id="flashMethod">
                <option value="odin">Odin (Samsung)</option>
                <option value="sp-flash">SP Flash Tool (MediaTek)</option>
                <option value="qfil">QFIL (Qualcomm)</option>
                <option value="hisuite">HiSuite (Huawei / Kirin)</option>
                <option value="miflash">Mi Flash (Xiaomi)</option>
                <option value="fastboot">Fastboot (Universal)</option>
                <option value="unisoc">Research Download (UNISOC)</option>
            </select>
        </div>
        <div class="alert alert-warning">Asegurate de que la bateria sea mayor al 50% antes de flashear.</div>
        <div class="btn-group">
            <button class="btn btn-primary" id="flashFirmware">Flash Firmware</button>
            <button class="btn btn-secondary" id="backupFirmware">Backup Actual</button>
        </div>
    </div>`;
}

function sectionMDM() {
    return `
    <div class="section-header">
        <h2>MDM / Knox Guard Removal</h2>
        <p>Elimina MDM empresarial, Knox Guard y apps de bloqueo de compania</p>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Tipo de MDM</span></div>
        <div class="form-group">
            <select class="form-select" id="mdmType">
                <option value="knox">Samsung Knox Guard / KG</option>
                <option value="google-mdm">Google EMM / Android Enterprise</option>
                <option value="airwatch">VMware Workspace ONE (AirWatch)</option>
                <option value="intune">Microsoft Intune</option>
                <option value="mobileiron">MobileIron / Ivanti</option>
                <option value="generic">MDM Generico</option>
            </select>
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" id="removeMDM">Eliminar MDM</button>
            <button class="btn btn-secondary" id="checkMDMStatus">Verificar MDM</button>
        </div>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Apps de Compania (Mexico)</span></div>
        <div class="brand-grid">
            <div class="brand-card" data-app="telcel"><div class="brand-icon">T</div><div class="brand-name">Telcel Lock</div></div>
            <div class="brand-card" data-app="att"><div class="brand-icon">AT</div><div class="brand-name">AT&T Lock</div></div>
            <div class="brand-card" data-app="payjoy"><div class="brand-icon">PJ</div><div class="brand-name">Payjoy Lock</div></div>
            <div class="brand-card" data-app="smart-lock"><div class="brand-icon">SL</div><div class="brand-name">Smart Lock</div></div>
            <div class="brand-card" data-app="credito"><div class="brand-icon">CR</div><div class="brand-name">Credito Lock</div></div>
        </div>
        <button class="btn btn-danger" id="removeCompanyApp">Desinstalar App Seleccionada</button>
    </div>`;
}

function sectionIMEI() {
    return `
    <div class="section-header">
        <h2>Reparacion de IMEI</h2>
        <p>Repara o restaura IMEI en dispositivos con chipset MediaTek, Qualcomm y UNISOC</p>
    </div>
    <div class="alert alert-danger">La modificacion de IMEI puede ser ilegal en tu jurisdiccion. Usa solo para restaurar IMEI original.</div>
    <div class="card">
        <div class="card-header"><span class="card-title">Configuracion</span></div>
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">IMEI 1</label>
                <input type="text" class="form-input" id="imei1" placeholder="Ingresa IMEI 1" maxlength="15">
            </div>
            <div class="form-group">
                <label class="form-label">IMEI 2 (Dual SIM)</label>
                <input type="text" class="form-input" id="imei2" placeholder="Ingresa IMEI 2" maxlength="15">
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Chipset del Dispositivo</label>
            <select class="form-select" id="imeiChipset">
                <option value="mtk">MediaTek (MTK)</option>
                <option value="qualcomm">Qualcomm</option>
                <option value="unisoc">UNISOC / Spreadtrum</option>
            </select>
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" id="repairIMEI">Reparar IMEI</button>
            <button class="btn btn-secondary" id="readIMEI">Leer IMEI Actual</button>
            <button class="btn btn-secondary" id="backupEFS">Backup EFS/QCN</button>
        </div>
    </div>`;
}

function sectionXiaomi() {
    return `
    <div class="section-header">
        <h2>Mi Account / Mi Cloud Bypass</h2>
        <p>Elimina cuenta Mi asociada y bloqueo Mi Cloud en dispositivos Xiaomi, Redmi y POCO</p>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Modelo Xiaomi</span></div>
        <div class="chip-group">
            <span class="chip active" data-model="redmi">Redmi</span>
            <span class="chip" data-model="poco">POCO</span>
            <span class="chip" data-model="mi">Mi Series</span>
            <span class="chip" data-model="note">Redmi Note</span>
        </div>
        <div class="form-group">
            <label class="form-label">Metodo</label>
            <select class="form-select" id="miMethod">
                <option value="adb">ADB Bypass (Requiere depuracion USB)</option>
                <option value="edl">EDL Mode (Modo 9008)</option>
                <option value="fastboot">Fastboot Clean</option>
                <option value="auth">Mi Unlock Tool (Oficial)</option>
            </select>
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" id="bypassMiAccount">Bypass Mi Account</button>
            <button class="btn btn-secondary" id="checkMiStatus">Verificar Estado</button>
        </div>
    </div>`;
}

function sectionBootloader() {
    return `
    <div class="section-header">
        <h2>Bootloader Unlock / Lock</h2>
        <p>Desbloquea o bloquea el bootloader del dispositivo</p>
    </div>
    <div class="alert alert-warning">Desbloquear el bootloader borrara todos los datos del dispositivo.</div>
    <div class="card">
        <div class="card-header"><span class="card-title">Marca del Dispositivo</span></div>${brandGrid(ALL_BRANDS.slice(0, 6))}</div>
    <div class="card">
        <div class="card-header"><span class="card-title">Acciones</span></div>
        <div class="btn-group">
            <button class="btn btn-primary" id="unlockBootloader">Desbloquear Bootloader</button>
            <button class="btn btn-warning" id="lockBootloader">Bloquear Bootloader</button>
            <button class="btn btn-secondary" id="checkBootloaderStatus">Verificar Estado</button>
        </div>
    </div>`;
}

function sectionAdvanced() {
    return `
    <div class="section-header">
        <h2>Funciones Avanzadas</h2>
        <p>Reparaciones avanzadas, menus ocultos y utilidades especializadas</p>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Reparaciones</span></div>
        <div class="btn-group">
            <button class="btn btn-secondary" data-repair="fix-calls">Reparar Llamadas</button>
            <button class="btn btn-secondary" data-repair="enable-diag">Habilitar Modo Diag</button>
            <button class="btn btn-secondary" data-repair="fix-wifi">Reparar WiFi</button>
            <button class="btn btn-secondary" data-repair="fix-bluetooth">Reparar Bluetooth</button>
            <button class="btn btn-secondary" data-repair="fix-gps">Reparar GPS</button>
        </div>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Menus Ocultos</span></div>
        <div class="btn-group">
            <button class="btn btn-secondary" data-dialer="*#0*#">Menu de Prueba Samsung</button>
            <button class="btn btn-secondary" data-dialer="*#*#4636#*#*">Info del Telefono</button>
            <button class="btn btn-secondary" data-dialer="*#06#">Ver IMEI</button>
            <button class="btn btn-secondary" data-dialer="*#*#2846579#*#*">Menu Huawei</button>
        </div>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Acciones del Sistema</span></div>
        <div class="btn-group">
            <button class="btn btn-secondary" data-reboot="system">Reiniciar Sistema</button>
            <button class="btn btn-secondary" data-reboot="recovery">Reiniciar a Recovery</button>
            <button class="btn btn-secondary" data-reboot="bootloader">Reiniciar a Bootloader</button>
            <button class="btn btn-warning" data-reboot="download">Modo Download (Samsung)</button>
            <button class="btn btn-danger" data-reboot="edl">Modo EDL 9008</button>
        </div>
    </div>`;
}

function sectioniCloud() {
    return `
    <div class="section-header">
        <h2>iCloud Bypass</h2>
        <p>Herramientas para bypass de iCloud en dispositivos Apple iPhone/iPad</p>
    </div>
    <div class="alert alert-warning">El bypass de iCloud resulta en funcionalidad limitada (sin llamadas, sin iCloud).</div>
    <div class="card">
        <div class="card-header"><span class="card-title">Metodo de Bypass</span></div>
        <div class="form-group">
            <select class="form-select" id="icloudMethod">
                <option value="checkra1n">checkra1n (A5-A11, iOS 12-14.8)</option>
                <option value="f3arRa1n">F3arRa1n (Linux)</option>
                <option value="palera1n">palera1n (A8-A11, iOS 15-17)</option>
                <option value="sliver">Sliver (macOS)</option>
                <option value="signal">Signal Bypass</option>
            </select>
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" id="bypassiCloud">Bypass iCloud</button>
            <button class="btn btn-secondary" id="checkiCloudStatus">Verificar Estado</button>
        </div>
    </div>`;
}

function sectionActivation() {
    return `
    <div class="section-header">
        <h2>Activacion iOS</h2>
        <p>Activar dispositivos iOS y gestionar estado de activacion</p>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Acciones</span></div>
        <div class="btn-group">
            <button class="btn btn-primary" id="activateiOS">Activar Dispositivo</button>
            <button class="btn btn-secondary" id="checkActivation">Verificar Activacion</button>
            <button class="btn btn-secondary" id="iosBackup">Backup</button>
        </div>
    </div>`;
}

function sectionJailbreak() {
    return `
    <div class="section-header">
        <h2>Jailbreak iOS</h2>
        <p>Jailbreak para diferentes versiones de iOS - Auto-detecta la herramienta correcta</p>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Herramientas Disponibles (2026)</span></div>
        <div class="info-grid">
            <div class="info-item"><div class="info-label">checkra1n</div><div class="info-value">iOS 12 - 14.8 (A5-A11)</div></div>
            <div class="info-item"><div class="info-label">palera1n</div><div class="info-value">iOS 15 - 17.x (A8-A11)</div></div>
            <div class="info-item"><div class="info-label">Dopamine</div><div class="info-value">iOS 15 - 16.6.1 (A12+)</div></div>
            <div class="info-item"><div class="info-label">unc0ver</div><div class="info-value">iOS 11 - 14.8</div></div>
        </div>
        <div style="margin-top:14px">
            <button class="btn btn-primary" id="jailbreakiOS">Detectar y Jailbreak</button>
        </div>
    </div>`;
}

function sectionTelcel() {
    return `
    <div class="section-header">
        <h2>Desbloqueo Telcel MX</h2>
        <p>Desbloqueo de red y eliminacion de apps Telcel Mexico</p>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Desbloqueo de Red</span></div>
        <div class="form-group">
            <label class="form-label">IMEI del dispositivo</label>
            <input type="text" class="form-input" id="telcelIMEI" placeholder="Ingresa IMEI (15 digitos)" maxlength="15">
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" id="unlockTelcel">Desbloquear Telcel</button>
            <button class="btn btn-secondary" id="removeTelcelApps">Remover Apps Telcel</button>
        </div>
    </div>`;
}

function sectionATT() {
    return `
    <div class="section-header">
        <h2>Desbloqueo AT&T MX</h2>
        <p>Desbloqueo de red y eliminacion de restricciones AT&T Mexico</p>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Desbloqueo de Red</span></div>
        <div class="form-group">
            <label class="form-label">IMEI del dispositivo</label>
            <input type="text" class="form-input" id="attIMEI" placeholder="Ingresa IMEI (15 digitos)" maxlength="15">
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" id="unlockATT">Desbloquear AT&T</button>
            <button class="btn btn-secondary" id="removeATTApps">Remover Apps AT&T</button>
        </div>
    </div>`;
}

function sectionPayjoy() {
    return `
    <div class="section-header">
        <h2>Desbloqueo Payjoy</h2>
        <p>Eliminacion de bloqueo Payjoy en dispositivos con financiamiento</p>
    </div>
    <div class="alert alert-danger">Payjoy es un sistema de financiamiento. Asegurate de que el dispositivo este liquidado.</div>
    <div class="card">
        <div class="card-header"><span class="card-title">Metodos de Desbloqueo</span></div>
        <div class="btn-group">
            <button class="btn btn-primary" id="unlockPayjoy">Desbloquear Payjoy</button>
            <button class="btn btn-secondary" id="removePayjoyApps">Remover Apps Payjoy</button>
        </div>
    </div>`;
}

function sectionDrivers() {
    return `
    <div class="section-header">
        <h2>Gestion de Drivers</h2>
        <p>Instalacion y verificacion de drivers para dispositivos Android e iOS</p>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Estado de Drivers</span></div>
        <div id="driverStatusGrid" class="info-grid">
            <div class="info-item"><div class="info-label">Verificando...</div><div class="info-value">...</div></div>
        </div>
        <div style="margin-top:14px">
            <button class="btn btn-secondary" id="recheckDrivers">Verificar Drivers</button>
        </div>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Instalar Drivers</span></div>
        <div class="btn-group">
            <button class="btn btn-primary" data-driver="adb">ADB / Fastboot</button>
            <button class="btn btn-primary" data-driver="samsung">Samsung USB</button>
            <button class="btn btn-primary" data-driver="qualcomm">Qualcomm 9008</button>
            <button class="btn btn-primary" data-driver="mtk">MediaTek VCOM</button>
            <button class="btn btn-primary" data-driver="apple">Apple Mobile</button>
            <button class="btn btn-secondary" data-driver="huawei">Huawei HiSuite</button>
            <button class="btn btn-secondary" data-driver="motorola">Motorola</button>
            <button class="btn btn-secondary" data-driver="lg">LG USB</button>
        </div>
    </div>`;
}

function sectionQR() {
    return `
    <div class="section-header">
        <h2>QR Code - MDM Bypass</h2>
        <p>Genera codigos QR para bypass de MDM durante configuracion inicial del dispositivo</p>
    </div>
    <div class="card">
        <div class="form-row">
            <div class="form-group">
                <label class="form-label">Tipo de Dispositivo</label>
                <select class="form-select" id="qrDeviceType">
                    <option value="samsung">Samsung</option>
                    <option value="lg">LG</option>
                    <option value="motorola">Motorola</option>
                    <option value="generic">Android Generico</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Operador</label>
                <select class="form-select" id="qrCarrier">
                    <option value="telcel">Telcel</option>
                    <option value="att">AT&T</option>
                    <option value="movistar">Movistar</option>
                    <option value="generic">Generico</option>
                </select>
            </div>
        </div>
        <button class="btn btn-primary" id="generateQR">Generar QR Code</button>
    </div>
    <div class="card qr-display" id="qrDisplay" style="display:none">
        <div class="card-header"><span class="card-title">Codigo QR Generado</span></div>
        <div id="qrImageContainer"></div>
        <p class="text-muted" style="margin-top:10px">Escanea este codigo durante la configuracion inicial del dispositivo</p>
    </div>`;
}

function sectionTerminal() {
    return `
    <div class="section-header">
        <h2>Terminal Premium</h2>
        <p>Ejecuta comandos ADB, Fastboot y comandos del sistema</p>
    </div>
    <div class="card">
        <div class="card-header"><span class="card-title">Comandos Rapidos</span></div>
        <div class="btn-group">
            <button class="btn btn-secondary" data-cmd="adb devices">ADB Devices</button>
            <button class="btn btn-secondary" data-cmd="adb shell getprop ro.product.model">Modelo</button>
            <button class="btn btn-secondary" data-cmd="fastboot devices">Fastboot Devices</button>
            <button class="btn btn-secondary" data-cmd="adb reboot">Reboot</button>
            <button class="btn btn-secondary" data-cmd="adb reboot bootloader">Bootloader</button>
            <button class="btn btn-secondary" data-cmd="adb reboot recovery">Recovery</button>
            <button class="btn btn-secondary" data-cmd="adb shell pm list packages -3">Apps Instaladas</button>
            <button class="btn btn-secondary" data-cmd="adb shell dumpsys battery">Info Bateria</button>
        </div>
    </div>
    <div class="card">
        <div class="terminal-container">
            <div class="terminal-header">
                <span class="terminal-dot red"></span>
                <span class="terminal-dot yellow"></span>
                <span class="terminal-dot green"></span>
                <span class="terminal-title">AspvServices Terminal v2.0</span>
            </div>
            <div class="terminal-body" id="terminalBody">
                <div class="terminal-output">
                    <div class="output-line" style="color:var(--accent)">AspvServices Terminal v2.0 - 2026 Premium Edition</div>
                    <div class="output-line" style="color:#666">Escribe un comando y presiona Enter para ejecutar.</div>
                </div>
                <div class="terminal-input-row">
                    <span class="terminal-prompt">ASPV &gt;</span>
                    <input type="text" class="terminal-input" id="terminalInput" placeholder="Escribe un comando..." autofocus>
                </div>
            </div>
        </div>
    </div>`;
}

// ===== EVENT HANDLERS =====

function attachHandlers(section) {
    // Brand selection
    document.querySelectorAll('.brand-card').forEach(card => {
        card.addEventListener('click', () => {
            card.parentElement.querySelectorAll('.brand-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedBrand = card.getAttribute('data-brand') || card.getAttribute('data-app');
        });
    });

    // Chip selection
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            chip.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    // FRP
    bindClick('executeFRP', async () => {
        const method = val('frpMethod');
        await runOperation('FRP Bypass', () => window.aspvAPI.androidRemoveFRP(currentDevice?.id, method));
    });

    // Screen Lock
    bindClick('removeScreenLock', async () => {
        await runOperation('Eliminacion de Bloqueo', () => window.aspvAPI.androidRemoveScreenLock(currentDevice?.id));
    });

    // Firmware
    bindClick('selectFirmware', async () => {
        const file = await window.aspvAPI.selectFirmwareFile();
        if (file) {
            const el = document.getElementById('firmwareFileName');
            if (el) el.textContent = file.split(/[/\\]/).pop();
        }
    });
    bindClick('flashFirmware', async () => {
        const fileName = document.getElementById('firmwareFileName')?.textContent;
        if (!fileName || fileName === 'Ningun archivo seleccionado') {
            logToConsole('error', 'Selecciona un archivo de firmware primero');
            return;
        }
        await runOperation('Flash Firmware', () => window.aspvAPI.androidFlashFirmware(currentDevice?.id, fileName));
    });

    // MDM
    bindClick('removeMDM', async () => {
        await runOperation('Eliminacion MDM', () => window.aspvAPI.androidRemoveMDM(currentDevice?.id, val('mdmType')));
    });
    bindClick('removeCompanyApp', async () => {
        if (!selectedBrand) { logToConsole('error', 'Selecciona una app primero'); return; }
        await runOperation('Remover App', () => window.aspvAPI.mdmRemoveCompanyApp(currentDevice?.id, selectedBrand));
    });

    // IMEI
    bindClick('repairIMEI', async () => {
        const imei = val('imei1');
        await runOperation('Reparacion IMEI', () => window.aspvAPI.androidRepairIMEI(currentDevice?.id, imei));
    });
    bindClick('readIMEI', async () => {
        await runOperation('Lectura IMEI', async () => {
            const r = await window.aspvAPI.terminalExecute('adb shell service call iphonesubinfo 1');
            return r;
        });
    });

    // Xiaomi
    bindClick('bypassMiAccount', async () => {
        await runOperation('Mi Account Bypass', () => window.aspvAPI.androidBypassMiAccount(currentDevice?.id));
    });

    // Bootloader
    bindClick('unlockBootloader', async () => {
        await runOperation('Unlock Bootloader', () => window.aspvAPI.androidUnlockBootloader(currentDevice?.id));
    });
    bindClick('lockBootloader', async () => {
        await runOperation('Lock Bootloader', () => window.aspvAPI.androidLockBootloader(currentDevice?.id));
    });

    // Advanced repairs
    document.querySelectorAll('[data-repair]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const op = btn.getAttribute('data-repair');
            await runOperation(`Reparacion: ${op}`, () => window.aspvAPI.androidAdvancedRepair(currentDevice?.id, op));
        });
    });

    // Reboot modes
    document.querySelectorAll('[data-reboot]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const mode = btn.getAttribute('data-reboot');
            logToConsole('info', `Reiniciando a ${mode}...`);
            await window.aspvAPI.terminalExecute(`adb reboot ${mode === 'system' ? '' : mode}`);
        });
    });

    // Dialer codes
    document.querySelectorAll('[data-dialer]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const code = btn.getAttribute('data-dialer');
            logToConsole('info', `Ejecutando codigo: ${code}`);
            await window.aspvAPI.terminalExecute(`adb shell am start -a android.intent.action.DIAL -d "tel:${code}"`);
        });
    });

    // iOS
    bindClick('bypassiCloud', async () => {
        await runOperation('iCloud Bypass', () => window.aspvAPI.iosBypassiCloud(currentDevice?.id, val('icloudMethod')));
    });
    bindClick('checkiCloudStatus', async () => {
        await runOperation('Verificar iCloud', () => window.aspvAPI.iosCheckiCloud(currentDevice?.id));
    });
    bindClick('activateiOS', async () => {
        await runOperation('Activacion iOS', () => window.aspvAPI.iosActivateDevice(currentDevice?.id));
    });
    bindClick('jailbreakiOS', async () => {
        await runOperation('Jailbreak iOS', () => window.aspvAPI.iosJailbreak(currentDevice?.id));
    });

    // Carrier
    bindClick('unlockTelcel', async () => {
        await runOperation('Desbloqueo Telcel', () => window.aspvAPI.carrierUnlockTelcel(currentDevice?.id, val('telcelIMEI')));
    });
    bindClick('unlockATT', async () => {
        await runOperation('Desbloqueo AT&T', () => window.aspvAPI.carrierUnlockATT(currentDevice?.id, val('attIMEI')));
    });
    bindClick('unlockPayjoy', async () => {
        await runOperation('Desbloqueo Payjoy', () => window.aspvAPI.carrierUnlockPayjoy(currentDevice?.id));
    });

    // Drivers
    document.querySelectorAll('[data-driver]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const type = btn.getAttribute('data-driver');
            await runOperation(`Driver ${type}`, () => window.aspvAPI.driverInstall(type));
        });
    });
    bindClick('recheckDrivers', loadDriverStatus);
    if (section === 'drivers') loadDriverStatus();

    // QR
    bindClick('generateQR', async () => {
        const deviceType = val('qrDeviceType');
        const carrier = val('qrCarrier');
        logToConsole('info', `Generando QR para ${deviceType} - ${carrier}`);
        try {
            const result = await window.aspvAPI.mdmGenerateQR(deviceType, carrier);
            if (result && result.success && result.qrCode) {
                const display = document.getElementById('qrDisplay');
                const container = document.getElementById('qrImageContainer');
                if (display && container) {
                    display.style.display = 'block';
                    container.innerHTML = `<img src="${result.qrCode}" alt="QR Code">`;
                    logToConsole('success', 'QR generado correctamente');
                }
            }
            if (result) showResult('QR MDM Bypass', result);
        } catch (error) {
            logToConsole('error', `Error: ${error.message}`);
        }
    });

    // Terminal
    if (section === 'terminal') {
        document.querySelectorAll('[data-cmd]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const cmd = btn.getAttribute('data-cmd');
                await executeTerminalCommand(cmd);
            });
        });
        const input = document.getElementById('terminalInput');
        if (input) {
            input.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter' && input.value.trim()) {
                    await executeTerminalCommand(input.value.trim());
                    input.value = '';
                }
            });
        }
    }
}

async function executeTerminalCommand(cmd) {
    const body = document.getElementById('terminalBody');
    const inputRow = body?.querySelector('.terminal-input-row');
    if (!body || !inputRow) return;

    const cmdDiv = document.createElement('div');
    cmdDiv.className = 'terminal-output';
    cmdDiv.innerHTML = `<div class="cmd-line">ASPV &gt; ${escapeHtml(cmd)}</div>`;
    body.insertBefore(cmdDiv, inputRow);

    logToConsole('info', `Terminal: ${cmd}`);

    try {
        const result = await window.aspvAPI.terminalExecute(cmd);
        const outputDiv = document.createElement('div');
        outputDiv.className = 'terminal-output';
        if (result.success) {
            outputDiv.innerHTML = `<div class="output-line">${escapeHtml(result.output || 'OK')}</div>`;
        } else {
            outputDiv.innerHTML = `<div class="error-line">${escapeHtml(result.error || 'Error')}</div>`;
        }
        body.insertBefore(outputDiv, inputRow);
    } catch (error) {
        const errDiv = document.createElement('div');
        errDiv.className = 'terminal-output';
        errDiv.innerHTML = `<div class="error-line">Error: ${escapeHtml(error.message)}</div>`;
        body.insertBefore(errDiv, inputRow);
    }

    body.scrollTop = body.scrollHeight;
}

// ===== UTILITIES =====

function bindClick(id, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', handler);
}

function val(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function runOperation(name, operation) {
    if (!currentDevice) {
        logToConsole('error', `${name}: No hay dispositivo conectado`);
        return;
    }
    showLoading(`Ejecutando ${name}...`);
    logToConsole('info', `Iniciando ${name}...`);
    try {
        const result = await operation();
        hideLoading();
        if (result && result.success) {
            logToConsole('success', `${name} completado`);
        } else if (result) {
            logToConsole('warning', `${name}: ${result.error || result.message || 'Completado con advertencias'}`);
        }
        if (result) showResult(name, result);
    } catch (error) {
        hideLoading();
        logToConsole('error', `${name}: ${error.message}`);
    }
}

function showResult(title, result) {
    const modal = document.getElementById('resultModal');
    const titleEl = document.getElementById('resultModalTitle');
    const content = document.getElementById('resultModalContent');
    if (!modal || !content) return;

    titleEl.textContent = title;
    let html = '';

    if (result.message) {
        const type = result.success ? 'success' : (result.warning ? 'warning' : 'error');
        html += `<div class="result-box ${type}"><div class="result-title">${escapeHtml(result.message)}</div></div>`;
    }

    if (result.instructions && result.instructions.length) {
        html += `<div class="result-box"><div class="result-title">Instrucciones</div><ul class="result-list">`;
        result.instructions.forEach(i => { html += `<li>${escapeHtml(i)}</li>`; });
        html += '</ul></div>';
    }

    if (result.methods && result.methods.length) {
        result.methods.forEach(m => {
            html += `<div class="result-box"><div class="result-title">${escapeHtml(m.method || m.name || 'Metodo')}</div>`;
            if (m.code) html += `<p class="text-accent" style="font-size:18px;font-weight:bold;margin:8px 0">Codigo: ${escapeHtml(m.code)}</p>`;
            if (m.steps) {
                html += '<ul class="result-list">';
                m.steps.forEach(s => { html += `<li>${escapeHtml(s)}</li>`; });
                html += '</ul>';
            }
            html += '</div>';
        });
    }

    if (result.warning) {
        html += `<div class="alert alert-warning">${escapeHtml(result.warning)}</div>`;
    }
    if (result.legalNote) {
        html += `<div class="alert alert-danger">${escapeHtml(result.legalNote)}</div>`;
    }
    if (result.output) {
        html += `<div class="result-box"><div class="result-title">Salida</div><pre style="color:var(--text-dim);font-size:11px;white-space:pre-wrap;word-break:break-all">${escapeHtml(result.output)}</pre></div>`;
    }

    if (!html) html = '<p class="text-muted">Operacion completada.</p>';

    content.innerHTML = html;
    modal.classList.add('active');
}

async function loadDriverStatus() {
    try {
        const result = await window.aspvAPI.driverCheckStatus();
        const grid = document.getElementById('driverStatusGrid');
        if (!grid || !result.drivers) return;

        grid.innerHTML = Object.entries(result.drivers).map(([key, info]) => {
            const status = info.installed ? 'Instalado' : 'No instalado';
            const cls = info.installed ? 'success' : 'error';
            return `<div class="info-item" style="border-left-color:var(--${cls})"><div class="info-label">${key.toUpperCase()}</div><div class="info-value"><span class="status-badge ${cls}">${status}</span></div></div>`;
        }).join('');
    } catch (error) {
        logToConsole('error', 'Error verificando drivers');
    }
}

// ===== LOADING =====
function showLoading(text) {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').classList.add('active');
}
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// ===== CONSOLE =====
function initConsole() {
    document.getElementById('clearConsole')?.addEventListener('click', () => {
        document.getElementById('consoleOutput').innerHTML = '';
        logToConsole('info', 'Console limpiada');
    });
    document.getElementById('toggleConsole')?.addEventListener('click', () => {
        document.getElementById('consoleArea')?.classList.toggle('minimized');
    });
}

function logToConsole(level, message) {
    const output = document.getElementById('consoleOutput');
    if (!output) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${level}`;
    const time = new Date().toLocaleTimeString();
    entry.textContent = `[${time}] ${message}`;
    output.appendChild(entry);
    output.scrollTop = output.scrollHeight;
}

// ===== MODALS =====
function initModals() {
    document.getElementById('closeModal')?.addEventListener('click', () => {
        document.getElementById('deviceModal')?.classList.remove('active');
    });
    document.getElementById('closeResultModal')?.addEventListener('click', () => {
        document.getElementById('resultModal')?.classList.remove('active');
    });
    document.getElementById('deviceInfoBtn')?.addEventListener('click', showDeviceModal);

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });
    });
}

function showDeviceModal() {
    const modal = document.getElementById('deviceModal');
    const content = document.getElementById('deviceInfoContent');
    if (!modal || !content) return;

    if (!currentDevice) {
        content.innerHTML = '<p class="text-muted">No hay dispositivo conectado.</p>';
    } else {
        const d = currentDevice;
        const items = [
            ['Marca', d.brand], ['Modelo', d.model], ['Fabricante', d.manufacturer],
            ['Sistema', d.androidVersion || d.iosVersion || 'N/A'],
            ['SDK', d.sdk || 'N/A'], ['Chipset', d.chipset || 'N/A'],
            ['IMEI', d.imei || 'N/A'], ['Serial', d.serialNumber || d.id],
            ['Security Patch', d.securityPatch || 'N/A'], ['Build', d.buildNumber || 'N/A'],
            ['Estado', d.state], ['Tipo', d.type?.toUpperCase()]
        ].filter(([,v]) => v && v !== 'N/A' && v !== 'Unknown');

        content.innerHTML = `<div class="info-grid">${items.map(([label, value]) =>
            `<div class="info-item"><div class="info-label">${label}</div><div class="info-value">${escapeHtml(value)}</div></div>`
        ).join('')}</div>`;
    }
    modal.classList.add('active');
}
