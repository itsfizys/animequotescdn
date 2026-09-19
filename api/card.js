const { getQuote } = require("../lib/quotes");
const { quoteCardSvg } = require("../lib/card");

module.exports = (req, res) => {
  const quote = getQuote(req.query || {});
  if (!quote) {
    return res.status(404).json({ error: "No quote found" });
  }
  const svg = quoteCardSvg(quote, req.query.style || req.query.theme || "editorial");
  if (req.query.format === "json") {
    return res.status(200).json({ ...quote, format: "svg", svg });
  }
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  return res.status(200).send(svg);
};