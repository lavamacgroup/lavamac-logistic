export const useApi = () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();

  const api = async <T>(
    url: string,
    options: any = {},
    retry = true,
  ): Promise<T> => {
    auth.loadFromCookie();

    try {
      return await $fetch<T>(`${config.public.apiBase}${url}`, {
        ...options,
        headers: {
          ...(options.headers || {}),
          ...(auth.accessToken
            ? { Authorization: `Bearer ${auth.accessToken}` }
            : {}),
        },
      });
    } catch (error: any) {
      const status = error?.response?.status || error?.statusCode;

      if (status === 401 && retry && auth.refreshToken) {
        try {
          await auth.refreshAccessToken();
          return await api<T>(url, options, false);
        } catch {
          auth.clearAuth();
          await navigateTo("/login");
          throw error;
        }
      }

      throw error;
    }
  };

  return { api };
};
