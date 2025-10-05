# 字型檔案說明

此資料夾包含專案使用的自訂字型。

## 字型檔案

- `custom-font.woff2` - 主要字型檔案（建議格式）
- `license.txt` - 字型授權說明

## 支援格式

- WOFF2 (最佳)
- WOFF (後備)
- TTF (最後後備)

## 使用方式

在 CSS 中使用 @font-face 規則載入字型：

```css
@font-face {
    font-family: 'CustomFont';
    src: url('../assets/fonts/custom-font.woff2') format('woff2');
    font-display: swap;
}
```