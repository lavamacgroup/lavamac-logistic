export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore();

  auth.loadFromCookie();

  if (!auth.accessToken) {
    return navigateTo("/login");
  }

  if (!auth.user) {
    await auth.me();
  }

  if (!auth.isDriver) {
    return navigateTo("/dashboard");
  }
});
