# Review of `/home/will/SRC/biohack.net/from-dreamhost/err`

## Context
You asked for a read/summarize of the rsync error log from the Dreamhost import, then walked through the categories of failures to decide which (if any) were worth recovering. This doc is the final disposition — there is no code change to plan, only a conclusion.

## What the log is
- Output of an rsync pulling `/home/wn/` from Dreamhost.
- Transfer completed: 34.09 GB logical, ~29.7 MB actually sent (resumed incremental), speedup 1,133×.
- Exit code **23** — "some files/attrs were not transferred" — caused by **2,600 `Permission denied (13)`** errors on the sender side. No network/transport failure.
- ~6,700 lines, but most of the bulk is rsync progress lines flattened by preserved CRs, not distinct errors.

## Disposition: everything in the err log is ignorable

Walked through all buckets with you. For each you confirmed "don't care":

| Bucket | Count | Note |
|---|---:|---|
| TinyMCE dialog `.htm` | ~1,500 | vendor |
| YUI `YahooUserInterfaceContrib/examples/*.php` | 10 | vendor |
| `JavaPasteAddOn/*.htm` | ~30 | vendor |
| `foswiki/trunk/...`, `twikiplugins/...` `.htm` | ~100 | vendor |
| `phpBB3/.../index.htm` dir-listing blockers | ~40 | vendor |
| Analog stats `*.cache`, `*.cache.yesterday` | 521 | regenerable |
| `.svn/**/t.html` working-copy junk | ~55 | SVN internals |
| Wikipedia saves under `diego.librett.org/.../OLD/` | ~9 | recoverable upstream |
| `biohack.net_DISABLED_BY_DREAMHOST*` + `rx.php` | ~40 | **compromised tree — do not restore** |
| `gallery.../g2data/cache/.../559.incemjwAC` | 1 | regenerable cache |
| `admin.questionmarc.com/.../default.htm` | 1 | FrontPage stub |
| Jabber rosters (`jabber/**/*.xml`) | 3 | you don't want them |
| `questionmarc.com/sd/shop/validator.php` | 1 | you don't want it |
| `.htpasswd` under `/home/wn/logs/*/html/` | 139 | **likely attacker-planted, not legitimate** |

## Security note (your call-out)
The unreadable `.htpasswd` files under `/home/wn/logs/*/html/` on `admin.*` subdomains — plus `rx.php` and the `_COMPROMISED`/`_DISABLED_BY_DREAMHOST` trees — fit the pattern of attacker-planted artifacts (files created by the web user during a compromise, owned by a uid you can't read). Treat them as suspect, not as lost data. Worth saving as a project memory once out of plan mode so future work on this import remembers it.

## Verification / next steps
- None required. Accept `rsync` exit 23 as expected for this import.
- If you ever want a clean re-run, use `--exclude` for:
  - `logs/*/analog/`
  - `**/.svn/`
  - `**/tinymce/`, `**/tiny_mce/`, `**/YahooUserInterfaceContrib/examples/`
  - `**/JavaPasteAddOn/`
  - `foswiki/trunk/`, `**/twikiplugins/*/pub/`
  - `*_DISABLED_BY_DREAMHOST*`, `*_COMPROMISED*`
  - `jabber/`
  - `**/logs/**/html/.htpasswd`
