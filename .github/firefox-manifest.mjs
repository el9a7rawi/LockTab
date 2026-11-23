// Firefox still runs background scripts rather than a service worker, so the
// release archive carries a manifest rewritten from the shipped MV3 source.
import fs from "node:fs";

const path = process.argv[2];
if (!path) throw new Error("usage: node firefox-manifest.mjs <manifest.json>");

const manifest = JSON.parse(fs.readFileSync(path, "utf8"));
delete manifest.minimum_chrome_version;
delete manifest.content_security_policy;
manifest.background = { scripts: ["background.js"] };
manifest.browser_specific_settings.gecko.strict_min_version = "121.0";

fs.writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n", "utf8");
