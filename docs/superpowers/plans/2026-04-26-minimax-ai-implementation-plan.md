# MiniMax AI API 接入实现计划

**日期**: 2026-04-26
**版本**: V1.0.0
**前置**: MiniMax AI API 密钥、环境已开通微信云开发

---

## 任务清单

- [ ] 1. 创建云函数基础结构
- [ ] 2. 实现 mbti-interpret 云函数
- [ ] 3. 实现 tarot-interpret 云函数
- [ ] 4. 实现 wuxing-interpret 云函数
- [ ] 5. 前端集成：MBTI 页面
- [ ] 6. 前端集成：塔罗页面
- [ ] 7. 前端集成：五行页面
- [ ] 8. 本地测试验证
- [ ] 9. 提交代码

---

## 详细步骤

### 步骤 1: 创建云函数基础结构

**创建目录**:
```
cloudfunctions/
├── mbti-interpret/
│   ├── index.js
│   └── package.json
├── tarot-interpret/
│   ├── index.js
│   └── package.json
└── wuxing-interpret/
    ├── index.js
    └── package.json
```

**package.json 模板**:
```json
{
  "name": "{{function-name}}",
  "version": "1.0.0",
  "description": "AI解读云函数",
  "dependencies": {
    "minimult": "latest"
  }
}
```

### 步骤 2-4: 实现各云函数

**每个云函数包含**:
1. `index.js` - 云函数入口
2. MiniMax API 调用逻辑
3. Prompt 模板
4. 错误处理

**共用的 MiniMax API 调用封装**:
```javascript
// 使用微信云托管或 Taro.cloud.callFunction
// 通过 HTTPS 调用 MiniMax API
```

### 步骤 5-7: 前端集成

**修改页面**:
- `src/pages/mbti/index.tsx` - 调用 mbti-interpret
- `src/pages/tarot/index.tsx` - 调用 tarot-interpret
- `src/pages/wuxing/index.tsx` - 调用 wuxing-interpret

**替换逻辑**:
- 原有的静态 AI 解读文本 → 调用云函数获取动态解读
- 添加 loading 状态
- 错误处理和降级

### 步骤 8: 测试验证

```bash
# 本地云函数模拟测试
# 或使用微信开发者工具云函数本地调试
```

### 步骤 9: 提交

```bash
git add .
git commit -m "feat: 完成MiniMax AI API接入"
git push
```

---

## 实现细节

### 云函数环境变量配置

在微信云开发控制台设置:
- `MINIMAX_API_KEY`: 你的MiniMax API密钥

### MiniMax API 端点

```
POST https://api.minimaxi.chat/v1/text/chatcompletion_pro

Headers:
  Content-Type: application/json
  Authorization: Bearer {API_KEY}

Body:
{
  "model": "abab6-chat",
  "messages": [
    {"role": "user", "content": "{prompt}"}
  ]
}
```

### 错误处理策略

| 错误类型 | 处理方式 |
|---------|---------|
| API 超时 | 返回友好提示"AI解读繁忙，请稍后再试" |
| API 错误 | 记录日志，返回错误信息 |
| 网络错误 | 降级到本地静态解读 |

---

## 预计工作量

- 云函数开发: 约 2-3 小时
- 前端集成: 约 1-2 小时
- 测试调试: 约 1 小时

---

## 注意事项

1. 云函数需在微信开发者工具中上传并部署
2. 需先在微信云开发控制台开通云开发服务
3. API 密钥不要硬编码，放在环境变量中
4. 微信小程序前端调用需使用 `wx.cloud.callFunction` 或 Taro 的云调用封装
