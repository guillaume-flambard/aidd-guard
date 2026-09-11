# Publishing

Nothing publishes itself. A version reaches npm when a tag is pushed, the full
gate runs again on that commit, and npm accepts the workflow's own identity.

## Why there is no token in this repository

npm **removed classic and automation tokens in November 2025**; only granular
tokens remain. A granular token can be given a "Bypass 2FA" option, but that
option is on its way out too: since August 2026 it cannot perform account
actions, and **publishing with it stops working in January 2027**
([about access tokens](https://docs.npmjs.com/about-access-tokens)).

What replaces it is **trusted publishing**: npm trades this workflow's OIDC
identity for a short-lived credential. No secret is stored anywhere, and the
only thing on earth that can publish this package is this workflow in this
repository ([trusted publishers](https://docs.npmjs.com/trusted-publishers)).

Requirements, from that page: npm 11.5.1 or later, Node 22.14 or later, and
`permissions: id-token: write` in the job. All three hold in
[`release.yml`](../.github/workflows/release.yml), and the CLI version is
checked explicitly so a runner image that moves backwards fails with a sentence
instead of an authentication error.

## One-time setup, on npmjs.com

This is the only part that needs a human and a browser.

1. Sign in on <https://www.npmjs.com>.
2. Add a trusted publisher for the package `aidd-guard`, with exactly:
   - provider: **GitHub Actions**
   - organization or user: `guillaume-flambard`
   - repository: `aidd-guard`
   - workflow filename: `release.yml`
   - environment: leave empty
3. Save.

npm **does not validate that entry when you save it**. A typo in the repository
name or the workflow filename surfaces only at the first publish attempt, as an
authentication failure. Check the three fields before leaving the page.

If npm refuses to configure a trusted publisher for a name that has never been
published, publish `0.1.0` once by hand (`npm login`, then
`npm publish --access public`, with the browser two-factor challenge), then come
back and do the steps above. Every release after that goes through the workflow.

## Cutting a release

```sh
# the manifest version and the tag must agree; the workflow refuses them otherwise
git tag v0.1.0
git push origin v0.1.0
```

The workflow then lints, formats, typechecks, builds, tests, verifies that the
tag matches `package.json`, asks the registry whether that version already
exists, and only then publishes with `--provenance`.

`workflow_dispatch` exists so a failed publish can be retried without inventing
a new tag.
