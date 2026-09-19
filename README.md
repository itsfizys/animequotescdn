# Quotes CDN

> English anime quotes, served with a little more attitude.

Quotes CDN is a small, fast API for English anime quotes. It returns structured
JSON for applications, searchable quote lists for integrations, and ready-to-
embed SVG or PNG cards for websites, bots, documentation, and social posts.

The project includes a browser-based quote explorer, a card lab, API reference
pages, Vercel serverless endpoints, and a local Node.js server for development.

<p align="center">
  <a href="https://github.com/itsfizys/quotescdn">
    <img src="https://img.shields.io/badge/Source-GitHub-111827?style=for-the-badge&logo=github&logoColor=white" alt="Source code on GitHub" />
  </a>
  <a href="https://github.com/itsfizys/quotescdn/blob/main/public/api.html">
    <img src="https://img.shields.io/badge/API-Reference-5e5bff?style=for-the-badge" alt="Read the API reference" />
  </a>
  <a href="https://vercel.com/new/clone?repository-url=https://github.com/itsfizys/quotescdn">
    <img src="https://img.shields.io/badge/Deploy-Vercel-111827?style=for-the-badge&logo=vercel&logoColor=white" alt="Deploy with Vercel" />
  </a>
</p>

<p align="center">
  <a href="#quick-start">Run locally</a>
  ·
  <a href="#api-reference">Explore the API</a>
  ·
  <a href="CONTRIBUTING.md">Contribute</a>
  ·
  <a href="LICENSE">License</a>
</p>

---

## Why Quotes CDN

- No API key is required.
- Quote data is stored locally for fast, predictable responses.
- Every record has a stable numeric index.
- Search by anime title, character, quote text, or exact index.
- Return quote cards as plain SVG URLs that work in Markdown and HTML.
- Use the same endpoints locally, on Vercel, or through another Node host.

---

## Quick start

### Requirements

- Node.js 18 or newer
- npm

### Install and run

```bash
git clone https://github.com/itsfizys/quotescdn.git
cd quotescdn
npm install
npm start
```

The server listens on port `5000` by default:

```text
http://localhost:5000
```

Set `PORT` when another port is needed:

```bash
PORT=8080 npm start
```

The project has no runtime package dependencies. `npm install` is still useful
for creating a standard local Node project environment and for future additions.

---

## Web experience

The home page provides:

- A random quote sample loaded from the API
- Search by anime, character, phrase, or numeric index
- Quote copying for chat messages and documentation
- A live SVG card preview
- Five card styles
- A copyable card URL

Open the API documentation at:

```text
/api.html
```

The reference page includes endpoint descriptions, query parameters, examples,
and copy buttons for each route.

---

## API reference

All endpoints return JSON unless the card endpoint is requested as an image.
Replace `https://your-domain.example` with your local or deployed URL.

### API metadata

```http
GET /api
```

Example:

```bash
curl https://your-domain.example/api
```

Response:

```json
{
  "name": "quotescdn",
  "description": "English anime quotes and neo-brutalist SVG quote cards.",
  "endpoints": {
    "quote": "/api/quote",
    "quotes": "/api/quotes",
    "card": "/api/card",
    "animes": "/api/animes"
  },
  "docs": "/api.html"
}
```

### Get one quote

```http
GET /api/quote
```

Without parameters, the endpoint returns a random quote:

```bash
curl https://your-domain.example/api/quote
```

Use query parameters to narrow the result:

```bash
curl https://your-domain.example/api/quote?index=42
curl "https://your-domain.example/api/quote?anime=Naruto"
curl "https://your-domain.example/api/quote?character=Spike"
curl "https://your-domain.example/api/quote?search=friendship"
```

Supported parameters:

| Parameter | Type | Description |
| --- | --- | --- |
| `index` | number | Return the record at an exact zero-based index. |
| `anime` | string | Match an anime title exactly. |
| `character` | string | Match part of a character name. |
| `search` | string | Search the quote, character, and anime title. |
| `seed` | number | Select a deterministic result from the filtered set. |

Response:

```json
{
  "index": 42,
  "anime": "Naruto",
  "character": "Pain",
  "quote": "Because of the existence of love - sacrifice is born."
}
```

When no matching quote exists, the endpoint returns `404`:

```json
{
  "error": "No quote found"
}
```

### List quotes

```http
GET /api/quotes
```

Return a paginated collection:

```bash
curl "https://your-domain.example/api/quotes?limit=20&offset=0"
curl "https://your-domain.example/api/quotes?search=power&limit=10"
curl "https://your-domain.example/api/quotes?anime=Naruto&limit=10"
```

Supported parameters:

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `search` | string | none | Search quote, character, and anime fields. |
| `anime` | string | none | Match an anime title exactly. |
| `character` | string | none | Match part of a character name. |
| `limit` | number | `20` | Number of records to return, capped at `100`. |
| `offset` | number | `0` | Number of matching records to skip. |

