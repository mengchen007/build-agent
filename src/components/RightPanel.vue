<script setup>
import { ref, onMounted } from 'vue'

const campus3D = ref(null)

const create3DCampus = () => {
  const campus3DElement = campus3D.value
  console.log('Creating campus 3D scene...')

  // 创建主建筑物
  const mainBuilding = document.createElement('div')
  mainBuilding.className = 'main-building'

  // 创建6层建筑
  for (let floor = 1;floor <= 6;floor++) {
    const floorDiv = document.createElement('div')
    floorDiv.className = 'floor'

    // 创建立方体的六个面
    const faces = ['top', 'bottom', 'front', 'back', 'left', 'right']
    faces.forEach(face => {
      const faceDiv = document.createElement('div')
      faceDiv.className = `floor-face floor-${face}`
      floorDiv.appendChild(faceDiv)
    })

    // 为前面、后面、左侧、右侧四个面添加窗户
    const facesWithWindows = {
      'front': 'windows',
      'back': 'windows-back',
      'left': 'windows-side',
      'right': 'windows-side'
    };

    for (const [faceName, windowClass] of Object.entries(facesWithWindows)) {
      const face = floorDiv.querySelector(`.floor-${faceName}`);
      const windows = document.createElement('div');
      windows.className = windowClass;

      const windowCount = (faceName === 'front' || faceName === 'back') ? 20 : 16;

      for (let i = 0;i < windowCount;i++) {
        const window = document.createElement('div');
        window.className = 'window';
        if (Math.random() < 0.2) {
          window.classList.add('off');
        } else {
          window.style.animationDelay = Math.random() * 2 + 's';
        }
        windows.appendChild(window);
      }
      face.appendChild(windows);
    }

    // 在特定楼层添加摄像头
    const cameraFloors = [2, 4, 6];
    if (cameraFloors.includes(floor)) {
      Object.keys(facesWithWindows).forEach((faceName, faceIndex) => {
        const face = floorDiv.querySelector(`.floor-${faceName}`);
        const camera = document.createElement('div');
        camera.className = `camera camera-${faceIndex + 1}`;
        camera.style.animationDelay = `${faceIndex * 0.5}s`;
        face.appendChild(camera);
      });
    }

    // 添加楼层标签
    const floorLabel = document.createElement('div');
    floorLabel.className = 'floor-label';
    floorLabel.textContent = `F${7 - floor}`;
    floorDiv.appendChild(floorLabel);

    mainBuilding.appendChild(floorDiv)
  }

  campus3DElement.appendChild(mainBuilding)
  console.log('Campus 3D scene created successfully!')
}

const startNodeStatusAnimation = () => {
  setInterval(() => {
    const progressBars = document.querySelectorAll('.progress-fill-node')
    progressBars.forEach(bar => {
      if (!bar.classList.contains('warning')) {
        const currentWidth = parseInt(bar.style.width)
        const variation = Math.random() * 4 - 2
        const newWidth = Math.max(85, Math.min(99, currentWidth + variation))
        bar.style.width = newWidth + '%'
      }
    })
  }, 3000)
}

onMounted(() => {
  create3DCampus()
  startNodeStatusAnimation()
})
</script>

