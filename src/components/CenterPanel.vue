<script setup>
import { ref, onMounted } from 'vue'
import IntelligentThinkingProcess from './IntelligentThinkingProcess.vue'

const searchInput = ref(null)
const analyzeBtn = ref(null)
const analysisDisplay = ref(null)
const intelligentThinkingProcess = ref(null)
const resultDisplay = ref(null)

const isAnalyzing = ref(false)
const frameIndex = ref(0)
const analysisFrames = ref([])



const startAnalysis = async () => {
  isAnalyzing.value = true
  analysisDisplay.value.style.display = 'block'
  resultDisplay.value.style.display = 'none'

  if (intelligentThinkingProcess.value) {
    await intelligentThinkingProcess.value.startThinkingProcess()
  }

  // 思考过程结束后，显示最终结果
  showResults()
  isAnalyzing.value = false
}



const showResults = () => {
  resultDisplay.value.style.display = 'block'
  resultDisplay.value.innerHTML = `
    <h3 style="color: #ff00ff; margin-bottom: 12px; font-size: 18px;">📈 一周能源效率多模态分析报告</h3>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 16px;">
      <div style="background: rgba(0,100,255,0.2); padding: 12px; border-radius: 10px; border: 1px solid rgba(0,255,255,0.3);">
        <h4 style="color: #00ffff; font-size: 13px;">📊 综合评分</h4>
        <div style="font-size: 22px; color: #00ff00; font-weight: bold;">78.6%</div>
        <p style="font-size: 10px; color: #ccc;">较上周提升 +3.2%</p>
      </div>

      <div style="background: rgba(255,0,100,0.2); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,0,255,0.3);">
        <h4 style="color: #ff00ff; font-size: 13px;">⚡ 节能潜力</h4>
        <div style="font-size: 22px; color: #ffff00; font-weight: bold;">6%–11%</div>
        <p style="font-size: 10px; color: #ccc;">预估节省 250–470 kWh/天</p>
      </div>

      <div style="background: rgba(0,255,100,0.2); padding: 12px; border-radius: 10px; border: 1px solid rgba(0,255,0,0.3);">
        <h4 style="color: #00ff80; font-size: 13px;">🔋 平均功耗</h4>
        <div style="font-size: 22px; color: #00ff00; font-weight: bold;">172kW</div>
        <p style="font-size: 10px; color: #ccc;">峰值: 260kW</p>
      </div>

      <div style="background: rgba(255,100,0,0.2); padding: 12px; border-radius: 10px; border: 1px solid rgba(255,165,0,0.3);">
        <h4 style="color: #ffa500; font-size: 13px;">🌡️ 环境指数</h4>
        <div style="font-size: 22px; color: #ffff00; font-weight: bold;">19.2°C</div>
        <p style="font-size: 10px; color: #ccc;">适宜温度范围</p>
      </div>
    </div>

    <div style="background: linear-gradient(135deg, rgba(100,0,255,0.2), rgba(255,0,100,0.2)); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,100,255,0.4); text-align: center;">
      <h4 style="color: #ff00ff; margin-bottom: 10px; font-size: 14px;">🚀 AI驱动的未来预期</h4>
      <p style="font-size: 14px; line-height: 1.6; color: #ffffff; margin: 0;">
        通过持续的多模态学习和优化，预计在 <span style="color: #00ffff; font-weight: bold;">3个月内</span>
        可将整体能源效率提升至 <span style="color: #00ff00; font-weight: bold;">85.2%</span>，
        实现 <span style="color: #ffff00; font-weight: bold;">智能化、绿色化</span> 的能源管理目标。
      </p>
    </div>
  `
}



const generateAnalysisFrames = () => {
  const imageUrls = [
    'st/1.png',
    'st/2.png',
    'st/3.png',
    'st/4.png',
    'st/5.png'
  ]

  analysisFrames.value = [
    { time: '09:00', energy: 85, frame: imageUrls[0] },
    { time: '15:00', energy: 72, frame: imageUrls[1] },
    { time: '21:00', energy: 91, frame: imageUrls[2] },
    { time: '12:00', energy: 68, frame: imageUrls[3] },
    { time: '18:00', energy: 78, frame: imageUrls[4] }
  ]
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

onMounted(() => {
  generateAnalysisFrames()
  analyzeBtn.value.addEventListener('click', startAnalysis)
})
</script>

<template>
  <div class="center-panel">
    <div class="search-container">
      <div class="search-box">
        <input type="text" class="search-input" ref="searchInput" placeholder="请评估过去一周能源使用效率？" value="请评估过去一周能源使用效率">
        <button class="analyze-btn" ref="analyzeBtn">🚀 开始分析</button>
      </div>
    </div>

    <div class="analysis-display" ref="analysisDisplay">
      <IntelligentThinkingProcess ref="intelligentThinkingProcess" />

      <div class="result-display" ref="resultDisplay">
        <h3 style="color: #ff00ff; margin-bottom: 20px;">📈 能源效率评估报告</h3>
        <div id="analysisResults"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== 中间分析区域 ========== */
.center-panel {
  background: rgba(10, 10, 30, 0.95);
  border-radius: 18px;
  padding: 20px;
  border: 1px solid rgba(255, 100, 255, 0.25);
  backdrop-filter: blur(25px);
  position: relative;
  overflow: visible;
  height: auto;
}

/* 自定义滚动条样式 */
.center-panel::-webkit-scrollbar {
  width: 8px;
}

.center-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.center-panel::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.center-panel::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, #ff0080, #0080ff);
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.center-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 0, 100, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 255, 100, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.search-container {
  position: relative;
  margin-bottom: 20px;
  z-index: 10;
}

.search-box {
  position: relative;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50px;
  padding: 5px;
  border: 1px solid rgba(255, 100, 255, 0.35);
  box-shadow: 0 6px 24px rgba(255, 0, 255, 0.18);
}

.search-input {
  width: calc(100% - 120px);
  background: none;
  border: none;
  padding: 14px 18px;
  color: #fff;
  font-size: 16px;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.analyze-btn {
  position: absolute;
  right: 5px;
  top: 10px;
  padding: 15px 30px;
  background: linear-gradient(45deg, #ff0080, #8000ff);
  border: none;
  border-radius: 45px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.analyze-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 25px rgba(255, 0, 128, 0.6);
}

.analysis-display {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  padding: 16px;
  min-height: 320px;
  border: 1px solid rgba(255, 100, 255, 0.25);
  position: relative;
  display: none;
  z-index: 10;
}

.result-display {
  background: linear-gradient(135deg, rgba(0, 50, 100, 0.3), rgba(50, 0, 100, 0.3));
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  border: 1px solid rgba(100, 255, 255, 0.35);
  display: none;
  color: #fff;
}
</style>
