---
description: Review the current file or selection against Vercel's React performance best practices (waterfalls, bundle size, server-side performance, re-renders, hydration, JS performance)
---

Review the target code against the React best practices defined in `.claude/skills/vercel-react-best-practices/`. Load the full rule set from that skill, including all rules in the `rules/` subdirectory as needed.

If the user passed a file path as an argument, review that file. Otherwise review the file currently open or the selection provided in context.

For each issue found:
1. Name the rule ID (e.g. `async-parallel`, `bundle-barrel-imports`, `rerender-no-inline-components`)
2. State its priority level (CRITICAL / HIGH / MEDIUM / LOW)
3. Quote the offending code
4. Explain the performance impact
5. Show the corrected version

Group findings by priority (CRITICAL first). If no issues are found, say so clearly. Do not invent problems.

$ARGUMENTS
