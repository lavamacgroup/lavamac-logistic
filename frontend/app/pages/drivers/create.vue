<template>
  <DriverForm />
</template>

<script setup lang="ts">
import DriverForm from "~/modules/drivers/DriverForm.vue";

definePageMeta({
  layout: "dashboard",
  middleware: ["auth", "staff"],
});
</script>
