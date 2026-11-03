# Uso:  .\ferramentas\neurobaby.ps1 dev | build | preview
# Instala as dependências fora do Google Drive e roda o Vite apontando para o código desta pasta.
param([ValidateSet('dev', 'build', 'preview')][string]$Comando = 'dev')
$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$Deps = Join-Path $env:LOCALAPPDATA 'NeuroBaby-deps'
New-Item -ItemType Directory -Force $Deps | Out-Null

Copy-Item (Join-Path $PSScriptRoot 'vite.config.mjs') $Deps -Force
$pkgOrigem = Join-Path $Root 'package.json'
$pkgDestino = Join-Path $Deps 'package.json'
$precisaInstalar = -not (Test-Path (Join-Path $Deps 'node_modules\vite')) -or
  -not (Test-Path $pkgDestino) -or ((Get-FileHash $pkgOrigem).Hash -ne (Get-FileHash $pkgDestino).Hash)
if ($precisaInstalar) {
  Copy-Item $pkgOrigem $pkgDestino -Force
  Push-Location $Deps
  try { npm install --no-audit --no-fund; if ($LASTEXITCODE) { throw 'npm install falhou' } } finally { Pop-Location }
}

$env:NEUROBABY_ROOT = $Root
$vite = Join-Path $Deps 'node_modules\vite\bin\vite.js'
$cfg = Join-Path $Deps 'vite.config.mjs'
switch ($Comando) {
  'dev' { node $vite --config $cfg }
  'build' { node $vite build --config $cfg }
  'preview' { node $vite preview --config $cfg }
}
