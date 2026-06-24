<template>
  <div>
    <h1 class="text-3xl font-bold text-slate-900">งานของฉัน</h1>

    <p class="mt-2 text-slate-600">สำหรับ DRIVER</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const auth = useAuthStore();

onMounted(() => {
  if (!auth.isDriver) {
    navigateTo("/dashboard");
  }
});
</script>
