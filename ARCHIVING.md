# Migration and archiving checklist

The canonical destination for the Guard family is
`../guards/packages/aidd-guard`. This repository remains the operational
publication source until every condition below is met. Do not archive it before
then.

## Required before redirecting users

- [ ] `packages/aidd-guard` is enabled in `../guards/pnpm-workspace.yaml`.
- [ ] The package consumes the shared `@spec-guard/core` implementation rather
  than carrying a second engine.
- [ ] From `../guards`, formatting, linting, type checking, tests and package
  build are green for AIDD Guard.
- [ ] A clean install of the produced package exposes `aidd-guard check` and
  `aidd-guard link`.
- [ ] npm package metadata, repository URL, issue URL and trusted-publisher
  configuration point to the canonical repository and release workflow.
- [ ] Known local consumers are searched; external package consumers are given
  a migration notice with a supported release window.

## Then, and only then

1. Publish the first canonical release from `guards/`.
2. Replace this README's opening with a concise redirect to the canonical
   package and repository, retaining installation and migration instructions.
3. Keep this repository readable through the announced support window.
4. Archive the GitHub repository manually after the window ends. Archiving is
   deliberately not automated by this checklist.

## Current observation

The local consumer search found no dependency on `@zoanlogia/aidd-guard` outside
this repository family. That proves only local usage. It does not prove that
npm has no external users.
