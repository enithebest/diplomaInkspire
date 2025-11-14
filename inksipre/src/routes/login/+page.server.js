import { login } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';
import { validateEmail, validatePassword } from '$lib/utils/authUtils';

export const actions = {
  login: async ({ request, cookies, url }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    // Validate email and password
    if (!validateEmail(email)) return { message: 'Invalid email format' };
    if (!validatePassword(password)) return { message: 'Password must be at least 8 characters' };

    // Attempt login
    const result = await login(email, password);

    if (result.token) {
      // Set session cookie
      cookies.set('session', result.token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      // Determine safe redirect target
      const next = url.searchParams.get('next');
      let to = '/profile';
      if (next && typeof next === 'string') {
        // allow only same-site relative paths
        if (next.startsWith('/') && !next.startsWith('//')) {
          to = next === '/login' ? '/profile' : next;
        }
      }
      throw redirect(302, to);
    }

    // Return any login error (email not found or wrong password)
    return { message: result.message };
  }
};
