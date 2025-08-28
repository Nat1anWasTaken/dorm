# 北科東校區宿委會 公告網站

## 目錄

- [如何使用](#如何使用)
  - [本地開發](#本地開發)
  - [Docker](#docker)
  - [部署至-vercel](#部署至-vercel)
  - [新增管理員-使用-scripts](#新增管理員-使用-scripts)
- [License](#license)

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
   pnpm start
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

### Firebase 自訂密碼重設頁面設定

本專案包含自訂的密碼重設頁面：

1. **進入 Firebase 主控台**
   - 前往 https://console.firebase.google.com
   - 選擇您的專案

2. **開啟驗證設定**
   - 點擊左側選單的「Authentication」
   - 切換到「Templates」分頁

3. **設定密碼重設範本**
   - 找到「Password reset」範本
   - 點擊編輯（鉛筆）圖示
   - 在「Action URL」欄位輸入：`https://yourdomain.com/login/reset-password`
     - 將 `yourdomain.com` 替換為您的實際網域
     - 本地開發時使用：`http://localhost:3000/login/reset-password`

4. **儲存變更**
   - 點擊「Save」套用設定

## License

本專案之授權條款請見 `LICENSE` 檔案。軟體以「現狀」提供且不附帶任何明示或暗示之擔保；使用者須自行承擔風險與責任。
