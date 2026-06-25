<template>
  <div>
    <CrudHeader
      :title="isEdit ? 'แก้ไขพนักงานขับรถ' : 'เพิ่มพนักงานขับรถ'"
      description="กรอกข้อมูลพนักงานขับรถ"
    />

    <div v-if="loading" class="rounded-xl bg-white p-6 shadow-sm">กำลังโหลดข้อมูล...</div>

    <form v-else class="space-y-6" @submit.prevent="submit">
      <!-- ข้อมูลคนขับ -->
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold text-slate-900">ข้อมูลคนขับ</h2>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="label">รหัสคนขับ</label>
            <input v-model="form.code" class="input" placeholder="เช่น D001" />
          </div>

          <div>
            <label class="label">เบอร์โทร</label>
            <input v-model="form.phone" class="input" placeholder="เช่น 0812345678" />
          </div>

          <div>
            <label class="label">ชื่อ</label>
            <input v-model="form.firstname" class="input" placeholder="ชื่อ" />
          </div>

          <div>
            <label class="label">นามสกุล</label>
            <input v-model="form.lastname" class="input" placeholder="นามสกุล" />
          </div>
        </div>
      </div>

      <!-- ข้อมูลบัญชีธนาคาร -->
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <h2 class="mb-4 text-lg font-semibold text-slate-900">ข้อมูลบัญชีธนาคาร</h2>

        <div class="grid gap-4 md:grid-cols-3">
          <div>
            <label class="label">ธนาคาร</label>
            <USelectMenu
              v-model="form.bankName"
              :items="banks"
              placeholder="เลือกธนาคาร"
              size="xl"
              class="w-full"
            />
          </div>

          <div>
            <label class="label">เลขบัญชี</label>
            <input v-model="form.bankAccountNo" class="input" placeholder="เลขบัญชี" />
          </div>

          <div>
            <label class="label">ชื่อบัญชี</label>
            <input v-model="form.bankAccountName" class="input" placeholder="ชื่อบัญชี" />
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="rounded-lg bg-red-50 p-4 text-red-600">
        {{ errorMessage }}
      </div>

      <div class="flex gap-3">
        <UButton type="submit" color="error" :loading="saving"> บันทึก </UButton>

        <UButton to="/drivers" color="neutral" variant="soft"> ยกเลิก </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id?: number;
}>();

const banks = [
  "ธนาคารกรุงเทพ",
  "ธนาคารกสิกรไทย",
  "ธนาคารกรุงไทย",
  "ธนาคารไทยพาณิชย์",
  "ธนาคารกรุงศรีอยุธยา",
  "ธนาคารทหารไทยธนชาต",
  "ธนาคารออมสิน",
  "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร",
  "ธนาคารยูโอบี",
  "ธนาคารซีไอเอ็มบี ไทย",
];

const { api } = useApi();

const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");

const isEdit = computed(() => Boolean(props.id));

const form = reactive({
  code: "",
  firstname: "",
  lastname: "",
  phone: "",
  bankName: "",
  bankAccountNo: "",
  bankAccountName: "",
});

async function loadDriver() {
  if (!props.id) return;

  loading.value = true;

  try {
    const driver = await api<any>(`/drivers/${props.id}`);

    Object.assign(form, {
      code: driver.code || "",
      firstname: driver.firstname || "",
      lastname: driver.lastname || "",
      phone: driver.phone || "",
      bankName: driver.bankName || "",
      bankAccountNo: driver.bankAccountNo || "",
      bankAccountName: driver.bankAccountName || "",
    });
  } finally {
    loading.value = false;
  }
}

async function submit() {
  saving.value = true;
  errorMessage.value = "";

  try {
    if (isEdit.value) {
      await api(`/drivers/${props.id}`, {
        method: "PATCH",
        body: form,
      });
    } else {
      await api("/drivers", {
        method: "POST",
        body: form,
      });
    }

    await navigateTo("/drivers");
  } catch (error: any) {
    errorMessage.value =
      error?.data?.message?.[0] || error?.data?.message || "บันทึกไม่สำเร็จ";
  } finally {
    saving.value = false;
  }
}

onMounted(loadDriver);
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

.label {
  margin-bottom: 0.25rem;
  display: block;
  font-size: 0.875rem;
  color: rgb(71 85 105);
}
</style>
