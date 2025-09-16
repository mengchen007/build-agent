<script setup>
import Header from './components/Header.vue'
import LeftPanel from './components/LeftPanel.vue'
import CenterPanel from './components/CenterPanel.vue'
import RightPanel from './components/RightPanel.vue'
</script>

<template>
  <div class="app-container h-screen flex flex-col text-white font-sans">
    <!-- Header -->
    <header class="h-[70px] flex-shrink-0">
      <Header />
    </header>

    <!-- Main Content -->
    <main class="flex-grow p-4 overflow-hidden">
      <div class="flex gap-4 h-full">
        <!-- Left Panel -->
        <aside class="w-[320px] flex-shrink-0">
          <LeftPanel />
        </aside>

        <!-- Center Panel -->
        <section class="flex-grow">
          <CenterPanel />
        </section>

        <!-- Right Panel -->
        <aside class="w-[350px] flex-shrink-0">
          <RightPanel />
        </aside>
      </div>
    </main>
  </div>
</template>

<style>
.app-container {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a0033 25%, #000d1a 50%, #001a0d 75%, #0a0a0a 100%);
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
}

@keyframes gradientShift {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}
</style>
