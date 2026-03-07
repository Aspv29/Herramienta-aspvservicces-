#!/usr/bin/env node

const PremiumCLI = require('./utils/PremiumCLI');
const DeviceManager = require('./modules/DeviceManager');
const AndroidTools = require('./modules/AndroidTools');
const iOSTools = require('./modules/iOSTools');
const MDMBypass = require('./modules/MDMBypass');
const CarrierUnlock = require('./modules/CarrierUnlock');
const DriverManager = require('./modules/DriverManager');

class AspvServiccesCLI {
    constructor() {
        this.cli = new PremiumCLI();
        this.deviceManager = new DeviceManager();
        this.androidTools = new AndroidTools();
        this.iosTools = new iOSTools();
        this.mdmBypass = new MDMBypass();
        this.carrierUnlock = new CarrierUnlock();
        this.driverManager = new DriverManager();
        this.currentDevice = null;
    }

    async start() {
        this.cli.showBanner();
        await this.mainMenu();
    }

    async mainMenu() {
        while (true) {
            const choice = await this.cli.showMenu('MENÚ PRINCIPAL', [
                { name: '📱 Detectar Dispositivos', value: 'detect' },
                { name: '🔓 Herramientas Android', value: 'android' },
                { name: '🍎 Herramientas iOS', value: 'ios' },
                { name: '📡 Desbloqueo de Operador', value: 'carrier' },
                { name: '🛡️ MDM / Knox Bypass', value: 'mdm' },
                { name: '💿 Gestión de Drivers', value: 'drivers' },
                { name: '⌨️ Terminal ADB/Fastboot', value: 'terminal' },
                { name: '❌ Salir', value: 'exit' }
            ]);

            switch (choice) {
                case 'detect':
                    await this.detectDevices();
                    break;
                case 'android':
                    await this.androidMenu();
                    break;
                case 'ios':
                    await this.iosMenu();
                    break;
                case 'carrier':
                    await this.carrierMenu();
                    break;
                case 'mdm':
                    await this.mdmMenu();
                    break;
                case 'drivers':
                    await this.driversMenu();
                    break;
                case 'terminal':
                    await this.terminalMode();
                    break;
                case 'exit':
                    this.cli.info('Gracias por usar AspvServicces!');
                    process.exit(0);
            }
        }
    }

    async detectDevices() {
        this.cli.showHeader('DETECCIÓN DE DISPOSITIVOS', 'Buscando dispositivos conectados...');

        const result = await this.cli.executeWithSpinner(
            'Detectando dispositivos',
            async () => await this.deviceManager.detectDevices()
        );

        if (result.success && result.result.length > 0) {
            this.cli.success(`Se encontraron ${result.result.length} dispositivo(s)`);

            const headers = ['#', 'Tipo', 'Marca', 'Modelo', 'Estado'];
            const rows = result.result.map((device, index) => [
                index + 1,
                device.type.toUpperCase(),
                device.brand,
                device.model,
                device.state
            ]);

            this.cli.showTable(headers, rows);

            if (result.result.length === 1) {
                this.currentDevice = result.result[0];
                this.cli.showDeviceInfo(this.currentDevice);
            } else {
                const deviceChoice = await this.cli.input('Selecciona el número de dispositivo (1-' + result.result.length + '):', '1');
                this.currentDevice = result.result[parseInt(deviceChoice) - 1];
                if (this.currentDevice) {
                    this.cli.showDeviceInfo(this.currentDevice);
                }
            }
        } else {
            this.cli.warning('No se encontraron dispositivos conectados');
            this.cli.showInstructions('Asegúrate de que:', [
                'El dispositivo esté conectado por USB',
                'La depuración USB esté habilitada (Android)',
                'Los drivers estén instalados correctamente',
                'El cable USB esté funcionando'
            ]);
        }

        await this.cli.pause();
    }

