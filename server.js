const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const { getQuote, listQuotes, index } = require("./lib/quotes");
const { quoteCardSvg } = require("./lib/card");

const port = Number(process.env.PORT || 5000);
const publicDir = path.join(__dirname, "public");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ico": "image/x-icon"
};

function sendJson(res, status, value) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(value));
}

function apiResponse(req, res, url) {
  if (url.pathname === "/api") {
    return sendJson(res, 200, {
      name: "quotescdn",
      description: "English anime quotes and neo-brutalist SVG quote cards.",
      endpoints: { quote: "/api/quote", quotes: "/api/quotes", card: "/api/card", animes: "/api/animes" },
      docs: "/api.html"
    });
  }
  if (url.pathname === "/api/quote") {
    const quote = getQuote(Object.fromEntries(url.searchParams));
    return quote ? sendJson(res, 200, quote) : sendJson(res, 404, { error: "No quote found" });
  }
  if (url.pathname === "/api/quotes") {
    return sendJson(res, 200, listQuotes(Object.fromEntries(url.searchParams)));
  }
  if (url.pathname === "/api/animes") {
    return sendJson(res, 200, { count: index.animeCount, data: index.animes });
  }
  if (url.pathname === "/api/card") {
    const quote = getQuote(Object.fromEntries(url.searchParams));
    if (!quote) return sendJson(res, 404, { error: "No quote found" });
    const svg = quoteCardSvg(quote, url.searchParams.get("style") || url.searchParams.get("theme") || "editorial");
    if (url.searchParams.get("format") === "json") return sendJson(res, 200, { ...quote, format: "svg", svg });
    res.writeHead(200, { "Content-Type": "image/svg+xml; charset=utf-8" });
    return res.end(svg);
  }
  return sendJson(res, 404, { error: "Unknown endpoint" });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) return apiResponse(req, res, url);
  let requested = url.pathname === "/" ? "/index.html" : url.pathname;
  if (requested === "/api.html") requested = "/api.html";
  const filePath = path.normalize(path.join(publicDir, requested));
  if (!filePath.startsWith(publicDir)) return res.writeHead(403).end();
  fs.readFile(filePath, (error, body) => {
    if (error) return res.writeHead(404).end("Not found");
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "text/plain; charset=utf-8" });
    res.end(body);
  });
});

server.listen(port, "0.0.0.0", () => {
      console.log(`Quotes CDN running at http://0.0.0.0:${port}`);
});