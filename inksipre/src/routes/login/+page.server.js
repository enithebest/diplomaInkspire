import { login } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';
import { validateEmail, validatePassword } from '$lib/utils/authUtils';

export const actions = {
  login: async ({ request, cookies }) => {
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

      // Redirect to dashboard
      throw redirect(302, '/admin');
    }

    // Return any login error (email not found or wrong password)
    return { message: result.message };
  }
};
