import { test, describe } from 'node:test';
import * as assert from 'node:assert';
import { build } from '../helper.js';

describe('Run Shortcut', () => {
  test('Should have an error message when shortcutName is not exist', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {},
    });

    assert.equal(JSON.parse(res.payload).statusCode, 400);
    assert.equal(JSON.parse(res.payload).error, 'Bad Request');
  });

  test('Should have an error message when shortcutName is empty', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: '',
      },
    });

    assert.equal(JSON.parse(res.payload).statusCode, 400);
    assert.equal(JSON.parse(res.payload).error, 'Bad Request');
  });

  test('Should have an error message when shortcutName value is not string', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: ['first', 'second'],
      },
    });

    assert.equal(JSON.parse(res.payload).statusCode, 400);
    assert.equal(JSON.parse(res.payload).error, 'Bad Request');
  });

  test('Should have an error message when Shortcut App is not exist from Shortcut list', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'asdf',
        shortcutInput: 'App is not exist',
      },
    });

    assert.deepStrictEqual(JSON.parse(res.payload), {
      statusCode: 404,
      error: 'Not Found',
      message: 'Not Found',
    });
  });

  test('Should have an error message when shortcutInput is not exist', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'TestShortcutsApiHelper',
      },
    });

    assert.equal(JSON.parse(res.payload).statusCode, 400);
    assert.equal(JSON.parse(res.payload).error, 'Bad Request');
  });

  test('Should have an error message when shortcutInput value is empty', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'TestShortcutsApiHelper',
        shortcutInput: '',
      },
    });

    assert.deepStrictEqual(JSON.parse(res.payload), {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Bad Request',
    });
  });

  test('Should have a success when shortcutInput value is string', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'TestShortcutsApiHelper',
        shortcutInput: 'Value is string',
      },
    });

    assert.deepStrictEqual(JSON.parse(res.payload), {
      success: true,
    });
  });

  test('Should have an error message when shortcutInput value is array', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'TestShortcutsApiHelper',
        shortcutInput: ['This is an array', 'this is an second item'],
      },
    });

    assert.equal(JSON.parse(res.payload).statusCode, 400);
    assert.equal(JSON.parse(res.payload).error, 'Bad Request');
  });

  test('Should have an error message when shortcutInput object is empty', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'TestShortcutsApiHelper',
        shortcutInput: {},
      },
    });

    assert.deepStrictEqual(JSON.parse(res.payload), {
      statusCode: 400,
      error: 'Bad Request',
      message: 'Input is not valid',
    });
  });

  test('Should have a success after send payload', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'TestShortcutsApiHelper',
        shortcutInput: {
          text: 'Text: Success',
        },
      },
    });

    assert.deepStrictEqual(JSON.parse(res.payload), {
      success: true,
    });
  });

  test('Should have an error message when shortcut file response is Empty', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'ErrorShortcutsWithEmptyApiHelper',
        shortcutInput: {
          text: 'Text: Error',
        },
      },
    });

    assert.equal(JSON.parse(res.payload).statusCode, 500);
    assert.equal(JSON.parse(res.payload).error, 'Internal Server Error');
  });

  test('Should have an error message when shortcut file response is string', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'ErrorShortcutsWithStringValueApiHelper',
        shortcutInput: {
          text: 'Text: Error',
        },
      },
    });

    assert.equal(JSON.parse(res.payload).statusCode, 500);
    assert.equal(JSON.parse(res.payload).error, 'Internal Server Error');
  });

  test('Should have an error message when shortcut file response is empty object', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'ErrorShortcutsWithEmptyObjectApiHelper',
        shortcutInput: {
          text: 'Text: Error',
        },
      },
    });

    assert.equal(JSON.parse(res.payload).statusCode, 500);
    assert.equal(JSON.parse(res.payload).error, 'Internal Server Error');
  });

  test('Should have an error message when shortcut file response without error prop', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'ErrorShortcutWithRandomObjectApiHelper',
        shortcutInput: {
          text: 'Text: Error',
        },
      },
    });

    assert.equal(JSON.parse(res.payload).statusCode, 500);
    assert.equal(JSON.parse(res.payload).error, 'Internal Server Error');
  });

  test('Should have a success message when shortcut file response ', async (t) => {
    const app = await build(t);

    const res = await app.inject({
      method: 'POST',
      url: '/shortcuts/run',
      payload: {
        shortcutName: 'SuccessShortcutApiHelper',
        shortcutInput: {
          text: 'Text: Success',
        },
      },
    });

    assert.deepStrictEqual(JSON.parse(res.payload), {
      success: true,
    });
  });
});
