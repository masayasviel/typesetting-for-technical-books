# 技術同人誌スターター（Markdown → HTML/CSS → PDF）

Vivliostyle CLI を使って、Markdown 原稿を CSS で組版し PDF にするための雛形です。
B5・横組み・左綴じ・章は右ページ始まり、の設定になっています。
`npm run build` で、入稿用（トンボ＋塗り足し 3mm）と電子版（トンボなし）の 2 つの PDF を同時に出力します。

## 使い方

Node.js 22.12 以上が必要です。

```bash
npm install
npm run preview      # ブラウザでライブプレビュー（入稿用の設定で表示）
npm run build        # 下の 2 つの PDF を生成
```

| 出力 | 内容 |
|---|---|
| `output/book-print.pdf` | 入稿用。仕上がり B5（182×257mm）＋塗り足し上下左右 3mm＋トンボ（角・センター）。用紙サイズは 214×289mm。TrimBox / BleedBox も設定済み |
| `output/book-ebook.pdf` | 電子版。B5 ちょうど、トンボなし |

初回のビルド時に、組版用の Chrome が自動でダウンロードされます。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `vivliostyle.config.js` | 判型・章の並び順・出力先 |
| `theme/book.css` | デザインのすべて（ページ、本文、見出し、図、コード） |
| `theme/print.css` | 入稿用のトンボと塗り足し（入稿用の出力だけで読み込む） |
| `manuscript/*.md` | 原稿（1 章 1 ファイル） |
| `manuscript/images/` | 画像 |

章を増やすときは `manuscript/` に Markdown を追加し、`vivliostyle.config.js` の `entry` に足します。
章番号は各ファイル先頭のフロントマターで指定します。

```yaml
---
title: '章のタイトル'
html:
  data-chapter: 4
---
```

## 原稿で使える記法（早見表）

### 画像

```md
![キャプション](./images/fig.png){id="fig-xxx"}                 その場に置く
![キャプション](./images/fig.png){id="fig-xxx" class="top"}     ページ上端へ（おすすめ）
![キャプション](./images/fig.png){id="fig-xxx" class="bottom"}  ページ下端へ
![キャプション](./images/fig.png){id="fig-xxx" class="right w30"}  右に置いて本文を回り込ませる
![キャプション](./images/fig.png){id="fig-xxx" class="newpage"} 改ページして置く
本文からの参照は [](#fig-xxx) → 「図2.1」に置き換わる
```

幅は `w30` `w40` `w50` `w60` `w70` `w80`（回り込みでは `w30` `w50`）。
表やコードをページ上端に送りたいときは `<div class="top">` … `</div>` で囲みます（前後に空行を入れる）。

### 改行・改ページ

| 書き方 | 効果 |
|---|---|
| 行末に `\` | 段落を分けずに改行 |
| `<span class="nowrap">…</span>` | この語は途中で改行しない |
| `<wbr>` | ここで改行してよい（長いパスなど） |
| `<p class="tight">…</p>` | 字間を詰めて最終行の 1〜2 文字を追い込む |
| `<div class="noindent">` … `</div>` | 字下げしない（奥付など） |
| `<div class="pagebreak"></div>` | 強制改ページ |

禁則処理、約物の詰め、和欧間スペース、見出しの文節改行、見出し直後の改ページ回避、
孤立行の回避（orphans / widows）は、`theme/book.css` で全体に設定済みです。

## 調整のヒント

- 判型を A5 にするなら `vivliostyle.config.js` の `size` と、`theme/book.css`・`theme/print.css` の `@page { size }` を変更します。
- 塗り足しの幅は `theme/print.css` の `bleed` で変えられます。背景色や画像を紙の端まで（断ち切りで）置くときは、仕上がり線の外側 3mm まで伸ばしておきます。
- 版面の余白（`@page` の `margin`）は仕上がり線から測られるので、トンボを付けても本文の位置は変わりません。
- フォントは `theme/book.css` 冒頭の `--serif` `--sans` `--mono` で指定します。PDF にはサブセットで埋め込まれます。
- 見出しに `clear: both` を指定すると、Vivliostyle 11.4 では `float: top` の図と干渉して本文が消えることがありました。回り込みの解除には `clear: right` / `left` を使ってください。
- 図の位置の微調整は、原稿を確定させてから前のページから順に行うのが鉄則です。
