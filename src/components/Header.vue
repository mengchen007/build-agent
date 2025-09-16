<script setup>
</script>

<template>
  <header
    class="h-full bg-[linear-gradient(135deg,rgba(10,20,40,0.95),rgba(20,10,50,0.95))] backdrop-blur-[20px] border-b-2 border-[rgba(0,255,255,0.3)] shadow-[0_4px_20px_rgba(0,255,255,0.1)]">
    <div class="h-full max-w-[1400px] mx-auto px-[30px] flex items-center justify-between">
      <!-- Left Section -->
      <div class="flex items-center">
        <div class="system-logo text-[28px] mr-[15px]">🏢</div>
        <h1 class="system-title text-[24px] font-bold mr-[20px]">智慧园区监控系统</h1>
        <div class="text-[14px] text-[#88aaff] font-light tracking-[2px]">园区 • 监控 • 智能 • 管理</div>
      </div>

      <!-- Right Section -->
      <div
        class="flex items-center bg-[rgba(0,255,255,0.1)] p-[8px_16px] rounded-[20px] border border-[rgba(0,255,255,0.3)] text-[13px] text-[#00ffff]">
        <div class="mr-2">
          <div class="status-indicator w-[10px] h-[10px] rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88]"></div>
        </div>
        <span>园区监控中 - 全域感知模式</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.system-logo {
  animation: logoGlow 3s ease-in-out infinite;
}

.system-title {
  background: linear-gradient(45deg, #00ffff, #0080ff, #8000ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.status-indicator {
  animation: statusPulse 2s infinite;
}

@keyframes logoGlow {

  0%,
  100% {
    text-shadow: 0 0 10px #00ffff;
  }

  50% {
    text-shadow: 0 0 20px #00ffff, 0 0 30px #0080ff;
  }
}

@keyframes statusPulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}
</style>
