import { chmodSync, existsSync, mkdirSync, writeFileSync } from "fs"
import * as path from "path"
import { gunzipSync } from "zlib"
import { binaryName, currentTarget, packages } from "./ffmpeg-packages"

let cacheDir: string | undefined

/** Registered at activation with the extension's global storage path. */
export function setFfmpegCacheDir(dir: string): void {
  cacheDir = dir
}

function targetPath(dir: string): string {
  return path.join(dir, "ffmpeg-bin", binaryName())
}

export function cachedFfmpegPath(): string | undefined {
  if (!cacheDir) return undefined
  const bin = targetPath(cacheDir)
  return existsSync(bin) ? bin : undefined
}

/**
 * Downloads the pinned FFmpeg build for this platform once, into extension storage.
 * Cheap to call repeatedly: an already-downloaded binary short-circuits.
 */
export async function downloadFfmpeg(): Promise<string> {
  const cached = cachedFfmpegPath()
  if (cached) return cached
  if (!cacheDir) throw new Error("FFmpeg cache directory is not configured")

  const target = currentTarget()
  const spec = packages[target]
  if (!spec) throw new Error(`No FFmpeg build is published for ${target}`)

  const at = spec.lastIndexOf("@")
  const name = spec.slice(0, at)
  const version = spec.slice(at + 1)
  const tarball = name.split("/").pop()
  const res = await fetch(`https://registry.npmjs.org/${name}/-/${tarball}-${version}.tgz`, {
    signal: AbortSignal.timeout(120_000),
  })
  if (!res.ok) throw new Error(`FFmpeg download failed: registry responded ${res.status}`)

  const bin = targetPath(cacheDir)
  const entry = extractTarEntry(gunzipSync(Buffer.from(await res.arrayBuffer())), `package/${binaryName()}`)
  mkdirSync(path.dirname(bin), { recursive: true })
  writeFileSync(bin, entry)
  if (process.platform !== "win32") chmodSync(bin, 0o755)
  return bin
}

/**
 * Minimal tar reader: the @ffmpeg-installer tarballs hold a flat `package/` tree with short
 * ASCII names, so ustar prefix handling, PAX headers and long-name GNU extensions are not needed.
 */
export function extractTarEntry(tarball: Buffer, wanted: string): Buffer {
  let off = 0
  while (off + 512 <= tarball.length) {
    const name = tarball.toString("utf8", off, off + 100).replace(/\0.*$/, "")
    if (!name) break
    const size = parseInt(
      tarball
        .toString("utf8", off + 124, off + 136)
        .replace(/\0.*$/, "")
        .trim() || "0",
      8,
    )
    const start = off + 512
    if (name === wanted) return tarball.subarray(start, start + size)
    off = start + Math.ceil(size / 512) * 512
  }
  throw new Error(`FFmpeg package did not contain ${wanted}`)
}
