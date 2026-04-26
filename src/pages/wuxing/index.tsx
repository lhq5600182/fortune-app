import { View, Text, Picker } from '@tarojs/components';
import { useState } from 'react';
import { useRouter } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import ConstellationBackground from '../../components/ConstellationBackground';
import './index.css';

const years = Array.from({ length: 100 }, (_, i) => `${2026 - i}年`);
const months = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
const days = Array.from({ length: 31 }, (_, i) => `${i + 1}日`);
const hours = Array.from({ length: 24 }, (_, i) => `${i}时`);

const wuxingElements = ['金', '木', '水', '火', '土'];

const elementInfo: Record<string, { desc: string; lucky: string[]; avoid: string[] }> = {
  '金': {
    desc: '你命中带金，性格坚毅果断，具有强大的执行力和正义感。',
    lucky: ['白色、银色', '数字4、9', '金属饰品'],
    avoid: ['红色、紫色', '剧烈运动'],
  },
  '木': {
    desc: '你命中带木，拥有蓬勃的生命力和创造才能，善于思考和学习。',
    lucky: ['绿色、青色', '数字3、8', '木质饰品'],
    avoid: ['白色、金色', '潮湿环境'],
  },
  '水': {
    desc: '你命中带水，智慧深邃，直觉敏锐，善于沟通和表达。',
    lucky: ['黑色、蓝色', '数字1、6', '水景图片'],
    avoid: ['黄色、棕色', '干燥环境'],
  },
  '火': {
    desc: '你命中带火，热情洋溢，行动力强，具有领袖气质。',
    lucky: ['红色、紫色', '数字2、7', '彩妆饰品'],
    avoid: ['黑色、蓝色', '沉默寡言'],
  },
  '土': {
    desc: '你命中带土，稳重踏实，诚实可靠，具有很强的忍耐力。',
    lucky: ['黄色、棕色', '数字5、10', '玉石饰品'],
    avoid: ['绿色、青色', '冒险活动'],
  },
};

interface AIResult {
  destiny: string;
  fortune: string;
  suggestions: string;
}

