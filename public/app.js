const state = { quote: null, style: "gallery" };
const $ = (selector) => document.querySelector(selector);

function renderQuote(quote) {
  state.quote = quote;
  $("#quote-index").textContent = `QUOTE ${String(quote.index).padStart(4, "0")}`;
  $("#quote-text").textContent = `“${quote.quote}”`;
  $("#quote-character").textContent = quote.character;
  $("#quote-anime").textContent = quote.anime;
  $("#card-index-input").value = quote.index;
  $("#card-index-status").textContent = `Previewing quote ${quote.index}.`;
  $("#card-url").textContent = `/api/card?index=${quote.index}&style=${state.style}`;
  $("#card-preview").src = `/api/card?index=${quote.index}&style=${state.style}`;
}

async function getQuote(params = {}) {
  const query = new URLSearchParams(params);
  const response = await fetch(`/api/quote?${query}`);
  if (!response.ok) throw new Error("No quote found");
  return response.json();
}

async function showRandom() {
  $("#random-button").disabled = true;
  try {
    renderQuote(await getQuote());
    $("#search-status").textContent = "Fresh from the index.";
  } catch (error) {
    $("#search-status").textContent = error.message;
  } finally {
    $("#random-button").disabled = false;
  }
}

async function search() {
  const search = $("#search-input").value.trim();
  if (!search) return showRandom();
  try {
    if (/^\d+$/.test(search)) {
      renderQuote(await getQuote({ index: Number(search) }));
      $("#search-status").textContent = `Loaded quote ${search}.`;
    } else {
      renderQuote(await getQuote({ search, seed: 0 }));
      $("#search-status").textContent = `Found a quote matching “${search}”.`;
    }
    revealQuote();
  } catch (error) {
    $("#search-status").textContent = "No match. Try a different phrase.";
  }
}

function revealQuote() {
  if (window.matchMedia("(max-width: 760px)").matches) {
    $("#quote-card").scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

async function loadCardByIndex() {
  const rawIndex = $("#card-index-input").value.trim();
  const index = Number.parseInt(rawIndex, 10);
  if (!Number.isInteger(index) || index < 0) {
    $("#card-index-status").textContent = "Enter an index number starting at 0.";
    return;
  }
  $("#load-card-button").disabled = true;
  $("#card-index-status").textContent = "Loading quote...";
  try {
    renderQuote(await getQuote({ index }));
    $("#card-index-status").textContent = `Loaded quote ${index}.`;
  } catch (error) {
    $("#card-index-status").textContent = "That index does not exist.";
  } finally {
    $("#load-card-button").disabled = false;
  }
}

async function loadRandomCard() {
  $("#card-index-status").textContent = "Finding a random quote...";
  try {
    renderQuote(await getQuote());
    $("#card-index-status").textContent = `Loaded random quote ${state.quote.index}.`;
  } catch (error) {
    $("#card-index-status").textContent = "Could not load a random quote.";
  }
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

$("#random-button").addEventListener("click", showRandom);
$("#quote-search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  search();
});
$("#load-card-button").addEventListener("click", loadCardByIndex);
$("#card-index-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadCardByIndex();
});
$("#random-card-button").addEventListener("click", loadRandomCard);
$("#copy-button").addEventListener("click", async () => {
  if (!state.quote) return;
  await copyText(`“${state.quote.quote}” — ${state.quote.character}, ${state.quote.anime}`);
  $("#copy-button").textContent = "✓";
  setTimeout(() => $("#copy-button").textContent = "⧉", 1200);
});
document.querySelectorAll(".theme-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.style = button.dataset.style;
    document.querySelectorAll(".theme-button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    $("#preview-style").textContent = state.style.toUpperCase();
    if (state.quote) renderQuote(state.quote);
  });
});
$("#copy-url").addEventListener("click", async () => {
  await copyText(location.origin + $("#card-url").textContent);
  $("#copy-url").innerHTML = "Copied ✓";
  setTimeout(() => $("#copy-url").innerHTML = "Copy URL <span>↗</span>", 1300);
});

Promise.all([
  getQuote({ seed: 0 }).then(renderQuote),
  fetch("/api/animes").then((response) => response.json()).then((data) => {
    $("#anime-count").textContent = data.count.toLocaleString();
  }),
  fetch("/api/quotes?limit=1").then((response) => response.json()).then((data) => {
    $("#quote-count").textContent = `${data.total.toLocaleString()}+`;
  })
]).catch(() => {
  $("#quote-text").textContent = "The quote index is warming up.";
});