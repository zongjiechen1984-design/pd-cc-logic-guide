import fs from "node:fs/promises";

const sourceHtml = await fs.readFile("pd-cc-logic-spec-summary.html", "utf8");
const worker = `const INDEX_HTML = ${JSON.stringify(sourceHtml)};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(INDEX_HTML, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "public, max-age=300"
        }
      });
    }

    return new Response("Not Found", { status: 404 });
  }
};
`;

await fs.rm("dist", { recursive: true, force: true });
await fs.mkdir("dist/server", { recursive: true });
await fs.writeFile("dist/server/index.js", worker);
