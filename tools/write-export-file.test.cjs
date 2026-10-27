const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { writeExportFile } = require('./write-export-file.cjs');

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nathan-export-write-'));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith('nathan-export-write-'));
    fs.rmSync(directory, {recursive:true,force:true});
  });
  const target = path.join(directory, 'board-content.json');
  fs.writeFileSync(target, '{"original":true}\n');
  return {directory,target};
}
test('unchanged exports never attempt a replacement of a locked file', t => {
  const {target} = fixture(t);
  const rename = t.mock.method(fs, 'renameSync', () => { throw new Error('An unchanged file must not be renamed'); });
  assert.equal(writeExportFile(target, '{"original":true}\n'), false);
  assert.equal(rename.mock.callCount(), 0);
});
test('transient Windows replacement locks retry atomically and clean up the temporary file', t => {
  const {target,directory} = fixture(t), rename = fs.renameSync;
  let attempts = 0;
  t.mock.method(fs, 'renameSync', (temporary, output) => {
    assert.equal(fs.readFileSync(output, 'utf8'), '{"original":true}\n');
    if (attempts++ < 3) throw Object.assign(new Error('Temporarily locked'), {code:['EPERM','EBUSY','EACCES'][attempts-1]});
    return rename(temporary, output);
  });
  assert.equal(writeExportFile(target, '{"updated":true}\n'), true);
  assert.equal(attempts, 4);
  assert.equal(fs.readFileSync(target, 'utf8'), '{"updated":true}\n');
  assert.deepEqual(fs.readdirSync(directory), ['board-content.json']);
});
test('persistent locks leave the existing JSON intact and produce a retryable error', t => {
  const {target,directory} = fixture(t);
  const rename = t.mock.method(fs, 'renameSync', () => { throw Object.assign(new Error('Locked'), {code:'EPERM'}); });
  assert.throws(() => writeExportFile(target, '{"updated":true}\n'), error => error.code === 'EPERM' && /existing file was kept.*Retry/.test(error.message));
  assert.equal(rename.mock.callCount(), 8);
  assert.equal(fs.readFileSync(target, 'utf8'), '{"original":true}\n');
  assert.deepEqual(fs.readdirSync(directory), ['board-content.json']);
});
test('non-lock failures are reported immediately without damaging the existing file', t => {
  const {target} = fixture(t);
  const rename = t.mock.method(fs, 'renameSync', () => { throw Object.assign(new Error('No space'), {code:'ENOSPC'}); });
  assert.throws(() => writeExportFile(target, '{"updated":true}\n'), {code:'ENOSPC'});
  assert.equal(rename.mock.callCount(), 1);
  assert.equal(fs.readFileSync(target, 'utf8'), '{"original":true}\n');
});
