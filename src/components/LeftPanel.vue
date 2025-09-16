<script setup>
import { ref, onMounted } from 'vue'

const uploadZone = ref(null)
const videoInput = ref(null)
const videoPreview = ref(null)
const videoInfo = ref(null)
const selectBtn = ref(null)
const videoDetails = ref(null)

const currentVideo = ref(null)

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
  selectBtn.value.style.background = 'linear-gradient(45deg, #00ff00, #00aa00)'
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
    <h2 class="panel-title">🎥 视频数据源</h2>

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
      <h4 style="color: #00f5ff; margin-bottom: 10px;">📊 视频信息</h4>
      <div ref="videoDetails"></div>
    </div>

    <button class="select-btn" ref="selectBtn">选择此视频进行分析</button>
  </div>
</template>

<style scoped>
/* ========== 左侧视频上传区域 ========== */
.left-panel {
  background: rgba(15, 15, 30, 0.9);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(100, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  box-shadow: 0 12px 28px rgba(0, 100, 255, 0.15);
  position: relative;
  overflow: hidden;
  height: 100%;
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
  background: linear-gradient(45deg, #00f5ff, #0080ff, #8000ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  border-color: #00f5ff;
  background: rgba(0, 245, 255, 0.1);
  transform: scale(1.02);
}

.upload-zone.dragover {
  border-color: #8000ff;
  background: rgba(128, 0, 255, 0.2);
  transform: scale(1.05);
}

.upload-icon {
  font-size: 40px;
  color: #00f5ff;
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
  box-shadow: 0 8px 20px rgba(0, 245, 255, 0.28);
  position: relative;
  z-index: 10;
}

.video-info {
  background: rgba(0, 0, 0, 0.7);
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(100, 255, 255, 0.25);
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
  background: linear-gradient(45deg, #00f5ff, #0080ff);
  border: none;
  border-radius: 20px;
  color: #000;
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
  box-shadow: 0 5px 20px rgba(0, 245, 255, 0.5);
}
</style>
