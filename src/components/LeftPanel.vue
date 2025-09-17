<script setup>
import { ref, onMounted } from 'vue'

const uploadZone = ref(null)
const videoInput = ref(null)
const videoPreview = ref(null)
const videoInfo = ref(null)
const selectBtn = ref(null)
const videoDetails = ref(null)

const currentVideo = ref(null)
const monitorIcon = '🎥'
const monitorList = [
  { id: 1, name: '会议室A101', status: 'active' },
  { id: 2, name: '会议室B203', status: 'active' },
  { id: 3, name: '大会议室C1', status: 'active' },
  { id: 4, name: '小会议室D2', status: 'active' },
  { id: 5, name: '多媒体室E3', status: 'active' },
  { id: 6, name: '培训室F4', status: 'active' }
]
const monitors = ref(monitorList.map(item => ({ ...item, icon: monitorIcon })))
const selectedMonitors = ref([1, 2, 3, 4, 5, 6])

const toggleMonitor = (monitorId) => {
  const index = selectedMonitors.value.indexOf(monitorId)
  if (index > -1) {
    selectedMonitors.value.splice(index, 1)
  } else {
    selectedMonitors.value.push(monitorId)
  }
}

const handleDragOver = (e) => {
  e.preventDefault()
  uploadZone.value.classList.add('dragover')
}

const handleDragLeave = (e) => {
  e.preventDefault()
  uploadZone.value.classList.remove('dragover')
}

const handleDrop = (e) => {
  e.preventDefault()
  uploadZone.value.classList.remove('dragover')
  const files = e.dataTransfer.files
  if (files.length > 0 && files[0].type.startsWith('video/')) {
    loadVideo(files[0])
  }
}

const handleVideoSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    loadVideo(file)
  }
}

const loadVideo = (file) => {
  const url = URL.createObjectURL(file)
  videoPreview.value.src = url
  videoPreview.value.style.display = 'block'

  videoPreview.value.addEventListener('loadedmetadata', () => {
    const duration = formatTime(videoPreview.value.duration)
    const size = formatFileSize(file.size)

    videoDetails.value.innerHTML = `
      <p><strong>文件名:</strong> ${file.name}</p>
      <p><strong>分辨率:</strong> ${videoPreview.value.videoWidth}x${videoPreview.value.videoHeight}</p>
    `

    videoInfo.value.style.display = 'block'
    selectBtn.value.style.display = 'block'
  })
}

const selectVideo = () => {
  currentVideo.value = videoPreview.value.src
  selectBtn.value.textContent = '✅ 视频已选择'
  selectBtn.value.style.background = 'rgba(144, 192, 144, 0.8)'
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatFileSize = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

onMounted(() => {
  uploadZone.value.addEventListener('click', () => videoInput.value.click())
  uploadZone.value.addEventListener('dragover', handleDragOver)
  uploadZone.value.addEventListener('dragleave', handleDragLeave)
  uploadZone.value.addEventListener('drop', handleDrop)
  videoInput.value.addEventListener('change', handleVideoSelect)
  selectBtn.value.addEventListener('click', selectVideo)
})
</script>

<template>
  <div class="left-panel">
    <!-- 上半部分：导入视频 -->
    <div class="video-section">
      <h2 class="panel-title">🎥 导入视频</h2>

      <div class="upload-zone" ref="uploadZone">
        <div class="upload-icon">📁</div>
        <p>拖拽视频文件到此处</p>
        <p style="font-size: 12px; color: #888; margin-top: 5px;">
          支持 MP4, AVI, MOV 格式
        </p>
        <input type="file" ref="videoInput" accept="video/*" style="display: none;">
      </div>

      <video class="video-preview" ref="videoPreview" controls muted></video>

      <div class="video-info" ref="videoInfo">
        <h4 style="color: #a0c0e0; margin-bottom: 10px;">📊 视频信息</h4>
        <div ref="videoDetails"></div>
      </div>

      <button class="select-btn" ref="selectBtn">选择此视频进行分析</button>
    </div>

    <!-- 下半部分：选择会议室 -->
    <div class="monitor-section">
      <h2 class="panel-title">🏢 选择会议室</h2>

      <div class="monitor-grid">
        <div
          v-for="monitor in monitors"
          :key="monitor.id"
          class="monitor-item"
          :class="{ active: selectedMonitors.includes(monitor.id) }"
          @click="toggleMonitor(monitor.id)"
        >
          <div class="monitor-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 7l-7 5 7 5V7z"/>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              <circle cx="5.5" cy="9.5" r="1"/>
            </svg>
          </div>
          <div class="monitor-name">{{ monitor.name }}</div>
          <div class="monitor-status" :class="monitor.status"></div>
        </div>
      </div>

      <div class="selected-count">
        已选择 {{ selectedMonitors.length }} 个会议室
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== 左侧视频上传区域 ========== */
.left-panel {
  background: rgba(15, 15, 30, 0.9);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(120, 140, 160, 0.25);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 20px rgba(80, 100, 120, 0.15);
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.left-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(100, 255, 255, 0.1), transparent);
  animation: scanLine 3s infinite;
}

