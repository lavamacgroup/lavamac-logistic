<template>
  <DriverTable />
</template>

<script setup lang="ts">
import DriverTable from "~/modules/drivers/DriverTable.vue";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "staff"],
});
</script>
