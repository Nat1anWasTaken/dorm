# 北科東校區宿委會

## 目錄

- [簡介](#簡介)
- [如何使用](#如何使用)
  - [本地開發](#本地開發)
  - [Docker](#docker)
  - [部署至-vercel](#部署至-vercel)
  - [新增管理員-使用-scripts](#新增管理員-使用-scripts)
- [License](#license)

## 簡介

北科東校區宿委會 是一個以 Next.js 15 構建的宿舍佈告欄應用，支援公告張貼、編輯、刪除與釘選，並提供 Markdown 編輯與渲染、基本身分驗證與管理員權限。

- 技術棧：Next.js 15、React 19、TypeScript、Tailwind CSS v4、shadcn/ui、@tanstack/react-query、Firebase（Auth + Firestore）
- 前端框架：shadcn/ui（New York 風格）、Lucide React 圖示
- 資料存取：React Query 管理快取與請求；客戶端以 hooks 封裝（見 `src/hooks/`）
- 專案結構：
  - `src/app/`：App Router 頁面與版型
  - `src/components/`：元件（含 `ui/` 與編輯器）
  - `src/lib/`：工具、Firebase 初始化與 API 客戶端
  - `src/hooks/`：React Query hooks（例如公告列表/單筆）
- 匯入別名：`@/` 指向 `src/`

核心功能

- 佈告欄：清單、卡片、釘選、Markdown 內容顯示
- 管理功能：建立、編輯、刪除、釘選（僅管理員可見）
- 驗證：Email/密碼與魔術連結（可設定動態連結網域）

## 如何使用

### 部署至 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FNat1anWasTaken%2Fdorm&env=NEXT_PUBLIC_FIREBASE_API_KEY,NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,NEXT_PUBLIC_FIREBASE_PROJECT_ID,NEXT_PUBLIC_FIREBASE_APP_ID)

### 本地開發

#### 前置需求

- Node.js 20+
- pnpm
- 一個 Firebase 專案

#### 步驟

1. 安裝依賴

   ```bash
   pnpm install
   ```

2. 將 `.env.local.example` 重新命名為 `.env.local` 並填入所需的環境變數

3. 啟動開發伺服器

   ```bash
   pnpm dev
   ```

4. 生產模式（可選）

   ```bash
   pnpm build
   pnpm start`
   ```

### Docker

你可以使用 Docker 來運行這網站

1. 將 `.env.local.example` 重新命名為 `.env.local` 並填入其中的內容

   ```bash
   mv .env.local.example .env.local
   ```

2. 建置並啟動：

   ```bash
   docker compose up --build
   ```

3. 接著，你就可以在 http://localhost:3000/ 訪問到這個網站

4. 關閉網站

- `docker compose down`

### 新增管理員 (使用 scripts/)

這個專案使用 Firebase Custom Claims 來分辨管理員與非管理員帳戶

1. 先讓目標使用者至網站註冊/登入一次（以便建立帳號）
2. 於 Firebase 主控台下載服務帳戶金鑰（JSON）
3. 設定環境變數並執行腳本：
   - `export FIREBASE_SERVICE_ACCOUNT_KEY="/絕對/路徑/至/服務帳戶.json"`
   - `node scripts/set-admin.js user@example.com`
4. 請使用者登出後重新登入，以套用最新 Claims
5. 登入後應可以在佈告欄看見「建立公告」按鈕、卡片上的編輯/刪除/釘選控制

> 非管理員帳戶目前沒有任何功能

## License

本專案之授權條款請見 `LICENSE` 檔案。軟體以「現狀」提供且不附帶任何明示或暗示之擔保；使用者須自行承擔風險與責任。
