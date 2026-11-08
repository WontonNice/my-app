import { supabase } from './supabase';
import { getLibraryAttemptBook } from './libraryBooks';
import { curateLibraryBook, libraryBookFingerprint, type LibraryBookSettings } from '../shared/libraryBooks';

// Reuse the protected library storage namespace, also used for teacher access grants.
export const bookSettingsPrefix = 'english-library:settings:';
export const bookEditionPrefix = 'english-library:edition:';
export async function readBookSetting(topic: string) {
  const result = await supabase.from('student_practice_progress').select('progress').eq('topic_slug', topic).order('updated_at', { ascending: false }).limit(1).maybeSingle();
  if (result.error) throw Object.assign(new Error('Book settings could not be loaded. Please retry.'), { status: 503 });
  return result.data?.progress as (LibraryBookSettings & { bookId: string }) | undefined;
}
export async function libraryBookEdition(bookId: string, revision?: string) {
  const book = getLibraryAttemptBook(bookId);
  if (!book) return undefined;
  const fingerprint = libraryBookFingerprint(book);
  const [editionId, editionFingerprint] = revision?.split(':') ?? [];
  const settings = revision
    ? revision.startsWith('catalog:') ? undefined : await readBookSetting(bookEditionPrefix + editionId)
    : await readBookSetting(bookSettingsPrefix + bookId);
  if (revision && (revision.startsWith('catalog:') ? revision !== `catalog:${fingerprint}` : !settings || settings.bookId !== bookId || (editionFingerprint ?? settings.fingerprint) !== fingerprint)) {
    throw Object.assign(new Error('This book’s source content has changed. Your answers are still on this page; ask your teacher to review the updated book before starting a new attempt.'), { status: 409 });
  }
  // Keep the teacher's selected IDs when sources grow; new questions wait for review.
  const currentSettings = settings && { ...settings, questionIds: settings.questionIds.filter(id => book.passageSet.questions.some(question => question.id === id)) };
  if (currentSettings && !currentSettings.questionIds.length) throw Object.assign(new Error('Your teacher needs to select questions for this book’s updated versions in Book settings.'), { status: 409 });
  return { book: curateLibraryBook(book, currentSettings), settings: settings ?? null, revision: settings ? `${settings.revision}:${fingerprint}` : `catalog:${fingerprint}` };
}
