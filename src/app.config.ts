export default {
  pages: [
    'pages/index/index',
    'pages/mbti/index',
    'pages/tarot/index',
    'pages/wuxing/index',
  ],
  window: {
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#0f0f1a',
    navigationBarTitleText: '命运星盘',
    navigationBarTextStyle: 'white',
  },
  permission: {
    'scope.userLocation': {
      desc: '你的位置信息将用于提供更好的星座服务',
    },
  },
  networkTimeout: {
    request: 10000,
    connectSocket: 10000,
    uploadFile: 10000,
    downloadFile: 10000,
  },
};