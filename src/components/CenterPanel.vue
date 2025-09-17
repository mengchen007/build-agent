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
const currentStatusMessage = ref('正在初始化会议室分析模型...')
const showFrameAnalysis = ref(false)
let carouselTimer = null

// 分析场景配置
const analysisScenarios = ref([
  {
    id: 'meeting-usage',
    name: '会议室使用频率分析',
    prompt: '分析会议室使用频率和预定建议？',
    description: '分析会议室的使用模式、频率和预定冲突，提供优化建议'
  },
  {
    id: 'occupancy-pattern',
    name: '人员流动模式分析',
    prompt: '分析人员进出和空间利用情况？',
    description: '识别人员流动规律、空间利用效率和高峰时段'
  },
  {
    id: 'booking-optimization',
    name: '预定系统优化分析',
    prompt: '优化会议室预定系统和资源配置？',
    description: '分析预定冲突、资源利用率，提供系统优化方案'
  },
  {
    id: 'efficiency-evaluation',
    name: '会议效率评估分析',
    prompt: '评估会议效率和时间管理情况？',
    description: '分析会议时长、参与度和效率指标，提供改进建议'
  }
])
const selectedScenario = ref('meeting-usage')

// 切换分析场景
const changeScenario = (scenarioId) => {
  selectedScenario.value = scenarioId
  const scenario = analysisScenarios.value.find(s => s.id === scenarioId)
  if (scenario) {
    searchInput.value.value = scenario.prompt
  }
}

// 获取当前场景配置
const getCurrentScenario = () => {
  return analysisScenarios.value.find(s => s.id === selectedScenario.value) || analysisScenarios.value[0]
}

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



const generateScenarioReport = (scenarioId) => {
  const reports = {
    'meeting-usage': generateMeetingUsageReport(),
    'occupancy-pattern': generateOccupancyPatternReport(),
    'booking-optimization': generateBookingOptimizationReport(),
    'efficiency-evaluation': generateEfficiencyEvaluationReport()
  }
  return reports[scenarioId] || reports['meeting-usage']
}

