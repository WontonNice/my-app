import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { isStudyHallWorksheet } from '../shared/studyHallWorksheets';

type Activity = { id: string; examLabel?: string; studyHallWorksheet?: import('../shared/studyHallWorksheets').StudyHallWorksheet | null };
type Transaction<T> = { version: 1; assessments: T[]; worksheets: T[] };

/** Separate authoritative stores, with one recoverable commit for moves between them.
 * A pending journal is the committed view until both projections have been installed.
 * Student attempts are never modified by this store. */
export function activityStore<T extends Activity>(directory: string) {
  const assessmentFile = path.join(directory, 'assessments.json');
  const worksheetFile = path.join(directory, 'worksheets.json');
  const journalFile = path.join(directory, 'activity-catalog-transaction.json');
  const lockFile = path.join(directory, 'activity-catalog.lock');
  const read = (file: string, fallback: unknown): unknown => {
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return fallback; throw error; }
  };
  const validate = (value: unknown): T[] => {
    if (!Array.isArray(value) || value.some(item => !item || typeof item.id !== 'string' || !item.id.trim())) throw new Error('The learning activity catalog is invalid. Existing files were preserved.');
    if (new Set(value.map(item => item.id)).size !== value.length) throw new Error('The learning activity catalog contains duplicate IDs.');
    return value as T[];
  };
  const snapshot = (): T[] => {
    const journal = read(journalFile, null) as Transaction<T> | null;
    if (journal) {
      if (journal.version !== 1) throw new Error('Unsupported activity transaction. Restore the catalog before editing.');
      return validate([...validate(journal.assessments), ...validate(journal.worksheets)]);
    }
    return validate([...validate(read(assessmentFile, [])), ...validate(read(worksheetFile, []))]);
  };
  const revision = (items: T[]) => createHash('sha256').update(JSON.stringify(items)).digest('hex');
  function atomic(file: string, value: unknown) {
    const text = JSON.stringify(value, null, 2) + '\n';
    try { if (fs.readFileSync(file, 'utf8') === text) return; } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
    const temporary = file + '.' + randomUUID() + '.tmp';
    try { fs.writeFileSync(temporary, text, 'utf8');
      for(let attempt=0;;attempt++){try{fs.renameSync(temporary,file);break;}catch(error){if(attempt>=5||!['EPERM','EBUSY','EACCES'].includes((error as NodeJS.ErrnoException).code??''))throw error;Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,50);}}
    }
    finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  }
  function update(change: (current: T[]) => T[], expectedRevision?: string): T[] {
    fs.mkdirSync(directory, { recursive: true });
    if(fs.existsSync(lockFile)){
      try{const owner=JSON.parse(fs.readFileSync(lockFile,'utf8'));if(Number.isInteger(owner.pid)&&owner.pid>0){try{process.kill(owner.pid,0);}catch(error){if((error as NodeJS.ErrnoException).code==='ESRCH')fs.unlinkSync(lockFile);}}}catch{ /* An unidentifiable lock must not be stolen from another writer. */ }
    }
    let lock: number;
    try { lock = fs.openSync(lockFile, 'wx'); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === 'EEXIST') throw Object.assign(new Error('Another catalog save is in progress. Retry after it finishes.'), { status: 409 }); throw error; }
    try {
      fs.writeFileSync(lock,JSON.stringify({pid:process.pid,startedAt:new Date().toISOString()}));
      const current = snapshot();
      if (expectedRevision && revision(current) !== expectedRevision) throw Object.assign(new Error('The catalog changed in another window. Reload before saving.'), { status: 409 });
      const items = validate(change(current));
      const transaction: Transaction<T> = { version: 1, assessments: items.filter(item => !isStudyHallWorksheet(item)), worksheets: items.filter(isStudyHallWorksheet) };
      if (!fs.existsSync(journalFile) && JSON.stringify(read(assessmentFile, [])) === JSON.stringify(transaction.assessments) && JSON.stringify(read(worksheetFile, [])) === JSON.stringify(transaction.worksheets)) return items;
      atomic(journalFile, transaction);
      atomic(worksheetFile, transaction.worksheets);
      atomic(assessmentFile, transaction.assessments);
      fs.unlinkSync(journalFile);
      return items;
    } finally { fs.closeSync(lock); fs.unlinkSync(lockFile); }
  }
  return { read: snapshot, revision: () => revision(snapshot()), update, write: (items: T[], expectedRevision?: string) => update(() => items, expectedRevision) };
}
