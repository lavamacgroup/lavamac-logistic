<template>
  <DriverForm :id="driverId" />
</template>

<script setup lang="ts">
import DriverForm from "~/modules/drivers/DriverForm.vue";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "staff"],
});

const route = useRoute();
const driverId = Number(route.params.id);
</script>
