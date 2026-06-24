<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-100">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h1 class="text-3xl font-bold text-slate-900">LavaMax Logistics</h1>

      <p class="mt-2 text-slate-500">เข้าสู่ระบบจัดการขนส่ง</p>

      <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="w-full rounded-lg border px-4 py-3 outline-none focus:border-red-500"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full rounded-lg border px-4 py-3 outline-none focus:border-red-500"
        />

        <UButton type="submit" block color="error" :loading="loading">
          เข้าสู่ระบบ
        </UButton>

        <div v-if="errorMessage" class="text-sm text-red-600">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({

  middleware: ["guest"],
});

const auth = useAuthStore();

const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");

async function handleLogin() {
  loading.value = true;
  errorMessage.value = "";

  try {
    await auth.login(username.value, password.value);
    await navigateTo("/dashboard");
  } catch {
    errorMessage.value = "Username หรือ Password ไม่ถูกต้อง";
  } finally {
    loading.value = false;
  }
}
</script>
