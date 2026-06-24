export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();

  auth.loadFromCookie();

  if (!auth.accessToken) {
    return navigateTo("/login");
  }

  try {
    if (!auth.user) {
      await auth.me();
    }
  } catch {
    auth.clearAuth();
    return navigateTo("/login");
  }
});
