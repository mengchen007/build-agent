<script setup>
import { ref, onMounted } from 'vue'
import IntelligentThinkingProcess from './IntelligentThinkingProcess.vue'

const searchInput = ref(null)
const analyzeBtn = ref(null)
const analysisDisplay = ref(null)
const intelligentThinkingProcess = ref(null)
const resultDisplay = ref(null)
const frameCarousel = ref(null)
const progressFill = ref(null)
const statusMessage = ref(null)
const extractionInfo = ref(null)
const analysisStatus = ref(null)

const isAnalyzing = ref(false)
const frameIndex = ref(0)
const analysisFrames = ref([])
const currentFrameIndex = ref(0)
const progress = ref(0)
const currentStatusMessage = ref('正在初始化深度学习模型...')
const showFrameAnalysis = ref(false)
let carouselTimer = null



const startAnalysis = async () => {
  isAnalyzing.value = true
  analysisDisplay.value.style.display = 'block'
  resultDisplay.value.style.display = 'none'
  showFrameAnalysis.value = true
  progress.value = 0
  currentFrameIndex.value = 0

  // 显示分析状态
  if (analysisStatus.value) {
    analysisStatus.value.style.display = 'block'
    analysisStatus.value.classList.remove('hidden')
  }

  // 启动轮播
  startCarousel()

  // 运行分析步骤
  await runAnalysisSteps()

  // 停止轮播
  stopCarousel()

  // 分析完成后，启动思考过程
  if (intelligentThinkingProcess.value) {
    await intelligentThinkingProcess.value.startThinkingProcess()
  }

  showResults()
  isAnalyzing.value = false
}



const showResults = () => {
  resultDisplay.value.style.display = 'block'
  resultDisplay.value.innerHTML = `
    <h3 style="color: #b0b0d0; margin-bottom: 12px; font-size: 18px;">📈 一周能源效率多模态分析报告</h3>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 16px;">
      <div style="background: rgba(60,80,100,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(120,140,160,0.4);">
        <h4 style="color: #a0c0e0; font-size: 13px;">📊 综合评分</h4>
        <div style="font-size: 22px; color: #90c090; font-weight: bold;">78.6%</div>
        <p style="font-size: 10px; color: #ccc;">较上周提升 +3.2%</p>
      </div>

      <div style="background: rgba(80,60,100,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(140,120,160,0.4);">
        <h4 style="color: #c0a0e0; font-size: 13px;">⚡ 节能潜力</h4>
        <div style="font-size: 22px; color: #d0d090; font-weight: bold;">6%–11%</div>
        <p style="font-size: 10px; color: #ccc;">预估节省 250–470 kWh/天</p>
      </div>

      <div style="background: rgba(60,100,80,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(120,160,140,0.4);">
        <h4 style="color: #a0e0c0; font-size: 13px;">🔋 平均功耗</h4>
        <div style="font-size: 22px; color: #90c090; font-weight: bold;">172kW</div>
        <p style="font-size: 10px; color: #ccc;">峰值: 260kW</p>
      </div>

      <div style="background: rgba(100,80,60,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(160,140,120,0.4);">
        <h4 style="color: #e0c0a0; font-size: 13px;">🌡️ 环境指数</h4>
        <div style="font-size: 22px; color: #d0d090; font-weight: bold;">19.2°C</div>
        <p style="font-size: 10px; color: #ccc;">适宜温度范围</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
      <div style="background: rgba(50,60,70,0.5); padding: 14px; border-radius: 10px; border: 1px solid rgba(100,110,120,0.4);">
        <h4 style="color: #9ab3c7; font-size: 14px; margin-bottom: 12px;">📊 整体使用分析</h4>
        <div style="font-size: 13px; line-height: 1.5; color: #bbc5d0;">
          <div style="margin-bottom: 6px;">• 高效时段：周三21:00 (91%)</div>
          <div style="margin-bottom: 6px;">• 标准时段：周一09:00, 周五18:00</div>
          <div style="margin-bottom: 6px;">• 待优化：周四12:00 (68%)</div>
          <div>• 平均负载：0.79 (良好)</div>
        </div>
      </div>

      <div style="background: rgba(60,50,70,0.5); padding: 14px; border-radius: 10px; border: 1px solid rgba(110,100,120,0.4);">
        <h4 style="color: #b5a3c7; font-size: 14px; margin-bottom: 12px;">⚡ 能耗模式识别</h4>
        <div style="font-size: 13px; line-height: 1.5; color: #c5bbd0;">
          <div style="margin-bottom: 6px;">• 办公模式：42% (上午时段)</div>
          <div style="margin-bottom: 6px;">• 高效模式：28% (晚间优化)</div>
          <div style="margin-bottom: 6px;">• 过渡模式：18% (傍晚时段)</div>
          <div>• 低效模式：12% (需优化)</div>
        </div>
      </div>
    </div>

    <div style="background: rgba(55,65,75,0.5); padding: 16px; border-radius: 12px; border: 1px solid rgba(105,115,125,0.4); margin-bottom: 16px;">
      <h4 style="color: #a8b8c8; font-size: 14px; margin-bottom: 12px;">🧠 深度学习分析发现</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 13px; color: #c0c8d0;">
        <div>
          <div style="color: #98b5c9; margin-bottom: 8px;">🧠 神经网络识别：</div>
          <div style="margin-bottom: 4px;">• 异常模式检测：3处长时照明</div>
          <div style="margin-bottom: 4px;">• 行为模式分析：工作型67%</div>
          <div>• 时序预测准确率：94.2%</div>
        </div>
        <div>
          <div style="color: #a8a0c9; margin-bottom: 8px;">📊 多维度融合：</div>
          <div style="margin-bottom: 4px;">• 空间分布热力图：东南角密度最高</div>
          <div style="margin-bottom: 4px;">• 时间序列趋势：总体上升3.2%</div>
          <div>• 环境关联度：温度影响占23%</div>
        </div>
      </div>
    </div>
  `
}



