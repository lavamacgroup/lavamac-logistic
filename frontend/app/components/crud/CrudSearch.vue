<template>
  <div class="mb-4 rounded-xl bg-white p-4 shadow-sm">
    <input
      v-model="model"
      type="text"
      :placeholder="placeholder || 'ค้นหา...'"
      class="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  placeholder?: string;
}>();

const model = defineModel<string>({
  default: "",
});
</script>
