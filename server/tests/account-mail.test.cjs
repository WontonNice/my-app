const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('ts-node').register({ transpileOnly: true, project: path.resolve(__dirname, '../tsconfig.json') });
const { accountMailReady, sendAccountMail } = require('../src/lib/accountMail.ts');
const originalFetch = global.fetch;
const keys = ['APP_PUBLIC_URL', 'RESEND_API_KEY', 'EMAIL_FROM', 'SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];
const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));
after(() => { global.fetch = originalFetch; for (const key of keys) { if (original[key] === undefined) delete process.env[key]; else process.env[key] = original[key]; } });
function configuration() {
  for (const key of keys) delete process.env[key];
  Object.assign(process.env, { APP_PUBLIC_URL: 'https://example.test', RESEND_API_KEY: 'fictional-test-key', EMAIL_FROM: 'Tutor <accounts@example.test>' });
}
test('HTTPS delivery uses the verified sender and fragment links for both email purposes', async () => {
  configuration(); const calls = [];
  global.fetch = async (url, options) => { calls.push({ url, options, body: JSON.parse(options.body) }); return { ok: true }; };
  const token = 'a'.repeat(64);
  await sendAccountMail('student@example.test', 'verify', token);
  await sendAccountMail('student@example.test', 'recover', token);
  assert.equal(calls.length, 2);
  for (const call of calls) {
    assert.equal(call.url, 'https://api.resend.com/emails');
    assert.equal(call.options.method, 'POST');
    assert.equal(call.body.from, 'Tutor <accounts@example.test>');
    assert.deepEqual(call.body.to, ['student@example.test']);
    const link = new URL(call.body.text.match(/https:\/\/\S+/)[0]);
    assert.equal(link.origin, 'https://example.test');
    assert.equal(link.search, '');
    assert.equal(link.hash, '#token=' + token);
  }
  assert.match(calls[0].body.text, /\/account\/verify-email#/);
  assert.match(calls[1].body.text, /\/reset-password#/);
});
test('missing configuration or an insecure public origin prevents delivery', async () => {
  configuration(); let called = false; global.fetch = async () => { called = true; return { ok: true }; };
  delete process.env.RESEND_API_KEY;
  assert.equal(accountMailReady(), false);
  await assert.rejects(sendAccountMail('student@example.test', 'verify', 'b'.repeat(64)), { status: 503 });
  configuration(); process.env.APP_PUBLIC_URL = 'http://example.test';
  await assert.rejects(sendAccountMail('student@example.test', 'recover', 'b'.repeat(64)), { status: 503 });
  assert.equal(called, false);
});
test('provider failures report a safe actionable message without echoing provider secrets', async () => {
  configuration();
  global.fetch = async () => ({ ok: false });
  await assert.rejects(sendAccountMail('student@example.test', 'verify', 'c'.repeat(64)), error => error.status === 503 && error.message.includes('verified sending domain') && !error.message.includes(process.env.RESEND_API_KEY));
});
