# Draft issue for ai-driven-dev/framework

Their CONTRIBUTING is issue-first: a Certified Member or Maintainer validates
this before any PR exists. Template: 🌱 Quick Contribution. Title field is
prefilled as `feat(<scope>): `.

Nothing is posted until Guillaume says so.

---

**Title**

```
feat(aidd-dev): a deterministic check for acceptance criteria that no test covers
```

**Problem to solve**

`aidd-dev:09-for-sure` carries the rule _"never set `status: implemented` until
the success condition genuinely passes"_, and `aidd-dev:03-assert` and
`06-test` rest on the same honesty. Today that rule is an instruction addressed
to a model, and nothing outside the model checks it. A phase can be ticked, a
task marked implemented, and no test anywhere name the behaviour that was
promised.

Measured on this repository at `f6c61cf`, reading every task document under
`aidd_docs/tasks`:

|                                                    |                                              |
| -------------------------------------------------- | -------------------------------------------- |
| Criteria found                                     | 315 (74 `Done-when` bullets, 241 checkboxes) |
| Ticked boxes                                       | 202                                          |
| Ticked boxes with no test title behind them        | 200                                          |
| Criteria sharing no significant word with any test | **0**                                        |

The last row is the interesting one. Every criterion in this repository shares
vocabulary with some test title; what is missing is not tests, it is the link
between a criterion and the test that covers it. Most of those 200 are review
checkboxes rather than product promises, which is a fair objection, and it is
exactly why the numbers above are given whole rather than as a headline.

**Proposed solution**

A deterministic check, runnable from a skill or from CI, that answers one
question: which acceptance criteria are covered by a test?

It reads `## Done-when` bullets and `- [ ]` checkboxes, reads Vitest and Jest
test titles from the TypeScript syntax tree, and matches the two. A criterion is
linked to a test with an HTML comment, never a heading, so the framework's own
parsers and `spec-validator.yml` see nothing new:

```md
- [ ] The export produces a JSON file the user can download.
  <!-- aidd-guard:test="writes the export as JSON" -->
```

It never runs a test, never imports project code, never calls a model, and
produces identical bytes for identical input. Exit codes separate "a gate was
violated" from "your input is malformed" from "the tool has a bug".

Working implementation, MIT, 120 tests, CI green:
<https://github.com/guillaume-flambard/aidd-guard>. It specifies itself in this
format and gates its own build on it (21 criteria, 20 linked by explicit
selector, 1 declared non-testable with a reason).

Two things worth deciding together before any PR:

1. **Where it belongs.** A skill in `aidd-dev` that shells out to the package, a
   hook, or nothing in the framework at all and just a documented companion
   tool. Your call, not mine.
2. **What the plan template should say.** The template ships a
   `#### Acceptance criteria` section, and this repository contains zero such
   headings; plans carry prose sections (`## Guards`, `## Proof`) instead. Any
   checkbox-based check is checking a section people are not writing, so the
   template and the practice should agree first.

Happy to do the work either way, and happy for it to live under the
`ai-driven-dev` org rather than mine if that is what makes sense.

**Content type**: Skill (or Other, depending on decision 1 above)
**Target tool(s)**: Claude Code
