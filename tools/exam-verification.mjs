import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { join } from 'node:path';

async function optional(operation, missing) {
  try { return await operation(); }
  catch (error) { if (error.code === 'ENOENT') return missing; throw error; }
}

function validRecord(record) {
  return typeof record?.verified === 'boolean' && Number.isFinite(Date.parse(record.updatedAt));
}

async function readDirectory(directory) {
  const files = await optional(() => readdir(directory), []);
  const entries = await Promise.all(files.filter(file => /^[0-9a-f]{64}\.json$/.test(file)).map(async file => {
    const { id, verified, updatedAt } = JSON.parse(await readFile(join(directory, file), 'utf8'));
    if (typeof id !== 'string' || !validRecord({ verified, updatedAt })) throw new Error('Invalid exam verification record.');
    return [id, { verified, updatedAt }];
  }));
  // A personal backup retains earlier decisions, including explicit unchecks.
  return Object.fromEntries(entries.sort(([, a], [, b]) => Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
    || Number(b.verified) - Number(a.verified)));

}

async function writeRecord(directory, id, record, keepHistory) {
  await mkdir(directory, { recursive: true });
  const key = keepHistory ? JSON.stringify([id, record.updatedAt, record.verified]) : id;
  const file = join(directory, createHash('sha256').update(key).digest('hex') + '.json');
  const temp = file + '.' + randomUUID() + '.tmp';
  await writeFile(temp, JSON.stringify({ id, ...record }, null, 2) + '\n', 'utf8');
  await rename(temp, file);
}

// Each exam has its own atomic file. The personal copy survives replacing the
// checkout and the versionable copy travels with the authored content.
export function examVerificationStore(directory, { backup, legacy } = {}) {
  const locations = backup ? [directory, backup] : [directory];
  let pending = Promise.resolve();
  function serialize(operation) {
    const action = pending.then(operation);
    pending = action.catch(() => {});
    return action;
  }

  async function reconcile() {
    const old = legacy ? JSON.parse(await optional(() => readFile(legacy, 'utf8'), '{}')) : {};
    const copies = await Promise.all(locations.map(readDirectory));
    const latest = new Map();
    for (const records of [old, ...copies]) {
      for (const [id, record] of Object.entries(records)) {
        if (!validRecord(record)) throw new Error('Invalid saved exam verification.');
        const previous = latest.get(id);
        if (!previous || Date.parse(record.updatedAt) > Date.parse(previous.updatedAt) ||
            (record.updatedAt === previous.updatedAt && !record.verified)) latest.set(id, record);
      }
    }
    for (const [id, record] of latest) {
      for (const [index, location] of locations.entries()) {
        const saved = copies[index][id];
        if (saved?.updatedAt !== record.updatedAt || saved?.verified !== record.verified) await writeRecord(location, id, record, location === backup);
      }
    }
    return Object.fromEntries(latest);
  }

  return {
    read: () => serialize(reconcile),
    set: (id, verified) => serialize(async () => {
      if (typeof verified !== 'boolean') throw new TypeError('Verified must be true or false.');
      const records = await reconcile();
      const at = Math.max(Date.now(), (Date.parse(records[id]?.updatedAt) || 0) + 1);
      const record = { verified, updatedAt: new Date(at).toISOString() };
      for (const location of locations) await writeRecord(location, id, record, location === backup);
      return record;
    }),
  };
}
