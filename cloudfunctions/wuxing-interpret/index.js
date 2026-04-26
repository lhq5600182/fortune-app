const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { year, month, day, hour, mainElement, elements } = event;

  if (!year || !month || !day || !hour || !mainElement) {
    return {
      success: false,
      error: '参数不完整'
    };
  }

  const prompt = `你是一位精通五行八字的中国传统命理师。请根据用户的生辰信息进行分析。

用户信息：
- 出生年月日時：${year}年${month}月${day}日${hour}时
- 五行主元素：${mainElement}
- 五行分布：${(elements || []).join(', ')}

请从以下方面进行分析：

1. 命理基础分析
   根据五行分析命主性格特点和命运特征，约150字

2. 流年运势
   结合当下时间分析近期运势走向，约150字

3. 调整建议
   方位、颜色、数字、贵人等调整建议，约100字

请用专业、睿智、富有东方智慧的语言进行分析。`;

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
      data: parseWuxingResult(result)
    };
  } catch (error) {
    console.error('五行AI调用失败:', error);
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

function parseWuxingResult(content) {
  const result = {
    destiny: '',
    fortune: '',
    suggestions: ''
  };

  const lines = content.split('\n');
  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();
    const lowerContent = trimmed.toLowerCase();

    if (lowerContent.includes('命理') || lowerContent.includes('基础')) {
      currentSection = 'destiny';
    } else if (lowerContent.includes('流年') || lowerContent.includes('运势')) {
      currentSection = 'fortune';
    } else if (lowerContent.includes('调整') || lowerContent.includes('建议') || lowerContent.includes('方位')) {
      currentSection = 'suggestions';
    } else if (currentSection && trimmed) {
      result[currentSection] += trimmed + '\n';
    }
  }

  if (!result.destiny) {
    const len = content.length;
    const third = Math.floor(len / 3);
    result.destiny = content.substring(0, third);
    result.fortune = content.substring(third, third * 2);
    result.suggestions = content.substring(third * 2);
  }

  result.destiny = result.destiny.trim();
  result.fortune = result.fortune.trim();
  result.suggestions = result.suggestions.trim();

  return result;
}