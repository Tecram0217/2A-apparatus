$ErrorActionPreference = 'Stop'
$serverFile = Join-Path $PSScriptRoot 'local-server.cjs'
$running = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" | Where-Object { $_.CommandLine -and $_.CommandLine.Contains($serverFile) }
if (-not $running) {
    $nodeExe = (Get-Command node -ErrorAction Stop).Source
    Start-Process -FilePath $nodeExe -ArgumentList @('"' + $serverFile + '"') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $PSScriptRoot 'local-server.log') -RedirectStandardError (Join-Path $PSScriptRoot 'local-server-error.log')
    Start-Sleep -Seconds 1
}
Invoke-WebRequest 'http://127.0.0.1:4174/index.html' -UseBasicParsing | Out-Null
Start-Process 'http://127.0.0.1:4174/'
