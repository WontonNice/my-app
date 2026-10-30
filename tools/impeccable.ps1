param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)

$ErrorActionPreference = 'Stop'
$version = '0.1.5'
$expectedHash = '477e544fc8880a5e82e427490cb9a5f5adab480c0e02966d33fd50772b531c71'
$candidates = @(
    $env:IMPECCABLE_BIN,
    (Join-Path $env:USERPROFILE ".impeccable/bin/$version/impeccable.exe"),
    (Join-Path $PSScriptRoot "../../.tool-cache/impeccable/bin/$version/impeccable.exe")
)
$engine = $candidates | Where-Object { $_ -and (Test-Path -LiteralPath $_ -PathType Leaf) } | Select-Object -First 1
if (-not $engine) { throw "Impeccable $version is not installed. Set IMPECCABLE_BIN to the verified Windows x64 engine." }
if ((Get-FileHash -LiteralPath $engine -Algorithm SHA256).Hash -ne $expectedHash) {
    throw 'The Impeccable engine does not match the pinned release checksum. Refusing execution.'
}
& $engine @Arguments
exit $LASTEXITCODE