    async androidMenu() {
        if (!this.currentDevice || this.currentDevice.type !== 'android') {
            this.cli.warning('No hay dispositivo Android conectado');
            await this.cli.pause();
            return;
        }

        const choice = await this.cli.showMenu('HERRAMIENTAS ANDROID', [
            { name: '🔓 FRP Bypass', value: 'frp' },
            { name: '🔐 Screen Lock Removal', value: 'screen' },
            { name: '💾 Flash Firmware', value: 'firmware' },
            { name: '📱 IMEI Repair', value: 'imei' },
            { name: '🌐 Mi Account Bypass', value: 'xiaomi' },
            { name: '🔧 Unlock Bootloader', value: 'bootloader' },
            { name: '🔙 Volver', value: 'back' }
        ]);

        switch (choice) {
            case 'frp':
                await this.removeFRP();
                break;
            case 'screen':
                await this.removeScreenLock();
                break;
            case 'firmware':
                await this.flashFirmware();
                break;
            case 'imei':
                await this.repairIMEI();
                break;
            case 'xiaomi':
                await this.bypassMiAccount();
                break;
            case 'bootloader':
                await this.unlockBootloader();
                break;
        }
    }

    async iosMenu() {
        if (!this.currentDevice || this.currentDevice.type !== 'ios') {
            this.cli.warning('No hay dispositivo iOS conectado');
            await this.cli.pause();
            return;
        }

        const choice = await this.cli.showMenu('HERRAMIENTAS iOS', [
            { name: '☁️ iCloud Bypass', value: 'icloud' },
            { name: '✅ Activar Dispositivo', value: 'activate' },
            { name: '🔓 Jailbreak', value: 'jailbreak' },
            { name: '🔙 Volver', value: 'back' }
        ]);

        switch (choice) {
            case 'icloud':
                await this.bypassiCloud();
                break;
            case 'activate':
                await this.activateiOS();
                break;
            case 'jailbreak':
                await this.jailbreakiOS();
                break;
        }
    }

    async carrierMenu() {
        const choice = await this.cli.showMenu('DESBLOQUEO DE OPERADOR (MÉXICO)', [
            { name: '📡 Telcel', value: 'telcel' },
            { name: '📡 AT&T', value: 'att' },
            { name: '💳 Payjoy', value: 'payjoy' },
            { name: '🔙 Volver', value: 'back' }
        ]);

        if (choice !== 'back') {
            await this.unlockCarrier(choice);
        }
    }

    async mdmMenu() {
        const choice = await this.cli.showMenu('MDM / KNOX BYPASS', [
            { name: '🛡️ Knox Guard Removal', value: 'knox' },
            { name: '📷 Generar QR MDM Bypass', value: 'qr' },
            { name: '🗑️ Remover Apps de Compañía', value: 'apps' },
            { name: '🔙 Volver', value: 'back' }
        ]);

        switch (choice) {
            case 'knox':
                await this.bypassKnox();
                break;
            case 'qr':
                await this.generateMDMQR();
                break;
            case 'apps':
                await this.removeCompanyApps();
                break;
        }
    }

    async driversMenu() {
        this.cli.showHeader('GESTIÓN DE DRIVERS');

        const status = await this.driverManager.checkDriverStatus();

        this.cli.success(`Drivers instalados: ${status.summary.installed}/${status.summary.total}`);
        this.cli.showProgress(status.summary.installed, status.summary.total, 'Completado');

        const choice = await this.cli.showMenu('OPCIONES DE DRIVERS', [
            { name: '📥 Instalar Driver ADB', value: 'adb' },
            { name: '📥 Instalar Driver Samsung', value: 'samsung' },
            { name: '📥 Instalar Driver Qualcomm', value: 'qualcomm' },
            { name: '📥 Instalar Driver MediaTek', value: 'mtk' },
            { name: '📥 Instalar Driver Apple', value: 'apple' },
            { name: '🔙 Volver', value: 'back' }
        ]);

        if (choice !== 'back') {
            await this.installDriver(choice);
        }
    }

