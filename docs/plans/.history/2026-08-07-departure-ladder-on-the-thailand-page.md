| Date | Change |
|------|--------|
| [2026-08-07](https://github.com/wbniv/biohack.net/commit/d4470fa) | thailand: reconfirm the cat's cabin slot on Friday, not on a Sunday |
| [2026-08-07](https://github.com/wbniv/biohack.net/commit/1865f43) | docs: plan the departure ladder on the Thailand page |

<!--history-meta v1
d4470fa	author	Will Norris
d4470fa	added	4
d4470fa	deleted	1
d4470fa	files	1
d4470fa	body	reconfirm-bkk-icn was set for "18 Oct and 20 Oct" — roughly 72 h and 24 h before\na Wednesday departure. But 18 October 2026 is a SUNDAY, so the early touch landed\non a dead day with the weekend behind it, and the late one leaves 24 hours. A\nreconfirmation needs business days behind it, not merely to precede departure:\nlearning the SSR was dropped is only useful if someone can still fix it. Moved to\nFriday 2026-10-16, which leaves Monday and Tuesday.\n\nNo separate pet-booking task was added. The slot is reserved when the ticket is\nbooked, and book-bkk-icn already covers it with the right reason on the card -\n"a passenger ticket does not reserve the cat's limited in-cabin space". A later\nstandalone booking task would invite the very mistake that line prevents.\n\nNote: tests/thailand-plan.test.mjs has one PRE-EXISTING failure, unchanged by this\ncommit - the event 'brandon' (10 Aug, "Email Brandon (Laos)") is referenced by no\ntask, so it shows on the calendar with nothing behind it.\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01QvfSYz8Nj2YAzHShqtEBP6
1865f43	author	Will Norris
1865f43	added	67
1865f43	deleted	0
1865f43	files	1
1865f43	body	The page shows a flat list of milestones - every card equally weighted and\nunconditional - which cannot express the three things that govern departure week:\nthe AQS calendar (Mon-Fri, and 2026-10-23 is Chulalongkorn Day), the dependency\non one Monday walk-in, and the A->B->C contingency chain that ends in a dead end\nbecause Cambodia's border closed.\n\nPlan only. The TODO entry is NOT added: conformance requires a delegation tier on\nevery open item, and rank-requires-fable denies a non-Fable model from adding one.\nRanking is T5 and Fable's alone, so the line needs adding from a Fable session.\n\nCo-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_01QvfSYz8Nj2YAzHShqtEBP6
-->
