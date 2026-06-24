<template>
  <div>
    <h1 class="text-3xl font-bold text-slate-900">โปรไฟล์ของฉัน</h1>

    <div class="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <div>Username: {{ auth.user?.username }}</div>
      <div>Email: {{ auth.user?.email }}</div>
      <div>Role: {{ auth.user?.role }}</div>
      <div>Status: {{ auth.user?.status }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const auth = useAuthStore();
</script>
