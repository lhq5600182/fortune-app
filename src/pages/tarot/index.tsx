import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import { useRouter } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import ConstellationBackground from '../../components/ConstellationBackground';
import './index.css';

const tarotCards = [
  { id: 0, name: '愚者', image: '🍀', meaning: '新的开始、自由、纯真' },
  { id: 1, name: '魔术师', image: '🎩', meaning: '创造力、意志力、沟通' },
  { id: 2, name: '女祭司', image: '🌙', meaning: '直觉、智慧、内在' },
  { id: 3, name: '女皇', image: '👑', meaning: '丰盛、繁荣、母性' },
  { id: 4, name: '皇帝', image: '⚔️', meaning: '权威、结构、领导力' },
  { id: 5, name: '教皇', image: '📿', meaning: '信仰、精神指引、传统' },
  { id: 6, name: '恋人', image: '💕', meaning: '爱情、选择、关系' },
  { id: 7, name: '战车', image: '🏛️', meaning: '胜利、意志力、决心' },
  { id: 8, name: '力量', image: '🦁', meaning: '勇气、耐心、内在力量' },
  { id: 9, name: '隐士', image: '🔦', meaning: '内省、孤独、指引' },
  { id: 10, name: '命运之轮', image: '🎡', meaning: '命运、转变、机遇' },
  { id: 11, name: '正义', image: '⚖️', meaning: '公平、平衡、真相' },
  { id: 12, name: '倒吊人', image: '🕊️', meaning: '等待、牺牲、换一个角度' },
  { id: 13, name: '死神', image: '💀', meaning: '结束、转变、重生' },
  { id: 14, name: '节制', image: '🌊', meaning: '平衡、调和、中庸' },
  { id: 15, name: '恶魔', image: '🔥', meaning: '束缚、欲望、物质主义' },
  { id: 16, name: '塔', image: '⛔', meaning: '突变、解放、觉醒' },
  { id: 17, name: '星星', image: '⭐', meaning: '希望、灵感、平静' },
  { id: 18, name: '月亮', image: '🌛', meaning: '幻觉、恐惧、直觉' },
  { id: 19, name: '太阳', image: '☀️', meaning: '快乐、成功、活力' },
  { id: 20, name: '审判', image: '📯', meaning: '重启、救赎、觉醒' },
  { id: 21, name: '世界', image: '🌍', meaning: '完成、成就、圆满' },
];

interface DrawnCard {
  id: number;
  name: string;
  image: string;
  meaning: string;
  position: string;
  isReversed: boolean;
}

interface AIResult {
  past: string;
  present: string;
  future: string;
  overall: string;
}

