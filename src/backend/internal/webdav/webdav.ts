import { generateWebDavXml } from "../../pkg/utils"

/** Return the public WebDAV path, keeping the `/dav` mount prefix and URL encoding. */
export function webDavHrefFromRequestUrl(requestUrl: string): string {
  const pathname = new URL(requestUrl).pathname
  if (pathname !== "/dav" && !pathname.startsWith("/dav/")) {
    throw new Error(`WebDAV request is outside the /dav mount: ${pathname}`)
  }
  return pathname
}

export interface WebDavItem {
  name: string
  size: number
  isFolder: boolean
  modified: string
}

export function buildWebDavPropfindResponse(
  reqPath: string,
  items: WebDavItem[],
): string {
  return generateWebDavXml(reqPath, items)
}
