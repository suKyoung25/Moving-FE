[한국어](/README.md) | [English](/docs/en/README.md) | [**简体字**](/docs/zh/README.md)

# Moving

<img width="3212" height="2023" alt="image" src="https://github.com/user-attachments/assets/a3260d6e-ac5c-4918-a846-bb25362c4798" />

---

## 目录

- [项目介绍](#项目介绍)
- [主要功能](#主要功能)
- [团队构成](#团队构成)
- [系统架构](#系统架构)
- [技术栈](#技术栈)
- [详细功能](#详细功能)
- [故障排除](#故障排除)
- [项目结构](#项目结构)

---

## 项目介绍

Moving是一个智能搬家比较平台，帮助用户轻松比较多个司机的报价，并选择最适合自己需求的专家。

它简化了之前复杂且不透明的搬家报价流程，让用户能够快速找到符合所需条件（搬家类型、地点、时间安排等）的专家。

此外，从司机的角度来看，可以实现高效的客户匹配，提供透明的交易环境和便捷的服务体验。

### 链接

- **团队Notion**: [前往](https://www.notion.so/4Team-Moving-Ops-Board-2153fde0e1948005ad04c1585430e77f)
- **后端仓库**: [GitHub Repository](https://github.com/az0319h/6th-Moving-4Team-BE)

---

## 主要功能

### 客户功能

- **AI报价计算器**: 基于OpenAI GPT-4的智能报价计算系统
- **司机搜索**: 基于位置、服务类型、评分的过滤和排序
- **报价请求**: 分步骤向导式报价请求系统
- **报价管理**: 查看收到的报价、批准/拒绝、跟踪进度
- **收藏夹**: 保存和管理偏好的司机
- **评价系统**: 搬家完成后撰写评价和管理评分

### 司机功能

- **报价响应**: 为收到的报价请求提供详细报价
- **个人资料管理**: 管理公司信息、服务区域、职业信息
- **收到的请求管理**: 通过过滤和搜索进行请求管理
- **评价管理**: 查看和回复收到的评价

### 通用功能

- **多语言支持**: 完全支持韩语（默认）、英语和中文
- **实时通知**: 基于Firebase的实时通知系统
- **社区**: 用户沟通和信息共享空间
- **客户支持**: 查询提交和文件上传支持
- **社交登录**: Google、Kakao、Naver社交登录支持
- **实时聊天**: 客户和司机之间的实时沟通

---

### 基本功能

<table>
  <thead>
    <tr>
      <th align="center">登录和登出</th>
      <th align="center">随机积分</th>
      <th align="center">照片卡创建</th>
      <th align="center">过滤、无限滚动</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/0fd8cbad-fcb1-4ef8-80c3-1f1890872548" alt="登录和登出" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/0fd51b67-6e94-4edc-8a4b-78f71a0319c4" alt="随机积分" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/c69f5edc-e626-4c41-9c80-c4669cd7f5df" alt="照片卡创建" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/eb7fb19e-308b-49d4-9848-e54a34c9e9f4" alt="过滤无限滚动" width="200">
      </td>
    </tr>
  </tbody>
</table>

### 交易功能

<table>
  <thead>
    <tr>
      <th align="center">照片卡销售</th>
      <th align="center">照片卡编辑</th>
      <th align="center">照片卡销售下架</th>
      <th align="center">照片卡购买</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/7746a772-e58f-4ae6-9935-2e3312ae3647" alt="照片卡销售" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/5dbc3427-2def-4205-b05a-c6230767d6fa" alt="照片卡编辑" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/dd3f1d2e-54f2-4765-9a42-d72c9672908c" alt="照片卡销售下架" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/392dda2b-aa79-4715-a9e7-e4ebc360dc10" alt="照片卡购买" width="200">
      </td>
    </tr>
  </tbody>
</table>

### 通知和交换功能

<table>
  <thead>
    <tr>
      <th align="center">通知确认</th>
      <th align="center">交换请求</th>
      <th align="center">买家交换请求取消</th>
      <th align="center">卖家交换批准和取消</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/741a866e-f4cc-4fc3-9eba-54d511b05117" alt="通知确认" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/67c8d1a3-545f-4d07-86c7-cd688d03678f" alt="交换请求" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/f51510c9-ad11-451b-89f4-ea125f667d5a" alt="买家交换请求取消" width="200">
      </td>
      <td align="center">
        <img src="https://github.com/user-attachments/assets/1ae2e3f3-a830-46c5-8ea9-b1737db5f74f" alt="卖家交换批准和取消" width="200">
      </td>
    </tr>
  </tbody>
</table>

---

## 团队构成

<table align="center">
  <tbody>
    <tr>
      <th>团队领导</th>
      <th>副团队领导</th>
      <th>团队成员</th>
      <th>团队成员</th>
      <th>团队成员</th>
      <th>团队成员</th>
      <th>团队成员</th>
    </tr>
    <tr>
      <td align="center">
        <a href="https://github.com/az0319h">
          <img src="https://github.com/az0319h.png?size=100" width="100px" alt="洪成勋"/>
          <br />
          <b>洪成勋</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/fiivxyxxng">
          <img src="https://github.com/fiivxyxxng.png?size=100" width="100px" alt="吴河英"/>
          <br />
          <b>吴河英</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/writing-sky">
          <img src="https://github.com/writing-sky.png?size=100" width="100px" alt="杨成京"/>
          <br />
          <b>杨成京</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/suKyoung25">
          <img src="https://github.com/suKyoung25.png?size=100" width="100px" alt="金秀京"/>
          <br />
          <b>金秀京</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/jbinyim">
          <img src="https://github.com/jbinyim.png?size=100" width="100px" alt="林正彬"/>
          <br />
          <b>林正彬</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Shinmilli">
          <img src="https://github.com/Shinmilli.png?size=100" width="100px" alt="申秀敏"/>
          <br />
          <b>申秀敏</b>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/shimyubin">
          <img src="https://github.com/shimyubin.png?size=100" width="100px" alt="沈有彬"/>
          <br />
          <b>沈有彬</b>
        </a>
      </td>
    </tr>
    <tr>
      <td align="center">
        <a href="https://pointed-afternoon-24b.notion.site/2173fde0e19480728178dce120cbdabb" target="_blank">个人报告</a>
      </td>
      <td align="center">
        <a href="https://immediate-conga-b1b.notion.site/217fb120f2ad80ea85b2e44377f62a58" target="_blank">个人报告</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/3-21788b3cb86180698299f89f0ee4ff53" target="_blank">个人报告</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/21783b8d694c801db314d01f63cd68c4" target="_blank">个人报告</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/217e8b00d07a8036a583ddb33c62345d" target="_blank">个人报告</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/2177a895c9ac8039a81fc7aad5fdbaed" target="_blank">个人报告</a>
      </td>
      <td align="center">
        <a href="https://www.notion.so/1c4c0886ab1380968ff8febb837182c7" target="_blank">个人报告</a>
      </td>
    </tr>
  </tbody>
</table>

<details>
<summary><strong>团队成员主要工作内容</strong></summary>
<div markdown="1">

- **洪成勋**
   - 收到的报价页面
   - 发送的报价列表页面
   - 拒绝的报价列表页面
   - 着陆页面
   - 客户支持页面
   - 收到的报价和发送的报价详细页面编写

- **吴河英**
   - 报价请求页面（搬家类型/搬家日期/地址）
   - 报价请求进行中页面
   - Kakao地址API
   - 通知功能

- **杨成京**
   - 全局状态管理
   - 普通用户/司机登录/注册组件
   - 普通用户登录/注册页面
   - 普通用户个人资料注册/编辑页面
   - 社交登录功能
   - 头部个人资料下拉菜单

- **金秀京**
   - 普通用户/司机个人资料组件
   - 司机登录/注册页面
   - 司机个人资料注册/编辑页面
   - 司机基本信息编辑页面
   - 社交登录功能
   - 账户注销功能实现

- **林正彬**
   - 待处理报价页面
   - 待处理报价详细页面
   - 收到的报价页面
   - 收到的报价详细页面

- **申秀敏**
   - 普通用户/非会员司机搜索页面
   - 普通用户/非会员司机详细页面
   - 司机我的页面

- **沈有彬**
   - 按钮组件实现
   - 收藏司机页面
   - 可撰写评价页面
   - 我撰写的评价页面
   - 多语言功能

</div>
</details>

---

## 系统架构

<img width="3212" height="2023" alt="fa68b90569ee2253" src="https://github.com/user-attachments/assets/b271e73e-7096-412c-8cfa-a7b8318607f2" />

---

## 技术栈

### 前端

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![date-fns](https://img.shields.io/badge/date--fns-770C56?style=flat-square&logo=date-fns&logoColor=white)
![react-icons](https://img.shields.io/badge/react--icons-E91E63?style=flat-square&logo=react&logoColor=white)
![react-hook-form](https://img.shields.io/badge/react--hook--form-EC5990?style=flat-square&logo=reacthookform&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=react-query&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

### 后端

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)
![Cookie-Parser](https://img.shields.io/badge/Cookie--Parser-8A2BE2?style=flat-square&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-00BFFF?style=flat-square&logo=lock&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=flat-square&logo=passport&logoColor=white)

### 部署

![EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazon-ec2&logoColor=white)
![RDS](https://img.shields.io/badge/AWS_RDS-527FFF?style=flat-square&logo=amazon-rds&logoColor=white)
![S3](https://img.shields.io/badge/AWS_S3-569A31?style=flat-square&logo=amazon-s3&logoColor=white)
![Route 53](https://img.shields.io/badge/Route_53-8C4FFF?style=flat-square&logo=amazon-route-53&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=github-actions&logoColor=white)

### 其他

![Sentry](https://img.shields.io/badge/Sentry-362D59?style=flat-square&logo=sentry&logoColor=white)
![DeepL](https://img.shields.io/badge/DeepL-0F2B46?style=flat-square&logo=deepl&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)

---

## 详细功能

### 核心功能详情

### AI报价计算器

- 基于**OpenAI GPT-4**的智能报价计算
- 考虑搬家类型、距离、日期、电梯可用性等
- 提供实时基本报价和AI报价比较
- 配额超限时的备用报价系统

### 实时聊天

- 基于**Firebase实时数据库**
- 实时消息同步
- 未读消息通知
- 聊天室加入/离开管理
- 系统消息支持

### 司机搜索

- 基于位置的搜索
- 服务类型过滤（小型/家庭/办公室）
- 按评分、评价数量、报价数量排序
- 收藏功能
- 无限滚动分页

### 报价请求系统

- 分步骤向导格式
- 实时表单验证
- 草稿保存功能（本地/服务器）
- 进度跟踪

## 多语言支持

本项目完全支持以下语言：

- 🇰🇷 **韩语 (ko)** - 默认语言
- 🇺🇸 **英语 (en)**
- 🇨🇳 **中文 (zh)**

您可以通过URL中的locale参数在右下角的集线器设置中更改语言。

### 翻译文件位置

```
messages/
├── ko.json    # 韩语翻译
├── en.json    # 英语翻译
└── zh.json    # 中文翻译
```

## 认证系统

### 支持的登录方式

- **邮箱/密码**登录
- **Google**社交登录
- **Kakao**社交登录
- **Naver**社交登录

### 用户类型

- **Client** - 普通客户
- **Mover** - 司机

## 响应式设计

- **移动优先**设计
- **平板**和**桌面**优化
- 基于**Tailwind CSS**的响应式布局
- **可访问性**考虑（ARIA标签、键盘导航）

## 性能优化

- 基于**Next.js App Router**的服务器组件
- **React Suspense**和**懒加载**
- **TanStack Query**缓存策略
- **图像优化**（Next.js Image组件）
- **代码分割**和**包优化**

---

## 故障排除

### 1. 韩语输入聊天重复发送问题（Mac / Safari / macOS环境）

**问题情况**

- 在Windows环境中，聊天按一次Enter键正常发送
- 在Mac / Safari / macOS环境中，韩语组合输入后按Enter键时，相同消息发送两次
- 主要在使用组合输入（IME，输入法编辑器）时发生

**原因分析**

- 在macOS中，韩语输入事件流程如下：  
  `keydown → compositionstart → compositionupdate → compositionend → keydown`
- compositionend后，keydown事件再次发生，导致Enter事件被调用两次
- 当前消息发送逻辑仅检测Enter键事件，因此组合完成后Enter被调用两次，导致重复发送

**解决方案**

- 在韩语输入组合期间（`compositionstart` ~ `compositionend`）忽略Enter事件
- 在`onKeyDown`事件处理程序中检查`isComposing`状态以确定消息发送
- 在Windows / Mac / 移动环境中测试了相同行为

```typescript
const [isComposing, setIsComposing] = useState(false);

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
if (e.key === "Enter" && !e.shiftKey && !isComposing) {
e.preventDefault();
sendMessage();
}
};

 <textarea onCompositionStart={() => setIsComposing(true)} onCompositionEnd={() => setIsComposing(false)} onKeyDown={handleKeyDown} />
```

## 2. 报价请求表单草稿保存和同步问题

### 问题情况

- 请求报价时，表单中间状态自动保存到服务器，设计为最初加载服务器保存的草稿，并在表单状态更新时通过`saveDraft`逻辑更新服务器
- 然而，尽管`savedDraft`反映了最新状态，但再次查询草稿时返回之前的状态，导致刷新或页面导航时最新保存状态未反映

### 原因分析

- 使用`debouncedSave`导致时间问题，最新状态未完全反映到服务器
- React Query应用导致之前的草稿缓存持续存在，阻止最新数据反映
- `currentStep`值在上下文中未初始化并重置为之前的状态，导致服务器草稿和本地状态不匹配

### 解决方案

- **移除debouncedSave**：消除时间问题并改为立即保存
- **应用双重保存结构**：表单状态更新时同时更新`localStorage`和服务器草稿 → 在刷新/页面导航时保持相同状态
- **初始加载优先级**：如果存在`localStorage`值则优先使用，否则加载服务器草稿作为初始状态
- **改进currentStep同步**：基于服务器草稿的`currentStep`初始化，并确保客户端更新时本地/服务器都反映

---

## 项目结构

```
src/
├── app/                           # Next.js App Router
│   ├── [locale]/                 # 多语言路由 (ko, en, zh)
│   │   ├── (marketing)/          # 营销页面（着陆页面）
│   │   ├── (with-guest)/         # 仅访客页面（登录/注册）
│   │   ├── (with-public)/        # 公开页面
│   │   │   ├── community/        # 社区
│   │   │   ├── estimate-calculator/ # AI报价计算器
│   │   │   ├── mover-search/     # 司机搜索
│   │   │   └── support/          # 客户支持
│   │   └── (with-protected)/     # 需要认证的页面
│   │       └── dashboard/        # 仪表板（司机用）
│   │       └── favorite-movers/  # 收藏夹
│   │       └── my-quotes/        # 我的报价管理
│   │       └── profile/          # 个人资料管理
│   │       └── received-requests/# 收到的请求管理
│   │       └── request/          # 报价请求
│   │       └── reviews/          # 评价管理
│   └── api/                      # API路由
│       ├── auth/
│       ├── google-maps/
│       ├── openai/
│       └── sentry-example-api/
├── components/                   # 可重用组件
│   ├── common/                   # 通用组件
│   │   ├── Chatbutton.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Pagination.tsx
│   │   ├── Spinner.tsx
│   │   └── ToastPopup.tsx
│   ├── domain/                   # 领域特定组件
│   │   ├── auth/
│   │   ├── community/
│   │   ├── dashboard/
│   │   ├── estimate-calculator/
│   │   ├── favorite-movers/
│   │   ├── marketing/
│   │   ├── mover-search/
│   │   ├── my-quotes/
│   │   ├── profile/
│   │   ├── received-requests/
│   │   ├── request/
│   │   ├── reviews/
│   │   └── support/
│   ├── effects/                  # 动画效果
│   │   ├── PaperPlane.tsx
│   │   └── *.json
│   └── layout/                   # 布局组件
│       ├── ChatRoom.tsx
│       ├── ChatRoomList.tsx
│       ├── DefaultLayout.tsx
│       ├── Header.tsx
│       ├── PageTitle.tsx
│       └── SupportHub.tsx
├── lib/                         # 工具和配置
│   ├── actions/                 # 服务器操作
│   │   ├── favorite.action.ts
│   │   ├── request.action.ts
│   │   └── support.action.ts
│   ├── api/                     # API相关函数
│   │   ├── auth/
│   │   ├── community/
│   │   ├── estimate/
│   │   ├── estimate-calculator/
│   │   ├── favorite/
│   │   ├── mover/
│   │   ├── notification/
│   │   ├── request/
│   │   └── review/
│   ├── firebase/                # Firebase配置
│   │   ├── firebase.ts
│   │   ├── firebaseChat.ts
│   │   └── createChatRoomIfNotExists.ts
│   ├── hooks/                   # 自定义钩子
│   │   ├── useAuthError.ts
│   │   ├── useClientProfilePostForm.ts
│   │   └── useClientProfileUpdateForm.ts
│   ├── schemas/                 # Zod模式
│   │   ├── auth.schema.ts
│   │   ├── client.schema.ts
│   │   ├── dashboard.schema.ts
│   │   └── common/
│   ├── types/                   # TypeScript类型定义
│   │   ├── auth.types.ts
│   │   ├── client.types.ts
│   │   ├── community.types.ts
│   │   ├── estimate.types.ts
│   │   ├── firebase.types.ts
│   │   ├── mover.types.ts
│   │   ├── notification.types.ts
│   │   ├── request.types.ts
│   │   └── review.types.ts
│   └── utils/                   # 工具函数
│       ├── address.util.ts
│       ├── ai.utils.ts
│       ├── auth.util.ts
│       ├── date.util.ts
│       ├── file.util.ts
│       ├── format.util.ts
│       ├── image.util.ts
│       ├── notification.util.ts
│       ├── price.util.ts
│       ├── query.util.ts
│       ├── rating.util.ts
│       ├── search.util.ts
│       └── validation.util.ts
├── context/                     # React Context
│   ├── AuthContext.tsx
│   ├── ChatContext.tsx
│   ├── FormWizardContext.tsx
│   ├── NotificationContext.tsx
│   ├── SupportHubContext.tsx
│   └── ToastConText.tsx
├── constants/                   # 常量定义
│   ├── index.ts
│   ├── mover.constants.ts
│   ├── profile.constants.ts
│   └── received-requests.constants.ts
├── i18n/                       # 国际化设置
│   ├── navigation.ts
│   ├── request.ts
│   └── routing.ts
└── assets/                     # 静态资源
    └── images/
```

---

<div align="center">
  
**值得信赖的专家匹配服务（Moving）**

</div>
