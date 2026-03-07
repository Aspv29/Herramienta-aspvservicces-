# AspvServicces - Quick Start Guide

Get started with AspvServicces in 5 minutes!

## Installation

1. **Download** `AspvServicces-Setup.exe`
2. **Run as Administrator** (right-click → Run as Administrator)
3. **Follow installer** wizard
4. **Launch** from desktop shortcut

## First Time Setup

### Step 1: Install Drivers

1. Open AspvServicces
2. Click "💿 Drivers" in sidebar
3. Install required drivers:
   - ✅ ADB Drivers (for Android)
   - ✅ Samsung Drivers (if servicing Samsung)
   - ✅ Apple Mobile Device (for iOS)
4. Restart computer if prompted

### Step 2: Connect a Device

**For Android:**
1. Enable USB Debugging on device
2. Connect via USB cable
3. Allow USB debugging popup on device
4. Click "🔄 Detectar" in AspvServicces

**For iOS:**
1. Connect device via Lightning cable
2. Trust computer on device
3. Click "🔄 Detectar" in AspvServicces

## Common Tasks

### Unlock Android (FRP Bypass)

```
1. Connect device with ADB enabled
2. Click "🔓 FRP Bypass"
3. Select your device brand
4. Choose "ADB Method"
5. Click "🚀 Ejecutar FRP Bypass"
6. Wait for completion
7. Reboot device
```

### Remove Screen Lock

```
1. Connect Android device
2. Click "🔐 Screen Lock"
3. Select lock type
4. Click "🔓 Eliminar Bloqueo"
5. Confirm operation
6. Device reboots automatically
```

### Unlock Carrier (Mexico)

```
1. Click "📡 Carrier Unlock"
2. Select carrier (Telcel/AT&T/Payjoy)
3. Enter IMEI or auto-detect
4. Choose unlock method
5. Follow method instructions
6. Test with different SIM
```

### Generate MDM Bypass QR

```
1. Click "📷 QR MDM Bypass"
2. Select device type
3. Select carrier
4. Click "🎯 Generar QR Code"
5. Save/print QR code
6. Use during device setup
```

### Remove Knox Guard

```
1. Connect Samsung device
2. Click "🛡️ MDM/Knox"
3. Select "Knox Guard"
4. Click "🗑️ Eliminar MDM"
5. Confirm (warranty warning)
6. Reboot device
```

## Using CLI Mode

```bash
# Open Command Prompt as Administrator
cd "C:\Program Files\AspvServicces"
node src/cli.js

# Or if added to PATH
aspv-cli
```

**CLI Navigation:**
- Use arrow keys to select options
- Press Enter to confirm
- Type "exit" in terminal mode to return

## Quick Commands

### Android ADB Commands

Open Terminal (⌨️) and run:

```bash
# List devices
adb devices

# Get device info
adb shell getprop

# Reboot to bootloader
adb reboot bootloader

# Reboot to recovery
adb reboot recovery

# Get IMEI
adb shell service call iphonesubinfo 1

# Remove app
adb shell pm uninstall --user 0 com.package.name
```

### Fastboot Commands

```bash
# List devices in fastboot
fastboot devices

# Unlock bootloader
fastboot oem unlock

# Flash partition
fastboot flash recovery recovery.img

# Erase partition
fastboot erase userdata

# Reboot
fastboot reboot
```

## Troubleshooting

### Device Not Detected

**Try this:**
1. Check USB cable (use different cable)
2. Enable USB Debugging (Android)
3. Trust computer (iOS)
4. Install drivers from Drivers section
5. Try different USB port
6. Restart device
7. Restart AspvServicces as Administrator

### Operation Failed

**Common fixes:**
1. Run as Administrator
2. Check device connection
3. Verify drivers are installed
4. Read error in console log
5. Try alternative method
6. Ensure device has >50% battery

### ADB Not Recognized

**Solution:**
1. Go to Drivers section
2. Install ADB Drivers
3. Restart computer
4. Verify: Open CMD, type `adb version`

## Safety Checklist

Before ANY operation:

- [ ] Device is charged (>50%)
- [ ] Important data is backed up
- [ ] You have authorization to service device
- [ ] You selected correct firmware/method
- [ ] You read and understood warnings
- [ ] USB cable is secure and quality

## Tips for Success

1. **Use Quality Cables** - Cheap cables cause 90% of connection issues
2. **Read Console Logs** - Errors are shown in red in console area
3. **Don't Rush** - Operations take time, don't interrupt
4. **Brand Matters** - Different brands need different methods
5. **Backup First** - Always backup important data
6. **Test After** - Verify operation worked before returning device

## Getting Help

### Before Asking for Help

1. Check console log for error message
2. Try operation again
3. Read relevant section in docs/USAGE.md
4. Search GitHub Issues

### When Reporting Issues

Include:
- Device brand and model
- What you tried to do
- Error message (screenshot)
- Console log (copy/paste)
- AspvServicces version

### Contact

- 📧 Email: support@aspvservicces.com
- 💬 Discord: [Community Server]
- 📱 Telegram: @AspvServicces
- 🐛 GitHub: Open an issue

## Next Steps

### Learn More

- Read full user guide: `docs/USAGE.md`
- Check documentation: `README_ES.md` (Spanish)
- Explore all tools in sidebar
- Join community for tips and tricks

### Advanced Features

Once comfortable with basics:
- Try firmware flashing
- Explore IMEI repair (carefully!)
- Use advanced ADB commands
- Create custom unlock methods

## Legal Reminder

⚠️ **Important:**
- Only service devices you own or have permission to service
- Some operations void warranty
- Check local laws before IMEI modification
- Payjoy devices must be paid off
- iCloud bypass has limitations

**Use responsibly and ethically!**

---

## Quick Reference Card

| Task | Navigation |
|------|-----------|
| FRP Bypass | 🔓 FRP Bypass |
| Screen Lock | 🔐 Screen Lock |
| Firmware | 💾 Firmware Flash |
| MDM/Knox | 🛡️ MDM/Knox |
| IMEI Repair | 📱 IMEI Repair |
| Mi Account | 🌐 Mi Account |
| Bootloader | 🔧 Bootloader |
| iCloud | ☁️ iCloud Bypass |
| iOS Activation | ✅ Activation |
| Jailbreak | 🔓 Jailbreak |
| Telcel | 📡 Telcel MX |
| AT&T | 📡 AT&T MX |
| Payjoy | 💳 Payjoy |
| Drivers | 💿 Drivers |
| QR Code | 📷 QR MDM Bypass |
| Terminal | ⌨️ Terminal |

---

**Happy Servicing!** 🚀

Version: 1.0.0 | Platform: Windows 10/11
