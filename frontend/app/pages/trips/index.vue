<template>
  <div>
    <h1 class="text-3xl font-bold text-slate-900">เที่ยววิ่ง</h1>

    <p class="mt-2 text-slate-600">ADMIN และ STAFF เข้าได้</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "staff"],
});
</script>
