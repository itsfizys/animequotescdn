const { listQuotes } = require("../lib/quotes");

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300");
  return res.status(200).json(listQuotes(req.query || {}));
};