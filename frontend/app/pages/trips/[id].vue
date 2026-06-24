<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">
          แก้ไขเที่ยววิ่ง #{{ tripId }}
        </h1>
        <p class="mt-1 text-slate-500">แก้ไขข้อมูลเที่ยววิ่ง</p>
      </div>

      <UButton to="/trips" color="neutral" variant="soft"> กลับ </UButton>
    </div>

    <div v-if="loading" class="rounded-xl bg-white p-6 shadow-sm">
      กำลังโหลดข้อมูล...
    </div>

    <form v-else class="space-y-6" @submit.prevent="updateTrip">
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold">ข้อมูลงาน</h2>

        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <label class="label">วันที่</label>
            <input v-model="form.tripDate" type="date" class="input" />
          </div>

          <div>
            <label class="label">ชนิดงาน/ตู้</label>
            <input v-model="form.jobType" class="input" />
          </div>

          <div>
            <label class="label">Booking</label>
            <input v-model="form.bookingNo" class="input" />
          </div>

          <div>
            <label class="label">เบอร์ตู้</label>
            <input v-model="form.containerNo" class="input" />
          </div>

          <div>
            <label class="label">ต้นทาง</label>
            <input v-model="form.origin" class="input" />
          </div>

          <div>
            <label class="label">ปลายทาง</label>
            <input v-model="form.destination" class="input" />
          </div>

          <div>
            <label class="label">ระยะทาง KM</label>
            <input
              v-model.number="form.distanceKm"
              type="number"
              class="input"
            />
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold">การเงิน</h2>

        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <label class="label">ค่าขนส่ง</label>
            <input
              v-model.number="form.freightPrice"
              type="number"
              class="input"
            />
          </div>

          <div>
            <label class="label">กำไรสุทธิ</label>
            <input
              v-model.number="form.netProfit"
              type="number"
              class="input"
            />
          </div>

          <div>
            <label class="label">เบิกได้</label>
            <input
              v-model.number="form.reimbursableAmount"
              type="number"
              class="input"
            />
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold">สถานะ</h2>

        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <label class="label">สถานะเที่ยว</label>
            <select v-model="form.tripStatus" class="input">
              <option value="DRAFT">DRAFT</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label class="label">สถานะวางบิล</label>
            <select v-model="form.billingStatus" class="input">
              <option value="NOT_BILLED">NOT_BILLED</option>
              <option value="BILLED">BILLED</option>
              <option value="PAID">PAID</option>
            </select>
          </div>

          <div>
            <label class="label">หมายเหตุ</label>
            <input v-model="form.note" class="input" />
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 text-red-600">
        {{ errorMessage }}
      </div>

      <div class="flex gap-3">
        <UButton type="submit" color="error" :loading="saving">
          บันทึก
        </UButton>

        <UButton to="/trips" color="neutral" variant="soft"> ยกเลิก </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "staff"],
});

const route = useRoute();
const { api } = useApi();

const tripId = Number(route.params.id);

const loading = ref(true);
const saving = ref(false);
const errorMessage = ref("");

const form = reactive<any>({
  tripDate: "",
  jobType: "",
  bookingNo: "",
  containerNo: "",
  origin: "",
  destination: "",
  distanceKm: 0,
  freightPrice: 0,
  netProfit: 0,
  tripStatus: "COMPLETED",
  billingStatus: "NOT_BILLED",
  note: "",
});

async function loadTrip() {
  loading.value = true;

  try {
    const trip = await api<any>(`/trips/${tripId}`);

    Object.assign(form, {
      tripDate: trip.tripDate?.slice(0, 10),

      jobType: trip.jobType || "",
      bookingNo: trip.bookingNo || "",
      containerNo: trip.containerNo || "",

      origin: trip.origin || "",
      destination: trip.destination || "",
      distanceKm: Number(trip.distanceKm || 0),

      freightPrice: Number(trip.freightPrice || 0),
      subcontractCost: Number(trip.subcontractCost || 0),
      advanceAmount: Number(trip.advanceAmount || 0),

      pickupFee: Number(trip.pickupFee || 0),
      shoreFee: Number(trip.shoreFee || 0),
      returnFee: Number(trip.returnFee || 0),
      portFee: Number(trip.portFee || 0),
      dropFee: Number(trip.dropFee || 0),
      tollFee: Number(trip.tollFee || 0),
      maintenanceFee: Number(trip.maintenanceFee || 0),
      electricFee: Number(trip.electricFee || 0),
      prepaidExpense: Number(trip.prepaidExpense || 0),

      netProfit: Number(trip.netProfit || 0),
      reimbursableAmount: Number(trip.reimbursableAmount || 0),

      tripStatus: trip.tripStatus || "COMPLETED",
      billingStatus: trip.billingStatus || "NOT_BILLED",

      note: trip.note || "",
    });
  } finally {
    loading.value = false;
  }
}

async function updateTrip() {
  saving.value = true;
  errorMessage.value = "";

  try {
    await api(`/trips/${tripId}`, {
      method: "PATCH",
      body: {
        tripDate: form.tripDate,

        jobType: form.jobType,
        bookingNo: form.bookingNo,
        containerNo: form.containerNo,

        origin: form.origin,
        destination: form.destination,
        distanceKm: Number(form.distanceKm || 0),

        freightPrice: Number(form.freightPrice || 0),
        subcontractCost: Number(form.subcontractCost || 0),
        advanceAmount: Number(form.advanceAmount || 0),

        pickupFee: Number(form.pickupFee || 0),
        shoreFee: Number(form.shoreFee || 0),
        returnFee: Number(form.returnFee || 0),
        portFee: Number(form.portFee || 0),
        dropFee: Number(form.dropFee || 0),
        tollFee: Number(form.tollFee || 0),
        maintenanceFee: Number(form.maintenanceFee || 0),
        electricFee: Number(form.electricFee || 0),
        prepaidExpense: Number(form.prepaidExpense || 0),

        netProfit: Number(form.netProfit || 0),
        reimbursableAmount: Number(form.reimbursableAmount || 0),

        tripStatus: form.tripStatus,
        billingStatus: form.billingStatus,

        note: form.note,
      },
    });

    await navigateTo("/trips");
  } catch (error: any) {
    console.log(error?.data);

    errorMessage.value =
      error?.data?.message?.[0] || error?.data?.message || "บันทึกไม่สำเร็จ";
  } finally {
    saving.value = false;
  }
}

onMounted(loadTrip);
</script>

<
<style scoped>
.input {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid rgb(203 213 225);
  padding: 0.75rem 1rem;
  outline: none;
}

.input:focus {
  border-color: rgb(239 68 68);
}

.label {
  margin-bottom: 0.25rem;
  display: block;
  font-size: 0.875rem;
  color: rgb(71 85 105);
}
</style>
