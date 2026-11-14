/**
 * FFmpeg is not bundled in the vsix any more (68MB unpacked / 23.5MB of every download for a
 * microphone-only helper). These are the same pinned npm builds `npm pack` used to fetch at
 * package time; they are now fetched once at runtime into extension storage.
 */
export const packages: Record<string, string> = {
  "darwin-x64": "@ffmpeg-installer/darwin-x64@4.1.0",
  "darwin-arm64": "@ffmpeg-installer/darwin-arm64@4.1.5",
  "linux-x64": "@ffmpeg-installer/linux-x64@4.1.0",
  "linux-arm64": "@ffmpeg-installer/linux-arm64@4.1.4",
  "win32-x64": "@ffmpeg-installer/win32-x64@4.1.0",
}

/** Windows ARM64 has no published build — speech input falls back to a system FFmpeg there. */
export function currentTarget(platform: NodeJS.Platform = process.platform, arch: string = process.arch): string {
  return `${platform}-${arch === "arm64" ? "arm64" : "x64"}`
}

export function binaryName(platform: NodeJS.Platform = process.platform): string {
  return platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
}