export default function Wuxing() {
  const router = useRouter();
  const [year, setYear] = useState('2000年');
  const [month, setMonth] = useState('1月');
  const [day, setDay] = useState('1日');
  const [hour, setHour] = useState('0时');
  const [hasCalculated, setHasCalculated] = useState(false);
  const [result, setResult] = useState<{ elements: string[]; mainElement: string } | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleCalculate = () => {
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const hourNum = parseInt(hour);

    const elementIndex = (yearNum + monthNum + dayNum + hourNum) % 5;
    const mainElement = wuxingElements[elementIndex];

    const elements: string[] = [mainElement];
    const otherElements = wuxingElements.filter(e => e !== mainElement);
    const shuffled = otherElements.sort(() => Math.random() - 0.5);
    elements.push(...shuffled.slice(0, 2));

    const calcResult = { elements, mainElement };
    setResult(calcResult);
    setHasCalculated(true);
    fetchAIInterpretation(yearNum, monthNum, dayNum, hourNum, mainElement, elements);
  };

  const fetchAIInterpretation = async (
    yearNum: number,
    monthNum: number,
    dayNum: number,
    hourNum: number,
    mainElement: string,
    elements: string[]
  ) => {
    setAiLoading(true);
    setAiError('');

    try {
      const res = await Taro.cloud.callFunction({
        name: 'wuxing-interpret',
        data: {
          year: yearNum,
          month: monthNum,
          day: dayNum,
          hour: hourNum,
          mainElement,
          elements,
        },
      }) as any;

      if (res.result?.success) {
        setAiResult(res.result.data);
      } else {
        setAiError(res.result?.error || 'AI解读服务繁忙，请稍后再试');
      }
    } catch (err) {
      console.error('五行AI调用失败:', err);
      setAiError('AI解读服务繁忙，请稍后再试');
    } finally {
      setAiLoading(false);
    }
  };

  const getBazi = () => {
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const hourNum = parseInt(hour);
    return { year: yearNum, month: monthNum, day: dayNum, hour: hourNum };
  };

  const handleRecalculate = () => {
    setHasCalculated(false);
    setResult(null);
    setAiResult(null);
    setAiError('');
  };

  return (
    <View className="container">
      <ConstellationBackground />
      <View className="content">
        <View className="page-header">
          <Text className="page-title">五行八字</Text>
          <Text className="page-subtitle">输入生辰信息，解读命理玄机</Text>
        </View>

        {!hasCalculated ? (
          <View className="form-section">
            <View className="form-card">
              <View className="form-group">
                <Text className="form-label">出生年份</Text>
                <View className="picker-wrap">
                  <Picker mode='selector' range={years} onChange={(e: any) => setYear(years[e.detail.value])}>
                    <View className="picker-value">{year}</View>
                  </Picker>
                </View>
              </View>

              <View className="form-group">
                <Text className="form-label">出生月份</Text>
                <View className="picker-wrap">
                  <Picker mode='selector' range={months} onChange={(e: any) => setMonth(months[e.detail.value])}>
                    <View className="picker-value">{month}</View>
                  </Picker>
                </View>
              </View>

              <View className="form-group">
                <Text className="form-label">出生日期</Text>
                <View className="picker-wrap">
                  <Picker mode='selector' range={days} onChange={(e: any) => setDay(days[e.detail.value])}>
                    <View className="picker-value">{day}</View>
                  </Picker>
                </View>
              </View>

              <View className="form-group">
                <Text className="form-label">出生时辰</Text>
                <View className="picker-wrap">
                  <Picker mode='selector' range={hours} onChange={(e: any) => setHour(hours[e.detail.value])}>
                    <View className="picker-value">{hour}</View>
                  </Picker>
                </View>
              </View>
            </View>

            <View className="calculate-btn-wrap">
              <View className="calculate-btn" onClick={handleCalculate}>
                <Text className="calculate-btn-text">开始测算</Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="result-section">
            <View className="bazi-card">
              <Text className="bazi-title">您的生辰八字</Text>
              <View className="bazi-info">
                <View className="bazi-item">
                  <Text className="bazi-label">年</Text>
                  <Text className="bazi-value">{getBazi().year}</Text>
                </View>
                <Text className="bazi-separator">年</Text>
                <View className="bazi-item">
                  <Text className="bazi-label">月</Text>
                  <Text className="bazi-value">{getBazi().month}</Text>
                </View>
                <Text className="bazi-separator">月</Text>
                <View className="bazi-item">
                  <Text className="bazi-label">日</Text>
                  <Text className="bazi-value">{getBazi().day}</Text>
                </View>
                <Text className="bazi-separator">日</Text>
                <View className="bazi-item">
                  <Text className="bazi-label">时</Text>
                  <Text className="bazi-value">{getBazi().hour}</Text>
                </View>
                <Text className="bazi-separator">时</Text>
              </View>
            </View>

            <View className="wuxing-display">
              <Text className="wuxing-title">五行分布</Text>
              <View className="elements-row">
                {result?.elements.map((el, index) => (
                  <View key={index} className={`element-badge ${el === result.mainElement ? 'main' : ''}`}>
                    <Text className="element-text">{el}</Text>
                    {el === result.mainElement && <Text className="main-tag">主</Text>}
                  </View>
                ))}
              </View>
            </View>

            <View className="element-detail">
              <Text className="detail-title">{result?.mainElement}行</Text>
              <Text className="detail-desc">{elementInfo[result?.mainElement || '土'].desc}</Text>

              <View className="detail-section">
                <Text className="detail-label">幸运之物</Text>
                <View className="detail-items">
                  {elementInfo[result?.mainElement || '土'].lucky.map((item, index) => (
                    <View key={index} className="detail-item lucky">
                      <Text className="detail-item-text">{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="detail-section">
                <Text className="detail-label">需注意</Text>
                <View className="detail-items">
                  {elementInfo[result?.mainElement || '土'].avoid.map((item, index) => (
                    <View key={index} className="detail-item avoid">
                      <Text className="detail-item-text">{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            <View className="ai-section">
              <View className="ai-card">
                <Text className="ai-title">✨ AI命理分析</Text>

                {aiLoading && (
                  <Text className="ai-text loading">正在获取AI解读，请稍候...</Text>
                )}

                {aiError && (
                  <Text className="ai-text">{aiError}</Text>
                )}

                {aiResult && (
                  <>
                    {aiResult.destiny && (
                      <View className="ai-subsection">
                        <Text className="ai-subsection-title">命理基础分析</Text>
                        <Text className="ai-text">{aiResult.destiny}</Text>
                      </View>
                    )}
                    {aiResult.fortune && (
                      <View className="ai-subsection">
                        <Text className="ai-subsection-title">流年运势</Text>
                        <Text className="ai-text">{aiResult.fortune}</Text>
                      </View>
                    )}
                    {aiResult.suggestions && (
                      <View className="ai-subsection">
                        <Text className="ai-subsection-title">调整建议</Text>
                        <Text className="ai-text">{aiResult.suggestions}</Text>
                      </View>
                    )}
                  </>
                )}

                {!aiLoading && !aiError && !aiResult && (
                  <Text className="ai-text">
                    根据您的生辰八字推算，您命中{result?.mainElement}行旺盛。
                    这意味着您在人生旅途中将面临特定的机遇与挑战...
                  </Text>
                )}
              </View>
            </View>

            <View className="vip-hint">
              <Text className="vip-hint-text">解锁完整八字详解，仅需 ¥9.9</Text>
            </View>

            <View className="action-buttons">
              <View className="recalculate-btn" onClick={handleRecalculate}>
                <Text className="recalculate-text">重新测算</Text>
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