const startCarousel = () => {
  carouselTimer = setInterval(() => {
    if (analysisFrames.value.length > 0) {
      currentFrameIndex.value = (currentFrameIndex.value + 1) % analysisFrames.value.length
      displayFrameAnalysis(currentFrameIndex.value)
    }
  }, 1500)
}

const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

const runAnalysisSteps = async () => {
  const steps = [
    { message: '正在加载视频数据...', progress: 5 },
    { message: '初始化多模态AI模型...', progress: 10 },
    { message: '提取关键帧进行分析...', progress: 15 },
    { message: '执行深度学习预处理...', progress: 25 },
    { message: '能源使用模式识别...', progress: 35 },
    { message: '时间序列数据分析...', progress: 45 },
    { message: '空间分布模式分析...', progress: 55 },
    { message: '异常检测和模式识别...', progress: 65 },
    { message: '效率指标计算...', progress: 75 },
    { message: '智能优化建议生成...', progress: 85 },
    { message: '综合评估报告生成...', progress: 95 },
    { message: '✅ 多模态分析完成！', progress: 100 }
  ]

  for (let i = 0; i < steps.length; i++) {
    currentStatusMessage.value = steps[i].message
    progress.value = steps[i].progress

    await sleep(800)
  }

  // 分析完成，隐藏状态指示器
  showFrameAnalysis.value = false
  if (analysisStatus.value) {
    analysisStatus.value.classList.add('hidden')
    setTimeout(() => {
      analysisStatus.value.style.display = 'none'
    }, 500)
  }
}

const generateAnalysisFrames = () => {
  const imageUrls = [
    new URL('@/assets/1.png', import.meta.url).href,
    new URL('@/assets/2.png', import.meta.url).href,
    new URL('@/assets/3.png', import.meta.url).href,
    new URL('@/assets/4.png', import.meta.url).href,
    new URL('@/assets/5.png', import.meta.url).href
  ]

  analysisFrames.value = [
    { time: '09:00', energy: 85, frame: imageUrls[0] },
    { time: '15:00', energy: 72, frame: imageUrls[1] },
    { time: '21:00', energy: 91, frame: imageUrls[2] },
    { time: '12:00', energy: 68, frame: imageUrls[3] },
    { time: '18:00', energy: 78, frame: imageUrls[4] }
  ]
}

