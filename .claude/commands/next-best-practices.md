---
description: Review the current file or selection against Next.js best practices (file conventions, RSC boundaries, async APIs, data patterns, error handling, metadata, image/font/script optimization, bundling, hydration)
---

Review the target code against the Next.js best practices defined in `.claude/skills/next-best-practices/`. Load and apply all rules from that skill.

If the user passed a file path as an argument, review that file. Otherwise review the file currently open or the selection provided in context.

For each issue found:
1. Name the rule or category it violates (e.g. "RSC boundaries", "async params", "image optimization")
2. Quote the offending code
3. Explain why it's a problem
4. Show the corrected version

If no issues are found, say so clearly. Do not invent problems. Group findings by category. Prioritize correctness issues (invalid RSC patterns, missing awaits on async APIs) over style issues.

$ARGUMENTS
