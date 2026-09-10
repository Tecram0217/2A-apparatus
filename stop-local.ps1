$serverFile = Join-Path $PSScriptRoot 'local-server.cjs'
Get-CimInstance Win32_Process -Filter "name = 'node.exe'" | Where-Object { $_.CommandLine -and $_.CommandLine.Contains($serverFile) } | ForEach-Object { Stop-Process -Id $_.ProcessId }
