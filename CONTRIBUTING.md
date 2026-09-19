# Contributing

Thanks for contributing to Quotes CDN.

Quotes CDN is a small, focused API for English anime quotes. Contributions
should keep the service fast, predictable, easy to embed, and useful for bots,
websites, documentation, and other small integrations.

---

## What belongs here

Good contributions include:

- Improvements to quote search, filtering, pagination, or card generation
- Corrections to malformed or duplicated quote records
- New API documentation and usage examples
- Improvements to the quote explorer and API reference pages
- Accessibility, responsive layout, and browser compatibility fixes
- Performance, security, and deployment improvements

Avoid unrelated features, large framework migrations, authentication systems,
databases, or third-party API dependencies unless the change has been
discussed first.

---

## Before you start

1. Fork the repository and clone your fork.
2. Create a focused branch for your change.
3. Review the existing API responses before changing route behavior.
4. Check open issues and pull requests to avoid duplicate work.

```bash
git clone https://github.com/itsfizys/quotescdn.git
cd quotescdn
git checkout -b update-search-behavior
```

---

## Run locally

Quotes CDN runs on Node.js 18 or newer and does not require a database or API
key.

```bash
npm install
npm start
```

Open the site at `http://localhost:5000`.

Useful pages and endpoints:

- `/` — quote explorer and card lab
- `/api.html` — API reference
- `/api` — API metadata
- `/api/quote` — single quote endpoint
- `/api/quotes` — quote list endpoint
- `/api/animes` — anime index endpoint
- `/api/card` — SVG quote card endpoint

Set `PORT` when another local port is needed:

```bash
PORT=8080 npm start
```

---

## Making API changes

The API is used by external applications, so response compatibility matters.

When changing an endpoint:

- Preserve existing routes and HTTP methods whenever possible.
- Preserve existing response fields and their types.
- Use clear `400`, `404`, and `500` behavior.
- Keep query parameters documented in `public/api.html` and `README.md`.
- Add examples for new parameters or response shapes.
- Keep the API usable without authentication or a required third-party service.

The server routes are implemented in `server.js` and the Vercel-compatible
functions are in `api/`. Shared quote and card behavior belongs in `lib/`.

---

## Updating quote data

Quote records are stored in `main.json`, with searchable metadata in
`index.json`.

When adding or correcting records:

- Keep the record shape consistent.
- Use a stable zero-based numeric `index`.
- Include `anime`, `character`, and `quote` values.
- Remove exact duplicates.
- Keep text readable and free of accidental markup.
- Update `index.json` whenever counts or searchable anime titles change.

Example record:

```json
{
  "index": 42,
  "anime": "Naruto",
  "character": "Pain",
  "quote": "Because of the existence of love - sacrifice is born."
}
```

Review applicable source and redistribution terms before adding new material.

---

## Updating the web interface

The browser experience lives in `public/`:

- `public/index.html` contains the quote explorer markup.
- `public/app.js` contains browser interactions and API requests.
- `public/api.html` contains the API reference markup.
- `public/styles.css` contains the site and documentation styles.

For UI changes:

- Preserve the existing routes and core interactions.
- Check both the home page and API reference page.
- Verify desktop and narrow mobile layouts.
- Keep visible text, colors, and controls readable.
- Do not add unrelated dependencies for small interface changes.

---

## Pull request checklist

- [ ] The change is focused and related to Quotes CDN.
- [ ] Existing API routes and response shapes still work.
- [ ] `README.md` is updated when behavior or public usage changes.
- [ ] `public/api.html` documents changed or new endpoints.
- [ ] Quote data changes keep `main.json` and `index.json` consistent.
- [ ] The home page and API reference page were checked locally.
- [ ] No secrets, tokens, credentials, build output, or Replit files are included.
- [ ] No unrelated files are included in the pull request.

---

## Commit and pull request guidance

Use a concise commit subject that explains the outcome:

```text
Improve quote search matching
```

Pull requests should explain:

1. What changed.
2. Why the change is useful.
3. Which routes, pages, or data files are affected.
4. How the change was checked locally.

If the change affects quote sourcing or redistribution, include the source and
any relevant licensing context.

---

## File structure

```text
quotescdn/
├── api/              # Vercel-compatible API functions
├── lib/              # Shared quote filtering and SVG card logic
├── public/            # Static site and API documentation
├── index.json         # Anime index and aggregate counts
├── main.json         # Local quote dataset
├── package.json       # Node scripts and project metadata
├── server.js          # Local HTTP server
├── vercel.json        # Vercel configuration
├── CONTRIBUTING.md    # Contribution guidelines
├── LICENSE            # MIT license
└── README.md          # Project and API documentation
```

---

## License

By contributing, you agree that your contributions will be released under the
project's [MIT License](LICENSE).