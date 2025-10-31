import { register } from '$lib/db/auth';
import { redirect } from '@sveltejs/kit';
import { validateEmail, validatePassword } from '$lib/utils/authUtils';

export const actions = {
  register: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const full_name = formData.get('full_name');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!validateEmail(email)) return { message: 'Invalid email format' };
    if (!validatePassword(password)) return { message: 'Password must be at least 8 characters' };
    if (password !== confirmPassword) return { message: 'Passwords do not match' };

    const { token, message } = await register(email, full_name, password);

    if (token) {
      cookies.set('session', token, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
      });

      throw redirect(302, '/admin'); 
    }

    return { message };
  }
};
