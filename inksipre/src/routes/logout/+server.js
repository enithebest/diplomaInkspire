import { createConnection } from '$lib/db/mysql';
import { redirect } from '@sveltejs/kit';

export const POST = async ({ locals, cookies }) => {
  if (!locals.user) {
    throw redirect(302, '/');
  }

  const connection = await createConnection();
  await connection.execute(
    'UPDATE users SET session_token = NULL, session_expiration = NULL WHERE id = ?',
    [locals.user.id]
  );
  connection.release();

  cookies.delete('session', { path: '/' });

  throw redirect(302, '/');
};
