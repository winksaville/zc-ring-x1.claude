export const meta = {
  name: 'punctuation-sweep-design-file',
  description: 'Sweep banned punctuation from seven chunks of ring-buffer-design.md',
  phases: [{ title: 'Sweep' }],
}
const RULES = `You are editing one chunk of a markdown design document in place, with the Edit tool. The job is punctuation only. Do not change meaning, do not add or drop facts, do not touch headings' words, do not reflow text you do not otherwise change, and do not touch anything inside fenced code blocks (\`\`\`) or inline code spans (\`...\`).

Remove every one of these from the prose: the semicolon ";", the em dash "—", the en dash "–", the ellipsis "…", the arrow "→". Rules:

1. "…" becomes "..." and "→" becomes "->" (in prose only).
2. A bullet with a bold lead and an em dash, "- **Label** — text", becomes "- Label: text": drop the bold, replace " —" with ":". The same when the lead is not bold but the dash separates a term from its definition ("\`foo\` — what it is" becomes "\`foo\`: what it is"). If the label already ends in a colon or other punctuation, do not double it.
3. An em dash used as a prose aside becomes a comma, parentheses, or two sentences, whichever reads naturally. A pair of em dashes around an aside becomes a pair of commas or parentheses.
4. A semicolon joining two claims becomes a period, the second half capitalized as its own sentence. A semicolon where the second half continues the first becomes a comma with a conjunction ("and", "so", "but"). A semicolon at the END of a list item (a list written "- a;\\n- b;\\n- c.") is simply deleted, or becomes a period when the item is a full sentence. Several items joined by semicolons inside one sentence become sub-bullets, or commas when the items are short and hold no commas.
5. Keep lines at or under 100 columns. If a changed line grows past 100, re-wrap only that paragraph or bullet, continuation lines indented to match the existing ones.
6. Text that is a verbatim quotation of tool output or a commit title keeps its characters. When unsure, convert.

When done, verify with: awk '/^\`\`\`/{c=!c;next} !c' FILE | sed 's/\`[^\`]*\`//g' | grep -n '[;—–…→]'   and fix anything it prints that is not a verbatim quotation. Note that an inline code span broken across two lines can show as a false hit, leave those. Report only: the count of lines you changed, and any place you were unsure about (line and what you chose).`
const chunks = [1,2,3,4,5,6,7]
const results = await parallel(chunks.map(i => () =>
  agent(`${RULES}\n\nYour file is /home/wink/data/prgs/rust/zc-ring-x1/tmp/rbd/c${i}.md . Edit only that file.`, { label: `sweep:c${i}`, phase: 'Sweep', model: 'sonnet' })
))
return { results }
