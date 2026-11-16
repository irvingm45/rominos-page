// The site can be served from a sub-path (GitHub Pages serves a project repo at /<repo-name>/).
// Next adds the base path to its own links and scripts; plain <img> and <source> URLs need this helper.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefixes a root-relative public file path ("/img/x.webp") with the base path. */
export const asset = (path: string) => `${basePath}${path}`;
