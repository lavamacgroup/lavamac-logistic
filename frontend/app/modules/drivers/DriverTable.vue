<template>
  <div>
    <CrudHeader
      title="พนักงานขับรถ"
      description="จัดการข้อมูลพนักงานขับรถ"
      create-to="/drivers/create"
      create-label="เพิ่มพนักงานขับรถ"
    />

    <CrudSearch v-model="search" placeholder="ค้นหารหัส, ชื่อ, เบอร์โทร..." />

    <div class="overflow-hidden rounded-xl bg-white shadow-sm">
      <div v-if="loading" class="p-6">กำลังโหลดข้อมูล...</div>

      <table v-else class="w-full text-left text-sm">
        <thead class="bg-slate-100 text-slate-600">
          <tr>
            <th class="p-3">รหัส</th>
            <th class="p-3">ชื่อ</th>
            <th class="p-3">เบอร์โทร</th>
            <th class="p-3">สถานะ</th>
            <th class="p-3 text-center">จัดการ</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="driver in filteredDrivers"
            :key="driver.id"
            class="border-t hover:bg-slate-50"
          >
            <td class="p-3">{{ driver.code || "-" }}</td>

            <td class="p-3">
              {{ driver.firstname }} {{ driver.lastname || "" }}
            </td>

            <td class="p-3">
              {{ driver.phone || "-" }}
            </td>

            <td class="p-3">
              {{ driver.status }}
            </td>

            <td class="p-3">
              <div class="flex justify-center gap-2">
                <UButton size="xs" :to="`/drivers/${driver.id}`">
                  ดู/แก้ไข
                </UButton>

                <UButton
                  size="xs"
                  color="error"
                  @click="deleteDriver(driver.id)"
                >
                  ลบ
                </UButton>
              </div>
            </td>
          </tr>

          <tr v-if="filteredDrivers.length === 0">
            <td colspan="5" class="p-6 text-center text-slate-500">
              ไม่พบข้อมูลพนักงานขับรถ
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDrivers } from "~/modules/drivers/useDrivers";

const search = ref("");

const { drivers, loading, loadDrivers, deleteDriver } = useDrivers();

const filteredDrivers = computed(() => {
  const keyword = search.value.toLowerCase();

  if (!keyword) return drivers.value;

  return drivers.value.filter((driver) => {
    return [
      driver.code,
      driver.firstname,
      driver.lastname,
      driver.phone,
      driver.status,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(keyword));
  });
});

onMounted(loadDrivers);
</script>