<template>
  <div class="right-panel">
    <h2 class="panel-title">🧠 AI神经网络监控</h2>

    <!-- 三维园区监控 -->
    <div class="building-3d-container">
      <div class="section-title" style="margin-bottom: 15px; font-size: 14px;">🏢 智慧园区3D监控</div>
      <div class="campus-3d" ref="campus3D">
        <!-- 园区地面 -->
        <div class="campus-ground"></div>

        <!-- 园区道路 -->
        <!-- <div class="campus-road"></div> -->
        <!-- <div class="campus-road vertical"></div> -->

        <!-- 园区装饰点 -->
        <div class="campus-decoration decoration-1"></div>
        <div class="campus-decoration decoration-2"></div>
        <div class="campus-decoration decoration-3"></div>
        <div class="campus-decoration decoration-4"></div>
      </div>
      <div class="scan-line"></div>
      <div class="building-info">
        <div>📹 摄像头: 12个在线</div>
        <div>🔍 监控覆盖: 100%</div>
        <div>🌿 园区环境: 优良</div>
        <div>🏢 建筑状态: 正常</div>
      </div>
    </div>

    <!-- 神经节点状态 -->
    <div class="neural-nodes-section">
      <div class="section-title">⚡ 神经节点状态</div>

      <div class="node-status-card">
        <div class="node-header">
          <div class="node-indicator active"></div>
          <div class="node-name">1F-大厅区域</div>
          <div class="node-status-badge active">活跃</div>
        </div>
        <div class="node-details">
          <div class="detail-row">
            <span>节点数量:</span>
            <span class="detail-value">4</span>
            <span>信号强度:</span>
            <span class="detail-value strong">97%</span>
          </div>
          <div class="detail-row">
            <span>最后同步:</span>
            <span class="detail-value">0.8s前</span>
            <span>负载:</span>
            <span class="detail-value">28%</span>
          </div>
          <div class="progress-bar-node">
            <div class="progress-fill-node" style="width: 97%;"></div>
          </div>
        </div>
      </div>

      <div class="node-status-card">
        <div class="node-header">
          <div class="node-indicator active"></div>
          <div class="node-name">2F-办公区域</div>
          <div class="node-status-badge active">活跃</div>
        </div>
        <div class="node-details">
          <div class="detail-row">
            <span>节点数量:</span>
            <span class="detail-value">2</span>
            <span>信号强度:</span>
            <span class="detail-value strong">95%</span>
          </div>
          <div class="detail-row">
            <span>最后同步:</span>
            <span class="detail-value">1.2s前</span>
            <span>负载:</span>
            <span class="detail-value">42%</span>
          </div>
          <div class="progress-bar-node">
            <div class="progress-fill-node" style="width: 95%;"></div>
          </div>
        </div>
      </div>

      <div class="node-status-card">
        <div class="node-header">
          <div class="node-indicator active"></div>
          <div class="node-name">停车场A区</div>
          <div class="node-status-badge active">活跃</div>
        </div>
        <div class="node-details">
          <div class="detail-row">
            <span>节点数量:</span>
            <span class="detail-value">3</span>
            <span>信号强度:</span>
            <span class="detail-value strong">99%</span>
          </div>
          <div class="detail-row">
            <span>最后同步:</span>
            <span class="detail-value">0.5s前</span>
            <span>负载:</span>
            <span class="detail-value">18%</span>
          </div>
          <div class="progress-bar-node">
            <div class="progress-fill-node" style="width: 99%;"></div>
          </div>
        </div>
      </div>

      <div class="node-status-card">
        <div class="node-header">
          <div class="node-indicator warning"></div>
          <div class="node-name">停车场B区</div>
          <div class="node-status-badge active">活跃</div>
        </div>
        <div class="node-details">
          <div class="detail-row">
            <span>节点数量:</span>
            <span class="detail-value">6</span>
            <span>信号强度:</span>
            <span class="detail-value warning">89%</span>
          </div>
          <div class="detail-row">
            <span>最后同步:</span>
            <span class="detail-value">2.1s前</span>
            <span>负载:</span>
            <span class="detail-value">56%</span>
          </div>
          <div class="progress-bar-node">
            <div class="progress-fill-node warning" style="width: 89%;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* 右侧效果和指标区域 */
.right-panel {
  background: rgba(15, 15, 35, 0.95);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(0, 255, 255, 0.25);
  backdrop-filter: blur(25px);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

.right-panel::-webkit-scrollbar {
  width: 6px;
}

.right-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.right-panel::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, #00ffff, #0080ff);
  border-radius: 3px;
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
}

