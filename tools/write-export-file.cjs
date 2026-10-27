// Keep derived JSON readable while Windows readers/watchers briefly hold files.
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const pause = milliseconds => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);

function writeExportFile(output, contents) {
  try { if (fs.readFileSync(output, 'utf8') === contents) return false; }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const temporary = `${output}.${process.pid}.${randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporary, contents, 'utf8');
    for (let attempt = 0; ; attempt++) {
      try { fs.renameSync(temporary, output); return true; }
      catch (error) {
        if (!['EPERM', 'EACCES', 'EBUSY'].includes(error.code)) throw error;
        if (attempt === 7) {
          const failure = new Error(`Could not update ${path.basename(output)} because the file is locked. The existing file was kept. Retry the import after the file is released.`, { cause: error });
          failure.code = error.code;
          throw failure;
        }
        pause(Math.min(25 * 2 ** attempt, 200));
      }
    }
  } finally {
    // Only our unique temporary file is disposable; never delete the target.
    try { fs.unlinkSync(temporary); } catch { /* Rename consumed it, or cleanup can be retried later. */ }
  }
}
module.exports = { writeExportFile };
