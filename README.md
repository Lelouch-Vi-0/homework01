# 元素週期表背誦網站

這是一個簡單的靜態網站，用來練習元素週期表的背誦（Flashcards）、小測驗（Quiz）、考試（Exam）與查閱沉澱表（Precipitation）。

如何本地檢視：

```bash
# 在專案根目錄啟動簡單的伺服器（需要 Python）
python3 -m http.server 8000
# 然後在瀏覽器開啟 http://localhost:8000
```

如何發佈到 GitHub Pages：

- 將變更 commit 並 push 到 GitHub（此 repo：Lelouch-Vi-0/homework01）
- 在 GitHub repos 的 Settings → Pages，選擇 `main` branch 的根目錄發佈
- 幾分鐘後，網站通常會在以下網址可用：

https://Lelouch-Vi-0.github.io/homework01/

備註：本專案在載入元素資料時使用外部 JSON（Bowserinator 的 PeriodicTableJSON），需要能存取 GitHub raw 檔案。

整合 Google Sheets（使用 Apps Script）

- 將 `gas/Code.gs` 的 `SPREADSHEET_ID` 換成你的試算表 ID。
- 在 Google Apps Script 編輯器建立新專案，貼上 `gas/Code.gs`，在 `appsscript.json` 中確認 `runtimeVersion` 為 `V8`。
- 部署 → 新增部署 → 選擇「Web 應用程式」，執行身分選 `自己`，存取權限選 `任何人（包含匿名）`，部署後會得到一個 URL。
- 將得到的 Web App URL 填入 `script.js` 中的 `GAS_URL` 常數。
- 前端按下「儲存進度」會把目前元素、使用者名稱與時間以 POST 送到該 URL，Apps Script 會把資料寫入指定的試算表（Sheet1）。

注意：要讓網頁能直接呼叫 Apps Script（跨域），Web App 必須設定為「任何人（包含匿名）」存取，或使用 OAuth 流程（較複雜）。

考試功能

- 本站提供「考試 (Exam)」模式：10 題多選，預設時限 10 分鐘。完成交卷後會顯示成績。
- 若要將成績儲存到 Google Sheets，請部署 Apps Script（參考上方步驟），並在 `script.js` 中設定 `GAS_URL`。
- 儲存成績包含使用者名稱、分數與時間戳記。

沉澱表（Solubility / Precipitation）

- 網站新增「沉澱表」頁面，列出常見鹽類溶解性（化學式、陽離子、陰離子、可溶/不溶、備註）。
- 可在搜尋欄輸入離子或化學式過濾結果，例如 `Cl-`、`AgCl`。
- 目前內建常見樣本資料（`script.js` 中的 `precipData`），你可擴充此陣列或改為從 API 載入更多條目。
# homework01
# 元素週期表背誦網站

這是一個簡單的靜態網站，用來練習元素週期表的背誦（Flashcards）與基本小測驗（Quiz）。

如何本地檢視：

```bash
# 在專案根目錄啟動簡單的伺服器（需要 Python）
python3 -m http.server 8000
# 然後在瀏覽器開啟 http://localhost:8000
```

如何發佈到 GitHub Pages：

- 將變更 commit 並 push 到 GitHub（此 repo：Lelouch-Vi-0/homework01）
- 在 GitHub repos 的 Settings → Pages，選擇 `main` branch 的根目錄發佈
- 幾分鐘後，網站通常會在以下網址可用：

https://Lelouch-Vi-0.github.io/homework01/

備註：本專案在載入元素資料時使用外部 JSON（Bowserinator 的 PeriodicTableJSON），需要能存取 GitHub raw 檔案。

整合 Google Sheets（使用 Apps Script）

- 將 `gas/Code.gs` 的 `SPREADSHEET_ID` 換成你的試算表 ID。
- 在 Google Apps Script 編輯器建立新專案，貼上 `gas/Code.gs`，在 `appsscript.json` 中確認 `runtimeVersion` 為 `V8`。
- 部署 → 新增部署 → 選擇「Web 應用程式」，執行身分選 `自己`，存取權限選 `任何人（包含匿名）`，部署後會得到一個 URL。
- 將得到的 Web App URL 填入 `script.js` 中的 `GAS_URL` 常數。
- 前端按下「儲存進度」會把目前元素、使用者名稱與時間以 POST 送到該 URL，Apps Script 會把資料寫入指定的試算表（Sheet1）。

注意：要讓網頁能直接呼叫 Apps Script（跨域），Web App 必須設定為「任何人（包含匿名）」存取，或使用 OAuth 流程（較複雜）。

考試功能

- 本站提供「考試 (Exam)」模式：10 題多選，預設時限 10 分鐘。完成交卷後會顯示成績。
- 若要將成績儲存到 Google Sheets，請部署 Apps Script（參考上方步驟），並在 `script.js` 中設定 `GAS_URL`。
- 儲存成績包含使用者名稱、分數與時間戳記。

沉澱表（Solubility / Precipitation）

- 網站新增「沉澱表」頁面，列出常見鹽類溶解性（化學式、陽離子、陰離子、可溶/不溶、備註）。
- 可在搜尋欄輸入離子或化學式過濾結果，例如 `Cl-`、`AgCl`。
- 目前內建常見樣本資料（`script.js` 中的 `precipData`），你可擴充此陣列或改為從 API 載入更多條目。
# homework01
>>>>>>> a47024d (Add exam and precipitation features; Apps Script placeholders)
