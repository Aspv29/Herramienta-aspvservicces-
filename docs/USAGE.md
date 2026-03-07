# AspvServicces - User Guide

Complete guide for using AspvServicces Professional Device Service Tool.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Device Connection](#device-connection)
3. [Android Tools](#android-tools)
4. [iOS Tools](#ios-tools)
5. [Carrier Unlock](#carrier-unlock)
6. [MDM Bypass](#mdm-bypass)
7. [Drivers](#drivers)
8. [Terminal Mode](#terminal-mode)
9. [Tips & Best Practices](#tips--best-practices)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### First Launch

1. Launch AspvServicces from desktop shortcut
2. Grant administrator privileges if prompted
3. The main interface will appear

### Interface Overview

- **Header**: Device status and detection button
- **Sidebar**: Tool categories
- **Main Area**: Active tool interface
- **Console**: Operation logs and messages

## Device Connection

### Connecting Android Devices

1. **Enable USB Debugging:**
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Go to Settings > Developer Options
   - Enable "USB Debugging"

2. **Connect Device:**
   - Use quality USB cable
   - Connect to PC
   - Allow USB debugging on device popup
   - Click "🔄 Detectar" in AspvServicces

3. **Verify Connection:**
   - Device info should appear in status bar
   - Console should show "Device detected"

### Connecting iOS Devices

1. **Trust Computer:**
   - Connect device
   - Tap "Trust" on device popup
   - Enter device passcode

2. **Install iTunes/Apple Mobile Device Support:**
   - Required for iOS communication
   - Install from Drivers section if needed

3. **Verify Connection:**
   - Click "🔄 Detectar"
   - iOS device should be recognized

## Android Tools

### FRP Bypass (Factory Reset Protection)

**Purpose:** Remove Google account lock after factory reset

**Steps:**

1. Select "🔓 FRP Bypass" from sidebar
2. Choose device brand
3. Select bypass method:
   - **ADB Method**: For devices with ADB access
   - **Fastboot Method**: For bootloader-unlocked devices
   - **Combination File**: For Samsung devices
   - **Test Point**: Hardware method (advanced)

4. Click "🚀 Ejecutar FRP Bypass"
5. Follow on-screen instructions
6. Wait for completion
7. Reboot device

**Best Method by Brand:**
- Samsung: Combination File + ADB
- Xiaomi: ADB or Mi Flash
- Huawei: ADB Method
- Others: ADB or Fastboot

### Screen Lock Removal

**Purpose:** Remove PIN, Pattern, Password, Fingerprint locks

**Steps:**

1. Select "🔐 Screen Lock" from sidebar
2. Choose lock type (or select "All methods")
3. Click "🔓 Eliminar Bloqueo"
4. Confirm the operation
5. Device will reboot automatically

**⚠️ Warning:** This will remove all screen locks. Data may be preserved.

### Firmware Flash

**Purpose:** Install official or custom firmware

**Steps:**

1. Select "💾 Firmware Flash"
2. Click "📁 Seleccionar Archivo"
3. Choose firmware file (.zip, .tar, .md5, etc.)
4. Select flash method:
   - **Odin**: For Samsung devices
   - **SP Flash Tool**: For MediaTek chipsets
   - **QFIL**: For Qualcomm devices
   - **Mi Flash**: For Xiaomi devices
   - **Fastboot**: For bootloader operations

5. Click "⚡ Flash Firmware"
6. **Do not disconnect** device during flashing
7. Wait for completion (may take 5-15 minutes)

**⚠️ Critical:**
- Battery must be >50%
- Use correct firmware for exact model
- Backup important data first

### MDM / Knox Removal

**Purpose:** Remove enterprise device management

**Steps:**

1. Select "🛡️ MDM/Knox" from sidebar
2. Choose MDM type:
   - Samsung Knox Guard
   - Google EMM/MDM
   - Microsoft Intune
   - Other MDM solutions

3. Click "🗑️ Eliminar MDM"
4. Confirm operation
5. Follow additional steps if needed

**Company App Removal (Mexico):**

For Telcel, AT&T, Payjoy locks:
1. Click on carrier icon
2. Select "🗑️ Desinstalar App Seleccionada"
3. Apps will be removed/disabled
4. Reboot device

### IMEI Repair

**Purpose:** Fix corrupted or invalid IMEI

**⚠️ Legal Warning:** IMEI modification may be illegal in your country

**Supported Chipsets:**
- MediaTek (MTK)
- Qualcomm (Requires QCN backup)

**Steps:**

1. Select "📱 IMEI Repair"
2. **Backup EFS/QCN first** (critical!)
3. Enter correct IMEI (15 digits)
4. Verify IMEI is valid
5. Execute repair
6. Reboot and verify with *#06#

### Mi Account Bypass

**Purpose:** Remove Xiaomi account lock

**Steps:**

1. Select "🌐 Mi Account"
2. Ensure device is connected with ADB
3. Click "🚀 Bypass Mi Account"
4. Wait for process completion
5. Device will reboot
6. Complete setup without Mi Account

**Limitations:**
- Some features may not work
- OTA updates may fail
- Find My Device will not work

### Bootloader Unlock/Lock

**Purpose:** Unlock/lock device bootloader

**Steps:**

1. Select "🔧 Bootloader"
2. Choose operation:
   - 🔓 Unlock
   - 🔒 Lock

3. Device will enter fastboot mode
4. Follow on-screen prompts
5. Confirm unlock (will wipe data)

**Brand-Specific:**
- **Xiaomi**: Requires Mi Unlock tool + wait period
- **Huawei**: Requires unlock code
- **Samsung**: Use Odin
- **Others**: May require OEM authorization

## iOS Tools

### iCloud Bypass

**Purpose:** Access device locked with iCloud

**⚠️ Warning:** Results in limited functionality

**Methods:**

1. Select "☁️ iCloud Bypass"
2. Choose method:
   - checkra1n (iOS 12-14.8)
   - F3arRa1n (Linux required)
   - Sliver (macOS)
   - Signal
   - Mina

3. Follow method-specific instructions
4. Jailbreak required for most methods

**Limitations After Bypass:**
- No cellular service
- No iCloud services
- No App Store (official)
- WiFi only

### Device Activation

**Purpose:** Activate iOS device

**Steps:**

1. Select "✅ Activation"
2. Device must be connected
3. Click "✅ Activar Dispositivo"
4. Wait for activation process
5. May require valid Apple account

### Jailbreak

**Purpose:** Gain root access to iOS

**Steps:**

1. Select "🔓 Jailbreak"
2. Tool will detect iOS version
3. Recommended jailbreak tools will be shown
4. Download and use recommended tool
5. Follow tool-specific instructions

**Popular Tools:**
- checkra1n (iOS 12-14.8.1)
- unc0ver (iOS 11-14.8)
- Taurine (iOS 14-14.8.1)
- palera1n (iOS 15-16.5)
- Dopamine (iOS 15-15.4.1)

## Carrier Unlock

### Telcel Unlock (Mexico)

**Methods Available:**

1. **Unlock Code Method:**
   - Tool generates unlock code
   - Insert non-Telcel SIM
   - Enter provided code
   - Instant unlock

2. **APK Removal:**
   - Removes Telcel lock apps
   - No SIM change needed
   - Requires ADB access

3. **NVRAM Method (Advanced):**
   - Requires root
   - Direct partition modification
   - Backup EFS first

**Steps:**

1. Select "📡 Telcel MX"
2. Enter IMEI (or auto-detect)
3. Choose preferred method
4. Follow instructions for selected method
5. Verify with different carrier SIM

### AT&T Unlock (Mexico)

**Official Method:**
- Visit att.com/deviceunlock
- Submit IMEI
- Wait for approval (2-5 days)
- Follow AT&T instructions

**Alternative Methods:**
1. APK Removal
2. Carrier restrictions bypass
3. Third-party unlock services

### Payjoy Unlock

**⚠️ Important:** Only use on fully paid devices

**Methods:**

1. **APK Removal:**
   - Removes Payjoy lock app
   - Disables device admin
   - Requires ADB or root

2. **ADB Advanced:**
   - Complete removal via ADB
   - Clears all Payjoy data
   - Factory reset recommended after

**Steps:**

1. Select "💳 Payjoy"
2. Choose method
3. Confirm operation
4. Wait for completion
5. Reboot device
6. Verify lock is removed

## MDM Bypass

### QR Code Generation

**Purpose:** Bypass MDM enrollment during setup

**Steps:**

1. Select "📷 QR MDM Bypass"
2. Choose device type:
   - Samsung
   - LG
   - Motorola
   - Generic

3. Select carrier:
   - Telcel
   - AT&T
   - Movistar
   - Generic

4. Click "🎯 Generar QR Code"
5. QR code will be displayed
6. Save/print QR code

**Using the QR Code:**

1. Factory reset device
2. Start setup wizard
3. On first screen, tap 6 times
4. Scan generated QR code
5. Setup will skip MDM enrollment
6. Complete setup normally

## Drivers

### Driver Management

**Available Drivers:**

- 📥 Android ADB & Fastboot
- 📥 Samsung USB Drivers
- 📥 Qualcomm QDLoader
- 📥 MediaTek VCOM
- 📥 Apple Mobile Device
- 📥 Huawei HiSuite
- 📥 LG USB Drivers
- 📥 Motorola Device Manager

**Installing Drivers:**

1. Select "💿 Drivers"
2. Click on driver to install
3. Follow installation wizard
4. Restart computer if prompted
5. Verify installation

**Checking Driver Status:**

- Green ✓ = Installed
- Red ✖ = Not installed
- Progress bar shows overall status

## Terminal Mode

### Using the Terminal

**Purpose:** Execute custom ADB/Fastboot commands

**Steps:**

1. Select "⌨️ Terminal"
2. Type command in input box
3. Press Enter or click "▶️ Ejecutar"
4. View output in console

**Quick Commands:**

- `adb devices` - List connected devices
- `adb shell getprop` - Get device properties
- `fastboot devices` - List fastboot devices
- `adb reboot` - Reboot device
- `adb reboot bootloader` - Boot to bootloader
- `adb reboot recovery` - Boot to recovery

**Custom Commands:**

```bash
# Get IMEI
adb shell service call iphonesubinfo 1

# List installed packages
adb shell pm list packages

# Uninstall app
adb shell pm uninstall --user 0 com.package.name

# Grant permission
adb shell pm grant com.package.name android.permission.PERMISSION_NAME
```

## Tips & Best Practices

### General Tips

1. **Always backup data** before major operations
2. **Verify device model** matches firmware
3. **Keep battery above 50%** during flashing
4. **Use quality USB cables** - cheap cables cause issues
5. **Don't interrupt** operations in progress
6. **Read warnings** before confirming operations

### Safety Checklist

Before any operation:

- [ ] Device is fully charged (>50%)
- [ ] Correct firmware/method selected
- [ ] Important data backed up
- [ ] USB cable is secure
- [ ] You have authorization to service device
- [ ] You understand the risks

### Maximizing Success

1. **Update drivers regularly**
2. **Use recommended methods** for each brand
3. **Follow step-by-step instructions**
4. **Check console for errors**
5. **Don't rush** - operations take time
6. **Keep notes** on what works for each model

## Troubleshooting

### Device Not Detected

**Solutions:**

1. Check USB cable (try different cable)
2. Enable USB Debugging (Android)
3. Install/update device drivers
4. Try different USB port
5. Restart device and PC
6. Check Device Manager for errors

### Operation Failed

**Common Causes:**

- Insufficient permissions
- Driver not installed
- Wrong method for device
- Interrupted connection
- Device in wrong mode

**Solutions:**

1. Run as Administrator
2. Install missing drivers
3. Try alternative method
4. Reconnect device
5. Reboot device to correct mode
6. Check console logs for specific error

### Bricked Device

**⚠️ If device won't boot:**

1. **Don't panic** - most bricks are fixable
2. Try entering **Recovery Mode**
3. Try entering **Download/Fastboot Mode**
4. Use **EDL/9008 mode** (Qualcomm)
5. Flash **stock firmware**
6. Seek professional help if needed

**Prevention:**

- Use correct firmware
- Don't interrupt flashing
- Keep battery charged
- Backup EFS/persist partitions

### App-Specific Issues

**GUI not responding:**
- Force close and restart
- Check Task Manager
- Restart as Administrator

**Terminal commands failing:**
- Verify ADB/Fastboot in PATH
- Check device connection
- Verify USB debugging enabled
- Try with device ID: `adb -s DEVICE_ID command`

## Getting Help

### Support Channels

- 📧 Email: support@aspvservicces.com
- 💬 Discord: [Community Server]
- 📱 Telegram: @AspvServicces
- 🐛 GitHub Issues: Bug reports

### Before Contacting Support

Provide:
1. Device model and brand
2. What you were trying to do
3. Error message (screenshot)
4. Console log (copy/paste)
5. AspvServicces version
6. Windows version

---

**Remember:** This tool is powerful. Use responsibly and only on devices you own or have authorization to service.

Last Updated: 2024
