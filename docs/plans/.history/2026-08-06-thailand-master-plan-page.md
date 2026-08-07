| Date | Change |
|------|--------|
| [2026-08-07](https://github.com/wbniv/biohack.net/commit/9b7a454) | docs: record verification results for the three Thailand plans |
| [2026-08-06](https://github.com/wbniv/biohack.net/commit/ead6e89) | docs: plan Thailand master plan publication |

<!--history-meta v1
9b7a454	author	Will Norris
9b7a454	added	50
9b7a454	deleted	0
9b7a454	files	1
9b7a454	body	Ran the mechanical and headless-browser steps and wrote the raw output\nback under each numbered step with PASS/FAIL, per the house format.\n\nTwo defects surfaced and were fixed: npm test was failing on three\ncalendar events with no task referencing them, and a third party's\nemail address was in the built HTML. Both had already shipped - the\npublish loop had been running build but not test.\n\nMarked NOT RUN honestly rather than assumed: visual inspection at two\nwidths, dark mode, Lighthouse, print preview, touch selection, and\ncomparing the decision branches against the source docs. Those need\neither a human eye or a reading pass, and claiming them would defeat\nthe point of the exercise.\n\nCo-Authored-By: Claude Opus 5 <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01URBu8Ab1pwJgK3deH3nEDZ
ead6e89	author	Will Norris
ead6e89	added	149
ead6e89	deleted	0
ead6e89	files	1
-->