Response:

```json
{
  "total": 184,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "index": 42,
      "anime": "Naruto",
      "character": "Pain",
      "quote": "Because of the existence of love - sacrifice is born."
    }
  ]
}
```

### Get the anime index

```http
GET /api/animes
```

Return every searchable anime title and the total number of titles:

```bash
curl https://your-domain.example/api/animes
```

Response:

```json
{
  "count": 1260,
  "data": ["Naruto", "Bleach"]
}
```

### Generate an SVG or PNG quote card

```http
GET /api/card
```

The default response is an SVG image, so it can be embedded directly:

```md
![Anime quote](https://your-domain.example/api/card?index=42&style=editorial)
```

Use `format=png` when you need a raster image, such as for Discord uploads:

```bash
curl "https://your-domain.example/api/card?index=42&style=editorial&format=png" \
  -o anime-quote.png
```

The PNG response uses `Content-Type: image/png`.

Card requests can use the same quote filters:

```text
/api/card?index=42&style=editorial
/api/card?anime=Naruto&style=cinema
/api/card?character=Spike&style=polaroid
/api/card?search=friendship&style=gallery
```

Available styles:

| Style | Description |
| --- | --- |
| `editorial` | Open layout with quiet typography. |
| `cinema` | Dark frame with soft contrast. |
| `polaroid` | Paper-like snapshot treatment with serif type. |
| `terminal` | Monospace command-line treatment. |
| `gallery` | Centered art-print layout. |

Add `format=json` to receive the quote fields and SVG markup in one response:

```bash
curl "https://your-domain.example/api/card?index=42&style=editorial&format=json"
```

---

## Using the API in an application

### JavaScript

```js
const response = await fetch(
  "https://your-domain.example/api/quote?search=friendship&seed=0",
);

const quote = await response.json();
console.log(`${quote.quote} — ${quote.character}, ${quote.anime}`);
```

### HTML image

```html
<img
  src="https://your-domain.example/api/card?index=42&style=gallery"
  alt="Anime quote card"
/>
```

### Discord or bot command flow

1. Receive a command such as `/quote Naruto`.
2. Call `/api/quote?anime=Naruto`.
3. Send the returned quote, character, and anime fields.
4. Use `/api/card` when the response should include a visual card.

---

## Deployment

### Vercel

The repository is configured for Vercel:

1. Import `itsfizys/quotescdn` into Vercel.
2. Keep the project root at the repository root.
3. Use the default build settings.
4. Deploy.

No environment variables are required. The `public/` directory provides the
browser pages, and the `api/` directory contains Vercel-compatible functions.

CLI deployment:

```bash
npx vercel
npx vercel --prod
```

The included `vercel.json` only enables clean URLs. Node runtime selection is
handled by Vercel's automatic function detection.

### Replit

The local server can run directly with:

```bash
node server.js
```

The server respects the `PORT` environment variable and binds to
`0.0.0.0`, which makes it suitable for a Replit web workflow.

---

## Data model

Each quote is stored as a JSON object:

```json
{
  "index": 0,
  "character": "Soul Eater",
  "quote": "In the end the shape and form don't matter at all...",
  "anime": "Soul Eater"
}
```

The committed data files are:

- `main.json` — quote records
- `index.json` — searchable anime index and aggregate counts

The dataset is local and indexed so the API can respond without a database or
third-party request during normal operation.

Review the applicable source licensing terms before redistributing the data or
adding new material.

---

## File tree

```text
quotescdn/
├── api/
│   ├── animes.js       # Anime index endpoint
│   ├── card.js         # SVG and PNG quote card endpoint
│   ├── index.js        # API metadata endpoint
│   ├── quote.js        # Single quote endpoint
│   └── quotes.js       # Quote list endpoint
├── lib/
│   ├── card.js         # SVG card rendering logic
│   └── quotes.js       # Search, filtering, and pagination logic
├── public/
│   ├── api.html        # API reference page
│   ├── app.js          # Browser interactions
│   ├── favicon.svg     # Site icon
│   ├── index.html      # Quote explorer
│   └── styles.css      # Site and API documentation styles
├── CONTRIBUTING.md     # Contribution rules
├── index.json          # Anime index and counts
├── LICENSE             # MIT license
├── main.json           # Local quote dataset
├── package.json        # Node scripts and project metadata
├── server.js           # Local HTTP server
└── vercel.json         # Vercel clean URL configuration
```

---

## Contributing

Before opening a pull request, read
[CONTRIBUTING.md](CONTRIBUTING.md). Keep changes focused, preserve the API
response shapes, and update the documentation when adding or changing an
endpoint.

---

## License

The project code is available under the [MIT License](LICENSE). Review source
licensing terms for quote data before redistributing records or adding new
material.

---

<p align="center">
  <a href="#quotes-cdn">Back to top</a>
</p>