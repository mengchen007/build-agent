<script setup>
import { ref, onMounted, nextTick, watch, computed, onUnmounted } from 'vue'

const props = defineProps({
  strict: { type: Boolean, default: false }
})

const currentThinkingStep = ref(null)
const thinkingProcessVisible = ref(false)

const processSteps = [
  {
    type: 'system_init',
    agent: '协调器',
    thought: '收到新的分析请求。正在初始化多智能体团队。',
    details: '任务：评估过去一周的能源效率。',
    deepDetails: '已创建由5个角色组成的协作编队：协调器、数据挖掘、时序分析、视觉识别、策略规划。为每个智能体分配独立上下文、缓存与速率限制，并建立消息总线用于事件驱动协作（topic: energy.timeline, energy.image, energy.hvac）。设定统一的度量标准：MAE、R²、F1、推理时延。目标：在10分钟内给出可执行建议，并量化节能潜力。'
  },
  {
    type: 'agent_dialogue',
    agent: '数据挖掘智能体',
    thought: '正在访问历史能耗数据、天气模式和设备日志。',
    details: '找到5个相关数据集。数据完整性检查通过。',
    deepDetails: '已完成数据编目与清洗。主要数据源：energy_logs_2023_w34.csv、weather_api_data.json、hvac_status.log、lighting_schedule.xml、occupancy_sensors.dat。处理步骤：缺失值插补（中位数与前向填充结合）、去重与时间戳对齐（统一为UTC+8，分钟级重采样）、异常值筛查（IQR 与 Z 分数并行）、跨表主键联接（设备ID、时段、楼层）。衍生特征：外部温度与湿度、冷/热日度（CDD/HDD）、工作日/节假日标识、占用率、功率因数、设备开关状态滚动均值与峰度等。覆盖率：过去7天内完整小时段占比 98.7%。',
    presentation: {
      type: 'code',
      data: `SELECT\n    DATE_TRUNC('hour', timestamp) AS hour,\n    AVG(power_consumption) AS avg_power\nFROM energy_logs\nWHERE timestamp >= NOW() - INTERVAL '7 days'\nGROUP BY hour\nORDER BY avg_power DESC\nLIMIT 5;`
    }
  },
  {
    type: 'agent_dialogue',
    agent: '时序分析智能体',
    thought: '正在分析时间模式。我注意到工作日下午3点左右反复出现峰值。这可能与暖通空调系统有关。',
    details: '应用LSTM模型进行趋势分析。置信度：89%。',
    deepDetails: '采用长短期记忆（LSTM）与季节-趋势分解并行建模：窗口=168小时、步长=1、特征包含气温、湿度、占用率与设备状态的滞后项。在工作日的14:30–15:30时段检测到显著异常，p值<0.01，峰值偏差+22.4%。PACF显示在滞后24和168处存在强相关，说明存在日/周周期。与暖通空调启停信号的互相关在滞后+5分钟处达到0.78。预测误差（RMSE）较全天基线降低18%，异常分数AnomalyScore>3的样本共计9个。',
    presentation: {
      type: 'calculation',
      data: 'AnomalyScore(t) = |x(t) - μ| / (σ + ε)'
    }
  },
  {
    type: 'agent_dialogue',
    agent: '视觉识别智能体',
    thought: '正在处理热成像帧。第3帧显示主入口区域有显著的热量损失。',
    details: '目标检测发现在非高峰时段有3个高耗能设备处于活动状态。',
    deepDetails: '对热成像序列进行标注与时空配准，采用YOLOv8热域微调（mAP@0.5=0.89）。主入口门缝区域计算温差ΔT≈12°C，按U=4.8W/m²·K、有效面积1.2m²估算瞬时热损失≈69W；风速场的光流向量与门缝方向一致，提示空气外泄。检测到非高峰时段活跃设备3个，估计待机功率合计≈310W，其中显示屏120W、自动售货机150W、服务器机架40W。',
    presentation: {
      type: 'image',
      data: [
        new URL('@/assets/1.png', import.meta.url).href,
        new URL('@/assets/2.png', import.meta.url).href,
        new URL('@/assets/3.png', import.meta.url).href,
        new URL('@/assets/4.png', import.meta.url).href,
        new URL('@/assets/5.png', import.meta.url).href
      ]
    }
  },
  {
    type: 'synthesis',
    agent: '协调器',
    thought: '综合所有智能体的发现。下午3点的峰值与高热读数相关。这是一个关键洞察。',
    details: '正在交叉引用设备日志和热数据。',
    deepDetails: '已构建跨模态知识图谱（Nodes: 设备/空间/事件/天气/占用；Edges: 因果/相关/时序邻接）。“下午3点能源峰值”与“主入口HVAC”“入口隔热不良”“外部高温”“人流量增加”节点形成密集团簇。关系权重：w(HVAC→峰值)=0.62，w(隔热→峰值)=0.21，w(占用→峰值)=0.11。以XGBoost对小时能耗做回归，SHAP 特征重要性前五：外温、HVAC状态、隔热评分、占用率、前1小时能耗；累积解释度79%。因果检验：Granger 对 HVAC→能耗 p=0.012；反事实模拟：若15:00前关闭门禁回风旁通并推迟HVAC预冷15分钟，峰值下降≈14%。'
  },
  {
    type: 'hypothesis',
    agent: '策略智能体',
    thought: '假设：主入口的暖通空调单元效率低下且调度不当，导致了严重的能源浪费。',
    details: '置信度分数：92%。建议行动：生成优化建议。',
    deepDetails: '提出两类干预：A) 设备层面——主入口HVAC优化（重设回风/新风比例、启用四象限阀门校准、将静压设定调整至≈250Pa）、修复门封并加装风幕机；B) 调度层面——将预冷时间从14:30推迟至14:50，引入占用感知与外温联动策略。贝叶斯模型综合证据后给出置信度92%，预期15:00峰值削减12%~18%，全天能耗下降6%~9%。风险评估：热舒适投诉概率<5%，对极端高温日需设置上限保护与回退策略。'
  },
  {
    type: 'conclusion',
    agent: '协调器',
    thought: '分析完成。正在生成最终报告和建议。',
    details: '效率得分：78.6%。潜在节省：21.4%。',
    deepDetails: '综合量化结果：基线日总能耗=4,120 kWh；实施方案后预测=3,650~3,870 kWh，节省≈250~470 kWh/天（6%~11%）。分项贡献：HVAC优化46%±8%，隔热修复32%±6%，待机负载治理18%±5%，调度策略4%±2%。KPI：舒适度PMV维持在[-0.5,0.5]；峰值削减≥12%；回本周期预计2.8~4.1个月。下一步：1) 一周AB测试并采集对照数据；2) 安装门封与风幕机并记录ΔT；3) 在BAS中联动占用与外温策略；4) 每日生成异常点追踪报告与节能看板。'
  }
]