export default function Tarot() {
  const router = useRouter();
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const drawCards = () => {
    setIsDrawing(true);
    setShowResult(false);
    setAiResult(null);
    setAiError('');

    setTimeout(() => {
      const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, 3).map((card, index) => ({
        ...card,
        position: index === 0 ? '过去' : index === 1 ? '现在' : '未来',
        isReversed: Math.random() > 0.7,
      }));
      setDrawnCards(drawn);
      setIsDrawing(false);
      setShowResult(true);
      fetchAIInterpretation(drawn);
    }, 1500);
  };

  const fetchAIInterpretation = async (cards: DrawnCard[]) => {
    setAiLoading(true);
    setAiError('');

    try {
      const res = await Taro.cloud.callFunction({
        name: 'tarot-interpret',
        data: { cards },
      }) as any;

      if (res.result?.success) {
        setAiResult(res.result.data);
      } else {
        setAiError(res.result?.error || 'AI解读服务繁忙，请稍后再试');
      }
    } catch (err) {
      console.error('塔罗AI调用失败:', err);
      setAiError('AI解读服务繁忙，请稍后再试');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDrawAgain = () => {
    setAiResult(null);
    setAiError('');
    drawCards();
  };

  const getPositionLabel = (position: string) => {
    if (position === '过去') return aiResult?.past || '';
    if (position === '现在') return aiResult?.present || '';
    if (position === '未来') return aiResult?.future || '';
    return '';
  };

  return (
    <View className="container">
      <ConstellationBackground />
      <View className="content">
        <View className="page-header">
          <Text className="page-title">塔罗占卜</Text>
          <Text className="page-subtitle">抽取三张牌，解读你的命运</Text>
        </View>

        {!showResult && !isDrawing ? (
          <View className="draw-section">
            <View className="card-spread">
              <View className="card-placeholder" />
              <View className="card-placeholder" />
              <View className="card-placeholder" />
            </View>
            <Text className="draw-hint">点击下方按钮，抽取你的命运之牌</Text>
            <View className="draw-btn-wrap">
              <View className="draw-btn" onClick={drawCards}>
                <Text className="draw-btn-text">开始占卜</Text>
              </View>
            </View>
            <Text className="free-count">今日免费次数：1</Text>
          </View>
        ) : isDrawing ? (
          <View className="drawing-section">
            <Text className="drawing-text">命运之轮正在转动...</Text>
            <View className="spinning-cards">
              <View className="spinning-card">🃏</View>
              <View className="spinning-card">🃏</View>
              <View className="spinning-card">🃏</View>
            </View>
          </View>
        ) : (
          <View className="result-section">
            <Text className="result-title">你的命运牌阵</Text>
            <View className="cards-display">
              {drawnCards.map((card, index) => (
                <View key={index} className="drawn-card">
                  <Text className="card-position">{card.position}</Text>
                  <View className={`tarot-card ${card.isReversed ? 'reversed' : ''}`}>
                    <Text className="card-image">{card.image}</Text>
                    {card.isReversed && <Text className="reversed-badge">逆</Text>}
                  </View>
                  <Text className="card-name">{card.name}</Text>
                </View>
              ))}
            </View>

            {aiLoading && (
              <View className="interpretations">
                <View className="interpretation-card">
                  <View className="interp-header">
                    <Text className="interp-title">✨ AI解读生成中</Text>
                  </View>
                  <Text className="ai-text loading">命运之牌正在被解读，请稍候...</Text>
                </View>
              </View>
            )}

            {aiError && (
              <View className="interpretations">
                {drawnCards.map((card, index) => (
                  <View key={index} className="interpretation-card">
                    <View className="interp-header">
                      <Text className="interp-title">{card.position} — {card.name}</Text>
                    </View>
                    <Text className="interp-meaning">{card.meaning}</Text>
                    <View className="ai-interp">
                      <Text className="ai-label">✨ AI解读</Text>
                      <Text className="ai-text">{aiError}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {aiResult && (
              <View className="interpretations">
                {drawnCards.map((card, index) => (
                  <View key={index} className="interpretation-card">
                    <View className="interp-header">
                      <Text className="interp-title">{card.position} — {card.name}</Text>
                    </View>
                    <Text className="interp-meaning">{card.meaning}</Text>
                    <View className="ai-interp">
                      <Text className="ai-label">✨ AI解读</Text>
                      <Text className="ai-text">{getPositionLabel(card.position)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {aiResult && aiResult.overall && (
              <View className="interpretation-card overall">
                <View className="interp-header">
                  <Text className="interp-title">🌟 整体建议</Text>
                </View>
                <View className="ai-interp">
                  <Text className="ai-text">{aiResult.overall}</Text>
                </View>
              </View>
            )}

            <View className="vip-section">
              <View className="vip-card">
                <Text className="vip-title">解锁完整解读</Text>
                <Text className="vip-desc">仅需 ¥9.9 查看详细牌义分析</Text>
                <View className="vip-btn">
                  <Text className="vip-btn-text">立即解锁</Text>
                </View>
              </View>
            </View>

            <View className="action-buttons">
              <View className="draw-again-btn" onClick={handleDrawAgain}>
                <Text className="draw-again-text">再次占卜</Text>
              </View>
              <View className="back-btn" onClick={() => router.back()}>
                <Text className="back-btn-text">返回首页</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}