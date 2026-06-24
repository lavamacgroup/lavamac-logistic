<template>
  <div class="flex min-h-screen bg-slate-50">
    <AppSidebar />

    <div class="flex min-h-screen flex-1 flex-col">
      <AppHeader />

      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
