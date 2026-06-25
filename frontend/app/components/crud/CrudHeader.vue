<template>
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">
        {{ title }}
      </h1>

      <p v-if="description" class="mt-1 text-slate-500">
        {{ description }}
      </p>
    </div>

    <UButton v-if="createTo" color="error" :to="createTo">
      {{ createLabel || "เพิ่มข้อมูล" }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  createTo?: string;
  createLabel?: string;
}>();
</script>
