export default {
    template: `
    <div class="container">
      <header class="header">
        <div class="header-left">
          <div class="logo"></div>
          <h1>智慧园区监控系统</h1>
        </div>
        <nav class="navigation">
          <span>园区</span>
          <span>监控</span>
          <span>智能</span>
          <span>管理</span>
        </nav>
        <div class="header-right">
          <div class="status-light"></div>
          <span>园区监控中 - 全域感知模式</span>
        </div>
      </header>
      <main class="main-content">
        <section class="card video-source">
          <h2 class="card-title">视频数据源</h2>
          <div class="drop-zone">
            <div class="folder-icon"></div>
            <p>拖拽视频文件到此处</p>
            <span>支持 MP4, AVI, MOV 格式</span>
          </div>
        </section>
        <section class="card energy-analysis">
          <div class="analysis-bar">
            <span>请评估过去一周能源使用效率</span>
            <button class="analyze-button">开始分析</button>
          </div>
        </section>
        <section class="card ai-monitoring">
          <h2 class="card-title">AI神经网络监控</h2>
          <div class="monitoring-content">
            <div class="building-3d">
                <p class="building-title">智慧园区3D监控</p>
                <img src="building.png" alt="Building 3D View">
                <div class="building-stats">
                    <p>摄像头: 12个在线</p>
                    <p>监控覆盖率: 100%</p>
                    <p>园区环境: 优良</p>
                    <p>建筑状态: 正常</p>
                </div>
            </div>
            <div class="node-status">
              <h3>神经节点状态</h3>
              <div class="node-item">
                <span>1F-大厅区域</span>
                <span class="status-active">活跃</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    `
};
