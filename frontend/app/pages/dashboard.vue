<template>
  <div>
    <h1 class="text-4xl font-bold text-slate-900">Dashboard</h1>

    <p class="mt-2 text-slate-600">ยินดีต้อนรับ {{ displayName }}</p>

    <div v-if="loading" class="mt-8">กำลังโหลดข้อมูล...</div>

    <div
      v-else-if="auth.isDriver"
      class="mt-8 rounded-xl bg-white p-6 shadow-sm"
    >
      <h2 class="text-xl font-bold">งานของฉัน</h2>
      <p class="mt-2 text-slate-500">หน้านี้จะใช้ดูเที่ยววิ่งของคนขับ</p>
    </div>

    <div v-else class="mt-8 space-y-6">
      <div class="grid gap-4 md:grid-cols-4">
        <div class="rounded-xl bg-white p-6 shadow-sm">
          <div class="text-sm text-slate-500">เที่ยววิ่งทั้งหมด</div>
          <div class="mt-2 text-3xl font-bold">
            {{ dashboard?.totalTrips || 0 }}
          </div>
        </div>

        <div class="rounded-xl bg-white p-6 shadow-sm">
          <div class="text-sm text-slate-500">เที่ยวสำเร็จ</div>
          <div class="mt-2 text-3xl font-bold">
            {{ dashboard?.completedTrips || 0 }}
          </div>
        </div>

        <div class="rounded-xl bg-white p-6 shadow-sm">
          <div class="text-sm text-slate-500">รายได้รวม</div>
          <div class="mt-2 text-3xl font-bold">
            {{ formatMoney(dashboard?.totalRevenue) }}
          </div>
        </div>

        <div class="rounded-xl bg-white p-6 shadow-sm">
          <div class="text-sm text-slate-500">กำไรสุทธิ</div>
          <div class="mt-2 text-3xl font-bold">
            {{ formatMoney(dashboard?.totalProfit) }}
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white p-6 shadow-sm">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-900">รายได้รายเดือน</h2>
            <p class="text-sm text-slate-500">จากข้อมูลเที่ยววิ่งปีนี้</p>
          </div>
        </div>

        <div class="flex h-72 items-end gap-3">
          <div
            v-for="item in dashboard?.monthly"
            :key="item.month"
            class="flex flex-1 flex-col items-center gap-2"
          >
            <div class="text-xs text-slate-500">
              {{ formatMoney(item.revenue) }}
            </div>

            <div class="flex h-52 w-full items-end rounded bg-slate-100">
              <div
                class="w-full rounded bg-red-500"
                :style="{
                  height: `${Math.max((item.revenue / maxRevenue) * 100, 3)}%`,
                }"
              />
            </div>

            <div class="text-sm text-slate-600">
              {{ monthNames[item.month - 1] }}
            </div>
          </div>
        </div>
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
const { api } = useApi();

const dashboard = ref<any>(null);
const loading = ref(true);

const monthNames = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const displayName = computed(() => {
  return auth.user?.firstname || auth.user?.username || "ผู้ใช้งาน";
});

const maxRevenue = computed(() => {
  if (!dashboard.value?.monthly) return 0;
  return Math.max(...dashboard.value.monthly.map((m: any) => m.revenue), 1);
});

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value || 0);
};

onMounted(async () => {
  try {
    if (auth.isAdmin || auth.isStaff) {
      dashboard.value = await api("/dashboard/summary");
    }
  } finally {
    loading.value = false;
  }
});
</script>
