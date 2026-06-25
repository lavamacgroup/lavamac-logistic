export const useDrivers = () => {
  const { api } = useApi();

  const drivers = ref<any[]>([]);
  const loading = ref(false);

  async function loadDrivers() {
    loading.value = true;

    try {
      drivers.value = await api<any[]>("/drivers");
    } finally {
      loading.value = false;
    }
  }

  async function deleteDriver(id: number) {
    if (!confirm("ต้องการลบพนักงานขับรถนี้ใช่หรือไม่?")) return;

    await api(`/drivers/${id}`, {
      method: "DELETE",
    });

    await loadDrivers();
  }

  return {
    drivers,
    loading,
    loadDrivers,
    deleteDriver,
  };
};