const generateMeetingUsageReport = () => {
  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 15px;">
      <div style="background: rgba(60,80,100,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(120,140,160,0.4);">
        <h4 style="color: #a0c0e0; font-size: 13px;">📈 使用率</h4>
        <div style="font-size: 22px; color: #90c090; font-weight: bold;">72.3%</div>
        <p style="font-size: 10px; color: #ccc;">较上周提升 +8.1%</p>
      </div>
      <div style="background: rgba(80,60,100,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(140,120,160,0.4);">
        <h4 style="color: #c0a0e0; font-size: 13px;">⏰ 平均会议时长</h4>
        <div style="font-size: 22px; color: #d0d090; font-weight: bold;">1.2h</div>
        <p style="font-size: 10px; color: #ccc;">建议时长: 1.0h</p>
      </div>
      <div style="background: rgba(60,100,80,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(120,160,140,0.4);">
        <h4 style="color: #a0e0c0; font-size: 13px;">👥 平均参会人数</h4>
        <div style="font-size: 22px; color: #90c090; font-weight: bold;">6人</div>
        <p style="font-size: 10px; color: #ccc;">容量利用率: 75%</p>
      </div>
      <div style="background: rgba(100,80,60,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(160,140,120,0.4);">
        <h4 style="color: #e0c0a0; font-size: 13px;">📅 预定成功率</h4>
        <div style="font-size: 22px; color: #d0d090; font-weight: bold;">89.4%</div>
        <p style="font-size: 10px; color: #ccc;">冲突率: 10.6%</p>
      </div>
    </div>

    <div style="background: rgba(55,65,75,0.4); padding: 16px; border-radius: 12px; border: 1px solid rgba(105,115,125,0.3);">
      <h4 style="color: #a8b8c8; font-size: 16px; margin-bottom: 12px;">🤖 智能预定建议</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 16px; color: #c0c8d0;">
        <div>
          <div style="color: #98b5c9; margin-bottom: 8px;">📋 最佳预定时段：</div>
          <div style="margin-bottom: 4px;">• 周一 09:00-10:30 (成功率98%)</div>
          <div style="margin-bottom: 4px;">• 周三 14:00-15:30 (成功率95%)</div>
          <div>• 周五 10:00-11:30 (成功率92%)</div>
        </div>
        <div>
          <div style="color: #a8a0c9; margin-bottom: 8px;">⚠️ 避免时段：</div>
          <div style="margin-bottom: 4px;">• 周二 14:00-16:00 (冲突率高)</div>
          <div style="margin-bottom: 4px;">• 周四 13:00-14:00 (使用密集)</div>
          <div>• 周五 16:00-17:00 (提前结束多)</div>
        </div>
      </div>
    </div>
  `
}

const generateOccupancyPatternReport = () => {
  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 15px;">
      <div style="background: rgba(60,80,100,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(120,140,160,0.4);">
        <h4 style="color: #a0c0e0; font-size: 13px;">👥 人员密度</h4>
        <div style="font-size: 22px; color: #90c090; font-weight: bold;">4.2人/㎡</div>
        <p style="font-size: 10px; color: #ccc;">峰值: 6.8人/㎡</p>
      </div>
      <div style="background: rgba(80,60,100,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(140,120,160,0.4);">
        <h4 style="color: #c0a0e0; font-size: 13px;">🚶 流动频率</h4>
        <div style="font-size: 22px; color: #d0d090; font-weight: bold;">24次/天</div>
        <p style="font-size: 10px; color: #ccc;">高峰: 上午10-11点</p>
      </div>
      <div style="background: rgba(60,100,80,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(120,160,140,0.4);">
        <h4 style="color: #a0e0c0; font-size: 13px;">📊 空间利用</h4>
        <div style="font-size: 22px; color: #90c090; font-weight: bold;">68%</div>
        <p style="font-size: 10px; color: #ccc;">最优区域: 靠窗位置</p>
      </div>
      <div style="background: rgba(100,80,60,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(160,140,120,0.4);">
        <h4 style="color: #e0c0a0; font-size: 13px;">⏱️ 停留时长</h4>
        <div style="font-size: 22px; color: #d0d090; font-weight: bold;">1.8h</div>
        <p style="font-size: 10px; color: #ccc;">中位数: 1.5h</p>
      </div>
    </div>

    <div style="background: rgba(55,65,75,0.4); padding: 16px; border-radius: 12px; border: 1px solid rgba(105,115,125,0.3);">
      <h4 style="color: #a8b8c8; font-size: 16px; margin-bottom: 12px;">🎯 人员流动优化建议</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 16px; color: #c0c8d0;">
        <div>
          <div style="color: #98b5c9; margin-bottom: 8px;">📈 高效流动模式：</div>
          <div style="margin-bottom: 4px;">• 进出口分离设计 (减少拥堵35%)</div>
          <div style="margin-bottom: 4px;">• 座位预分配系统 (提升效率28%)</div>
          <div>• 智能引导标识 (缩短寻找时间40%)</div>
        </div>
        <div>
          <div style="color: #a8a0c9; margin-bottom: 8px;">⚠️ 拥堵预警：</div>
          <div style="margin-bottom: 4px;">• 周二14:00-15:00 入口拥堵</div>
          <div style="margin-bottom: 4px;">• 会议结束高峰期疏散慢</div>
          <div>• 靠门位置利用率过高</div>
        </div>
      </div>
    </div>
  `
}

