const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { cards } = event;

  if (!cards || !Array.isArray(cards) || cards.length !== 3) {
    return {
      success: false,
      error: '参数不完整，需要3张牌'
    };
  }

  const cardsInfo = cards.map((card, index) => {
    const positionNames = ['过去', '现在', '未来'];
    return `位置：${positionNames[index] || card.position}
牌名：${card.name}
${card.isReversed ? '逆位' : '正位'}
基础含义：${card.meaning}`;
  }).join('\n\n');

  const prompt = `你是专业的塔罗牌占卜师。请解读以下三牌阵。

抽牌信息：
${cardsInfo}

请针对每个位置进行详细解读：

1. 过去
   分析过去的经历如何影响当前状态，约100字

2. 现在
   分析当前面临的挑战和机遇，约100字

3. 未来
   分析可能的发展方向和建议，约100字

4. 整体建议
   综合三张牌给出指导性建议，约100字

请用神秘、深邃、富有洞察力的语言进行解读。`;

  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: 'AI服务未配置，请联系管理员'
      };
    }

    const result = await callMiniMaxAPI(prompt, apiKey);
    return {
      success: true,
      data: parseTarotResult(result, cards)
    };
  } catch (error) {
    console.error('塔罗AI调用失败:', error);
    return {
      success: false,
      error: 'AI解读服务繁忙，请稍后再试'
    };
  }
};

function callMiniMaxAPI(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'abab6-chat',
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const options = {
      hostname: 'api.minimaxi.chat',
      port: 443,
      path: '/v1/text/chatcompletion_pro',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response.choices?.[0]?.message?.content || '');
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function parseTarotResult(content, cards) {
  const result = {
    past: '',
    present: '',
    future: '',
    overall: ''
  };

  const lines = content.split('\n');
  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();
    const lowerContent = trimmed.toLowerCase();

    if (lowerContent.includes('过去')) {
      currentSection = 'past';
    } else if (lowerContent.includes('现在') && !lowerContent.includes('未来')) {
      currentSection = 'present';
    } else if (lowerContent.includes('未来') && !lowerContent.includes('整体')) {
      currentSection = 'future';
    } else if (lowerContent.includes('整体') || lowerContent.includes('建议')) {
      currentSection = 'overall';
    } else if (currentSection && trimmed) {
      result[currentSection] += trimmed + '\n';
    }
  }

  if (!result.past) {
    const len = content.length;
    const third = Math.floor(len / 4);
    result.past = content.substring(0, third);
    result.present = content.substring(third, third * 2);
    result.future = content.substring(third * 2, third * 3);
    result.overall = content.substring(third * 3);
  }

  result.past = result.past.trim();
  result.present = result.present.trim();
  result.future = result.future.trim();
  result.overall = result.overall.trim();

  return result;
}