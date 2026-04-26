import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import { useRouter } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import ConstellationBackground from '../../components/ConstellationBackground';
import './index.css';

const questions = [
  {
    id: 1,
    question: '在社交场合中，你通常会：',
    options: [
      { text: '主动和陌生人交谈', value: 'E' },
      { text: '等待别人来接近你', value: 'I' },
    ],
  },
  {
    id: 2,
    question: '你更倾向于：',
    options: [
      { text: '关注具体的事实和数据', value: 'S' },
      { text: '探索可能性和想象', value: 'N' },
    ],
  },
  {
    id: 3,
    question: '在做决定时，你更看重：',
    options: [
      { text: '逻辑和客观因素', value: 'T' },
      { text: '对他人的影响和感受', value: 'F' },
    ],
  },
  {
    id: 4,
    question: '你更喜欢哪种生活方式：',
    options: [
      { text: '有计划、有组织', value: 'J' },
      { text: '灵活随性、顺其自然', value: 'P' },
    ],
  },
  {
    id: 5,
    question: '你更感兴趣的是：',
    options: [
      { text: '发生在当下的事物', value: 'S' },
      { text: '未来可能发生的事物', value: 'N' },
    ],
  },
  {
    id: 6,
    question: '你容易被什么所吸引：',
    options: [
      { text: '实际、有用的东西', value: 'S' },
      { text: '新颖、有创意的东西', value: 'N' },
    ],
  },
  {
    id: 7,
    question: '在工作中，你更喜欢：',
    options: [
      { text: '按计划执行任务', value: 'J' },
      { text: '自由探索解决方案', value: 'P' },
    ],
  },
  {
    id: 8,
    question: '与他人相处时，你更注重：',
    options: [
      { text: '和谐的人际关系', value: 'F' },
      { text: '事实和真相', value: 'T' },
    ],
  },
];

const mbtiTypes = {
  'INTJ': { name: '战略家', desc: '富有想象力和战略思维，善于制定长期计划' },
  'INTP': { name: '思想家', desc: '热爱探索知识，擅长逻辑分析和创新思考' },
  'ENTJ': { name: '指挥官', desc: '天生领导者，果断自信，善于组织和决策' },
  'ENTP': { name: '辩论家', desc: '思维敏捷，热爱智识挑战，善于创新' },
  'INFJ': { name: '提倡者', desc: '理想主义者，洞察力强，富有同理心和创造力' },
  'INFP': { name: '调停者', desc: '温柔理想主义者，追求有意义的生活和关系' },
  'ENFJ': { name: '主人公', desc: '魅力非凡的领导者，激励他人成为最好的自己' },
  'ENFP': { name: '竞选者', desc: '热情洋溢的创意者，富有感染力和想象力' },
  'ISTJ': { name: '物流师', desc: '尽职尽责，注重细节，踏实可靠' },
  'ISFJ': { name: '守护者', desc: '温暖体贴，默默付出，忠诚可靠' },
  'ESTJ': { name: '总经理', desc: '务实高效，注重秩序和传统，执行力强' },
  'ESFJ': { name: '执政官', desc: '热情友好，善于照顾他人，注重社交' },
  'ISTP': { name: '鉴赏家', desc: '冷静务实，动手能力强，善于分析' },
  'ISFP': { name: '探险家', desc: '自由灵活，艺术家气质，热爱体验' },
  'ESTP': { name: '企业家', desc: '大胆务实，精力充沛，善于把握机会' },
  'ESFP': { name: '表演者', desc: '活泼开朗，热爱社交，享受当下' },
};

interface AIResult {
  personality: string;
  career: string;
  relationship: string;
  growth: string;
}

