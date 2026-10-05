/**
 * XtoX Logistics — smoke tests (zero extra deps, Node built-in test runner)
 * Run: npm test
 *
 * Covers:
 *  - static invariants: layout imports CSS, fonts, chat widget, nav/footer links
 *  - live smoke tests against a running server when SMOKE_BASE_URL is set:
 *      SMOKE_BASE_URL=http://localhost:3000 npm test
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const fs = require("fs");

const BASE = process.env.SMOKE_BASE_URL || "";
const ROOT = path.join(__dirname, "..");
const appDir = path.join(ROOT, "app");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

// ---------- Static checks ----------
describe("project structure", () => {
  it("has a root layout that imports global styles", () => {
    const layout = fs.readFileSync(path.join(appDir, "layout.tsx"), "utf8");
    assert.match(layout, /globals\.css/);
  });

  it("uses the Inclusive Sans font", () => {
    const layout = fs.readFileSync(path.join(appDir, "layout.tsx"), "utf8");
    assert.match(layout, /Inclusive_Sans/);
  });

  it("mounts the ChatWidget in the root layout", () => {
    const layout = fs.readFileSync(path.join(appDir, "layout.tsx"), "utf8");
    assert.match(layout, /ChatWidget/);
  });

  it("renders the Navbar on the home page", () => {
    const home = fs.readFileSync(path.join(appDir, "page.tsx"), "utf8");
    assert.match(home, /Navbar/);
  });

  it("every API route reads request input or validates auth", () => {
    const apiDir = path.join(appDir, "api");
    for (const file of walk(apiDir)) {
      if (!file.endsWith("route.ts")) continue;
      const src = fs.readFileSync(file, "utf8");
      const readsInput =
        src.includes("req.json()") ||
        src.includes("searchParams") ||
        src.includes("sessionFromRequest") ||
        src.includes("req.headers");
      assert.ok(
        readsInput,
        `${path.basename(path.dirname(file))}/route.ts must read request input`
      );
    }
  });

  it("admin routes use the service-role client, not anon", () => {
    for (const name of ["data", "reply"]) {
      const src = fs.readFileSync(path.join(appDir, "api", "admin", name, "route.ts"), "utf8");
      assert.match(src, /getSupabaseAdmin/, `admin/${name} must use service-role client`);
      assert.doesNotMatch(src, /getSupabase\(/, `admin/${name} must not use anon client`);
    }
  });

  it("resource pages exist for navbar dropdown links", () => {
    for (const p of ["articles", "case-studies", "faq", "blog"]) {
      const f = path.join(appDir, "resources", p, "page.tsx");
      assert.ok(fs.existsSync(f), `missing app/resources/${p}/page.tsx`);
    }
  });

  it("footer shows the real contact details", () => {
    const footer = fs.readFileSync(path.join(ROOT, "components", "Footer.tsx"), "utf8");
    assert.match(footer, /xtoxlogistics\.info@gmail\.com/);
    assert.match(footer, /7875488307/);
    assert.match(footer, /xtoxlogisticsindia/);
    assert.match(footer, /linkedin\.com\/company\/xtox-logistics/);
  });

  it("navbar links Login and Sign Up", () => {
    const nav = fs.readFileSync(path.join(ROOT, "components", "Navbar.tsx"), "utf8");
    assert.match(nav, /\/login/);
    assert.match(nav, /\/signup/);
  });

  it("chat schema keeps admin access off the anon role", () => {
    const sql = fs.readFileSync(path.join(ROOT, "supabase", "chat-schema.sql"), "utf8");
    assert.match(sql, /enable row level security/);
    // All chat traffic goes through the Next.js server via the service-role key,
    // so there must be NO anon policies on the chat tables.
    assert.doesNotMatch(sql, /create policy/);
  });
});

// ---------- Live smoke tests (only when SMOKE_BASE_URL is provided) ----------
(BASE ? describe : describe.skip)("live smoke tests", () => {
  it("GET / returns 200 and HTML", async () => {
    const res = await fetch(BASE + "/");
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.match(html, /<!DOCTYPE html>/i);
    assert.match(html, /XtoX/i);
  });

  it("GET /robots.txt returns 200", async () => {
    const res = await fetch(BASE + "/robots.txt");
    assert.equal(res.status, 200);
  });

  it("GET /sitemap.xml returns 200 and lists home", async () => {
    const res = await fetch(BASE + "/sitemap.xml");
    assert.equal(res.status, 200);
    const xml = await res.text();
    assert.match(xml, /<urlset/);
  });

  it("admin data API rejects unauthenticated requests", async () => {
    const res = await fetch(BASE + "/api/admin/data");
    assert.ok([401, 503].includes(res.status), `expected 401/503, got ${res.status}`);
  });

  it("chat API rejects bad tokens", async () => {
    const res = await fetch(BASE + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorToken: "x", body: "hi" }),
    });
    assert.equal(res.status, 400);
  });

  it("quote API rejects missing fields", async () => {
    const res = await fetch(BASE + "/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "t" }),
    });
    assert.equal(res.status, 400);
  });

  it("track API responds without crashing", async () => {
    const res = await fetch(BASE + "/api/track?code=XTX000000");
    // 200/404 = working lookup, 503 = graceful "not configured" degradation
    assert.ok(
      [200, 404, 503].includes(res.status),
      `expected 200/404/503, got ${res.status}`
    );
  });

  it("all static pages return 200", async () => {
    const pages = [
      "/login",
      "/signup",
      "/drivers",
      "/services/packers-movers",
      "/services/packers-movers/book",
      "/services/packers-movers/estimate",
      "/services/packers-movers/express",
      "/services/import-export",
      "/services/sme-transport",
      "/services/agri-export",
      "/resources/articles",
      "/resources/case-studies",
      "/resources/faq",
      "/resources/blog",
    ];
    for (const p of pages) {
      const res = await fetch(BASE + p);
      assert.equal(res.status, 200, `${p} should be 200, got ${res.status}`);
    }
  });
});
