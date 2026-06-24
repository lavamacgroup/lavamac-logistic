<template>
  <aside class="flex h-screen w-64 flex-col border-r bg-white">
    <div class="border-b p-4">
      <h1 class="text-xl font-bold text-slate-900">LavaMax Logistics</h1>

      <p class="mt-1 text-sm text-slate-500">
        {{ auth.user?.role }}
      </p>
    </div>

    <nav class="flex-1 space-y-1 p-4">
      <NuxtLink
        v-for="menu in menus.filter((item) => item.show)"
        :key="menu.to"
        :to="menu.to"
        class="block rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100"
        active-class="bg-red-50 text-red-600 font-semibold"
      >
        {{ menu.label }}
      </NuxtLink>
    </nav>

    <div class="border-t p-4">
      <div class="mb-3 text-sm">
        <div class="font-medium text-slate-900">
          {{ auth.user?.firstname || auth.user?.username }}
        </div>

        <div class="text-slate-500">
          {{ auth.user?.role }}
        </div>
      </div>

      <UButton block color="error" @click="auth.logout()"> ออกจากระบบ </UButton>
    </div>
  </aside>
</template>

<script setup lang="ts">
const auth = useAuthStore();

const menus = computed(() => [
  {
    label: "Dashboard",
    to: "/dashboard",
    show: true,
  },
  {
    label: "จัดการผู้ใช้",
    to: "/users",
    show: auth.canManageUsers,
  },
  {
    label: "พนักงานขับรถ",
    to: "/drivers",
    show: auth.canManageDrivers,
  },
  {
    label: "รถขนส่ง",
    to: "/trucks",
    show: auth.canManageTrucks,
  },
  {
    label: "เที่ยววิ่ง",
    to: "/trips",
    show: auth.canManageTrips,
  },
  {
    label: "รายงาน",
    to: "/reports",
    show: auth.canViewReports,
  },
  {
    label: "งานของฉัน",
    to: "/my-trips",
    show: auth.isDriver,
  },
  {
    label: "โปรไฟล์ของฉัน",
    to: "/profile",
    show: true,
  },
]);
</script>
