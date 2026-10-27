import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Only public figures from the source site's known media bucket. No cookies,
// credentials, redirects, arbitrary hosts, SVG scripts, or unbounded bodies.
export function satCrashCourseImageImporter(directory, request = fetch) {
  const cache = new Map();
  return async source => {
    const url = new URL(source);
    if (url.protocol !== 'https:' || url.hostname !== 'thesatcrashcourse.s3.amazonaws.com' || url.port || url.username || url.password || !url.pathname.startsWith('/media/')) throw new Error('Image URL is not a SAT Crash Course media asset');
    if (cache.has(url.href)) return cache.get(url.href);
    const pending = (async () => {
      const response = await request(url.href, { redirect:'error', signal:AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`Image server returned ${response.status}`);
      const limit = 8 * 1024 * 1024;
      if (Number(response.headers.get('content-length')) > limit) { await response.body?.cancel(); throw new Error('Image exceeds 8 MB'); }
      const chunks = []; let size = 0;
      for await (const chunk of response.body) { size += chunk.length; if (size > limit) throw new Error('Image exceeds 8 MB'); chunks.push(chunk); }
      const bytes = Buffer.concat(chunks);
      const ext = bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'png'
        : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'jpg'
        : /^GIF8[79]a/.test(bytes.subarray(0,6).toString()) ? 'gif'
        : bytes.subarray(0,4).toString() === 'RIFF' && bytes.subarray(8,12).toString() === 'WEBP' ? 'webp' : '';
      if (!ext) throw new Error('Unsupported image format (use PNG, JPEG, GIF, or WebP)');
      const name = `satcc-${createHash('sha256').update(bytes).digest('hex')}.${ext}`;
      await mkdir(directory, {recursive:true});
      try { await readFile(join(directory, name)); } catch (error) { if (error.code !== 'ENOENT') throw error; await writeFile(join(directory,name), bytes, {flag:'wx'}).catch(error => { if (error.code !== 'EEXIST') throw error; }); }
      return {src:`/exam-images/${name}`};
    })();
    cache.set(url.href, pending);
    try { return await pending; } catch (error) { cache.delete(url.href); throw error; }
  };
}
