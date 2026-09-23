import assert from "node:assert/strict"
import { test } from "node:test"
import { buildWebDavPropfindResponse, webDavHrefFromRequestUrl } from "./webdav"

test("WebDAV href preserves the public /dav mount and encoded request path", () => {
  assert.equal(webDavHrefFromRequestUrl("https://tv.example.test/dav"), "/dav")
  assert.equal(
    webDavHrefFromRequestUrl(
      "https://tv.example.test/dav/BrokenStar%E3%81%AE%E7%B1%B3%E5%A5%87/电影/",
    ),
    "/dav/BrokenStar%E3%81%AE%E7%B1%B3%E5%A5%87/%E7%94%B5%E5%BD%B1/",
  )
})

test("PROPFIND returns self and child hrefs under the same DAV mount", () => {
  const href = webDavHrefFromRequestUrl(
    "https://tv.example.test/dav/storage/%E7%94%B5%E5%BD%B1/",
  )
  const xml = buildWebDavPropfindResponse(href, [
    {
      name: "Series folder",
      size: 0,
      isFolder: true,
      modified: "2026-09-23T00:00:00Z",
    },
    {
      name: "Movie.mkv",
      size: 123,
      isFolder: false,
      modified: "2026-09-23T00:00:00Z",
    },
  ])

  assert.match(xml, /<d:href>\/dav\/storage\/%E7%94%B5%E5%BD%B1\/</)
  assert.match(
    xml,
    /<d:href>\/dav\/storage\/%E7%94%B5%E5%BD%B1\/Series%20folder</,
  )
  assert.match(xml, /<d:href>\/dav\/storage\/%E7%94%B5%E5%BD%B1\/Movie\.mkv</)
  assert.doesNotMatch(xml, /\/dav\/dav\//)
})

test("WebDAV href helper rejects paths outside the DAV mount", () => {
  assert.throws(
    () => webDavHrefFromRequestUrl("https://tv.example.test/other/path"),
    /outside the \/dav mount/,
  )
})
