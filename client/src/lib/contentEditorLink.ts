/** Content Studio runs separately; hosted installs can configure its HTTPS address. */
export function contentEditorQuestionHref(questionId:string,assessmentId?:unknown,base=import.meta.env.VITE_CONTENT_STUDIO_URL||'http://localhost:4319') {
  const url=new URL(base);
  if(!['http:','https:'].includes(url.protocol))throw new Error('Use an HTTP or HTTPS Content Studio URL.');
  url.searchParams.set('questionId',questionId);
  if(typeof assessmentId==='string'&&assessmentId)url.searchParams.set('assessmentId',assessmentId);
  url.hash='math';
  return url.toString();
}
