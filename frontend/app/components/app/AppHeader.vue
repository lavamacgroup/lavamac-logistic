<template>
  <header class="flex h-16 items-center justify-between border-b bg-white px-6">
    <div>
      <h2 class="text-lg font-semibold text-slate-900">ระบบจัดการขนส่ง</h2>
    </div>

    <div class="flex items-center gap-3">
      <div class="text-right text-sm">
        <div class="font-medium text-slate-900">
          {{ displayName }}
        </div>
        <div class="text-slate-500">
          {{ auth.user?.role }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const auth = useAuthStore();

const displayName = computed(() => {
  return auth.user?.firstname || auth.user?.username || "ผู้ใช้งาน";
});
</script>
