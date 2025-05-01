import { test } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../helper.js';

test('default root route', async (t) => {
  const app = await build(t);

  const res = await app.inject({
    method: 'GET',
    url: '/',
  });

  const body = JSON.parse(res.payload);
  assert.strictEqual(body.hello, 'world');
  assert.ok('port' in body);
});
