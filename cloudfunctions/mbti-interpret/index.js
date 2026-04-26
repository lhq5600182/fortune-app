const cloud = require('wx-server-sdk');
const https = require('https');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { mbtiType, answers, typeName, typeDesc } = event;

  if (!mbtiType || !answers || !typeName) {
    return {
      success: false,
      error: '参数不完整'
    };
  }

  const prompt = `你是专业的MBTI人格分析师。请根据用户的MBTI类型进行深度分析。

用户信息：
- MBTI类型：${mbtiType}
- 类型名称：${typeName}
- 类型描述：${typeDesc}
- 用户选项：${answers.join(', ')}

请从以下四个维度进行深度分析：

1. 性格深度解析
   分析该类型的核心特质、思维模式和行为动机

2. 职业发展规划
   适合的职业方向、工作环境、团队角色

3. 人际关系建议
   与不同人格类型的相处之道、亲密关系建议

4. 个人成长指南
   潜在优势挖掘、潜在挑战、成长路径

请用温暖，专业、有洞察力的语言进行分析，总字数约400-500字。`;

  try {
    const apiKey = process.env.MINIMAX_API_KEY;
    if (!apiKey) {
      return {
        success: false,
        error: 'AI服务未配置，请联系管理员'
      };
    }

    console.log('开始调用MiniMax API...');
    const result = await callMiniMaxAPI(prompt, apiKey);
    console.log('MiniMax API调用成功');

    return {
      success: true,
      data: parseMBTIResult(result)
    };
  } catch (error) {
    console.error('MBTI AI调用失败:', error);
    return {
      success: false,
      error: 'AI解读服务繁忙，请稍后再试'
    };
  }
};

function callMiniMaxAPI(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'abab5.5-chat',
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

    console.log('发送请求到MiniMax API...');

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log('MiniMax响应状态:', res.statusCode);
        console.log('MiniMax响应体:', body);
        try {
          const response = JSON.parse(body);
          if (response.error) {
            reject(new Error(response.error.message || 'API错误'));
            return;
          }
          resolve(response.choices?.[0]?.message?.content || '');
        } catch (e) {
          console.error('解析响应失败:', e);
          reject(e);
        }
      });
    });

    req.on('error', (err) => {
      console.error('请求错误:', err);
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

function parseMBTIResult(content) {
  if (!content) {
    return {
      personality: '暂无分析结果',
      career: '暂无分析结果',
      relationship: '暂无分析结果',
      growth: '暂无分析结果'
    };
  }

  const sections = {
    personality: '',
    career: '',
    relationship: '',
    growth: ''
  };

  const lines = content.split('\n');
  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.includes('性格') || (trimmed.includes('1.') && trimmed.length < 15)) {
      currentSection = 'personality';
    } else if (trimmed.includes('职业') || (trimmed.includes('2.') && currentSection === 'personality')) {
      currentSection = 'career';
    } else if (trimmed.includes('人际') || (trimmed.includes('3.') && currentSection === 'career')) {
      currentSection = 'relationship';
    } else if (trimmed.includes('成长') || (trimmed.includes('4.') && currentSection === 'relationship')) {
      currentSection = 'growth';
    } else if (currentSection && trimmed) {
      sections[currentSection] += trimmed + '\n';
    }
  }

  if (!sections.personality) {
    const len = content.length;
    return {
      personality: content.substring(0, Math.floor(len / 4)),
      career: content.substring(Math.floor(len / 4), Math.floor(len / 2)),
      relationship: content.substring(Math.floor(len / 2), Math.floor(len * 3 / 4)),
      growth: content.substring(Math.floor(len * 3 / 4))
    };
  }

  Object.keys(sections).forEach(key => {
    sections[key] = sections[key].trim();
  });

  return sections;
}