const displayFrameAnalysis = (frameIndex) => {
  if (frameIndex >= analysisFrames.value.length) return

  const frame = analysisFrames.value[frameIndex]
  const analysisDetails = getDetailedAnalysisInfo(frameIndex, frame)

  // 更新提取信息显示
  if (extractionInfo.value) {
    extractionInfo.value.innerHTML = `
      <h4 style="color: #00f5ff; margin-bottom: 10px;">🔍 ${analysisDetails.title}</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
        <div>⚡ 能源效率: <span style="color: #00ff00">${frame.energy}%</span></div>
        <div>🌡️ 环境温度: <span style="color: #ffff00">${analysisDetails.temp}°C</span></div>
        <div>💡 设备状态: <span style="color: #00ffff">${analysisDetails.devices}</span></div>
        <div>📊 负载系数: <span style="color: #ff00ff">${analysisDetails.load}</span></div>
        <div>🔋 功耗预估: <span style="color: #ffa500">${analysisDetails.power}</span></div>
        <div>🎯 模式识别: <span style="color: #00ff80">${analysisDetails.mode}</span></div>
      </div>
      <div style="margin-top: 10px; padding: 8px; background: rgba(0,255,255,0.1); border-radius: 5px;">
        <div style="font-size: 12px; color: #00ffff;">🔮 AI分析维度: ${analysisDetails.dimension}</div>
        <div style="font-size: 12px; color: #ff00ff;">📈 置信度: ${analysisDetails.confidence}% | 处理: ${analysisDetails.processing}</div>
      </div>
    `
  }
}

const getDetailedAnalysisInfo = (frameIndex, frame) => {
  const analysisTemplates = [
    {
      title: '周一上午能源模式分析 (09:00)',
      temp: (18 + Math.random() * 4).toFixed(1),
      devices: '空调+照明+设备',
      load: '0.85',
      power: '12.4 kWh',
      mode: '办公高效模式',
      dimension: '时间序列 + 空间分布',
      confidence: (88 + Math.random() * 8).toFixed(1),
      processing: '深度卷积分析'
    },
    {
      title: '周二下午负载分析 (15:00)',
      temp: (20 + Math.random() * 3).toFixed(1),
      devices: '空调+部分照明',
      load: '0.72',
      power: '9.8 kWh',
      mode: '标准工作模式',
      dimension: '热力图 + 行为识别',
      confidence: (85 + Math.random() * 10).toFixed(1),
      processing: '多模态融合'
    },
    {
      title: '周三晚间峰值分析 (21:00)',
      temp: (16 + Math.random() * 3).toFixed(1),
      devices: '全部设备运行',
      load: '0.91',
      power: '15.2 kWh',
      mode: '夜间高效模式',
      dimension: '异常检测 + 模式识别',
      confidence: (92 + Math.random() * 6).toFixed(1),
      processing: 'Transformer模型'
    },
    {
      title: '周四中午低效分析 (12:00)',
      temp: (22 + Math.random() * 4).toFixed(1),
      devices: '空调过载+照明',
      load: '0.68',
      power: '8.5 kWh',
      mode: '优化待改进',
      dimension: '能耗异常 + 环境因子',
      confidence: (79 + Math.random() * 12).toFixed(1),
      processing: '决策树分析'
    },
    {
      title: '周五傍晚过渡分析 (18:00)',
      temp: (19 + Math.random() * 3).toFixed(1),
      devices: '渐进式启动',
      load: '0.78',
      power: '11.1 kWh',
      mode: '过渡平衡模式',
      dimension: '时序预测 + 趋势分析',
      confidence: (86 + Math.random() * 9).toFixed(1),
      processing: 'LSTM时序网络'
    }
  ]

  return analysisTemplates[frameIndex] || analysisTemplates[0]
}

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const handleImageError = (event) => {
  console.log('图片加载失败，使用占位图')
  if (analysisFrames.value[currentFrameIndex.value]) {
    const frame = analysisFrames.value[currentFrameIndex.value]
    event.target.src = createEnergyFrame(frame.energy, `分析帧 ${currentFrameIndex.value + 1}`)
  }
}

