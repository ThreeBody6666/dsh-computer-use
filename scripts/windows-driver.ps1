param([Parameter(Mandatory = $true)][string]$PayloadBase64)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

if (-not ('DshComputerUse.Native' -as [type])) {
  Add-Type -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;

namespace DshComputerUse {
  public static class Native {
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
    [DllImport("user32.dll")] public static extern void mouse_event(uint flags, uint dx, uint dy, int data, UIntPtr extra);
    [DllImport("user32.dll")] public static extern void keybd_event(byte vk, byte scan, uint flags, UIntPtr extra);
    [DllImport("user32.dll")] public static extern uint SendInput(uint count, INPUT[] inputs, int size);
    [StructLayout(LayoutKind.Sequential)] public struct INPUT { public uint type; public InputUnion U; }
    [StructLayout(LayoutKind.Explicit)] public struct InputUnion { [FieldOffset(0)] public KEYBDINPUT ki; }
    [StructLayout(LayoutKind.Sequential)] public struct KEYBDINPUT { public ushort wVk; public ushort wScan; public uint dwFlags; public uint time; public UIntPtr dwExtraInfo; }
    const uint INPUT_KEYBOARD = 1, KEYEVENTF_KEYUP = 2, KEYEVENTF_UNICODE = 4;
    public static void TypeText(string text) {
      var inputs = new List<INPUT>();
      foreach (char c in text) {
        inputs.Add(new INPUT { type = INPUT_KEYBOARD, U = new InputUnion { ki = new KEYBDINPUT { wScan = c, dwFlags = KEYEVENTF_UNICODE } } });
        inputs.Add(new INPUT { type = INPUT_KEYBOARD, U = new InputUnion { ki = new KEYBDINPUT { wScan = c, dwFlags = KEYEVENTF_UNICODE | KEYEVENTF_KEYUP } } });
      }
      if (inputs.Count > 0) SendInput((uint)inputs.Count, inputs.ToArray(), Marshal.SizeOf(typeof(INPUT)));
    }
  }
}
'@
}

$payload = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($PayloadBase64)) | ConvertFrom-Json
$virtual = [System.Windows.Forms.SystemInformation]::VirtualScreen

function Get-KeyCode([string]$key) {
  $keys = @{ ALT = 0x12; BACKSPACE = 0x08; CTRL = 0x11; DELETE = 0x2E; DOWN = 0x28; END = 0x23; ENTER = 0x0D; ESC = 0x1B; HOME = 0x24; LEFT = 0x25; PAGEDOWN = 0x22; PAGEUP = 0x21; RIGHT = 0x27; SHIFT = 0x10; SPACE = 0x20; TAB = 0x09; UP = 0x26 }
  if ($key -match '^F([1-9]|1[0-2])$') { return 0x70 + ([int]$Matches[1] - 1) }
  if ($key.Length -eq 1 -and $key -match '^[A-Z0-9]$') { return [byte][char]$key }
  if ($keys.ContainsKey($key)) { return $keys[$key] }
  throw "Unsupported key: $key"
}

function Assert-Point([int]$x, [int]$y) {
  if ($x -lt $virtual.Left -or $x -ge ($virtual.Left + $virtual.Width) -or $y -lt $virtual.Top -or $y -ge ($virtual.Top + $virtual.Height)) { throw "Point ($x, $y) is outside the virtual desktop" }
}

switch ($payload.action) {
  'screenBounds' { @{ left = $virtual.Left; top = $virtual.Top; width = $virtual.Width; height = $virtual.Height } | ConvertTo-Json -Compress }
  'screenshot' {
    $scale = [Math]::Min(1.0, [Math]::Min(([double]$payload.maxWidth / $virtual.Width), ([double]$payload.maxHeight / $virtual.Height)))
    $width = [Math]::Max(1, [int][Math]::Floor($virtual.Width * $scale)); $height = [Math]::Max(1, [int][Math]::Floor($virtual.Height * $scale))
    $source = New-Object System.Drawing.Bitmap($virtual.Width, $virtual.Height); $graphics = [System.Drawing.Graphics]::FromImage($source); $graphics.CopyFromScreen($virtual.Left, $virtual.Top, 0, 0, $source.Size)
    $result = New-Object System.Drawing.Bitmap($width, $height); $out = [System.Drawing.Graphics]::FromImage($result); $out.DrawImage($source, 0, 0, $width, $height); $stream = New-Object IO.MemoryStream; $result.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
    $out.Dispose(); $graphics.Dispose(); $result.Dispose(); $source.Dispose(); @{ pngBase64 = [Convert]::ToBase64String($stream.ToArray()); width = $width; height = $height } | ConvertTo-Json -Compress; $stream.Dispose()
  }
  'click' {
    Assert-Point $payload.x $payload.y; [DshComputerUse.Native]::SetCursorPos($payload.x, $payload.y) | Out-Null
    $button = @{ left = @(0x0002, 0x0004); right = @(0x0008, 0x0010); middle = @(0x0020, 0x0040) }[$payload.button]
    1..$payload.clicks | ForEach-Object { [DshComputerUse.Native]::mouse_event($button[0], 0, 0, 0, [UIntPtr]::Zero); Start-Sleep -Milliseconds $payload.delayMs; [DshComputerUse.Native]::mouse_event($button[1], 0, 0, 0, [UIntPtr]::Zero) }; '{}'
  }
  'drag' {
    Assert-Point $payload.fromX $payload.fromY; Assert-Point $payload.toX $payload.toY; [DshComputerUse.Native]::SetCursorPos($payload.fromX, $payload.fromY) | Out-Null; [DshComputerUse.Native]::mouse_event(0x0002, 0, 0, 0, [UIntPtr]::Zero); Start-Sleep -Milliseconds $payload.durationMs; [DshComputerUse.Native]::SetCursorPos($payload.toX, $payload.toY) | Out-Null; [DshComputerUse.Native]::mouse_event(0x0004, 0, 0, 0, [UIntPtr]::Zero); '{}'
  }
  'type' { [DshComputerUse.Native]::TypeText([string]$payload.text); '{}' }
  'keypress' {
    $codes = @($payload.keys | ForEach-Object { Get-KeyCode ([string]$_) })
    foreach ($code in $codes) { [DshComputerUse.Native]::keybd_event([byte]$code, 0, 0, [UIntPtr]::Zero) }
    Start-Sleep -Milliseconds $payload.delayMs
    [array]::Reverse($codes)
    foreach ($code in $codes) { [DshComputerUse.Native]::keybd_event([byte]$code, 0, 0x0002, [UIntPtr]::Zero) }
    '{}'
  }
  'scroll' { [DshComputerUse.Native]::mouse_event(0x0800, 0, 0, [int]$payload.amount * 120, [UIntPtr]::Zero); '{}' }
  default { throw "Unsupported action: $($payload.action)" }
}
