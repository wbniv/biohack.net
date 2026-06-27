| Date | Change |
|------|--------|
| [2026-06-27](https://github.com/wbniv/biohack.net/commit/2be28fb) | fix(cache): drop /* rule — play/* gets clean immutable, HTML uses CF default |

<!--history-meta v1
2be28fb	author	Will Norris
2be28fb	added	90
2be28fb	deleted	0
2be28fb	files	1
2be28fb	body	The /* rule bled must-revalidate into /play/* (merged headers), producing:\n  Cache-Control: public, max-age=31536000, must-revalidate, immutable\nwhich is contradictory. Cloudflare Pages already defaults HTML pages to\nmax-age=0, must-revalidate — no explicit rule needed. Only /play/* stays,\ngetting a clean max-age=31536000, immutable without any bleed.\n\nCo-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
-->
