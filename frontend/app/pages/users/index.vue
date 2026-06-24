<template>
  <div>
    <h1 class="text-3xl font-bold text-slate-900">จัดการผู้ใช้</h1>

    <p class="mt-2 text-slate-600">เฉพาะ ADMIN เท่านั้น</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "admin"],
});
</script>