.section-title {
  font-size: 16px;
  color: #00ffff;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
  background: linear-gradient(45deg, #00ffff, #0080ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 三维园区可视化 */
.building-3d-container {
  background: linear-gradient(135deg, rgba(0, 20, 40, 0.9), rgba(0, 40, 20, 0.9));
  border-radius: 12px;
  padding: 14px;
  border: 1px solid rgba(0, 255, 255, 0.35);
  margin-bottom: 12px;
  perspective: 1200px;
  height: 380px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

.campus-3d {
  position: absolute;
  left: 50%;
  top: 27%;
  transform: translate(-50%, -50%) rotateX(20deg) rotateY(0deg) rotateZ(0deg);
  transform-style: preserve-3d;
  animation: campusRotate 25s infinite linear;
}

@keyframes campusRotate {
  0% {
    transform: translate(-50%, -50%) rotateX(20deg) rotateY(0deg) rotateZ(0deg);
  }

  25% {
    transform: translate(-50%, -50%) rotateX(20deg) rotateY(90deg) rotateZ(0deg);
  }

  50% {
    transform: translate(-50%, -50%) rotateX(20deg) rotateY(180deg) rotateZ(0deg);
  }

  75% {
    transform: translate(-50%, -50%) rotateX(20deg) rotateY(270deg) rotateZ(0deg);
  }

  100% {
    transform: translate(-50%, -50%) rotateX(20deg) rotateY(360deg) rotateZ(0deg);
  }
}

.main-building {
  position: absolute;
  transform: translateZ(0) translateX(0px) translateY(0px);
  transform-style: preserve-3d;
}

.floor {
  position: absolute;
  width: 120px;
  height: 120px;
  transform-style: preserve-3d;
}

.floor:nth-child(1) {
  transform: translateY(0px);
}

.floor:nth-child(2) {
  transform: translateY(30px);
}

.floor:nth-child(3) {
  transform: translateY(60px);
}

.floor:nth-child(4) {
  transform: translateY(90px);
}

.floor:nth-child(5) {
  transform: translateY(120px);
}

.floor:nth-child(6) {
  transform: translateY(150px);
}

/* 园区地面 */
.campus-ground {
  position: absolute;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle at center, rgba(0, 255, 128, 1) 0%, rgba(0, 200, 100, 0.9) 100%);
  border-radius: 15px;
  transform: translateY(150px) rotateX(90deg) translateZ(-125px);
  border: 5px solid #00ff80;
  box-shadow: 0 0 40px #00ff80, inset 0 0 25px rgba(0, 255, 128, 0.7), 0 0 70px rgba(0, 255, 128, 0.8);
  animation: groundPulse 3s ease-in-out infinite;
  z-index: 1;
  opacity: 1;
}

@keyframes groundPulse {

  0%,
  100% {
    transform: translateY(150px) rotateX(90deg) translateZ(-125px) scale(1);
    box-shadow: 0 0 40px #00ff80, inset 0 0 25px rgba(0, 255, 128, 0.7), 0 0 70px rgba(0, 255, 128, 0.8);
  }

  50% {
    transform: translateY(150px) rotateX(90deg) translateZ(-125px) scale(1.1);
    box-shadow: 0 0 60px #00ff80, inset 0 0 35px rgba(0, 255, 128, 0.9), 0 0 100px rgba(0, 255, 128, 1);
  }
}

/* 园区道路 */
.campus-road {
  position: absolute;
  width: 180px;
  height: 8px;
  background: linear-gradient(90deg, rgba(200, 200, 200, 0.8) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(200, 200, 200, 0.8) 100%);
  border-radius: 4px;
  transform: translateY(138px) rotateX(90deg) translateZ(-50px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
  z-index: 2;
}

/* .campus-road.vertical {
  width: 8px;
  height: 180px;
  transform: translateY(138px) rotateX(90deg) translateZ(-50px) rotateZ(90deg);
} */

/* 园区装饰点 */
.campus-decoration {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(0, 255, 255, 0.9);
  border-radius: 50%;
  animation: decorationBlink 2s infinite;
  z-index: 3;
}

.decoration-1 {
  transform: translateY(136px) rotateX(90deg) translateZ(-30px) translateX(-60px);
  animation-delay: 0s;
}

.decoration-2 {
  transform: translateY(136px) rotateX(90deg) translateZ(-30px) translateX(60px);
  animation-delay: 0.5s;
}

.decoration-3 {
  transform: translateY(136px) rotateX(90deg) translateZ(-70px) translateX(0px);
  animation-delay: 1s;
}

.decoration-4 {
  transform: translateY(136px) rotateX(90deg) translateZ(-30px) translateX(0px);
  animation-delay: 1.5s;
}

@keyframes decorationBlink {

  0%,
  100% {
    opacity: 1;
    box-shadow: 0 0 5px rgba(0, 255, 255, 0.6);
  }

  50% {
    opacity: 0.4;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.9);
  }
}

/* 立方体的六个面 */
.floor-face {
  position: absolute;
  width: 120px;
  height: 35px;
}

.floor-top {
  background: linear-gradient(135deg, rgba(0, 200, 255, 0.9), rgba(0, 150, 255, 0.7));
  border: 1px solid rgba(0, 255, 255, 0.8);
  transform: rotateX(90deg) translateZ(17.5px);
}

.floor-bottom {
  background: linear-gradient(135deg, rgba(0, 80, 160, 0.8), rgba(0, 100, 180, 0.6));
  border: 1px solid rgba(0, 180, 255, 0.6);
  transform: rotateX(-90deg) translateZ(17.5px);
}

.floor-front {
  background: linear-gradient(180deg, rgba(0, 150, 255, 0.9), rgba(0, 100, 200, 0.7));
  border: 2px solid rgba(0, 255, 255, 0.8);
  transform: translateZ(60px);
}

.floor-back {
  background: linear-gradient(180deg, rgba(0, 120, 220, 0.8), rgba(0, 80, 160, 0.6));
  border: 1px solid rgba(0, 200, 255, 0.6);
  transform: translateZ(-60px) rotateY(180deg);
}

.floor-left {
  width: 120px;
  height: 35px;
  background: linear-gradient(90deg, rgba(0, 100, 200, 0.7), rgba(0, 130, 230, 0.5));
  border: 1px solid rgba(0, 220, 255, 0.5);
  transform: rotateY(-90deg) translateZ(60px);
}

.floor-right {
  width: 120px;
  height: 35px;
  background: linear-gradient(90deg, rgba(0, 130, 230, 0.7), rgba(0, 100, 200, 0.5));
  border: 1px solid rgba(0, 220, 255, 0.5);
  transform: rotateY(90deg) translateZ(60px);
}

.windows {
  position: absolute;
  top: 4px;
  left: 8px;
  right: 8px;
  bottom: 4px;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
}


.windows-back {
  position: absolute;
  top: 4px;
  left: 8px;
  right: 8px;
  bottom: 4px;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
}

.floor-label {
  position: absolute;
  right: -25px;
  top: 20%;
  transform: translateY(-50%);
  font-size: 8px;
  color: #00ff80;
  background: rgba(0, 0, 0, 0.8);
  padding: 2px 4px;
  border-radius: 3px;
  border: 1px solid rgba(0, 255, 128, 0.5);
}

.windows-side {
  position: absolute;
  top: 4px;
  left: 8px;
  right: 8px;
  bottom: 4px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px;
}

.window {
  background: rgba(255, 255, 0, 0.6);
  border-radius: 2px;
  animation: windowBlink 2s infinite ease-in-out;
}

.window.off {
  background: rgba(50, 50, 50, 0.8);
  animation: none;
}

@keyframes windowBlink {

  0%,
  70% {
    opacity: 1;
  }

  71%,
  100% {
    opacity: 0.3;
  }
}

.camera {
  position: absolute;
  width: 8px;
  height: 6px;
  background: linear-gradient(45deg, #ff0080, #8000ff);
  border-radius: 50% 50% 20% 20%;
  box-shadow: 0 0 6px rgba(255, 0, 128, 0.8);
  animation: cameraRotate 4s infinite ease-in-out;
  z-index: 10;
}

.camera::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 2px;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #00ffff, #0080ff);
  border-radius: 50%;
  animation: cameraLens 2s infinite;
}

@keyframes cameraRotate {

  0%,
  100% {
    transform: rotateZ(-5deg);
  }

  50% {
    transform: rotateZ(5deg);
  }
}

@keyframes cameraLens {

  0%,
  100% {
    box-shadow: 0 0 3px #00ffff;
  }

  50% {
    box-shadow: 0 0 8px #00ffff, 0 0 12px #0080ff;
  }
}

.camera-1 {
  top: 3px;
  right: 10px;
  transform: translateZ(1px);
}

.camera-2 {
  top: 3px;
  left: 10px;
  animation-delay: 0.5s;
  transform: translateZ(1px);
}

.camera-3 {
  bottom: 3px;
  left: 50%;
  transform: translateX(-50%) translateZ(1px);
  animation-delay: 1s;
}

.camera-4 {
  bottom: 3px;
  right: 10px;
  transform: translateZ(1px);
  animation-delay: 1.5s;
}

.building-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  font-size: 10px;
  color: #00ffff;
  background: rgba(0, 0, 0, 0.8);
  padding: 5px 8px;
  border-radius: 5px;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.building-info div {
  margin-bottom: 2px;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: scanBuilding 6s infinite linear;
}

@keyframes scanBuilding {
  0% {
    top: 0%;
    opacity: 1;
  }

  100% {
    top: 100%;
    opacity: 0;
  }
}

/* 神经节点状态样式 */
.neural-nodes-section {
  margin-bottom: 12px;
}

.node-status-card {
  background: rgba(15, 30, 45, 0.9);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 255, 255, 0.25);
  transition: all 0.3s ease;
}

.node-status-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 255, 255, 0.2);
}

.node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.node-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 12px;
  animation: nodePulse 2s infinite;
}

.node-indicator.active {
  background: #00ffff;
  box-shadow: 0 0 10px #00ffff;
}

.node-indicator.warning {
  background: #ffaa00;
  box-shadow: 0 0 10px #ffaa00;
}

@keyframes nodePulse {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.node-name {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.node-status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.node-status-badge.active {
  background: rgba(0, 255, 255, 0.2);
  color: #00ffff;
  border: 1px solid #00ffff;
}

.node-details {
  margin-top: 15px;
}

.detail-row {
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #cccccc;
}

.detail-value {
  font-weight: 600;
  text-align: right;
}

.detail-value.strong {
  color: #00ff88;
}

.detail-value.warning {
  color: #ffaa00;
}

.progress-bar-node {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
}

.progress-fill-node {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #0080ff);
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill-node.warning {
  background: linear-gradient(90deg, #ffaa00, #ff8800);
}

.progress-fill-node::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: progressShimmer 2s infinite;
}

@keyframes progressShimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
