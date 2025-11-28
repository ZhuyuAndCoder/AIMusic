This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Cloudflare Pages（Git 方式）部署流程

- 仓库准备
  - 保持当前项目结构与脚本，确保 `package.json` 中包含构建命令：`npx @cloudflare/next-on-pages@latest build` 或使用脚本 `npm run build:cf`
  - 构建输出目录：`.vercel/output/static`
  - 可选：根目录 `next.config.js` 已配置在构建时忽略 ESLint

- 在 Cloudflare 控制台创建 Pages 项目
  - Pages → Create Project → Connect to Git
  - 选择你的仓库与分支（通常是 `main`/`master`）

- 构建设置
  - Build command：`npm run build:cf`（等价：`npx @cloudflare/next-on-pages@latest`）
  - Build output directory：`.vercel/output/static`
  - Environment variables：按需添加，例如 `NEXT_PUBLIC_SITE_NAME=AI音乐`
  - Framework preset：选择 None（因使用 next-on-pages 自行构建）

- Functions 与资源绑定（生产环境，可选）
  - Pages → Settings → Functions → Bindings：
    - D1 Database：`AIMUSIC_DB`
    - KV Namespace：`AIMUSIC_KV`
    - R2 Bucket：`AIMUSIC_MEDIA`
  - 未绑定时 API 自动回退到内存 mock；绑定后自动使用 D1/KV/R2

- D1 数据库初始化（一次）
  - Cloudflare 控制台 → D1 → 创建数据库（命名如 `ai_music_db`）
  - 进入数据库 → SQL 编辑器 → 执行 `cloudflare/d1/schema.sql` 内容

- 部署与预览
  - 提交代码到 Git，Cloudflare 会自动触发构建与部署
  - Pages 项目 → Deployments 查看状态；完成后访问预览域名
  - 验证页面与 API（`/api/playlists`、`/api/playlists/[id]`、`/api/tracks`）

- 自定义域名（可选）
  - Pages → Custom domains → 添加域名 → 按指引完成 DNS 设置与代理

- 多环境与分支预览（可选）
  - 为不同分支开启 Preview deployments；按需设置环境变量与绑定区分生产/预览

- 常见问题
  - 构建失败：检查 Build command 与 Output 目录；确保 Next 与 Node 版本兼容
  - API 404：确认 `.vercel/output/functions` 已生成；非静态页面需 `export const runtime = 'edge'`
  - 绑定不起效：生产绑定需在控制台设置；`wrangler.toml` 仅用于本地 Pages Dev
