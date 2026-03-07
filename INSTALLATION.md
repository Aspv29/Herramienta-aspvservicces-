# AspvServicces - Installation & Deployment Guide

Complete guide for installing and deploying AspvServicces.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [End User Installation](#end-user-installation)
3. [Developer Setup](#developer-setup)
4. [Building from Source](#building-from-source)
5. [Deployment](#deployment)
6. [Post-Installation](#post-installation)
7. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10 (64-bit) or Windows 11
- **Processor**: Intel Core i3 or AMD equivalent
- **RAM**: 4 GB
- **Disk Space**: 500 MB (plus space for drivers and tools)
- **USB Ports**: 2.0 or higher
- **Internet**: Required for driver downloads

### Recommended Requirements

- **Operating System**: Windows 11 (64-bit)
- **Processor**: Intel Core i5/i7 or AMD Ryzen 5/7
- **RAM**: 8 GB or more
- **Disk Space**: 2 GB (for tools and firmwares)
- **USB Ports**: USB 3.0 or higher
- **Screen Resolution**: 1920x1080 or higher

### Additional Software

**Required:**
- .NET Framework 4.7.2 or higher (usually pre-installed on Windows 10/11)

**Optional but Recommended:**
- Samsung Smart Switch (for Samsung device support)
- iTunes or Apple Mobile Device Support (for iOS devices)
- Latest USB drivers for your devices

## End User Installation

### Step 1: Download

1. Obtain `AspvServicces-Setup.exe` from official source
2. Verify file integrity (SHA256 checksum if provided)
3. Save to Downloads folder

### Step 2: Install

1. **Right-click** on `AspvServicces-Setup.exe`
2. Select **"Run as Administrator"**
3. If Windows SmartScreen appears:
   - Click "More info"
   - Click "Run anyway"
4. Select installation language (English/Spanish)
5. Accept license agreement
6. Choose installation directory:
   - Default: `C:\Program Files\AspvServicces`
   - Or select custom location
7. Select components (all recommended)
8. Choose Start Menu folder
9. Select additional tasks:
   - ✅ Create desktop shortcut (recommended)
   - ✅ Create Quick Launch icon
10. Click "Install"
11. Wait for installation to complete
12. Click "Finish" to launch AspvServicces

### Step 3: First Launch

1. Application will request Administrator privileges
2. Click "Yes" on User Account Control prompt
3. Main interface will appear
4. Proceed to [Post-Installation](#post-installation)

## Developer Setup

### Prerequisites

Install the following before proceeding:

1. **Node.js** (v18 or higher)
   ```bash
   # Download from https://nodejs.org/
   # Verify installation
   node --version
   npm --version
   ```

2. **Git**
   ```bash
   # Download from https://git-scm.com/
   # Verify installation
   git --version
   ```

3. **Visual Studio Code** (recommended)
   - Download from https://code.visualstudio.com/

### Clone Repository

```bash
# Clone the repository
git clone https://github.com/aspvservicces/herramienta-aspvservicces.git

# Navigate to directory
cd herramienta-aspvservicces

# Verify files
dir  # Windows
ls   # Git Bash
```

### Install Dependencies

```bash
# Install all dependencies
npm install

# This will install:
# - Electron
# - All Node modules
# - Development dependencies
```

### Verify Installation

```bash
# Test GUI mode
npm start

# Test CLI mode
node src/cli.js

# Run build script (test only, won't create installer)
node scripts/build.js --dry-run
```

## Building from Source

### Preparation

1. **Create Assets**

   Place in `assets/` folder:
   - `icon.ico` - Application icon (256x256)
   - `icon.png` - PNG version (1024x1024)
   - `installer-header.bmp` - Installer banner (optional)

   If missing, build will use defaults or fail.

2. **Review Configuration**

   Edit `package.json` if needed:
   ```json
   {
     "name": "aspvservicces",
     "version": "1.0.0",
     "description": "AspvServicces - Professional Device Service Tool",
     "build": {
       // Build configuration
     }
   }
   ```

### Build Process

#### Option 1: Automated Build (Recommended)

```bash
# Run automated build script
node scripts/build.js
```

This script will:
- Check environment
- Create directories
- Verify required files
- Install dependencies
- Build Windows installer
- Report completion

#### Option 2: Manual Build

```bash
# Install dependencies if not already done
npm install

# Build Windows installer
npm run build:win

# Or build specific target
npx electron-builder --win nsis
npx electron-builder --win portable
```

### Build Outputs

After successful build, check `dist/` directory:

```
dist/
├── AspvServicces-1.0.0-Setup.exe          # NSIS Installer (~150-200 MB)
├── AspvServicces-1.0.0-Setup.exe.blockmap  # Update metadata
├── builder-effective-config.yaml           # Build configuration
├── latest.yml                              # Auto-update metadata
└── win-unpacked/                           # Unpacked application
    ├── AspvServicces.exe                   # Main executable
    ├── resources/                          # Application resources
    └── ... (other files)
```

### Verify Build

```bash
# Check file exists
dir dist\AspvServicces-*.exe

# Get file size
powershell -Command "Get-Item dist\AspvServicces-*-Setup.exe | Select-Object Name, Length"

# Generate checksum
certutil -hashfile dist\AspvServicces-1.0.0-Setup.exe SHA256
```

## Deployment

### Testing the Build

Before distribution, test thoroughly:

1. **Clean Installation Test**
   - Use VM or clean test machine
   - Install as end user would
   - Test all major features
   - Verify driver installations work

2. **Upgrade Test**
   - Install previous version (if exists)
   - Install new version over it
   - Verify upgrade works correctly

3. **Uninstall Test**
   - Uninstall application
   - Verify all files removed
   - Check registry cleaned

### Distribution Methods

#### Method 1: Direct Download

1. Upload installer to file host
2. Provide download link
3. Include SHA256 checksum
4. Update documentation

#### Method 2: GitHub Releases

```bash
# Create release
gh release create v1.0.0 \
  dist/AspvServicces-1.0.0-Setup.exe \
  --title "AspvServicces v1.0.0" \
  --notes "Release notes here"
```

#### Method 3: Custom Download Server

1. Set up secure HTTPS server
2. Upload installer
3. Implement version checking
4. Add download counter

### Code Signing (Production)

For production releases, sign the executable:

1. **Obtain Certificate**
   - Purchase code signing certificate
   - From DigiCert, Sectigo, or similar CA

2. **Install Certificate**
   - Install on build machine
   - Note certificate details

3. **Configure Signing**

   Update `package.json`:
   ```json
   {
     "build": {
       "win": {
         "certificateFile": "path/to/certificate.pfx",
         "certificatePassword": "password",
         "certificateSubjectName": "Your Company Name",
         "signingHashAlgorithms": ["sha256"],
         "rfc3161TimeStampServer": "http://timestamp.digicert.com"
       }
     }
   }
   ```

4. **Build Signed Installer**
   ```bash
   npm run build:win
   ```

5. **Verify Signature**
   - Right-click installer
   - Properties → Digital Signatures
   - Verify signature is valid

### Update Server (Optional)

Set up auto-update server:

1. **Configure Update URL**
   ```json
   {
     "publish": {
       "provider": "generic",
       "url": "https://updates.aspvservicces.com"
     }
   }
   ```

2. **Upload Files**
   - `AspvServicces-Setup.exe`
   - `latest.yml`
   - `*.blockmap` files

3. **Implement Version Check**
   - Server returns latest.yml
   - App checks version
   - Downloads if newer available

## Post-Installation

### Required Setup Steps

After installation, users should:

1. **Install Drivers**
   - Launch AspvServicces
   - Go to Drivers section
   - Install ADB drivers (minimum)
   - Install brand-specific drivers as needed

2. **Grant Permissions**
   - Allow firewall if prompted
   - Grant USB access permissions

3. **Connect Test Device**
   - Connect Android/iOS device
   - Click "Detectar"
   - Verify device is recognized

### Optional Setup

1. **Pin to Taskbar**
   - Right-click desktop shortcut
   - Pin to taskbar

2. **Add to PATH** (for CLI)
   ```cmd
   setx PATH "%PATH%;C:\Program Files\AspvServicces"
   ```

3. **Create Shortcuts**
   - CLI mode: `aspv-cli`
   - Direct terminal access

## Troubleshooting

### Installation Issues

#### "Installation Failed"

**Causes:**
- Insufficient permissions
- Antivirus blocking
- Corrupted download

**Solutions:**
1. Run as Administrator
2. Temporarily disable antivirus
3. Re-download installer
4. Check disk space

#### "Cannot Install to Program Files"

**Solution:**
- Install to different directory
- Or run installer as Administrator

#### "Missing .NET Framework"

**Solution:**
```bash
# Download and install .NET Framework 4.7.2 or higher
# From: https://dotnet.microsoft.com/download/dotnet-framework
```

### Build Issues

#### "electron-builder not found"

**Solution:**
```bash
npm install --save-dev electron-builder
```

#### "Icon file missing"

**Solution:**
```bash
# Create placeholder or use any icon
mkdir assets
# Copy icon.ico and icon.png to assets/
```

#### "Build fails on Windows"

**Solution:**
```bash
# Install Windows Build Tools
npm install --global windows-build-tools

# Or install Visual Studio Build Tools
```

### Runtime Issues

#### "Application won't start"

**Solutions:**
1. Run as Administrator
2. Check Event Viewer for errors
3. Reinstall application
4. Update .NET Framework

#### "Drivers won't install"

**Solutions:**
1. Run as Administrator
2. Disable driver signature enforcement
3. Install manually from manufacturer

## Uninstallation

### Standard Uninstall

1. Open Settings → Apps
2. Find "AspvServicces"
3. Click "Uninstall"
4. Follow uninstaller prompts

### Complete Removal

If standard uninstall fails:

```cmd
# Run uninstaller directly
"C:\Program Files\AspvServicces\Uninstall AspvServicces.exe"

# Or use registry
reg query HKLM\Software\Microsoft\Windows\CurrentVersion\Uninstall
# Find AspvServicces GUID and uninstall
```

### Clean Removal

Remove remaining files:

```cmd
# Delete installation directory
rmdir /s "C:\Program Files\AspvServicces"

# Delete AppData
rmdir /s "%APPDATA%\AspvServicces"
rmdir /s "%LOCALAPPDATA%\AspvServicces"
```

## Support

For installation help:
- Email: support@aspvservicces.com
- GitHub Issues: Report problems
- Documentation: See docs/

---

**Version**: 1.0.0
**Last Updated**: 2024
**Platform**: Windows 10/11 (64-bit)
