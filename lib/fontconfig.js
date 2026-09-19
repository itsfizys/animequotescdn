const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join("/tmp", "quotescdn-fontconfig.xml");
const CACHE_PATH = path.join("/tmp", "quotescdn-fontconfig-cache");

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function configureFontconfig() {
  if (process.env.FONTCONFIG_FILE) return;

  const fontDirectory = path.resolve(__dirname, "../fonts");
  const config = `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${escapeXml(fontDirectory)}</dir>
  <cachedir>${escapeXml(CACHE_PATH)}</cachedir>
  <alias>
    <family>QuoteEmbeddedSans</family>
    <prefer>
      <family>DejaVu Sans</family>
    </prefer>
  </alias>
</fontconfig>
`;

  fs.mkdirSync(CACHE_PATH, { recursive: true });
  if (!fs.existsSync(CONFIG_PATH)) {
    fs.writeFileSync(CONFIG_PATH, config);
  }
  process.env.FONTCONFIG_FILE = CONFIG_PATH;
}

configureFontconfig();

module.exports = { configureFontconfig };
