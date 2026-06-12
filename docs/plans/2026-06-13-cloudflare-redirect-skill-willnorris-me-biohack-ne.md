# Plan: `cloudflare-redirect` skill + willnorris.me → biohack.net/cv/

**Date:** 2026-06-13

## Context

User wants `http(s)://willnorris.me` to 301 to `https://biohack.net/cv/`, and — on
reflection — wants this generalized into a **reusable skill** for "redirect one domain
to another," supporting two modes:

1. **Single destination** — every URL on the source goes to one fixed target
   (willnorris.me's case → `https://biohack.net/cv/`).
2. **Path passthrough** — preserve path + query (`src.com/foo?q=1` →
   `dest.com/foo?q=1`).

This is Cloudflare's **Dynamic URL Redirects (Single Redirects)** feature, free on any
proxied zone. No existing skill covers domain→domain redirects: `cloudflare-domain-setup`
gets a zone active; `cloudflare-static-site` does hosting. This fills that gap.

**Live state verified 2026-06-13 (read-only CF API + dig):**

- `willnorris.me` is already a Cloudflare zone (NS `vin`/`mary.ns.cloudflare.com`) but
  has **no apex DNS record** — it doesn't resolve today; nothing redirects yet.
- The cached `biohack.net/.creds/bootstrap.env` token is **zone-scoped to biohack.net
  only** — cannot touch willnorris.me. No other CF cred exists locally. → A **new token
  scoped to the source zone** is the one manual input.
- The exact CF permission group for Single Redirects is **`Dynamic URL Redirects Write`**
  (zone-scoped), confirmed against the live permission-group list. Full token scope:
  `Zone Read` + `DNS Write` + `Dynamic URL Redirects Write`, all on the source zone.
- `biohack.net`'s `public/_redirects` already maps `/cv → /cv/`, so target must be
  `/cv/` (trailing slash) to avoid a double hop.

---

## Deliverable 1 — New skill `~/.claude/skills/cloudflare-redirect/`

Matches existing skill conventions (frontmatter + phased SKILL.md + bundled
`set -euo pipefail` script with `-h`/`--dry-run`).

### `SKILL.md`

Frontmatter:
```yaml
name: cloudflare-redirect
description: Redirect one domain to another on Cloudflare (free Single Redirect) —
  either all URLs to a single destination, or path/query passthrough. Source domain
  must already be a Cloudflare zone. Trigger phrases: "redirect domain to", "point
  one domain at another", "domain forwarding", "301 redirect a domain", "redirect
  willnorris.me", "set up a domain redirect".
version: 1.0.0
```

Body (phased):
- **Step 0 — Inputs:** source domain (must be a CF zone), destination URL, mode
  (`single` | `passthrough`), include-www (default yes), status (default 301).
- **Precondition check:** source must already be an active CF zone (point to
  `cloudflare-domain-setup` if not). Single Redirects need the apex proxied.
- **Token:** create one Custom Token scoped to the source zone with `Zone:Read` +
  `DNS:Edit` + `Dynamic URL Redirect:Edit` (UI labels), paste it (hidden). Validate via
  `/user/tokens/verify`. Document the permission-group UUIDs + first-run verify note,
  same as the other CF skills.
- **Run the bundled script** (below). Verify with curl.

### `cf-redirect.sh` (bundled, generic, flag-driven — not placeholder-substituted)

```
cf-redirect.sh --source <domain> --to <url> [--mode single|passthrough]
               [--www|--no-www] [--status 301|302] [--token-cache <file>] [--dry-run] [-h]
```
Reuses the `cf_api` / `cache_set` / token-prompt-and-validate helpers from
`biohack.net/scripts/bootstrap-site.sh`. Idempotent steps:

1. Validate/cache token (`.creds/<source>.redirect.env`, chmod 600).
2. Resolve zone: `GET /zones?name=<source>`; die clearly if empty (token not scoped to
   that zone, or zone missing).
3. Proxied placeholder records (so CF answers + runs the rule at the edge for HTTP *and*
   HTTPS): ensure `AAAA <source> → 100::` proxied, and `AAAA www.<source> → 100::`
   proxied when `--www`. Check-then-create (idempotent).
4. Single Redirect rule via
   `PUT /zones/{id}/rulesets/phases/http_request_dynamic_redirect/entrypoint`:
   - expression: `(http.host eq "<source>")` (+ `or (http.host eq "www.<source>")` if www)
   - **single mode:** `from_value.target_url.value = "<to>"`, `preserve_query_string=false`
   - **passthrough mode:** `from_value.target_url.expression =
     concat("<to-origin>", http.request.uri.path)`, `preserve_query_string=true`
   - `status_code = <status>`; PUT replaces phase rules → re-run-safe.
5. Inline verify loop: poll `curl -sI https://<source>` for the redirect (Universal SSL
   may need ~1–3 min after records go proxied).

> Note in SKILL.md: target domain need NOT be on Cloudflare; only the source. HTTP works
> automatically (rule runs pre-scheme in the dynamic-redirect phase). Universal SSL covers
> apex + `*.domain`, so www is covered.

---

## Deliverable 2 — Apply to willnorris.me

```
cf-redirect.sh --source willnorris.me --to https://biohack.net/cv/ --mode single --www
```

Single-destination, apex + www, 301. User creates the one token (3 perms, scoped to
willnorris.me); the script does the rest and self-verifies.

---

## Reproducibility / docs

- Record the exact reproducible command in
  `~/SRC/docs/plans/2026-05-08-domain-portfolio-migration.md` (§"Free Cloudflare
  redirects" + Transfer-mechanics step 4) and mark those willnorris.me items done — the
  skill is the executable form of that runbook.
- The skill + cached token are the reproducible artifact (no CI, no per-project repo
  state — a redirect is one-time CF config).
- Token cache file is gitignored (lives under `.creds/`, already ignored).

## Decision baked in (flag on review)

- **Skill name** `cloudflare-redirect`; generic flag-driven script (no per-project
  placeholder substitution, since redirects hold no project state) — departs slightly
  from `cloudflare-static-site`'s template-substitution style because there's nothing to
  substitute.
- **Apex + www** both redirect (drop with `--no-www`).
- Token pasted directly (one UI visit, 3 perms) rather than the meta-token auto-mint from
  `cloudflare-domain-setup` — simpler for a single zone; UUIDs documented so auto-mint can
  be added later.

## Verification

Executed 2026-06-13. Applied via:
`cf-redirect.sh --source willnorris.me --to https://biohack.net/cv/ --mode single --www`
(token resolved zone `02fa6958…`, created both proxied `AAAA 100::` placeholders, wrote
the redirect rule).

**1. `dig +short willnorris.me` — CF proxy IPs, not empty**
```
104.21.72.236
172.67.187.211
```
**PASS** (Cloudflare anycast, no longer non-resolving).

**2. `curl -sI http://willnorris.me`**
```
HTTP/1.1 301 Moved Permanently
Location: https://biohack.net/cv/
```
**PASS** — HTTP redirects (no separate "Always Use HTTPS" needed).

**3. `curl -sI https://willnorris.me` (valid cert, no -k)**
```
HTTP/2 301
location: https://biohack.net/cv/
```
**PASS** — Universal SSL cert valid.

**4. `curl -sI https://www.willnorris.me`**
```
HTTP/2 301
location: https://biohack.net/cv/
```
**PASS** — www covered by Universal SSL (`*.willnorris.me`); first check was blank for
~30 s while the cert provisioned, then green.

**5. `curl -sIL https://willnorris.me` — full follow chain**
```
HTTP/2 301
location: https://biohack.net/cv/
HTTP/2 200
```
**PASS** — single hop to `/cv/` (trailing slash avoids biohack's `/cv → /cv/` bounce),
ends 200.

**Skill self-tests:** `cf-redirect.sh -h` prints usage (exit 0); `--dry-run` for both
`single` and `passthrough` modes emits correct rule JSON without touching Cloudflare.
**PASS.**

All steps PASS — redirect is live.
