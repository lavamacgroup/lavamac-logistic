<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-slate-900">เพิ่มเที่ยววิ่ง</h1>

      <p class="mt-1 text-slate-500">กรอกข้อมูลเที่ยววิ่งใหม่</p>
    </div>

    <form class="space-y-6" @submit.prevent="submit">
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold">ข้อมูลงาน</h2>

        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <label class="mb-1 block text-sm text-slate-600">วันที่</label>
            <input v-model="form.tripDate" type="date" class="input" />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ชนิดงาน/ตู้</label>
            <input v-model="form.jobType" class="input" />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">Booking</label>
            <input v-model="form.bookingNo" class="input" />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">เบอร์ตู้</label>
            <input v-model="form.containerNo" class="input" />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ต้นทาง</label>
            <input v-model="form.origin" class="input" />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ปลายทาง</label>
            <input v-model="form.destination" class="input" />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ระยะทาง KM</label>
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

        <div class="grid gap-4 md:grid-cols-4">
          <div>
            <label class="mb-1 block text-sm text-slate-600">ค่าขนส่ง</label>
            <input
              v-model.number="form.freightPrice"
              type="number"
              class="input"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">รถร่วม</label>
            <input
              v-model.number="form.subcontractCost"
              type="number"
              class="input"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">Advance</label>
            <input
              v-model.number="form.advanceAmount"
              type="number"
              class="input"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">กำไรสุทธิ</label>
            <input
              v-model.number="form.netProfit"
              type="number"
              class="input"
            />
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold">ค่าใช้จ่าย</h2>

        <div class="grid gap-4 md:grid-cols-4">
          <div>
            <label class="mb-1 block text-sm text-slate-600">ค่ารับตู้</label>
            <input
              v-model.number="form.pickupFee"
              type="number"
              class="input"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ค่าชอร์</label>
            <input v-model.number="form.shoreFee" type="number" class="input" />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ค่าคืนตู้</label>
            <input
              v-model.number="form.returnFee"
              type="number"
              class="input"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ค่าผ่านท่า</label>
            <input v-model.number="form.portFee" type="number" class="input" />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ค่าดอปตู้</label>
            <input v-model.number="form.dropFee" type="number" class="input" />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ค่าทางด่วน</label>
            <input v-model.number="form.tollFee" type="number" class="input" />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ซ่อมบำรุง</label>
            <input
              v-model.number="form.maintenanceFee"
              type="number"
              class="input"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">ค่าเสียบไฟ</label>
            <input
              v-model.number="form.electricFee"
              type="number"
              class="input"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">สำรองจ่าย</label>
            <input
              v-model.number="form.prepaidExpense"
              type="number"
              class="input"
            />
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">เบิกได้</label>
            <input
              v-model.number="form.reimbursableAmount"
              type="number"
              class="input"
            />
          </div>
        </div>
      </div>

      <div class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-xl font-bold">สถานะ / หมายเหตุ</h2>

        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <label class="mb-1 block text-sm text-slate-600">สถานะเที่ยว</label>
            <select v-model="form.tripStatus" class="input">
              <option value="DRAFT">DRAFT</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">สถานะวางบิล</label>
            <select v-model="form.billingStatus" class="input">
              <option value="NOT_BILLED">NOT_BILLED</option>
              <option value="BILLED">BILLED</option>
              <option value="PAID">PAID</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm text-slate-600">หมายเหตุ</label>
            <input v-model="form.note" class="input" />
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 text-red-600">
        {{ errorMessage }}
      </div>

      <div class="flex gap-3">
        <UButton type="submit" color="error" :loading="loading">
          บันทึก
        </UButton>

        <UButton color="neutral" variant="soft" to="/trips"> ยกเลิก </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "staff"],
});

const { api } = useApi();

const loading = ref(false);
const errorMessage = ref("");

const form = reactive({
  tripDate: new Date().toISOString().slice(0, 10),

  jobType: "",
  bookingNo: "",
  containerNo: "",

  origin: "",
  destination: "",
  distanceKm: 0,

  freightPrice: 0,
  subcontractCost: 0,
  advanceAmount: 0,

  pickupFee: 0,
  shoreFee: 0,
  returnFee: 0,
  portFee: 0,
  dropFee: 0,
  tollFee: 0,
  maintenanceFee: 0,
  electricFee: 0,
  prepaidExpense: 0,

  netProfit: 0,
  reimbursableAmount: 0,

  tripStatus: "COMPLETED",
  billingStatus: "NOT_BILLED",

  note: "",
});

const formatNumber = (value: any) => Number(value || 0);

async function submit() {
  loading.value = true;
  errorMessage.value = "";

  try {
    await api("/trips", {
      method: "POST",
      body: {
        ...form,
        distanceKm: formatNumber(form.distanceKm),
        freightPrice: formatNumber(form.freightPrice),
        subcontractCost: formatNumber(form.subcontractCost),
        advanceAmount: formatNumber(form.advanceAmount),
        pickupFee: formatNumber(form.pickupFee),
        shoreFee: formatNumber(form.shoreFee),
        returnFee: formatNumber(form.returnFee),
        portFee: formatNumber(form.portFee),
        dropFee: formatNumber(form.dropFee),
        tollFee: formatNumber(form.tollFee),
        maintenanceFee: formatNumber(form.maintenanceFee),
        electricFee: formatNumber(form.electricFee),
        prepaidExpense: formatNumber(form.prepaidExpense),
        netProfit: formatNumber(form.netProfit),
        reimbursableAmount: formatNumber(form.reimbursableAmount),
      },
    });

    await navigateTo("/trips");
  } catch (error: any) {
    errorMessage.value =
      error?.data?.message?.[0] || error?.data?.message || "บันทึกไม่สำเร็จ";
  } finally {
    loading.value = false;
  }
}
</script>

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
</style>
