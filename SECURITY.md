# 安全须知

## 敏感信息保护

本项目严格禁止提交任何敏感信息到 GitHub，包括但不限于：

- API 密钥（如 MiniMax API Key）
- 微信云开发 AppID / Secret
- 数据库密码
- 环境变量文件 `.env`
- 任何包含真实凭证的配置文件

## 本地开发

1. 复制 `.env.example` 为 `.env`
2. 填入你的实际配置值
3. 确保 `.env` 已在 `.gitignore` 中

## 云函数环境变量

敏感配置（如 `MINIMAX_API_KEY`）应存储在微信云开发控制台的环境变量中，而不是代码中。

所有云函数通过 `process.env.VARIABLE_NAME` 读取密钥。
