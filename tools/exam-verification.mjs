import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

// Private authoring metadata, excluded from student exam exports.
export function examVerificationStore(path) {
  let pending = Promise.resolve();
  const read = async () => {
    try { return JSON.parse(await readFile(path, 'utf8')); }
    catch (error) { if (error.code === 'ENOENT') return {}; throw error; }
  };
  return {
    read,
    set(id, verified) {
      const action = pending.then(async () => {
        if (typeof verified !== 'boolean') throw new TypeError('Verified must be true or false.');
        const records = await read();
        const record = { verified, updatedAt: new Date().toISOString() };
        Object.defineProperty(records, id, { value: record, enumerable: true, configurable: true, writable: true });
        await mkdir(dirname(path), { recursive: true });
        await writeFile(`${path}.tmp`, `${JSON.stringify(records, null, 2)}\n`, 'utf8');
        await rename(`${path}.tmp`, path);
        return record;
      });
      pending = action.catch(() => {});
      return action;
    },
  };
}
