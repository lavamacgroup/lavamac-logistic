<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">เที่ยววิ่ง</h1>
        <p class="mt-1 text-slate-500">รายการเที่ยววิ่งทั้งหมด</p>
      </div>

      <UButton color="error" to="/trips/create"> เพิ่มเที่ยววิ่ง </UButton>
    </div>
    <div class="mb-4 rounded-xl bg-white p-4 shadow-sm">
      <input
        v-model="search"
        type="text"
        placeholder="ค้นหา Booking, เบอร์ตู้, ต้นทาง, ปลายทาง..."
        class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
      />
    </div>

    <div class="mb-4 grid gap-4 md:grid-cols-4">
      <div class="rounded-xl bg-white p-5 shadow-sm">
        <div class="text-sm text-slate-500">จำนวนเที่ยว</div>
        <div class="mt-2 text-2xl font-bold">
          {{ totalTrips }}
        </div>
      </div>

      <div class="rounded-xl bg-white p-5 shadow-sm">
        <div class="text-sm text-slate-500">รายได้รวม</div>
        <div class="mt-2 text-2xl font-bold">
          {{ formatMoney(totalRevenue) }}
        </div>
      </div>

      <div class="rounded-xl bg-white p-5 shadow-sm">
        <div class="text-sm text-slate-500">กำไรสุทธิ</div>
        <div class="mt-2 text-2xl font-bold">
          {{ formatMoney(totalProfit) }}
        </div>
      </div>

      <div class="rounded-xl bg-white p-5 shadow-sm">
        <div class="text-sm text-slate-500">ยังไม่วางบิล</div>
        <div class="mt-2 text-2xl font-bold">
          {{ notBilledCount }}
        </div>
      </div>
    </div>
    <div class="mb-4 rounded-xl bg-white p-4 shadow-sm">
      <div class="grid gap-4 md:grid-cols-4">
        <input v-model="startDate" type="date" class="input" />

        <input v-model="endDate" type="date" class="input" />

        <select v-model="selectedTripStatus" class="input">
          <option value="">ทุกสถานะเที่ยว</option>
          <option value="DRAFT">DRAFT</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <select v-model="selectedBillingStatus" class="input">
          <option value="">ทุกสถานะวางบิล</option>
          <option value="NOT_BILLED">NOT_BILLED</option>
          <option value="BILLED">BILLED</option>
          <option value="PAID">PAID</option>
        </select>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl bg-white shadow-sm">
      <div v-if="loading" class="p-6">กำลังโหลดข้อมูล...</div>

      <table v-else class="w-full text-left text-sm">
        <thead class="bg-slate-100 text-slate-600">
          <tr>
            <th class="p-3">วันที่</th>
            <th class="p-3">ลูกค้า</th>
            <th class="p-3">คนขับ</th>
            <th class="p-3">รถ</th>
            <th class="p-3">ต้นทาง</th>
            <th class="p-3">ปลายทาง</th>
            <th class="p-3 text-right">ค่าขนส่ง</th>
            <th class="p-3 text-right">กำไร</th>
            <th class="p-3">สถานะ</th>
            <th class="p-3 text-center">จัดการ</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="trip in filteredTrips"
            :key="trip.id"
            class="border-t hover:bg-slate-50"
          >
            <td class="p-3">
              {{ new Date(trip.tripDate).toLocaleDateString("th-TH") }}
            </td>

            <td class="p-3">
              {{ trip.customer?.name || "-" }}
            </td>

            <td class="p-3">
              {{ trip.driver?.firstname || "-" }}
            </td>

            <td class="p-3">
              {{ trip.truck?.plateNo || "-" }}
            </td>

            <td class="p-3">
              {{ trip.origin || "-" }}
            </td>

            <td class="p-3">
              {{ trip.destination || "-" }}
            </td>

            <td class="p-3 text-right">
              {{ formatMoney(trip.freightPrice) }}
            </td>

            <td class="p-3 text-right">
              {{ formatMoney(trip.netProfit) }}
            </td>

            <td class="p-3">
              {{ trip.tripStatus }}
            </td>
            <td class="p-3">
              <div class="flex gap-2">
                <UButton size="xs" :to="`/trips/${trip.id}`">
                  ดู/แก้ไข
                </UButton>

                <UButton size="xs" color="error" @click="deleteTrip(trip.id)">
                  ลบ
                </UButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "staff"],
});

const { api } = useApi();

const trips = ref<any[]>([]);
const loading = ref(true);

const formatMoney = (value: number) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const loadTrips = async () => {
  loading.value = true;

  try {
    trips.value = await api<any[]>("/trips");
  } finally {
    loading.value = false;
  }
};

async function deleteTrip(id: number) {
  const ok = confirm("ต้องการลบเที่ยววิ่งนี้ใช่หรือไม่?");

  if (!ok) return;

  await api(`/trips/${id}`, {
    method: "DELETE",
  });

  await loadTrips();
}

const search = ref("");

const filteredTrips = computed(() => {
  return trips.value.filter((trip) => {
    const keyword = search.value.toLowerCase();

    const matchKeyword =
      !keyword ||
      [
        trip.bookingNo,
        trip.containerNo,
        trip.origin,
        trip.destination,
        trip.customer?.name,
        trip.driver?.firstname,
        trip.truck?.plateNo,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));

    const matchTripStatus =
      !selectedTripStatus.value || trip.tripStatus === selectedTripStatus.value;

    const matchBillingStatus =
      !selectedBillingStatus.value ||
      trip.billingStatus === selectedBillingStatus.value;

    const tripDate = new Date(trip.tripDate);

    const matchStartDate =
      !startDate.value || tripDate >= new Date(startDate.value);

    const matchEndDate = !endDate.value || tripDate <= new Date(endDate.value);

    return (
      matchKeyword &&
      matchTripStatus &&
      matchBillingStatus &&
      matchStartDate &&
      matchEndDate
    );
  });
});

const totalTrips = computed(() => filteredTrips.value.length);

const totalRevenue = computed(() =>
  filteredTrips.value.reduce(
    (sum, trip) => sum + Number(trip.freightPrice || 0),
    0,
  ),
);

const totalProfit = computed(() =>
  filteredTrips.value.reduce(
    (sum, trip) => sum + Number(trip.netProfit || 0),
    0,
  ),
);

const notBilledCount = computed(
  () =>
    filteredTrips.value.filter((trip) => trip.billingStatus === "NOT_BILLED")
      .length,
);

const selectedTripStatus = ref("");
const selectedBillingStatus = ref("");

const startDate = ref("");
const endDate = ref("");

onMounted(loadTrips);
</script>