    async removeFRP() {
        this.cli.showHeader('FRP BYPASS', 'Factory Reset Protection Removal');

        const method = await this.cli.showMenu('Selecciona el método:', [
            { name: 'ADB Method', value: 'adb' },
            { name: 'Fastboot Method', value: 'fastboot' },
            { name: 'Combination File (Samsung)', value: 'combination' },
            { name: 'Volver', value: 'back' }
        ]);

        if (method !== 'back') {
            const result = await this.cli.executeWithSpinner(
                'Removiendo FRP',
                async () => await this.androidTools.removeFRP(this.currentDevice.id, method)
            );

            if (result.success) {
                this.cli.printBox('FRP BYPASS COMPLETADO', [
                    result.result.message,
                    '',
                    'Reinicia el dispositivo para aplicar cambios'
                ], 'success');

                if (result.result.instructions) {
                    this.cli.showInstructions('Instrucciones adicionales', result.result.instructions);
                }
            }
        }

        await this.cli.pause();
    }

    async removeScreenLock() {
        this.cli.showHeader('SCREEN LOCK REMOVAL');

        const confirmed = await this.cli.confirm('¿Deseas eliminar el bloqueo de pantalla?');

        if (confirmed) {
            const result = await this.cli.executeWithSpinner(
                'Eliminando bloqueo de pantalla',
                async () => await this.androidTools.removeScreenLock(this.currentDevice.id)
            );

            if (result.success) {
                this.cli.printBox('BLOQUEO ELIMINADO', [
                    'El bloqueo de pantalla ha sido removido',
                    'El dispositivo se reiniciará automáticamente'
                ], 'success');
            }
        }

        await this.cli.pause();
    }

    async unlockCarrier(carrier) {
        this.cli.showHeader(`DESBLOQUEO ${carrier.toUpperCase()}`);

        if (!this.currentDevice) {
            this.cli.warning('No hay dispositivo conectado');
            await this.cli.pause();
            return;
        }

        const imei = this.currentDevice.imei || await this.cli.input('Ingresa el IMEI del dispositivo:');

        const methods = {
            'telcel': async () => await this.carrierUnlock.unlockTelcel(this.currentDevice.id, imei),
            'att': async () => await this.carrierUnlock.unlockATT(this.currentDevice.id, imei),
            'payjoy': async () => await this.carrierUnlock.unlockPayjoy(this.currentDevice.id)
        };

        const result = await this.cli.executeWithSpinner(
            `Procesando desbloqueo ${carrier}`,
            methods[carrier]
        );

        if (result.success && result.result.methods) {
            this.cli.success('Métodos de desbloqueo disponibles:');

            result.result.methods.forEach((method, index) => {
                this.cli.showSection(`Método ${index + 1}: ${method.method}`);
                if (method.steps) {
                    method.steps.forEach(step => this.cli.log(step));
                }
                if (method.code) {
                    this.cli.printBox('CÓDIGO DE DESBLOQUEO', [`Código: ${method.code}`], 'success');
                }
                this.cli.endSection();
            });
        }

        await this.cli.pause();
    }

    async terminalMode() {
        this.cli.showHeader('TERMINAL ADB/FASTBOOT', 'Modo de comandos interactivo');

        while (true) {
            const command = await this.cli.input('Ingresa comando (o "exit" para salir):');

            if (command.toLowerCase() === 'exit') {
                break;
            }

            if (command.trim()) {
                await this.cli.executeADBCommand(command, this.currentDevice?.id);
            }
        }
    }

    async installDriver(driverType) {
        const result = await this.cli.executeWithSpinner(
            `Instalando driver ${driverType}`,
            async () => await this.driverManager.installDriver(driverType)
        );

        if (result.success) {
            if (result.result.instructions) {
                this.cli.showInstructions('Instrucciones de instalación', result.result.instructions);
            }
        }

        await this.cli.pause();
    }

