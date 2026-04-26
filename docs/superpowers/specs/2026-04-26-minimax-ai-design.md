# MiniMax AI API 接入设计文档

**日期**: 2026-04-26
**版本**: V1.0.0
**作者**: Emy

## 概述

为"命运星盘"小程序接入 MiniMax AI API，实现三个核心功能的 AI 智能解读：
- MBTI 人格测试深度分析
- 塔罗牌占卜详细解读
- 五行八字命理分析

## 技术架构

### 架构图

```
微信小程序前端
    ↓ Taro.cloud.callFunction
云函数 (微信云开发)
    ↓ HTTPS请求
MiniMax API (chatcompletion_pro)
    ↓ 返回
AI 解读结果 → 前端展示
```

### 目录结构

```
cloudfunctions/
├── mbti-interpret/       # MBTI AI 解读
│   ├── index.js          # 云函数入口
│   └── package.json
├── tarot-interpret/      # 塔罗 AI 解读
│   ├── index.js
│   └── package.json
└── wuxing-interpret/    # 五行 AI 解读
    ├── index.js
    └── package.json
```

## API 设计

### 1. mbti-interpret

**功能**: MBTI人格测试 AI 深度解读

**输入参数**:
```javascript
{
  mbtiType: string,      // e.g. "INTJ"
  answers: string[],     // 用户选择的8个选项值
  typeName: string,      // 中文名称，如"战略家"
  typeDesc: string       // 基础描述
}
```

**输出参数**:
```javascript
{
  success: boolean,
  data: {
    personality: string,        // 性格深度分析
    career: string,             // 职业建议
    relationship: string,       // 人际关系
    growth: string,            // 成长建议
  },
  error?: string
}
```

### 2. tarot-interpret

**功能**: 塔罗牌三牌阵 AI 解读

**输入参数**:
```javascript
{
  cards: [
    {
      name: string,           // 牌名
      position: string,       // 位置：过去/现在/未来
      isReversed: boolean,   // 是否逆位
      meaning: string         // 基础含义
    }
  ]
}
```

**输出参数**:
```javascript
{
  success: boolean,
  data: {
    past: string,            // 过去解读
    present: string,         // 现在解读
    future: string,         // 未来解读
    overall: string,        // 整体建议
  },
  error?: string
}
```

### 3. wuxing-interpret

**功能**: 五行八字 AI 命理分析

**输入参数**:
```javascript
{
  year: number,           // 出生年
  month: number,          // 出生月
  day: number,            // 出生日
  hour: number,           // 出生时
  mainElement: string,    // 主元素：金/木/水/火/土
  elements: string[],     // 五行分布
}
```

**输出参数**:
```javascript
{
  success: boolean,
  data: {
    destiny: string,       // 命理分析
    fortune: string,       // 运势分析
    suggestions: string,   // 调整建议
  },
  error?: string
}
```

## Prompt 设计

### MBTI Prompt

```
你是专业的MBTI人格分析师。请根据用户的MBTI类型进行深度分析。

用户信息：
- MBTI类型：{mbtiType}
- 类型名称：{typeName}
- 类型描述：{typeDesc}
- 用户选项：{answers}

请从以下四个维度进行深度分析：

1. 性格深度解析
   分析该类型的核心特质、思维模式和行为动机

2. 职业发展规划
   适合的职业方向、工作环境、团队角色

3. 人际关系建议
   与不同人格类型的相处之道、亲密关系建议

4. 个人成长指南
   潜在优势挖掘、潜在挑战、成长路径

请用温暖、专业、有洞察力的语言进行分析，总字数约400-500字。
```

### Tarot Prompt

```
你是专业的塔罗牌占卜师。请解读以下三牌阵。

抽牌信息：
{循环输出每张牌信息}
位置：{position}
牌名：{name}
{'逆位' if isReversed else '正位'}
基础含义：{meaning}

请针对每个位置进行详细解读：

1. 过去 ({pastCard})
   分析过去的经历如何影响当前状态

2. 现在 ({presentCard})
   分析当前面临的挑战和机遇

3. 未来 ({futureCard})
   分析可能的发展方向和建议

4. 整体建议
   综合三张牌给出指导性建议

请用神秘、深邃、富有洞察力的语言进行解读，每个位置约100字，整体建议约100字。
```

### Wuxing Prompt

```
你是一位精通五行八字的中国传统命理师。请根据用户的生辰信息进行分析。

用户信息：
- 出生年月日時：{year}年{month}月{day}日{hour}时
- 五行主元素：{mainElement}
- 五行分布：{elements}

请从以下方面进行分析：

1. 命理基础分析
   根据五行分析命主性格特点和命运特征

2. 流年运势
   结合当下时间分析近期运势走向

3. 调整建议
   方位、颜色、数字、贵人等调整建议

请用专业、睿智、富有东方智慧的语言进行分析，总字数约300-400字。
```

## 安全措施

1. **密钥管理**
   - MiniMax API 密钥存储在云函数环境变量 `MINIMAX_API_KEY`
   - 不暴露在前端代码中

2. **调用限制**
   - 每个云函数设置超时时间 10s
   - 错误处理和降级方案

3. **错误处理**
   - API 调用失败时返回友好的错误信息
   - 记录日志便于排查

## 微信云开发配置

1. 安装微信开发者工具
2. 开通云开发服务
3. 创建云函数并上传
4. 配置环境变量 `MINIMAX_API_KEY`

## 前端集成

各页面调用对应的云函数获取 AI 解读结果，替换现有的静态占位文本。

---

## 实施计划

见: `docs/superpowers/plans/2026-04-26-minimax-ai-implementation-plan.md`