const generateBookingOptimizationReport = () => {
  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 15px;">
      <div style="background: rgba(60,80,100,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(120,140,160,0.4);">
        <h4 style="color: #a0c0e0; font-size: 13px;">📋 预定冲突率</h4>
        <div style="font-size: 22px; color: #ff9090; font-weight: bold;">12.3%</div>
        <p style="font-size: 10px; color: #ccc;">较上月下降 -5.2%</p>
      </div>
      <div style="background: rgba(80,60,100,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(140,120,160,0.4);">
        <h4 style="color: #c0a0e0; font-size: 13px;">⚡ 系统响应时间</h4>
        <div style="font-size: 22px; color: #90c090; font-weight: bold;">0.8s</div>
        <p style="font-size: 10px; color: #ccc;">目标: <1.0s</p>
      </div>
      <div style="background: rgba(60,100,80,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(120,160,140,0.4);">
        <h4 style="color: #a0e0c0; font-size: 13px;">📱 移动端使用率</h4>
        <div style="font-size: 22px; color: #90c090; font-weight: bold;">76%</div>
        <p style="font-size: 10px; color: #ccc;">PC端: 24%</p>
      </div>
      <div style="background: rgba(100,80,60,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(160,140,120,0.4);">
        <h4 style="color: #e0c0a0; font-size: 13px;">🔄 取消率</h4>
        <div style="font-size: 22px; color: #d0d090; font-weight: bold;">8.9%</div>
        <p style="font-size: 10px; color: #ccc;">主要原因: 临时变更</p>
      </div>
    </div>

    <div style="background: rgba(55,65,75,0.4); padding: 16px; border-radius: 12px; border: 1px solid rgba(105,115,125,0.3);">
      <h4 style="color: #a8b8c8; font-size: 16px; margin-bottom: 12px;">🛠️ 系统优化建议</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 16px; color: #c0c8d0;">
        <div>
          <div style="color: #98b5c9; margin-bottom: 8px;">🚀 功能增强：</div>
          <div style="margin-bottom: 4px;">• 智能推荐空闲会议室</div>
          <div style="margin-bottom: 4px;">• 自动分配最佳时段</div>
          <div>• 冲突预警和替代方案</div>
        </div>
        <div>
          <div style="color: #a8a0c9; margin-bottom: 8px;">⚙️ 技术优化：</div>
          <div style="margin-bottom: 4px;">• 缓存机制优化响应速度</div>
          <div style="margin-bottom: 4px;">• 并发预定锁机制</div>
          <div>• 负载均衡提升稳定性</div>
        </div>
      </div>
    </div>
  `
}

const generateEfficiencyEvaluationReport = () => {
  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin-bottom: 15px;">
      <div style="background: rgba(60,80,100,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(120,140,160,0.4);">
        <h4 style="color: #a0c0e0; font-size: 13px;">📊 会议效率指数</h4>
        <div style="font-size: 22px; color: #90c090; font-weight: bold;">7.3/10</div>
        <p style="font-size: 10px; color: #ccc;">较上季度 +0.8</p>
      </div>
      <div style="background: rgba(80,60,100,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(140,120,160,0.4);">
        <h4 style="color: #c0a0e0; font-size: 13px;">⏰ 准时开始率</h4>
        <div style="font-size: 22px; color: #d0d090; font-weight: bold;">82%</div>
        <p style="font-size: 10px; color: #ccc;">平均延迟: 4分钟</p>
      </div>
      <div style="background: rgba(60,100,80,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(120,160,140,0.4);">
        <h4 style="color: #a0e0c0; font-size: 13px;">👥 参与度</h4>
        <div style="font-size: 22px; color: #90c090; font-weight: bold;">68%</div>
        <p style="font-size: 10px; color: #ccc;">活跃讨论比例</p>
      </div>
      <div style="background: rgba(100,80,60,0.5); padding: 12px; border-radius: 10px; border: 1px solid rgba(160,140,120,0.4);">
        <h4 style="color: #e0c0a0; font-size: 13px;">📋 议程完成度</h4>
        <div style="font-size: 22px; color: #d0d090; font-weight: bold;">75%</div>
        <p style="font-size: 10px; color: #ccc;">平均超时: 15分钟</p>
      </div>
    </div>

    <div style="background: rgba(55,65,75,0.4); padding: 16px; border-radius: 12px; border: 1px solid rgba(105,115,125,0.3);">
      <h4 style="color: #a8b8c8; font-size: 16px; margin-bottom: 12px;">📈 效率提升建议</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 16px; color: #c0c8d0;">
        <div>
          <div style="color: #98b5c9; margin-bottom: 8px;">🎯 会议优化：</div>
          <div style="margin-bottom: 4px;">• 会前准备时间预留5分钟</div>
          <div style="margin-bottom: 4px;">• 设置议程时间提醒</div>
          <div>• 引入会议效率评分机制</div>
        </div>
        <div>
          <div style="color: #a8a0c9; margin-bottom: 8px;">🔧 工具支持：</div>
          <div style="margin-bottom: 4px;">• 智能日程冲突检测</div>
          <div style="margin-bottom: 4px;">• 会议记录AI总结</div>
          <div>• 参与度实时监控</div>
        </div>
      </div>
    </div>
  `
}

