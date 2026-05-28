# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
│   ├── build.sh            # 构建脚本
│   ├── dev.sh              # 开发环境启动脚本
│   ├── prepare.sh          # 预处理脚本
│   └── start.sh            # 生产环境启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   ├── components/ui/      # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   └── utils.ts        # 通用工具函数 (cn)
│   └── server.ts           # 自定义服务端入口
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

- 项目文件（如 app 目录、pages 目录、components 等）默认初始化到 `src/` 目录下。

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 数据存储

- 使用 JSON 文件存储（`/data/*.json`），通过 `src/lib/json-db.ts` 工具库访问
- 启动时自动通过 `src/lib/seed.ts` 填充初始示例数据
- 图片/文件上传：通过 `/api/admin/upload` 使用 S3Storage 存储

## API 路由

### 公共接口（无需鉴权）
| 接口 | 返回 | 说明 |
|------|------|------|
| `GET /api/public/banners` | 数组 | 首页Banner |
| `GET /api/public/company` | 对象 | 公司介绍 |
| `GET /api/public/business` | 数组 | 业务板块 |
| `GET /api/public/categories` | 数组 | 产品分类 |
| `GET /api/public/products` | 数组 | 产品列表 |
| `GET /api/public/clients` | 数组 | 合作客户 |
| `GET /api/public/cases` | 数组 | 合作案例 |
| `GET /api/public/certifications` | 数组 | 工厂资质 |
| `GET /api/public/exhibitions` | 数组 | 展会集锦 |
| `GET /api/public/contacts` | 对象 | 联系方式 |
| `GET /api/public/social` | 数组 | 社媒链接 |

### 管理接口（需登录）
- `POST /api/admin/login` — 登录（密码: `dreamdoll888`）
- 所有板块均有 CRUD：`GET/POST/PUT/DELETE /api/admin/{板块名}`
- `POST /api/admin/upload` — 文件上传（返回 key）

## 后台管理入口

- 访问 `/admin/login` 登录（密码: `dreamdoll888`）
- 管理后台支持：公司介绍、业务板块、产品分类、产品管理、合作客户、合作案例、工厂资质、展会集锦、联系方式、社媒链接

## 页面路由

| 路径 | 页面 |
|------|------|
| `/` | 首页（Banner + 产品展示 + 客户 + 案例） |
| `/about` | 公司介绍 |
| `/business` | 业务板块 |
| `/products/[slug]` | 产品线（按分类展示） |
| `/clients` | 合作客户 |
| `/cases` | 合作案例 |
| `/certifications` | 工厂资质 |
| `/exhibitions` | 展会集锦 |
| `/contact` | 联系方式 |

### 编码规范

- 默认按 TypeScript `strict` 心智写代码；优先复用当前作用域已声明的变量、函数、类型和导入，禁止引用未声明标识符或拼错变量名。
- 禁止隐式 `any` 和 `as any`；函数参数、返回值、解构项、事件对象、`catch` 错误在使用前应有明确类型或先完成类型收窄，并清理未使用的变量和导入。

### next.config 配置规范

- 配置的路径不要写死绝对路径，必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接。

### Hydration 问题防范

1. 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。**必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染**；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
2. **禁止使用 head 标签**，优先使用 metadata，详见文档：https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   1. 三方 CSS、字体等资源可在 `globals.css` 中顶部通过 `@import` 引入或使用 next/font
   2. preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入
   3. json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld

## 中英文双语支持 (i18n)

### 架构
- **`src/lib/locales/zh.ts`** — 中文翻译字典
- **`src/lib/locales/en.ts`** — 英文翻译字典
- **`src/lib/locales/context.tsx`** — 语言上下文 + 切换逻辑

### 使用方式
```tsx
import { useLang, t, Lang } from "@/lib/locales/context";

function Component() {
  const { lang, setLang } = useLang();  // lang: "zh" | "en"
  return <h1>{t(lang, "nav.home")}</h1>;
}
```

- `t(lang, "dot.path")` — 从翻译字典中取值，key 不存在时返回 key 本身
- `setLang("zh" | "en")` — 切换语言
- 页面包裹：根 layout.tsx 中已嵌套 `LangWrapper`（含 LangProvider + Navbar + Footer）
- 语言切换按钮在导航栏右侧（显示"EN"或"中文"）

### 新增翻译
在 `zh.ts` 和 `en.ts` 中同步添加同一结构的 key 即可，无需修改类型定义。

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**
