const styles = {
  editorial: {
    background: "#F4EFE6",
    ink: "#171717",
    accent: "#E85D3F",
    secondary: "#D8E8C8",
    font: "Arial, sans-serif"
  },
  cinema: {
    background: "#11151A",
    ink: "#F7F0DF",
    accent: "#E3B86A",
    secondary: "#28313B",
    font: "Georgia, serif"
  },
  polaroid: {
    background: "#E8D7C4",
    ink: "#30271F",
    accent: "#BC6C4A",
    secondary: "#F7F0DF",
    font: "Georgia, serif"
  },
  terminal: {
    background: "#0D1714",
    ink: "#B9FF66",
    accent: "#E4F2DB",
    secondary: "#18352A",
    font: "Courier New, monospace"
  },
  gallery: {
    background: "#E9E8FF",
    ink: "#252342",
    accent: "#6C63D9",
    secondary: "#FFFFFF",
    font: "Arial, sans-serif"
  }
};

const aliases = {
  acid: "editorial",
  cobalt: "cinema",
  tangerine: "polaroid",
  paper: "gallery",
  orchid: "terminal"
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrap(text, maxChars) {
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let line = "";
  for (const originalWord of words) {
    let word = originalWord;
    while (word.length > maxChars) {
      if (line) {
        lines.push(line);
        line = "";
      }
      lines.push(word.slice(0, maxChars));
      word = word.slice(maxChars);
    }
    if (!word) continue;
    if ((line + " " + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [" "];
}

function truncateLabel(value, maxLength = 72) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}…` : text;
}

function layoutFor(quote, styleName) {
  const textLength = String(quote.quote || "").length;
  const fontSize = textLength > 900 ? 26 : textLength > 550 ? 31 : textLength > 320 ? 37 : 44;
  const layoutRules = {
    editorial: { textWidth: 930, averageCharacterWidth: 0.6 },
    cinema: { textWidth: 760, averageCharacterWidth: 0.58 },
    polaroid: { textWidth: 930, averageCharacterWidth: 0.58 },
    terminal: { textWidth: 930, averageCharacterWidth: 0.62 },
    gallery: { textWidth: 820, averageCharacterWidth: 0.6 }
  };
  const rules = layoutRules[styleName] || layoutRules.editorial;
  const maxChars = Math.max(12, Math.floor(rules.textWidth / (fontSize * rules.averageCharacterWidth)));
  const lines = wrap(quote.quote, maxChars);
  const lineHeight = Math.round(fontSize * 1.18);
  const quoteTop = 157;
  const quoteBottom = quoteTop + (lines.length - 1) * lineHeight + fontSize;
  const footerY = quoteBottom + 70;
  const height = Math.max(630, footerY + 80);
  return { lines, fontSize, lineHeight, quoteTop, footerY, height };
}

function quoteTspans(lines, x, y, lineHeight, anchor = "start") {
  return lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : lineHeight}" text-anchor="${anchor}">${escapeXml(line)}</tspan>`)
    .join("");
}

function footer(quote, layout, style, options = {}) {
  const contentX = options.contentX || 72;
  const lineStart = options.lineStart || 72;
  const lineEnd = options.lineEnd || 1128;
  const anime = escapeXml(truncateLabel(quote.anime));
  const character = escapeXml(truncateLabel(quote.character, 58));
  return `
    <line x1="${lineStart}" y1="${layout.footerY - 28}" x2="${lineEnd}" y2="${layout.footerY - 28}" stroke="${style.accent}" stroke-width="2"/>
    <text x="${contentX}" y="${layout.footerY + 15}" fill="${style.ink}" font-family="Arial, sans-serif" font-size="25" font-weight="700">${character}</text>
    <text x="${contentX}" y="${layout.footerY + 50}" fill="${style.ink}" opacity=".72" font-family="Arial, sans-serif" font-size="19">${anime}</text>
  `;
}

function editorialCard(quote, style, layout) {
  return `
    <rect width="1200" height="${layout.height}" fill="${style.background}"/>
    <rect x="42" y="42" width="1116" height="${layout.height - 84}" rx="24" fill="${style.secondary}" opacity=".54"/>
    <rect x="82" y="82" width="8" height="${layout.footerY - 106}" rx="4" fill="${style.accent}"/>
    <text x="103" y="${layout.quoteTop - 20}" fill="${style.accent}" font-family="Georgia, serif" font-size="74">“</text>
    <text x="126" y="${layout.quoteTop}" fill="${style.ink}" font-family="${style.font}" font-size="${layout.fontSize}" font-weight="700">${quoteTspans(layout.lines, 126, 0, layout.lineHeight)}</text>
    ${footer(quote, layout, style)}
  `;
}

function cinemaCard(quote, style, layout) {
  return `
    <rect width="1200" height="${layout.height}" fill="${style.background}"/>
    <circle cx="1030" cy="134" r="126" fill="${style.secondary}" opacity=".7"/>
    <circle cx="1030" cy="134" r="88" fill="none" stroke="${style.accent}" stroke-width="2" opacity=".8"/>
    <rect x="72" y="72" width="1056" height="${layout.height - 144}" rx="28" fill="none" stroke="${style.accent}" stroke-width="2" opacity=".8"/>
    <text x="91" y="${layout.quoteTop - 20}" fill="${style.accent}" font-family="Georgia, serif" font-size="74">“</text>
    <text x="112" y="${layout.quoteTop}" fill="${style.ink}" font-family="${style.font}" font-size="${layout.fontSize}" font-weight="400">${quoteTspans(layout.lines, 112, 0, layout.lineHeight)}</text>
    ${footer(quote, layout, style, { contentX: 96, lineStart: 96, lineEnd: 1104 })}
  `;
}

function polaroidCard(quote, style, layout) {
  return `
    <rect width="1200" height="${layout.height}" fill="${style.background}"/>
    <rect x="54" y="38" width="1092" height="${layout.height - 76}" rx="9" fill="${style.secondary}" transform="rotate(-1.2 600 ${layout.height / 2})"/>
    <circle cx="1056" cy="104" r="26" fill="${style.accent}"/>
    <text x="95" y="${layout.quoteTop - 20}" fill="${style.accent}" font-family="Georgia, serif" font-size="74">“</text>
    <text x="116" y="${layout.quoteTop}" fill="${style.ink}" font-family="${style.font}" font-size="${layout.fontSize}" font-style="italic">${quoteTspans(layout.lines, 116, 0, layout.lineHeight)}</text>
    ${footer(quote, layout, style)}
  `;
}

function terminalCard(quote, style, layout) {
  return `
    <rect width="1200" height="${layout.height}" fill="${style.background}"/>
    <rect x="58" y="58" width="1084" height="${layout.height - 116}" rx="18" fill="none" stroke="${style.secondary}" stroke-width="3"/>
    <circle cx="95" cy="97" r="8" fill="${style.accent}"/>
    <circle cx="121" cy="97" r="8" fill="${style.accent}" opacity=".7"/>
    <circle cx="147" cy="97" r="8" fill="${style.accent}" opacity=".4"/>
    <text x="92" y="${layout.quoteTop}" fill="${style.accent}" font-family="${style.font}" font-size="${layout.fontSize}">&gt;</text>
    <text x="124" y="${layout.quoteTop}" fill="${style.ink}" font-family="${style.font}" font-size="${layout.fontSize}">${quoteTspans(layout.lines, 124, 0, layout.lineHeight)}</text>
    ${footer(quote, layout, style)}
  `;
}

function galleryCard(quote, style, layout) {
  const centerX = 600;
  return `
    <rect width="1200" height="${layout.height}" fill="${style.background}"/>
    <path d="M0 0h1200v100H0z" fill="${style.secondary}"/>
    <path d="M0 ${layout.height}L430 0h155L0 ${layout.height}z" fill="${style.accent}" opacity=".14"/>
    <circle cx="1060" cy="118" r="48" fill="${style.accent}"/>
    <text x="${centerX}" y="${layout.quoteTop - 20}" fill="${style.accent}" font-family="Georgia, serif" font-size="74" text-anchor="middle">“</text>
    <text x="${centerX}" y="${layout.quoteTop}" fill="${style.ink}" font-family="${style.font}" font-size="${layout.fontSize}" font-weight="700" text-anchor="middle">${quoteTspans(layout.lines, centerX, 0, layout.lineHeight, "middle")}</text>
    <line x1="440" y1="${layout.footerY - 28}" x2="760" y2="${layout.footerY - 28}" stroke="${style.accent}" stroke-width="4"/>
    <text x="${centerX}" y="${layout.footerY + 15}" fill="${style.ink}" font-family="Arial, sans-serif" font-size="25" font-weight="700" text-anchor="middle">${escapeXml(truncateLabel(quote.character, 58))}</text>
    <text x="${centerX}" y="${layout.footerY + 50}" fill="${style.ink}" opacity=".72" font-family="Arial, sans-serif" font-size="19" text-anchor="middle">${escapeXml(truncateLabel(quote.anime))}</text>
  `;
}

function quoteCardSvg(quote, styleName = "editorial") {
  const normalizedName = aliases[styleName] || styleName;
  const style = styles[normalizedName] || styles.editorial;
  const layout = layoutFor(quote, normalizedName);
  const card = {
    editorial: editorialCard,
    cinema: cinemaCard,
    polaroid: polaroidCard,
    terminal: terminalCard,
    gallery: galleryCard
  }[normalizedName](quote, style, layout);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${layout.height}" viewBox="0 0 1200 ${layout.height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(quote.anime)} quote</title>
  <desc id="desc">${escapeXml(quote.quote)}</desc>
  ${card}
</svg>`;
}

module.exports = { quoteCardSvg, styles };