/*
 * WebMCP tools for in-browser AI agents (navigator.modelContext).
 * Does nothing in browsers without WebMCP support.
 */
(function () {
  var mc = typeof navigator !== "undefined" && navigator.modelContext;
  if (!mc || typeof mc.registerTool !== "function") return;

  function text(t) {
    return { content: [{ type: "text", text: t }] };
  }
  function getJson(url) {
    return fetch(url, { headers: { Accept: "application/json" } }).then(function (r) {
      if (!r.ok) throw new Error("Request failed: " + r.status);
      return r.json();
    });
  }

  var tools = [
    {
      name: "search_library",
      description:
        "Search The Digital City Library of plain-English guides on making money online (affiliate marketing, semi-passive business ideas, tools and platforms). Returns matching articles with title, summary and URL. Leave query empty to list all articles.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Words to look for in titles and summaries" },
        },
      },
      annotations: { readOnlyHint: true },
      execute: function (input) {
        var words = String((input && input.query) || "").toLowerCase().split(/\s+/).filter(Boolean);
        return getJson("/library.json").then(function (list) {
          var hits = list.filter(function (a) {
            var hay = (a.title + " " + a.description + " " + a.district).toLowerCase();
            return words.every(function (w) { return hay.indexOf(w) !== -1; });
          });
          return text(hits.length ? JSON.stringify(hits, null, 2) : "No matching articles.");
        });
      },
    },
    {
      name: "read_article",
      description: "Get the full text of one Library article as Markdown, by its slug (from search_library).",
      inputSchema: {
        type: "object",
        properties: { slug: { type: "string", description: "Article slug, e.g. affiliate-marketing-2027" } },
        required: ["slug"],
      },
      annotations: { readOnlyHint: true },
      execute: function (input) {
        var slug = String((input && input.slug) || "");
        if (!/^[a-z0-9-]+$/.test(slug)) return Promise.resolve(text("Invalid slug."));
        return fetch("/library/" + slug + ".md").then(function (r) {
          return r.ok ? r.text().then(text) : text("No published article with that slug.");
        });
      },
    },
    {
      name: "list_products",
      description:
        "List The Digital City's digital products (worksheets, toolkits, e-book) with prices, summaries and purchase links.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true },
      execute: function () {
        return getJson("/api/trpc/gumroad.products").then(function (body) {
          var list = ((body && body.result && body.result.data && body.result.data.json) || []).map(function (p) {
            return { name: p.name, price: p.formattedPrice, summary: p.summary, url: p.shortUrl };
          });
          return text(list.length ? JSON.stringify(list, null, 2) : "See https://buildyourdigitalcity.gumroad.com");
        });
      },
    },
    {
      name: "subscribe_to_newsletter",
      description:
        "Subscribe an email address to The Digital City's free weekly newsletter. Only use the user's own email address, and only when the user has asked to subscribe. They will receive a confirmation email.",
      inputSchema: {
        type: "object",
        properties: { email: { type: "string", format: "email", description: "The user's email address" } },
        required: ["email"],
      },
      execute: function (input) {
        var email = String((input && input.email) || "").trim();
        return fetch("/api/trpc/subscribe.join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ json: { email: email, source: "webmcp" } }),
        }).then(function (r) {
          return text(r.ok ? "Subscribed. A confirmation email is on its way to " + email + "." : "That didn't work. Check the email address and try again.");
        });
      },
    },
  ];

  tools.forEach(function (tool) {
    try {
      mc.registerTool(tool);
    } catch (e) {
      /* already registered, or unsupported shape */
    }
  });
})();