const startThinkingProcess = async () => {
  thinkingProcessVisible.value = true
  currentThinkingStep.value = null

  for (const step of processSteps) {
    currentThinkingStep.value = step
    await sleep(1800) // Increased delay for better readability
  }

  thinkingProcessVisible.value = false
  currentThinkingStep.value = null
}

const getAgentStyle = (agent) => {
  const colors = {
    '协调器': { background: 'rgba(255, 0, 255, 0.2)', border: '#ff00ff' },
    '数据挖掘智能体': { background: 'rgba(0, 255, 255, 0.2)', border: '#00ffff' },
    '时序分析智能体': { background: 'rgba(0, 255, 0, 0.2)', border: '#00ff00' },
    '视觉识别智能体': { background: 'rgba(255, 255, 0, 0.2)', border: '#ffff00' },
    '策略智能体': { background: 'rgba(255, 165, 0, 0.2)', border: '#ffa500' }
  }
  return colors[agent] || { background: 'rgba(255, 255, 255, 0.1)', border: '#ccc' }
}

const getIconForType = (type) => {
  const icons = {
    system_init: '🚀',
    agent_dialogue: '💬',
    synthesis: '🔗',
    hypothesis: '💡',
    conclusion: '✅'
  }
  return icons[type] || '🤔'
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Carousel state for presentation images
const carouselIndex = ref(0)
const presentationImages = computed(() => {
  const step = currentThinkingStep.value
  if (!step || !step.presentation || step.presentation.type !== 'image') return []
  const data = step.presentation.data
  return Array.isArray(data) ? data : (data ? [data] : [])
})

const setSlide = (idx) => {
  const len = presentationImages.value.length
  if (!len) return
  carouselIndex.value = (idx % len + len) % len
}

const prevSlide = () => setSlide(carouselIndex.value - 1)
const nextSlide = () => setSlide(carouselIndex.value + 1)

watch(currentThinkingStep, () => {
  carouselIndex.value = 0
})

// Autoplay and loop
let autoplayTimer = null
const AUTOPLAY_INTERVAL = 3000

const shouldAutoplay = computed(() => thinkingProcessVisible.value && presentationImages.value.length > 1)

const startAutoplay = () => {
  stopAutoplay()
  if (!shouldAutoplay.value) return
  autoplayTimer = setInterval(() => {
    nextSlide()
  }, AUTOPLAY_INTERVAL)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

watch([shouldAutoplay, presentationImages], () => {
  // restart autoplay when visibility or images change
  startAutoplay()
}, { deep: false })

onUnmounted(() => {
  stopAutoplay()
})

defineExpose({
  startThinkingProcess
})

</script>

<template>
  <div v-if="thinkingProcessVisible" class="intelligent-thinking-process">
    <h3 class="title">🤖 AI 思考过程</h3>
    <div class="thinking-carousel-container">
      <transition name="fade-step" mode="out-in">
        <div v-if="currentThinkingStep" :key="currentThinkingStep.agent" class="thinking-step active">
          <!-- Top Section: Agent and Thought -->
          <div class="agent-info" :style="{ borderColor: getAgentStyle(currentThinkingStep.agent).border }">
            <span class="agent-icon">{{ getIconForType(currentThinkingStep.type) }}</span>
            <span class="agent-name">{{ currentThinkingStep.agent }}</span>
          </div>
          <div class="thought-bubble">
            <template v-if="!props.strict">
              <p class="thought-text"><strong>思考:</strong> {{ currentThinkingStep.thought }}</p>
              <p class="details-text"><em>详情: {{ currentThinkingStep.details }}</em></p>
            </template>
            <template v-else>
              <p class="thought-text"><strong>方法:</strong> 展示真实数据驱动的推理过程（占用、气象、能耗特征），不展示示例性数值。</p>
              <p class="details-text"><em>说明: 已开启严格模式，等待真实数据接入后展示具体指标。</em></p>
            </template>
          </div>

          <!-- Bottom Section: Deep Analysis and Rich Content -->
          <div class="deep-analysis-container">
            <div class="deep-analysis-text">
              <h5 class="deep-details-title">深度分析</h5>
              <template v-if="!props.strict">
                <p class="deep-details-text">{{ currentThinkingStep.deepDetails }}</p>
              </template>
              <template v-else>
                <p class="deep-details-text">严格模式启用：将依据实际数据进行气象归一化、占用修正、基线对比与不确定性评估。接入数据后展示详细过程与数值。</p>
              </template>
            </div>
            <div v-if="currentThinkingStep.presentation" class="presentation-content">
              <h5 class="presentation-title">补充材料</h5>
              <div v-if="currentThinkingStep.presentation.type === 'image'">
                <div class="carousel-container" :class="{ 'has-multiple': presentationImages.length > 1 }">
                  <img v-if="presentationImages.length" :src="presentationImages[carouselIndex]" alt="补充材料"
                    class="carousel-image" />
                  <button v-if="presentationImages.length > 1" class="carousel-btn prev" @click="prevSlide">‹</button>
                  <button v-if="presentationImages.length > 1" class="carousel-btn next" @click="nextSlide">›</button>

                </div>
              </div>
              <div v-else-if="currentThinkingStep.presentation.type === 'code'">
                <pre class="presentation-code"><code>{{ currentThinkingStep.presentation.data }}</code></pre>
              </div>
              <div v-else-if="currentThinkingStep.presentation.type === 'calculation'">
                <div class="presentation-calculation">
                  {{ currentThinkingStep.presentation.data }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.intelligent-thinking-process {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 100, 255, 0.3);
  color: #fff;
  margin-bottom: 20px;
}

.title {
  text-align: center;
  color: #00f5ff;
  margin-bottom: 15px;
  font-size: 18px;
  animation: pulse 2s infinite;
}

.thinking-carousel-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  padding: 10px 0;
}

.thinking-step {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.agent-info {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 12px;
  border-radius: 20px;
  border-left: 4px solid;
  margin-bottom: 10px;
}

.agent-icon {
  margin-right: 8px;
  font-size: 16px;
}

.agent-name {
  font-weight: bold;
  font-size: 14px;
}

.thought-bubble {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 15px;
  width: 90%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  margin-bottom: 15px;
}

.thought-text {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.6;
}

.details-text {
  margin: 0;
  font-size: 12px;
  color: #ccc;
  opacity: 0.8;
}

.deep-analysis-container {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  gap: 20px;
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 10px;
  align-items: flex-start;
  min-height: 80px;
}

.deep-analysis-text {
  flex: 1;
  min-width: 0;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
  overflow-wrap: break-word;
  padding-right: 15px;
}

.deep-details-title {
  color: #00f5ff;
  font-size: 15px;
  margin-bottom: 8px;
  font-weight: bold;
}

.deep-details-text {
  font-size: 12px;
  color: #d0d0d0;
  line-height: 1.4;
  margin: 0;
}

.presentation-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.presentation-title {
  color: #00f5ff;
  font-size: 15px;
  margin-bottom: 8px;
  font-weight: bold;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  height: 220px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 12px;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: fill;
  border-radius: 12px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.15);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 255, 0.4);
  color: #00ffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.6);
}

.carousel-btn.prev {
  left: 10px;
}

.carousel-btn.next {
  right: 10px;
}


.presentation-code {
  background: #010409;
  color: #c9d1d9;
  padding: 15px;
  border-radius: 8px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  font-size: 13px;
  white-space: pre-wrap;
  overflow: auto;
  max-height: 250px;
  /* Allow long code blocks to be scrollable */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE/Edge */
}

.presentation-code::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.presentation-calculation {
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(0, 255, 255, 0.4);
  padding: 16px;
  border-radius: 8px;
  color: #00ff80;
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  text-align: center;
  letter-spacing: 0.5px;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  max-width: 100%;
  line-height: 1.5;
}

/* Transition for fading steps */
.fade-step-enter-active,
.fade-step-leave-active {
  transition: opacity 0.8s ease;
}

.fade-step-enter-from,
.fade-step-leave-to {
  opacity: 0;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
    text-shadow: 0 0 5px #00f5ff;
  }

  50% {
    opacity: 0.7;
    text-shadow: 0 0 15px #00f5ff;
  }
}
</style>
