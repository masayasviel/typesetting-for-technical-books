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
| `theme/images/cover-art.svg` | 章扉の右端に半分だけ載せる絵（差し替え用） |
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

## 章扉（タイトルページ）

章の原稿の先頭を `<div class="cover">` で囲むと、その章の扉ページになります。
扉は右ページに置かれ、本文は次のページ（扉の裏）から始まります。

```md
---
title: 'トランジスタを使った回路を作る'
html:
  data-chapter: 1
link:   # Google Fonts を使うときだけ（PC に入っている書体なら不要）
  - rel: stylesheet
    href: 'https://fonts.googleapis.com/css2?family=Reggae+One&display=swap'
---

<div class="cover" style="--cover-label-font: 'Reggae One';">

<p class="cover-label">第一の素</p>

# トランジスタを使った回路を作る

0. はじめに
1. 回路の構成について
2. バイアス回路を作ろう

</div>

ここから本文。

## はじめに
```

- `<p class="cover-label">` が白い円の中の文字、`#` 見出しが真ん中の章タイトル、リストがその下の目次です。
- 目次の番号はリストに書いた番号のまま出ます（`0.` から書けば 0 始まり）。目次は手で書くので、節の名前を変えたら扉も直してください。
- `<div>` の直後・`</div>` の直前と、各要素の間には空行を入れます（入れないと Markdown として読まれません）。
- 目次が長いときは、章タイトルが自動で上に詰まって 1 ページに収まります。

### 章ごとに変えられるもの

`<div class="cover" style="…">` の中に、変えたいものだけ書きます。

| 変数 | 既定値 | 内容 |
|---|---|---|
| `--cover-label-font` | ゴシック | 「第一の素」の書体 |
| `--cover-label-size` | `54pt` | 「第一の素」の文字サイズ |
| `--cover-label-color` | 地の色と同じ | 「第一の素」の文字色 |
| `--cover-font` | ゴシック | 章タイトルと目次の書体 |
| `--cover-color` | `#d36b67` | 地の色 |
| `--cover-ink` | `#fff` | 章タイトルと目次の文字色 |
| `--cover-circle-color` | `#fff` | 左上の円の色 |
| `--cover-art` | `url("images/cover-art.svg")` | 右端に半分だけ載せる絵 |
| `--cover-art-height` | `180mm` | 絵の高さ（幅は縦横比から決まる） |
| `--cover-art-bottom` | `9mm` | 仕上がり線の下端から絵の下端まで |

全章の既定値を変えるときは、`theme/book.css` の「8. 章扉」の `:root` を書き換えます。

### 書体の指定

書体名を `--cover-label-font: 'Reggae One';` のように書きます。見つからない書体はゴシックで組まれるので、PDF で書体が変わっているか確認してください。

- **PC に入っている書体**：名前を書くだけです（Mac のヒラギノやモリサワなど）。
- **Google Fonts**：上の例のように、その章のフロントマターの `link` に Google Fonts の URL を書きます。ビルド時にネットにつながっている必要があります。
- **フォントファイル**：`theme/fonts/` に置き、`theme/book.css` の「0. フォント」のところに `@font-face` を書きます。

  ```css
  @font-face { font-family: "Reggae One"; src: url("fonts/ReggaeOne-Regular.ttf"); }
  ```

### 右端の絵（SVG）の差し替え

- **全章まとめて**：`theme/images/cover-art.svg` を同じ名前のファイルで上書きします。絵の左右中央が仕上がり線の右端に来るように置かれるので、左半分だけが紙面に載ります。縦横比の違う SVG でもかまいません。線の色や太さは SVG の中で指定します。
- **章ごとに別の絵**：`manuscript/images/` に置き、`style="--cover-art: url('images/bottle-2.svg');"` のように指定します（パスは原稿からの相対パス）。

地の色・円・絵は、入稿用 PDF では塗り足し 3mm の外側まで伸び、それより外は切り落とされます。

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
- 塗り足しの幅は `theme/print.css` の `bleed` で変えられます（同じファイルの `--bleed` も同じ値にします。章扉の地色をどこまで伸ばすかに使います）。
- 章扉の裏を白ページにして本文を右ページから始めたいときは、`theme/book.css` の `.cover` の `break-after: page` を `right` にします。背景色や画像を紙の端まで（断ち切りで）置くときは、仕上がり線の外側 3mm まで伸ばしておきます。
- 版面の余白（`@page` の `margin`）は仕上がり線から測られるので、トンボを付けても本文の位置は変わりません。
- フォントは `theme/book.css` 冒頭の `--serif` `--sans` `--mono` で指定します。PDF にはサブセットで埋め込まれます。
- 見出しに `clear: both` を指定すると、Vivliostyle 11.4 では `float: top` の図と干渉して本文が消えることがありました。回り込みの解除には `clear: right` / `left` を使ってください。
- 図の位置の微調整は、原稿を確定させてから前のページから順に行うのが鉄則です。