const createEnergyFrame = (efficiency, timeLabel) => {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600
  const ctx = canvas.getContext('2d')

  // 背景渐变
  const gradient = ctx.createLinearGradient(0, 0, 800, 600)
  gradient.addColorStop(0, '#001122')
  gradient.addColorStop(1, '#000515')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 800, 600)

  // 绘制能源效率可视化
  ctx.strokeStyle = '#00ffff'
  ctx.lineWidth = 3
  ctx.beginPath()

  // 绘制效率曲线
  for (let i = 0; i < 24; i++) {
    const x = 50 + (i * 30)
    const baseY = 400
    const variation = Math.sin(i * 0.5) * 50 + (efficiency / 100) * 100
    const y = baseY - variation

    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // 标题
  ctx.fillStyle = '#00ffff'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`能源效率分析 - ${timeLabel}`, 400, 50)

  // 效率值
  ctx.fillStyle = efficiency > 80 ? '#00ff00' : efficiency > 60 ? '#ffff00' : '#ff6600'
  ctx.font = 'bold 48px Arial'
  ctx.fillText(`${efficiency}%`, 400, 150)

  // 详细信息
  ctx.fillStyle = '#ffffff'
  ctx.font = '16px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(`时间段: ${timeLabel}`, 50, 500)
  ctx.fillText(`平均功耗: ${(efficiency * 1.2).toFixed(1)} kW`, 50, 530)
  ctx.fillText(`碳排放: ${(100 - efficiency) * 0.5} kg CO₂`, 50, 560)

  return canvas.toDataURL()
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
        <button class="analyze-btn" ref="analyzeBtn">开始分析</button>
      </div>
    </div>

    <div class="analysis-display" ref="analysisDisplay">
      <div class="analysis-status" ref="analysisStatus">
        <div class="status-text">🤖 AI正在进行多模态分析...</div>
        <div class="loading-spinner"></div>
        <div class="progress-bar">
          <div class="progress-fill" ref="progressFill" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="status-message" ref="statusMessage">{{ currentStatusMessage }}</p>
      </div>

      <div class="frame-carousel" ref="frameCarousel">
        <div class="analysis-overlay"></div>
        <img
          v-if="analysisFrames[currentFrameIndex]"
          :src="analysisFrames[currentFrameIndex].frame"
          class="frame-image active analyzing"
          @error="handleImageError"
        />
      </div>

      <div v-if="showFrameAnalysis" class="extraction-info" ref="extractionInfo">
        <h4 style="color: #00f5ff; margin-bottom: 10px;">🔍 实时信息提取</h4>
        <div>准备开始多维度分析...</div>
      </div>

      <!-- <IntelligentThinkingProcess ref="intelligentThinkingProcess" /> -->

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
  background: rgba(120, 140, 160, 0.8);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.center-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(140, 160, 180, 0.9);
  box-shadow: 0 0 5px rgba(120, 140, 160, 0.3);
}

.center-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(20, 25, 35, 0.1);
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
  top: 50%;
  transform: translateY(-50%);
  padding: 15px 30px;
  background: #4a90e2;
  border: 1px solid #3a7bc8;
  border-radius: 45px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.analyze-btn:hover {
  transform: translateY(-50%) scale(1.05);
  background: #357abd;
  box-shadow: 0 2px 8px rgba(74, 144, 226, 0.4);
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

.analysis-status {
  text-align: center;
  margin-bottom: 20px;
  transition: opacity 0.5s ease, visibility 0.5s ease;
}

.analysis-status.hidden {
  opacity: 0;
  visibility: hidden;
}

.status-text {
  font-size: 20px;
  color: #a0c0e0;
  margin-bottom: 10px;
  animation: pulse 2s infinite;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #a0c0e0;
  animation: spin 1s ease-in-out infinite;
  margin: 20px auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 15px 0;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: rgba(100, 150, 200, 0.8);
  width: 0%;
  transition: width 0.3s;
  border-radius: 4px;
  position: relative;
}

.status-message {
  color: #fff;
  font-size: 18px;
  margin: 10px 0;
}

.frame-carousel {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
  background: #000;
  border: 1px solid rgba(150, 150, 170, 0.3);
}

.frame-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: all 0.8s ease;
  transform: scale(1);
}

.frame-image.active {
  opacity: 1;
  transform: scale(1.05);
}

.frame-image.analyzing {
  transform: scale(1.15);
  filter: brightness(1.1) contrast(1.1) saturate(1.1);
  box-shadow: 0 0 15px rgba(150, 150, 170, 0.4);
}

.analysis-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(120, 140, 160, 0.1);
  opacity: 0;
  animation: analyzeFlash 1.5s infinite;
}

@keyframes analyzeFlash {
  0%, 100% { opacity: 0; }
  50% { opacity: 0.7; }
}

.extraction-info {
  background: rgba(0, 0, 0, 0.9);
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #a0c0e0;
  margin-bottom: 15px;
  color: #fff;
  font-size: 13px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.result-display {
  background: rgba(40, 40, 60, 0.6);
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  border: 1px solid rgba(150, 150, 170, 0.35);
  display: none;
  color: #fff;
}

.hidden {
  display: none !important;
}
</style>
