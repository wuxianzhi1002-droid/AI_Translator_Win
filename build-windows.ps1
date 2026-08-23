$ErrorActionPreference = "Stop"

if (-not (Get-Command cargo -ErrorAction SilentlyContinue)) {
    Write-Host "Rust was not found. Downloading rustup..."
    $rustup = Join-Path $env:TEMP "rustup-init.exe"
    Invoke-WebRequest "https://win.rustup.rs/x86_64" -OutFile $rustup
    & $rustup -y
    $env:Path = "$env:USERPROFILE\.cargo\bin;$env:Path"
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js 20 or later is required: https://nodejs.org/"
}

if (-not (Get-Command cl.exe -ErrorAction SilentlyContinue)) {
    Write-Warning "Visual C++ Build Tools were not detected. If compilation fails, install Visual Studio Build Tools 2022 with the Desktop development with C++ workload."
}

npm install
npm run build

Write-Host ""
Write-Host "Build finished. Installers are under src-tauri\target\release\bundle." -ForegroundColor Green