const showResults = () => {
  resultDisplay.value.style.display = 'block'
  const currentScenario = getCurrentScenario()

  // 根据不同场景生成不同报告
  const reportContent = generateScenarioReport(currentScenario.id)

  resultDisplay.value.innerHTML = `
    <h3 style="color: #b0b0d0; margin-bottom: 12px; font-size: 18px;">📊 ${currentScenario.name}报告</h3>
    ${reportContent}
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
    { message: '正在加载监控视频数据...', progress: 5 },
    { message: '初始化会议室分析AI模型...', progress: 10 },
    { message: '提取关键帧进行人员识别...', progress: 15 },
    { message: '执行人数统计和行为分析...', progress: 25 },
    { message: '会议室使用模式识别...', progress: 35 },
    { message: '使用频率时序数据分析...', progress: 45 },
    { message: '人员流动和空间利用分析...', progress: 55 },
    { message: '会议时长和冲突检测...', progress: 65 },
    { message: '使用效率指标计算...', progress: 75 },
    { message: '智能预定建议生成...', progress: 85 },
    { message: '会议室优化报告生成...', progress: 95 },
    { message: '✅ 会议室分析完成！', progress: 100 }
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
    { time: '09:00', occupancy: 85, frame: imageUrls[0] },
    { time: '15:00', occupancy: 72, frame: imageUrls[1] },
    { time: '21:00', occupancy: 45, frame: imageUrls[2] },
    { time: '12:00', occupancy: 68, frame: imageUrls[3] },
    { time: '18:00', occupancy: 30, frame: imageUrls[4] }
  ]
}

const displayFrameAnalysis = (frameIndex) => {
  if (frameIndex >= analysisFrames.value.length) return

  const frame = analysisFrames.value[frameIndex]
  const analysisDetails = getDetailedAnalysisInfo(frameIndex, frame)

  // 更新提取信息显示
  if (extractionInfo.value) {
    extractionInfo.value.innerHTML = `
      <h4 style="color: #00f5ff; margin-bottom: 10px; font-size: 15px;">🔍 ${analysisDetails.title}</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 15px;">
        <div>📈 使用率: <span style="color: #00ff00">${frame.occupancy}%</span></div>
        <div>👥 人数统计: <span style="color: #ffff00">${analysisDetails.peopleCount}</span></div>
        <div>⏰ 会议时长: <span style="color: #00ffff">${analysisDetails.duration}</span></div>
        <div>📊 空间利用: <span style="color: #ff00ff">${analysisDetails.spaceUtil}</span></div>
        <div>🎯 会议类型: <span style="color: #ffa500">${analysisDetails.meetingType}</span></div>
        <div>📅 预定状态: <span style="color: #00ff80">${analysisDetails.bookingStatus}</span></div>
      </div>
      <div style="margin-top: 10px; padding: 8px; background: rgba(0,255,255,0.1); border-radius: 5px;">
        <div style="font-size: 15px; color: #00ffff;">🔮 AI分析维度: ${analysisDetails.dimension}</div>
        <div style="font-size: 15px; color: #ff00ff;">📈 置信度: ${analysisDetails.confidence}% | 处理: ${analysisDetails.processing}</div>
      </div>
    `
  }
}

const getDetailedAnalysisInfo = (frameIndex, frame) => {
  const analysisTemplates = [
    {
      title: '周一上午高峰时段分析 (09:00)',
      peopleCount: '6-8人',
      duration: '1.5小时',
      spaceUtil: '85%',
      meetingType: '团队晨会',
      bookingStatus: '已预定',
      dimension: '人员识别 + 行为分析',
      confidence: (88 + Math.random() * 8).toFixed(1),
      processing: '人脸识别AI'
    },
    {
      title: '周二下午会议分析 (15:00)',
      peopleCount: '4-6人',
      duration: '2.0小时',
      spaceUtil: '72%',
      meetingType: '项目讨论',
      bookingStatus: '已预定',
      dimension: '空间利用 + 时长预测',
      confidence: (85 + Math.random() * 10).toFixed(1),
      processing: '行为分析模型'
    },
    {
      title: '周三晚间使用分析 (21:00)',
      peopleCount: '2-3人',
      duration: '0.8小时',
      spaceUtil: '45%',
      meetingType: '临时讨论',
      bookingStatus: '临时使用',
      dimension: '异常检测 + 使用模式',
      confidence: (92 + Math.random() * 6).toFixed(1),
      processing: '时序分析网络'
    },
    {
      title: '周四中午低效分析 (12:00)',
      peopleCount: '3-4人',
      duration: '0.5小时',
      spaceUtil: '68%',
      meetingType: '简短汇报',
      bookingStatus: '冲突预定',
      dimension: '冲突检测 + 优化建议',
      confidence: (79 + Math.random() * 12).toFixed(1),
      processing: '冲突分析算法'
    },
    {
      title: '周五下午闲置分析 (18:00)',
      peopleCount: '0人',
      duration: '0小时',
      spaceUtil: '30%',
      meetingType: '空置状态',
      bookingStatus: '可预定',
      dimension: '空置检测 + 预定建议',
      confidence: (86 + Math.random() * 9).toFixed(1),
      processing: '空置优化模型'
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
    event.target.src = createMeetingRoomFrame(frame.occupancy, `分析帧 ${currentFrameIndex.value + 1}`)
  }
}

const createMeetingRoomFrame = (occupancy, timeLabel) => {
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

  // 绘制会议室使用率可视化
  ctx.strokeStyle = '#00ffff'
  ctx.lineWidth = 3
  ctx.beginPath()

  // 绘制使用率曲线
  for (let i = 0; i < 24; i++) {
    const x = 50 + (i * 30)
    const baseY = 400
    const variation = Math.sin(i * 0.3) * 40 + (occupancy / 100) * 80
    const y = baseY - variation

    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()

  // 标题
  ctx.fillStyle = '#00ffff'
  ctx.font = 'bold 24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText(`会议室使用分析 - ${timeLabel}`, 400, 50)

  // 使用率值
  ctx.fillStyle = occupancy > 70 ? '#00ff00' : occupancy > 40 ? '#ffff00' : '#ff6600'
  ctx.font = 'bold 48px Arial'
  ctx.fillText(`${occupancy}%`, 400, 150)

  // 详细信息
  ctx.fillStyle = '#ffffff'
  ctx.font = '16px Arial'
  ctx.textAlign = 'left'
  ctx.fillText(`时间段: ${timeLabel}`, 50, 500)
  ctx.fillText(`预估人数: ${Math.ceil(occupancy / 12)} 人`, 50, 530)
  ctx.fillText(`空间利用: ${occupancy > 50 ? '高' : '低'}`, 50, 560)

  return canvas.toDataURL()
}

onMounted(() => {
  generateAnalysisFrames()
  analyzeBtn.value.addEventListener('click', startAnalysis)
})
</script>

<template>
  <div class="center-panel">
    <div class="scenario-selector">
      <label class="scenario-label">分析场景：</label>
      <select
        v-model="selectedScenario"
        @change="changeScenario(selectedScenario)"
        class="scenario-select"
      >
        <option
          v-for="scenario in analysisScenarios"
          :key="scenario.id"
          :value="scenario.id"
        >
          {{ scenario.name }}
        </option>
      </select>
    </div>

    <div class="search-container">
      <div class="search-box">
        <input type="text" class="search-input" ref="searchInput" placeholder="分析会议室使用频率和预定建议？" value="分析会议室使用频率和预定建议">
        <button class="analyze-btn" ref="analyzeBtn">开始分析</button>
      </div>
      <div class="scenario-description">
        {{ getCurrentScenario().description }}
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
        <h3 style="color: #ff00ff; margin-bottom: 20px;">📊 会议室使用分析报告</h3>
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

.scenario-selector {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
  position: relative;
}

.scenario-label {
  color: #a0c0e0;
  font-size: 14px;
  font-weight: bold;
  min-width: 80px;
}

.scenario-select {
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: 1px solid rgba(120, 140, 160, 0.4);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  max-width: 300px;
}

.scenario-select:hover {
  border-color: rgba(160, 192, 224, 0.6);
  background: rgba(0, 0, 0, 0.8);
}

.scenario-select option {
  background: rgba(20, 25, 35, 0.95);
  color: #fff;
  padding: 8px;
}

.search-container {
  position: relative;
  margin-bottom: 20px;
  z-index: 10;
}

.scenario-description {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  border-left: 3px solid rgba(160, 192, 224, 0.5);
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