    async bypassKnox() {
        this.cli.showHeader('KNOX GUARD BYPASS');

        const confirmed = await this.cli.confirm('¿Deseas eliminar Knox Guard? (Esto puede anular la garantía)');

        if (confirmed) {
            const result = await this.cli.executeWithSpinner(
                'Eliminando Knox Guard',
                async () => await this.mdmBypass.bypassKnox(this.currentDevice.id)
            );

            if (result.success) {
                this.cli.printBox('KNOX BYPASS', [
                    result.result.message,
                    '',
                    result.result.warning
                ], 'warning');
            }
        }

        await this.cli.pause();
    }

    async generateMDMQR() {
        this.cli.showHeader('GENERADOR QR MDM BYPASS');

        const deviceType = await this.cli.showMenu('Tipo de dispositivo:', [
            { name: 'Samsung', value: 'samsung' },
            { name: 'LG', value: 'lg' },
            { name: 'Motorola', value: 'motorola' },
            { name: 'Generic', value: 'generic' }
        ]);

        const carrier = await this.cli.showMenu('Operador:', [
            { name: 'Telcel', value: 'telcel' },
            { name: 'AT&T', value: 'att' },
            { name: 'Movistar', value: 'movistar' },
            { name: 'Generic', value: 'generic' }
        ]);

        const result = await this.mdmBypass.generateQRCode(deviceType, carrier);

        if (result.success) {
            this.cli.success('QR Code generado correctamente');
            this.cli.info('El código QR ha sido guardado en: qr-mdm-bypass.png');
            this.cli.showInstructions('Instrucciones de uso', result.instructions);
        }

        await this.cli.pause();
    }

    async removeCompanyApps() {
        this.cli.showHeader('REMOVER APPS DE COMPAÑÍA');

        const appType = await this.cli.showMenu('Selecciona la app a remover:', [
            { name: 'Telcel Lock', value: 'telcel' },
            { name: 'AT&T Lock', value: 'att' },
            { name: 'Payjoy Lock', value: 'payjoy' },
            { name: 'Smart Lock', value: 'smart-lock' }
        ]);

        const result = await this.cli.executeWithSpinner(
            'Removiendo aplicación',
            async () => await this.mdmBypass.removeCompanyApp(this.currentDevice.id, appType)
        );

        if (result.success) {
            this.cli.success('Aplicación removida correctamente');
            if (result.result.results) {
                result.result.results.forEach(r => {
                    this.cli.log(`${r.package}: ${r.status}`);
                });
            }
        }

        await this.cli.pause();
    }

    async flashFirmware() {
        this.cli.showHeader('FLASH FIRMWARE');
        this.cli.warning('Esta función requiere archivos de firmware apropiados');
        await this.cli.pause();
    }

    async repairIMEI() {
        this.cli.showHeader('REPARACIÓN DE IMEI');
        this.cli.warning('La modificación de IMEI puede ser ilegal en tu jurisdicción');
        await this.cli.pause();
    }

    async bypassMiAccount() {
        this.cli.showHeader('MI ACCOUNT BYPASS');
        const result = await this.cli.executeWithSpinner(
            'Bypassing Mi Account',
            async () => await this.androidTools.bypassMiAccount(this.currentDevice.id)
        );
        await this.cli.pause();
    }

    async unlockBootloader() {
        this.cli.showHeader('UNLOCK BOOTLOADER');
        const result = await this.cli.executeWithSpinner(
            'Unlocking bootloader',
            async () => await this.androidTools.unlockBootloader(this.currentDevice.id)
        );
        await this.cli.pause();
    }

    async bypassiCloud() {
        this.cli.showHeader('iCLOUD BYPASS');
        this.cli.warning('iCloud bypass resultará en funcionalidad limitada');
        await this.cli.pause();
    }

    async activateiOS() {
        this.cli.showHeader('ACTIVACIÓN iOS');
        await this.cli.pause();
    }

    async jailbreakiOS() {
        this.cli.showHeader('JAILBREAK iOS');
        await this.cli.pause();
    }
}

// Start the CLI if run directly
if (require.main === module) {
    const app = new AspvServiccesCLI();
    app.start().catch(error => {
        console.error('Error fatal:', error);
        process.exit(1);
    });
}

module.exports = AspvServiccesCLI;
