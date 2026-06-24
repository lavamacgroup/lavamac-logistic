export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();

  auth.loadFromCookie();

  if (!auth.accessToken) {
    return;
  }

  try {
    await auth.me();
    return navigateTo("/dashboard");
  } catch {
    auth.clearAuth();
  }
});
