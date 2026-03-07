# AspvServices v2.0 - Professional Device Service Tool

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%2010%2F11-lightgrey.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)
![Electron](https://img.shields.io/badge/Electron-33-47848F.svg)
![Updated](https://img.shields.io/badge/updated-2026-brightgreen.svg)

## Descripcion

**AspvServices** es una herramienta profesional para Windows diseñada para tecnicos de servicio de dispositivos moviles. Incluye funciones completas de desbloqueo, reparacion, flasheo de firmware y gestion de dispositivos Android e iOS.

## Caracteristicas Principales

### Android Tools
| Funcion | Descripcion | Marcas Soportadas |
|---------|-------------|-------------------|
| **FRP Bypass** | Eliminacion de Factory Reset Protection | Samsung, Xiaomi, Huawei, Motorola, Oppo, Vivo, Realme, Tecno, Infinix, LG |
| **Screen Lock Removal** | Remueve PIN, patron, password, huella, Face ID | Todas las marcas |
| **Firmware Flash** | Flasheo de firmware oficial y custom | Qualcomm, MediaTek, UNISOC, Kirin, Exynos |
| **MDM/Knox Removal** | Elimina MDM empresarial y Knox Guard | Samsung Knox, Google EMM, AirWatch, Intune, MobileIron |
| **IMEI Repair** | Reparacion y restauracion de IMEI | MediaTek, Qualcomm, UNISOC |
| **Mi Account Bypass** | Bypass de Mi Cloud/Mi Account | Xiaomi, Redmi, POCO |
| **Bootloader Unlock/Lock** | Gestion de bootloader | Todas las marcas |
| **Funciones Avanzadas** | Reparar llamadas, WiFi, Diag Mode, menus ocultos | Multi-marca |

### iOS / iPhone Tools
| Funcion | Descripcion |
|---------|-------------|
| **iCloud Bypass** | checkra1n, palera1n, F3arRa1n, Sliver, Signal |
| **Activacion** | Activacion de dispositivos iOS |
| **Jailbreak** | Auto-detecta herramienta correcta para version iOS |

### Desbloqueo de Operador (Mexico)
| Operador | Funciones |
|----------|-----------|
| **Telcel** | Desbloqueo de red, codigo unlock, remocion de apps |
| **AT&T** | Desbloqueo oficial/alternativo, remocion de bloatware |
| **Payjoy** | Eliminacion de bloqueo de financiamiento |

### Utilidades
- **Gestion de Drivers** - ADB, Samsung, Qualcomm 9008, MediaTek VCOM, Apple, Huawei, Motorola, LG
- **QR MDM Bypass** - Generador de codigos QR para bypass MDM durante setup inicial
- **Terminal Premium** - Consola integrada ADB/Fastboot con comandos rapidos
- **Deteccion Automatica** - Detecta dispositivos Android e iOS conectados por USB

## Chipsets Soportados

- **Qualcomm** - MSM, SDM, SM series (Modo EDL 9008)
- **MediaTek** - MT series (SP Flash Tool, preloader)
- **Samsung Exynos** - (Odin/Download mode)
- **UNISOC / Spreadtrum** - (Research Download)
- **HiSilicon Kirin** - (HiSuite)
- **Google Tensor** - (Fastboot)

## Requisitos del Sistema

- **OS:** Windows 10/11 (64-bit)
- **RAM:** 4 GB minimo
- **Disco:** 500 MB de espacio libre
- **USB:** Puerto USB 2.0/3.0
- **Drivers:** Se instalan desde la herramienta
- **Permisos:** Administrador

## Instalacion

### Desde el Installer (EXE)
1. Descarga `AspvServices-2.0.0-Setup.exe` desde la seccion de releases
2. Ejecuta como Administrador
3. Sigue el asistente de instalacion
4. Lanza desde el acceso directo en escritorio

### Desde codigo fuente
```bash
# Clonar repositorio
git clone <repo-url>
cd aspvservices

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir instalador Windows
npm run build:win
```

## Estructura del Proyecto

```
aspvservices/
├── src/
│   ├── main.js              # Proceso principal Electron
│   ├── preload.js            # Bridge IPC (context isolation)
│   ├── cli.js                # Interfaz CLI Premium
│   ├── modules/
│   │   ├── DeviceManager.js  # Deteccion de dispositivos
│   │   ├── AndroidTools.js   # Herramientas Android (FRP, Screen, Flash, MDM, IMEI)
│   │   ├── iOSTools.js       # Herramientas iOS (iCloud, Jailbreak, Activacion)
│   │   ├── MDMBypass.js      # MDM Bypass + QR Generator
│   │   ├── CarrierUnlock.js  # Desbloqueo de operadores Mexico
│   │   └── DriverManager.js  # Gestion de drivers
│   ├── ui/
│   │   ├── index.html        # UI principal
│   │   ├── styles.css        # Estilos premium
│   │   └── app.js            # Logica frontend
│   └── utils/
│       └── PremiumCLI.js     # Utilidades CLI
├── assets/                   # Iconos e imagenes
├── config/
│   └── electron-builder.json # Configuracion de build
├── drivers/                  # Drivers incluidos
├── tools/                    # Herramientas externas
├── scripts/
│   └── build.js              # Script de build
├── package.json
├── LICENSE.txt
└── README.md
```

## Tecnologias

- **Electron 33** - Framework de aplicacion desktop
- **Node.js 22** - Runtime
- **electron-builder 25** - Generacion de instaladores
- **QRCode** - Generacion de codigos QR
- **ADB/Fastboot** - Comunicacion con dispositivos Android
- **libimobiledevice** - Comunicacion con dispositivos iOS

## Seguridad

- Context Isolation habilitado
- Node Integration deshabilitado en renderer
- Preload script como bridge IPC
- Content Security Policy implementada
- Sin acceso directo al filesystem desde la UI

## Licencia

Software propietario. Todos los derechos reservados 2026 AspvServices Team.

## Aviso Legal

Esta herramienta esta diseñada para tecnicos de servicio profesionales. El uso indebido de funciones de desbloqueo en dispositivos que no son de su propiedad puede ser ilegal. El usuario es responsable del uso correcto de la herramienta.
