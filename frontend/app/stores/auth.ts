export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: "" as string,
    refreshToken: "" as string,
    user: null as any,
  }),

  getters: {
    isLoggedIn: (state) => Boolean(state.accessToken),

    role: (state) => state.user?.role,

    isAdmin: (state) => state.user?.role === "ADMIN",
    isStaff: (state) => state.user?.role === "STAFF",
    isDriver: (state) => state.user?.role === "DRIVER",
    isUser: (state) => state.user?.role === "USER",

    canManageUsers(): boolean {
      return this.isAdmin;
    },

    canManageDrivers(): boolean {
      return this.isAdmin || this.isStaff;
    },

    canManageTrucks(): boolean {
      return this.isAdmin || this.isStaff;
    },

    canManageTrips(): boolean {
      return this.isAdmin || this.isStaff;
    },

    canViewReports(): boolean {
      return this.isAdmin || this.isStaff;
    },
  },

  actions: {
    loadFromCookie() {
      const accessToken = useCookie<string | null>("accessToken");
      const refreshToken = useCookie<string | null>("refreshToken");

      this.accessToken = accessToken.value || "";
      this.refreshToken = refreshToken.value || "";
    },

    saveTokens(accessTokenValue: string, refreshTokenValue: string) {
      const accessToken = useCookie<string | null>("accessToken");
      const refreshToken = useCookie<string | null>("refreshToken");

      accessToken.value = accessTokenValue;
      refreshToken.value = refreshTokenValue;

      this.accessToken = accessTokenValue;
      this.refreshToken = refreshTokenValue;
    },

    clearAuth() {
      const accessToken = useCookie<string | null>("accessToken");
      const refreshToken = useCookie<string | null>("refreshToken");

      accessToken.value = null;
      refreshToken.value = null;

      this.accessToken = "";
      this.refreshToken = "";
      this.user = null;
    },

    async login(username: string, password: string) {
      const config = useRuntimeConfig();

      const res = await $fetch<any>(`${config.public.apiBase}/auth/login`, {
        method: "POST",
        body: { username, password },
      });

      this.saveTokens(res.accessToken, res.refreshToken);
      this.user = res.user;

      return res;
    },

    async me() {
      const { api } = useApi();

      const user = await api<any>("/auth/me");

      this.user = user;
      return user;
    },

    async refreshAccessToken() {
      const config = useRuntimeConfig();

      if (!this.refreshToken) {
        throw new Error("No refresh token");
      }

      const res = await $fetch<{
        accessToken: string;
        refreshToken: string;
      }>(`${config.public.apiBase}/auth/refresh`, {
        method: "POST",
        body: {
          refreshToken: this.refreshToken,
        },
      });

      this.saveTokens(res.accessToken, res.refreshToken);

      return res.accessToken;
    },

    async logout() {
      const { api } = useApi();

      try {
        if (this.accessToken) {
          await api("/auth/logout", {
            method: "POST",
          });
        }
      } finally {
        this.clearAuth();
        await navigateTo("/login");
      }
    },
  },
});
