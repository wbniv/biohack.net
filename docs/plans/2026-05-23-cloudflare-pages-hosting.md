# Plan — Cloudflare Pages hosting for biohack.net

## Context

Old Dreamhost hosting is gone. Domain is in Cloudflare (already proxied).
`curl -I https://biohack.net` returns 301 → `www.biohack.net` — a stale Cloudflare
Page Rule from the Dreamhost era. Need Pages hosting so the static HTML repo
deploys on push/tag.

## Steps

1. `scripts/bootstrap-site.sh` — creates Pages project `biohack-net`, removes the
   www redirect Page Rule, sets DNS CNAME, attaches custom domain, provisions a
   scoped CI token, wires `CF_PAGES_API_TOKEN` + `CF_PAGES_ACCOUNT_ID` into GitHub
   Actions secrets.
2. `.github/workflows/deploy.yml` — `wrangler pages deploy .` on `v*` tag push.
3. Tag `v1.0.0` and push; confirm deploy in GH Actions.

## Verification

1. `curl -sI https://biohack.net/` → `HTTP/2 200`
2. `curl -sI https://biohack.net/claude/` → `HTTP/2 200`
3. Body contains "bioHACK dot NET"
