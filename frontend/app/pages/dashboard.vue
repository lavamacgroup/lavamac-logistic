<template>
  <div>
    <h1 class="text-4xl font-bold text-slate-900">Dashboard</h1>

    <p class="mt-2 text-slate-600">ยินดีต้อนรับ {{ displayName }}</p>

    <div class="mt-8 grid gap-4 md:grid-cols-4">
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <div class="text-sm text-slate-500">Role</div>
        <div class="mt-2 text-2xl font-bold">
          {{ auth.user?.role }}
        </div>
      </div>

      <div v-if="auth.canManageUsers" class="rounded-xl bg-white p-6 shadow-sm">
        <div class="text-sm text-slate-500">Users</div>
        <div class="mt-2 text-2xl font-bold">จัดการผู้ใช้</div>
      </div>

      <div
        v-if="auth.canManageDrivers"
        class="rounded-xl bg-white p-6 shadow-sm"
      >
        <div class="text-sm text-slate-500">Drivers</div>
        <div class="mt-2 text-2xl font-bold">พนักงานขับรถ</div>
      </div>

      <div v-if="auth.isDriver" class="rounded-xl bg-white p-6 shadow-sm">
        <div class="text-sm text-slate-500">My Trips</div>
        <div class="mt-2 text-2xl font-bold">งานของฉัน</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth"],
});

const auth = useAuthStore();

const displayName = computed(() => {
  return auth.user?.firstname || auth.user?.username || "ผู้ใช้งาน";
});
</script>