@keyframes scanLine {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

.panel-title {
  font-size: 18px;
  font-weight: bold;
  color: #a0c0e0;
  margin-bottom: 14px;
  text-align: center;
  position: relative;
  z-index: 10;
}

.upload-zone {
  border: 2px dashed rgba(100, 255, 255, 0.4);
  border-radius: 12px;
  padding: 20px 16px;
  text-align: center;
  margin-bottom: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  background: rgba(0, 50, 100, 0.1);
  z-index: 10;
}

.upload-zone:hover {
  border-color: #a0c0e0;
  background: rgba(160, 192, 224, 0.1);
  transform: scale(1.02);
}

.upload-zone.dragover {
  border-color: #b0a0d0;
  background: rgba(176, 160, 208, 0.2);
  transform: scale(1.05);
}

.upload-icon {
  font-size: 40px;
  color: #a0c0e0;
  margin-bottom: 10px;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

.upload-zone p {
  color: #fff;
  margin: 0;
}

.video-preview {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 12px;
  display: none;
  box-shadow: 0 4px 12px rgba(120, 140, 160, 0.2);
  position: relative;
  z-index: 10;
}

.video-info {
  background: rgba(0, 0, 0, 0.7);
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(120, 140, 160, 0.25);
  display: none;
  position: relative;
  z-index: 10;
  color: #fff;
}

.video-info p {
  margin: 5px 0;
  color: #ccc;
}

.select-btn {
  width: 100%;
  padding: 10px;
  background: rgba(120, 140, 160, 0.8);
  border: 1px solid rgba(160, 180, 200, 0.5);
  border-radius: 20px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.3s;
  display: none;
  position: relative;
  z-index: 10;
}

.select-btn:hover {
  transform: scale(1.05);
  background: rgba(140, 160, 180, 0.9);
  box-shadow: 0 3px 12px rgba(120, 140, 160, 0.3);
}

/* ========== 视频部分区域 ========== */
.video-section {
  flex: 0 0 auto;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(120, 140, 160, 0.2);
}

/* ========== 监控接入区域 ========== */
.monitor-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.monitor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  flex: 1;
  align-content: start;
}

.monitor-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 3px;
  background: rgba(40, 50, 70, 0.6);
  border: 1px solid rgba(80, 100, 120, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  aspect-ratio: 1;
  min-height: 0;
}

.monitor-item:hover {
  background: rgba(60, 80, 100, 0.8);
  border-color: rgba(120, 140, 160, 0.5);
  transform: translateY(-2px);
}

.monitor-item.active {
  background: rgba(80, 120, 100, 0.6);
  border-color: rgba(144, 192, 144, 0.6);
}

.monitor-icon {
  color: #a0c0e0;
  margin-bottom: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.monitor-icon svg {
  width: 24px;
  height: 24px;
}

.monitor-name {
  font-size: 12px;
  color: #ccc;
  text-align: center;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  padding: 0 2px;
}

.monitor-status {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #90c090;
}

.monitor-status.active {
  background: #90c090;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.selected-count {
  text-align: center;
  color: #a0c0e0;
  font-size: 12px;
  margin-top: 10px;
  padding: 6px;
  background: rgba(40, 50, 70, 0.5);
  border-radius: 6px;
}
</style>
