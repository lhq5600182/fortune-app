import { View, Text } from '@tarojs/components';
import { useRouter } from '@tarojs/taro';
import ConstellationBackground from '../../components/ConstellationBackground';
import './index.css';

const features = [
  {
    id: 'mbti',
    icon: '🧠',
    name: 'MBTI人格测试',
    desc: '探索你的性格密码',
  },
  {
    id: 'tarot',
    icon: '🌙',
    name: '塔罗牌占卜',
    desc: '指引你的命运之路',
  },
  {
    id: 'wuxing',
    icon: '☯️',
    name: '五行八字',
    desc: '解读命理玄机',
  },
];

export default function Index() {
  const router = useRouter();

  const handleFeatureClick = (id: string) => {
    router.navigateTo({ url: `/pages/${id}/index` });
  };

  return (
    <View className="container">
      <ConstellationBackground />
      <View className="content">
        <View className="hero-section">
          <View className="hero-avatar">
            <Text className="hero-avatar-text">✧</Text>
          </View>
          <Text className="hero-title">命运星盘</Text>
          <Text className="hero-subtitle">AI智能解读 · 探索你的命运轨迹</Text>
        </View>

        <View className="feature-list">
          {features.map((item) => (
            <View
              key={item.id}
              className="feature-item"
              onClick={() => handleFeatureClick(item.id)}
            >
              <View className="feature-icon">{item.icon}</View>
              <View className="feature-content">
                <Text className="feature-name">{item.name}</Text>
                <Text className="feature-desc">{item.desc}</Text>
              </View>
              <Text className="feature-arrow">›</Text>
            </View>
          ))}
        </View>

        <View className="tips-section">
          <Text className="tips-title">使用须知</Text>
          <Text className="tips-text">• 每日免费塔罗占卜1次</Text>
          <Text className="tips-text">• 解锁高级功能仅需¥9.9</Text>
          <Text className="tips-text">• AI解读仅供娱乐参考</Text>
        </View>

        <View className="footer-section">
          <Text className="footer-author">作者：Emy</Text>
          <Text className="footer-email">Email：1765714607@qq.com</Text>
          <Text className="footer-date">创建日期：2026-04-25</Text>
          <Text className="footer-version">版本号：1.0.0</Text>
        </View>
      </View>
    </View>
  );
}
