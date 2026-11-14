import { describe, expect, test } from "bun:test"
import { gzipSync } from "zlib"
import { currentTarget, packages } from "../../src/speech-to-text/ffmpeg-packages"
import { extractTarEntry } from "../../src/speech-to-text/ffmpeg-fetch"

function header(name: string, size: number): Buffer {
  const buf = Buffer.alloc(512)
  buf.write(name, 0, "utf8")
  buf.write("0000644\0", 100, "utf8")
  buf.write(size.toString(8).padStart(11, "0") + "\0", 124, "utf8")
  buf.write("ustar\0" + "00", 257, "utf8")
  return buf
}

function entry(name: string, body: Buffer): Buffer {
  const pad = Buffer.alloc((512 - (body.length % 512)) % 512)
  return Buffer.concat([header(name, body.length), body, pad])
}

describe("ffmpeg tarball extraction", () => {
  test("skips earlier entries and finds the binary by exact name", () => {
    const tar = Buffer.concat([
      entry("package/package.json", Buffer.from('{"name":"@ffmpeg-installer/linux-x64"}')),
      entry("package/ffmpeg", Buffer.from("ELF-fake-binary")),
      Buffer.alloc(1024),
    ])
    expect(extractTarEntry(tar, "package/ffmpeg").toString()).toBe("ELF-fake-binary")
  })

  test("throws when the binary is absent instead of returning junk", () => {
    const tar = entry("package/package.json", Buffer.from("{}"))
    expect(() => extractTarEntry(tar, "package/ffmpeg")).toThrow(/did not contain package\/ffmpeg/)
  })

  test("survives the gzip round trip the downloader performs", () => {
    const tar = gzipSync(entry("package/ffmpeg.exe", Buffer.from("MZ-fake")))
    const { gunzipSync } = require("zlib") as typeof import("zlib")
    expect(extractTarEntry(gunzipSync(tar), "package/ffmpeg.exe").toString()).toBe("MZ-fake")
  })
})

describe("ffmpeg package targets", () => {
  test("maps platforms to the pinned installer builds", () => {
    expect(currentTarget("linux", "x64")).toBe("linux-x64")
    expect(currentTarget("darwin", "arm64")).toBe("darwin-arm64")
    expect(packages["win32-x64"]).toBe("@ffmpeg-installer/win32-x64@4.1.0")
  })

  test("has no build for win32-arm64, so it must fall back to a system ffmpeg", () => {
    expect(packages["win32-arm64"]).toBeUndefined()
  })
})
