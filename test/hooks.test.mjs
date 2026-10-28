import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const source = fileURLToPath(new URL('../', import.meta.url));
const run = (cwd,cmd,args) => spawnSync(cmd,args,{cwd,encoding:'utf8',env:{...process.env,CI:''}});
test('pre-commit rejects bad staged changes, accepts clean ones', () => {
 const cwd=mkdtempSync(join(tmpdir(),'aidd-hooks-'));
 try {
  mkdirSync(join(cwd,'.githooks'));mkdirSync(join(cwd,'scripts'));
  copyFileSync(join(source,'.githooks/pre-commit'),join(cwd,'.githooks/pre-commit'));
  copyFileSync(join(source,'scripts/install-git-hooks.sh'),join(cwd,'scripts/install-git-hooks.sh'));
  assert.equal(run(cwd,'git',['init','-q']).status,0);
  assert.equal(run(cwd,'sh',['scripts/install-git-hooks.sh']).status,0);
  assert.equal(run(cwd,'git',['config','--local','--get','core.hooksPath']).stdout.trim(),'.githooks');
  writeFileSync(join(cwd,'sample.txt'),'bad whitespace  \n');
  assert.equal(run(cwd,'git',['add','sample.txt']).status,0);
  assert.notEqual(run(cwd,'sh',['.githooks/pre-commit']).status,0);
  writeFileSync(join(cwd,'sample.txt'),'clean\n');
  assert.equal(run(cwd,'git',['add','sample.txt']).status,0);
  assert.equal(run(cwd,'sh',['.githooks/pre-commit']).status,0);
  writeFileSync(join(cwd,'.env'),'DUMMY=example\n');
  assert.equal(run(cwd,'git',['add','-f','.env']).status,0);
  assert.notEqual(run(cwd,'sh',['.githooks/pre-commit']).status,0);
 } finally {rmSync(cwd,{recursive:true,force:true});}
});
