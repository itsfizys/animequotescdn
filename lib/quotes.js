const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const quotes = JSON.parse(fs.readFileSync(path.join(root, "main.json"), "utf8"));
const index = JSON.parse(fs.readFileSync(path.join(root, "index.json"), "utf8"));

function toPositiveInt(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function matches(row, query) {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return true;
  return [row.quote, row.character, row.anime].some((value) =>
    value.toLowerCase().includes(needle)
  );
}

function filteredQuotes(params = {}) {
  const anime = String(params.anime || "").trim().toLowerCase();
  const character = String(params.character || "").trim().toLowerCase();
  const search = params.search;
  return quotes.filter((row) => {
    if (anime && row.anime.toLowerCase() !== anime) return false;
    if (character && !row.character.toLowerCase().includes(character)) return false;
    return matches(row, search);
  });
}

function getQuote(params = {}) {
  const requestedIndex = toPositiveInt(params.index);
  if (requestedIndex !== null) {
    return quotes[requestedIndex] || null;
  }
  const pool = filteredQuotes(params);
  if (!pool.length) return null;
  const seed = toPositiveInt(params.seed);
  const position = seed === null ? Math.floor(Math.random() * pool.length) : seed % pool.length;
  return pool[position];
}

function listQuotes(params = {}) {
  const pool = filteredQuotes(params);
  const limit = Math.min(Math.max(toPositiveInt(params.limit) ?? 20, 1), 100);
  const offset = toPositiveInt(params.offset) ?? 0;
  return {
    total: pool.length,
    limit,
    offset,
    data: pool.slice(offset, offset + limit)
  };
}

module.exports = {
  quotes,
  index,
  getQuote,
  listQuotes
};