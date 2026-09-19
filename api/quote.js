const { getQuote } = require("../lib/quotes");

module.exports = (req, res) => {
  const quote = getQuote(req.query || {});
  if (!quote) {
    return res.status(404).json({
      error: "No quote found",
      hint: "Try another index, anime, character, or search value."
    });
  }
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  return res.status(200).json(quote);
};