export default function MBTI() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const mbti = calculateMBTI(newAnswers);
      setResult(mbti);
      fetchAIInterpretation(mbti, newAnswers);
    }
  };

  const calculateMBTI = (answers: string[]): string => {
    let type = '';
    type += answers[0] === 'E' ? 'E' : 'I';
    type += answers[1] === 'S' ? 'S' : 'N';
    type += answers[2] === 'T' ? 'T' : 'F';
    type += answers[3] === 'J' ? 'J' : 'P';
    type += answers[4] === 'S' ? 'S' : 'N';
    type += answers[5] === 'S' ? 'S' : 'N';
    type += answers[6] === 'J' ? 'J' : 'P';
    type += answers[7] === 'T' ? 'T' : 'F';
    return type;
  };

  const fetchAIInterpretation = async (mbtiType: string, userAnswers: string[]) => {
    const typeInfo = mbtiTypes[mbtiType as keyof typeof mbtiTypes];
    if (!typeInfo) return;

    setAiLoading(true);
    setAiError('');

    try {
      const res = await Taro.cloud.callFunction({
        name: 'mbti-interpret',
        data: {
          mbtiType,
          answers: userAnswers,
          typeName: typeInfo.name,
          typeDesc: typeInfo.desc,
        },
      }) as any;

      if (res.result?.success) {
        setAiResult(res.result.data);
      } else {
        setAiError(res.result?.error || 'AI解读服务繁忙，请稍后再试');
      }
    } catch (err) {
      console.error('MBTI AI调用失败:', err);
      setAiError('AI解读服务繁忙，请稍后再试');
    } finally {
      setAiLoading(false);
    }
  };

  const getTypeInfo = () => {
    return mbtiTypes[result as keyof typeof mbtiTypes] || { name: '未知', desc: '无法确定类型' };
  };

  const handleRetest = () => {
    setStep(0);
    setAnswers([]);
    setResult('');
    setAiResult(null);
    setAiError('');
  };

  return (
    <View className="container">
      <ConstellationBackground />
      <View className="content">
        <View className="page-header">
          <Text className="page-title">MBTI人格测试</Text>
          <Text className="page-subtitle">
            {result ? '测试完成' : `第 ${step + 1} / ${questions.length} 题`}
          </Text>
        </View>

        <View className="progress-bar">
          <View
            className="progress-fill"
            style={{ width: `${((step + (result ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </View>

        {!result ? (
          <View className="question-card">
            <Text className="question-text">{questions[step].question}</Text>
            <View className="options">
              {questions[step].options.map((option, index) => (
                <View
                  key={index}
                  className="option-item"
                  onClick={() => handleAnswer(option.value)}
                >
                  <Text className="option-text">{option.text}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View className="result-card">
            <View className="result-badge">
              <Text className="result-type">{result}</Text>
              <Text className="result-name">{getTypeInfo().name}</Text>
            </View>
            <Text className="result-desc">{getTypeInfo().desc}</Text>

            {aiLoading && (
              <View className="ai-analysis">
                <Text className="ai-title">✨ AI深度分析</Text>
                <Text className="ai-text loading">正在获取AI解读，请稍候...</Text>
              </View>
            )}

            {aiError && (
              <View className="ai-analysis error">
                <Text className="ai-title">✨ AI深度分析</Text>
                <Text className="ai-text">{aiError}</Text>
              </View>
            )}

            {aiResult && (
              <View className="ai-analysis">
                <Text className="ai-title">✨ AI深度分析</Text>
                {aiResult.personality && (
                  <View className="ai-section">
                    <Text className="ai-section-title">性格深度解析</Text>
                    <Text className="ai-text">{aiResult.personality}</Text>
                  </View>
                )}
                {aiResult.career && (
                  <View className="ai-section">
                    <Text className="ai-section-title">职业发展规划</Text>
                    <Text className="ai-text">{aiResult.career}</Text>
                  </View>
                )}
                {aiResult.relationship && (
                  <View className="ai-section">
                    <Text className="ai-section-title">人际关系建议</Text>
                    <Text className="ai-text">{aiResult.relationship}</Text>
                  </View>
                )}
                {aiResult.growth && (
                  <View className="ai-section">
                    <Text className="ai-section-title">个人成长指南</Text>
                    <Text className="ai-text">{aiResult.growth}</Text>
                  </View>
                )}
              </View>
            )}

            <View className="result-actions">
              <View className="btn-primary" onClick={() => router.back()}>返回首页</View>
              <View className="btn-secondary" onClick={handleRetest}>重新测试</View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}