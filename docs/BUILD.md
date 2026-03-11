# Build Instructions for AspvServicces

This guide explains how to build AspvServicces from source code.

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Git** (for cloning repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

3. **Windows 10/11** (64-bit)
   - Build process requires Windows environment
   - Administrator privileges may be needed

### Optional Tools

- **Visual Studio Code** - Recommended IDE
- **Python 3.x** - For some native dependencies
- **Windows Build Tools** - For native module compilation

## Setup

### 1. Clone Repository

```bash
git clone https://github.com/aspvservicces/herramienta-aspvservicces.git
cd herramienta-aspvservicces
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Electron framework
- All required Node.js modules
- Development dependencies

### 3. Prepare Assets

Create or place the following files in `assets/`:

- `icon.ico` - Application icon (256x256 recommended)
- `icon.png` - PNG version (1024x1024)
- `installer-header.bmp` - NSIS installer header image

You can use placeholder icons for testing or create professional icons for production.

## Building

### Development Build

Run the application in development mode:

```bash
npm start
# or
npm run dev
```

This launches the Electron app with hot-reload enabled.

### Production Build

#### Method 1: Using Build Script

```bash
node scripts/build.js
```

This automated script will:
1. Check environment
2. Create required directories
3. Verify all files are present
4. Install dependencies
5. Build the Windows installer

#### Method 2: Manual Build

```bash
# Build Windows installer (NSIS)
npm run build:win

# Or build portable version
npx electron-builder --win portable
```

### Build Outputs

After building, check the `dist/` directory:

```
dist/
├── AspvServicces-1.0.0-Setup.exe      # NSIS Installer
├── AspvServicces-1.0.0-Portable.exe   # Portable version (optional)
└── win-unpacked/                       # Unpacked application files
```

## Build Configuration

Build settings are defined in `package.json` under the `build` section:

```json
{
  "build": {
    "appId": "com.aspvservicces.app",
    "productName": "AspvServicces",
    "win": {
      "target": ["nsis"],
      "icon": "assets/icon.ico",
      "requestedExecutionLevel": "requireAdministrator"
    }
  }
}
```

### Customizing the Build

Edit `package.json` to customize:

- Application ID
- Product name
- Icon paths
- Installation directory
- Installer options

## Troubleshooting

### Common Issues

#### 1. "electron-builder not found"

**Solution:**
```bash
npm install --save-dev electron-builder
```

#### 2. "Icon file not found"

**Solution:**
Create a placeholder icon or download a free icon:
```bash
# Create assets directory
mkdir assets

# Place your icon.ico and icon.png in assets/
```

#### 3. Native module compilation errors

**Solution:**
Install Windows Build Tools:
```bash
npm install --global windows-build-tools
```

#### 4. Permission denied errors

**Solution:**
Run command prompt as Administrator:
```bash
# Right-click Command Prompt
# Select "Run as Administrator"
```

### Build Artifacts

After successful build:

1. **Installer**: `dist/AspvServicces-1.0.0-Setup.exe`
   - Full installer with NSIS
   - Includes uninstaller
   - Creates shortcuts

2. **Portable**: `dist/AspvServicces-1.0.0-Portable.exe`
   - Single executable
   - No installation required
   - Runs from any location

## Testing the Build

### 1. Test Installer

```bash
# Run the installer
cd dist
AspvServicces-1.0.0-Setup.exe
```

Follow the installation wizard and test all features.

### 2. Test Portable Version

```bash
# Run portable executable
AspvServicces-1.0.0-Portable.exe
```

Verify it runs without installation.

## Distribution

### Preparing for Distribution

1. **Test thoroughly** on clean Windows installations
2. **Verify digital signatures** (if code signing)
3. **Check file sizes** - Installer should be reasonable size
4. **Create checksums** for integrity verification:

```bash
# Generate SHA256 checksum
certutil -hashfile AspvServicces-1.0.0-Setup.exe SHA256
```

### Code Signing (Optional)

For production releases, sign the executable:

1. Obtain code signing certificate
2. Install certificate
3. Configure electron-builder:

```json
{
  "win": {
    "certificateFile": "path/to/cert.pfx",
    "certificatePassword": "password"
  }
}
```

## Advanced Build Options

### Custom NSIS Script

Create `build/installer.nsh` for custom installer behavior:

```nsis
!macro customInstall
  ; Custom installation steps
!macroend
```

### Multi-language Support

Enable multiple languages in NSIS configuration:

```json
{
  "nsis": {
    "installerLanguages": ["en_US", "es_MX"],
    "multiLanguageInstaller": true
  }
}
```

### Auto-Update Configuration

Add update server configuration:

```json
{
  "publish": {
    "provider": "generic",
    "url": "https://updates.aspvservicces.com"
  }
}
```

## Build Performance

### Speed Up Builds

1. **Exclude unnecessary files:**

```json
{
  "files": [
    "!**/*.md",
    "!docs/**/*",
    "!test/**/*"
  ]
}
```

2. **Use build cache:**

```bash
npm run build:win -- --cache
```

3. **Parallel compression:**

```json
{
  "compression": "maximum",
  "parallel": true
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build
on: [push]
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build:win
      - uses: actions/upload-artifact@v2
        with:
          name: installer
          path: dist/*.exe
```

## Resources

- [Electron Builder Documentation](https://www.electron.build/)
- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [Electron Documentation](https://www.electronjs.org/docs)

## Support

For build-related issues:
- Check GitHub Issues
- Contact: support@aspvservicces.com
- Join our Discord community

---

Last Updated: 2024
Version: 1.0.0
