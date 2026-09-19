module.exports = (req, res) => {
  res.status(200).json({
    name: "quotescdn",
    description: "English anime quotes and neo-brutalist SVG quote cards.",
    endpoints: {
      quote: "/api/quote",
      quotes: "/api/quotes",
      card: "/api/card",
      animes: "/api/animes"
    },
    docs: "/api.html"
  });
};