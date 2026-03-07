# AspvServicces - Professional Device Service Tool

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-lightgrey.svg)
![License](https://img.shields.io/badge/license-Proprietary-red.svg)

A premium professional toolkit for mobile device servicing, unlocking, and firmware management.

## Features

- **Android Tools**: FRP Bypass, Screen Lock Removal, Firmware Flashing, MDM/Knox Removal, IMEI Repair
- **iOS Tools**: iCloud Bypass, Device Activation, Jailbreak Support
- **Carrier Unlock**: Support for Telcel, AT&T, Payjoy (Mexico)
- **MDM Bypass**: QR Code generation, Knox Guard removal
- **Driver Management**: Automatic installation of device drivers
- **Premium Terminal**: Colorful CLI interface with advanced features

## Installation

### Prerequisites

- Windows 10/11 (64-bit)
- Node.js 18+ (for development)
- Administrator privileges

### For End Users

1. Download `AspvServicces-Setup.exe`
2. Run as Administrator
3. Follow the installation wizard
4. Launch from Desktop shortcut

### For Developers

```bash
# Clone repository
git clone https://github.com/aspvservicces/herramienta-aspvservicces.git
cd herramienta-aspvservicces

# Install dependencies
npm install

# Run in development mode
npm start

# Build for production
npm run build:win
```

## Usage

### GUI Mode

Launch the application and use the visual interface to:
1. Detect connected devices
2. Select tools from the sidebar
3. Execute operations with guided workflows

### CLI Mode

```bash
# Run CLI directly
node src/cli.js

# Or use the packaged version
aspv-cli
```

## Documentation

- [Spanish Documentation](README_ES.md) - Documentación completa en español
- [Build Instructions](docs/BUILD.md) - How to build from source
- [API Reference](docs/API.md) - Module documentation

## Legal Notice

⚠️ **IMPORTANT**: This tool is designed for authorized device repair and service purposes only. Users must:
- Own the devices being serviced or have explicit authorization
- Comply with all local laws and regulations
- Accept that certain operations may void warranties
- Understand that IMEI modification may be illegal in some jurisdictions

**Use at your own risk.** The authors assume no liability for misuse of this software.

## License

Copyright © 2024 AspvServicces Team. All rights reserved.

This is proprietary software. See [LICENSE.txt](LICENSE.txt) for details.

## Support

- Email: support@aspvservicces.com
- Issues: Use GitHub Issues for bug reports
- Community: Join our Discord/Telegram

---

Built with ❤️ for mobile service professionals