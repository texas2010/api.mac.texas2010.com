import { FastifyRequest, FastifyReply } from 'fastify';
import { runAppleScript } from 'run-applescript';

interface ShortcutRequestBody {
  shortcutName: string;
  shortcutInput: string | object;
}

interface GetShortcutsResponse {
  shortcutNamesList: string[];
}

interface PostShortcutsRequest {
  Body: ShortcutRequestBody;
}

interface RunShortcutResSuccess {
  success: true;
  file: string;
}

interface RunShortcutResSuccessWithData<T> extends RunShortcutResSuccess {
  data: T;
}

interface RunShortcutResError {
  error: true;
  message: string;
  file: string;
}

const runShortcut = async <T>(
  name: string,
  input: ShortcutRequestBody | string = ''
): Promise<
  RunShortcutResSuccess | RunShortcutResSuccessWithData<T> | RunShortcutResError
> => {
  const json = JSON.stringify(input).replace(/"/g, '\\"');

  try {
    const result = await runAppleScript(`
      set json to "${json}"
      tell application "Shortcuts Events"
        run shortcut "${name}" with input json
      end tell
    `);

    try {
      const maybeJson = JSON.parse(result);
      return maybeJson;
    } catch {
      throw new Error();
    }
  } catch (error) {
    throw new Error('Shortcut data response is not valid');
  }
};

export const post = async (
  request: FastifyRequest<PostShortcutsRequest>,
  reply: FastifyReply
) => {
  const { shortcutName, shortcutInput } = request.body;

  if (!shortcutName || (typeof shortcutInput === 'string' && !shortcutInput)) {
    return reply.badRequest();
  }

  const getShortcutsRes = await runShortcut<GetShortcutsResponse>(
    'GetShortcutsApiHelper'
  );

  if (!('data' in getShortcutsRes)) {
    return reply.badRequest();
  }
  const { shortcutNamesList } = getShortcutsRes.data;
  const isValidShortcut = shortcutNamesList.includes(shortcutName);
  if (!isValidShortcut) {
    return reply.notFound();
  }

  const postShortcutRes = await runShortcut(
    'PostShortcutsApiHelper',
    request.body
  );

  if (
    typeof postShortcutRes !== 'object' ||
    postShortcutRes === null ||
    (!Array.isArray(postShortcutRes) &&
      Object.keys(postShortcutRes).length === 0) ||
    (!('success' in postShortcutRes) && !('error' in postShortcutRes))
  ) {
    throw new Error(
      'Shortcut did not return expected { error, message } or { success } format.'
    );
  }

  if ('error' in postShortcutRes) {
    return reply.badRequest(postShortcutRes.message);
  }

  return reply.code(200).send({ success: true });
};
