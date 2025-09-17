import { ref } from 'vue'

// 全局分析模式状态
export const analysisMode = ref('energy') // 'energy', 'meetingroom', or 'parking'

// 监控点配置
export const monitorConfigs = {
  energy: {
    monitors: [
      { id: 1, name: '大楼东侧', status: 'active' },
      { id: 2, name: '大楼西侧', status: 'active' },
      { id: 3, name: '大楼南侧', status: 'active' },
      { id: 4, name: '大楼北侧', status: 'active' },
      { id: 5, name: '大厅区域', status: 'active' },
      { id: 6, name: '走廊区域', status: 'active' }
    ],
    panelTitle: '🎥 导入视频',
    monitorTitle: '📹 接入监控'
  },
  meetingroom: {
    monitors: [
      { id: 1, name: 'A801会议室', status: 'active' },
      { id: 2, name: 'B502会议室', status: 'active' },
      { id: 3, name: 'C103会议室', status: 'active' },
      { id: 4, name: 'A601会议室', status: 'active' },
      { id: 5, name: 'B304会议室', status: 'active' },
      { id: 6, name: 'D205会议室', status: 'active' }
    ],
    panelTitle: '🎥 导入会议录像',
    monitorTitle: '📹 接入会议室监控'
  },
  parking: {
    monitors: [
      { id: 1, name: '东门停车区', status: 'active' },
      { id: 2, name: '西门停车区', status: 'active' },
      { id: 3, name: '南广场区域', status: 'active' },
      { id: 4, name: '北侧路边区', status: 'active' },
      { id: 5, name: '地下停车场', status: 'active' },
      { id: 6, name: '访客停车区', status: 'active' }
    ],
    panelTitle: '🎥 导入监控录像',
    monitorTitle: '📹 接入停车监控'
  }
}

// 神经节点配置
export const neuralNodeConfigs = {
  energy: [
    {
      name: '1F-大厅区域',
      indicator: 'active',
      badge: 'active',
      nodeCount: 4,
      signalStrength: 97,
      lastSync: '0.8s前',
      load: 28,
      progressWidth: 97
    },
    {
      name: '2F-办公区域',
      indicator: 'active',
      badge: 'active',
      nodeCount: 2,
      signalStrength: 95,
      lastSync: '1.2s前',
      load: 42,
      progressWidth: 95
    },
    {
      name: '停车场A区',
      indicator: 'active',
      badge: 'active',
      nodeCount: 3,
      signalStrength: 99,
      lastSync: '0.5s前',
      load: 18,
      progressWidth: 99
    },
    {
      name: '停车场B区',
      indicator: 'warning',
      badge: 'active',
      nodeCount: 6,
      signalStrength: 89,
      lastSync: '2.1s前',
      load: 56,
      progressWidth: 89
    }
  ],
  meetingroom: [
    {
      name: 'A801-视频会议室',
      indicator: 'active',
      badge: 'active',
      nodeCount: 2,
      signalStrength: 96,
      lastSync: '0.6s前',
      load: 35,
      progressWidth: 96
    },
    {
      name: 'B502-演示厅',
      indicator: 'active',
      badge: 'active',
      nodeCount: 3,
      signalStrength: 94,
      lastSync: '1.1s前',
      load: 48,
      progressWidth: 94
    },
    {
      name: 'C103-小型会议室',
      indicator: 'active',
      badge: 'active',
      nodeCount: 1,
      signalStrength: 92,
      lastSync: '0.9s前',
      load: 22,
      progressWidth: 92
    },
    {
      name: 'A601-大型会议厅',
      indicator: 'warning',
      badge: 'active',
      nodeCount: 4,
      signalStrength: 87,
      lastSync: '2.3s前',
      load: 68,
      progressWidth: 87
    }
  ],
  parking: [
    {
      name: '东门停车监控',
      indicator: 'active',
      badge: 'active',
      nodeCount: 6,
      signalStrength: 98,
      lastSync: '0.4s前',
      load: 15,
      progressWidth: 98
    },
    {
      name: '西门停车监控',
      indicator: 'active',
      badge: 'active',
      nodeCount: 4,
      signalStrength: 96,
      lastSync: '0.7s前',
      load: 23,
      progressWidth: 96
    },
    {
      name: '南广场监控',
      indicator: 'warning',
      badge: 'active',
      nodeCount: 8,
      signalStrength: 88,
      lastSync: '1.8s前',
      load: 45,
      progressWidth: 88
    },
    {
      name: '路边停车监控',
      indicator: 'active',
      badge: 'active',
      nodeCount: 3,
      signalStrength: 94,
      lastSync: '1.1s前',
      load: 32,
      progressWidth: 94
    }
  ]
}