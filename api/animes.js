const { index } = require("../lib/quotes");

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
  return res.status(200).json({
    count: index.animeCount,
    data: index.animes
  });
};