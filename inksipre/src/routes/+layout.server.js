// src/routes/+layout.server.js

export const load = async ({ locals }) => {
  // locals.user is set in hooks.server.js when a valid session exists
  return {
    user: locals.user || null
  };
};
