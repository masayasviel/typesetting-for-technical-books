# Markdown → HTML/CSS → PDF

## Requirements

- npm

## Install

```sh
npm install
```

## Usage

```sh
# preview
# 本文のファイルを保存したり、章ディレクトリや原稿ファイルを足したり消したりすると、自動で組み直されます
npm run preview
# generate PDF
npm run build
```

### Output

| 出力 | 内容 |
|---|---|
| `output/book-print.pdf` | 入稿用。仕上がり B5（182×257mm）＋塗り足し上下左右 3mm＋トンボ（角・センター）。用紙サイズは 214×289mm。TrimBox / BleedBox も設定済み |
| `output/book-ebook.pdf` | 電子版。B5 ちょうど、トンボなし |

初回のビルド時に、組版用の Chrome が自動でダウンロードされます。

## Directory

| ファイル | 役割 |
|---|---|
| `vivliostyle.config.js` | 判型・出力先 |
| `lib/chapters.js` | 章ディレクトリを集めて、1 章ずつ 1 つの HTML にまとめる仕組み（ふだんは触らない） |
| `theme/book.css` | デザインのすべて（ページ、本文、見出し、図、コード） |
| `theme/print.css` | 入稿用のトンボと塗り足し（入稿用の出力だけで読み込む） |
| `theme/images/cover-art.svg` | 章扉の右端に半分だけ載せる絵（差し替え用） |
| `manuscript/01-intro/` | 章ディレクトリ（1 章 = 1 ディレクトリ） |
| `manuscript/01-intro/title.md` | 章扉の原稿。章のフロントマターもここに書く |
| `manuscript/01-intro/01-flow.md` など | 本文の原稿（節ごとに 1 ファイル。`00-lead.md` は節より前の導入文） |
| `manuscript/01-intro/images/` | その章の画像 |

## 章の作り方

`manuscript/` の下に章ごとのディレクトリを作り、その中に原稿を置きます。

```text
manuscript/
├── 01-xxx/
│   ├── title.md        … 章扉
│   ├── 00-lead.md      … 節より前の導入文
│   ├── 01-flow.md      … 01~
│   ├── 0x-xxxx.md      … 0x~
│   └── images/         … この章の画像
└── 0x-xxx/
    └── xxxxxx/
```

- **並び順と章番号**
  - 章はディレクトリ名の順に並び、名前の先頭の数字が章番号になります（`04-xxx` → 第 4 章）
  - 順番を入れ替えるときはディレクトリ名の数字を変えます
  - 数字の桁はそろえてください（`01`〜`09`、`10`…）
- **本文**
  - 節ごとに `01-xxx.md` `02-xxx.md` のように1ファイルずつ作り、それぞれ `## 節のタイトル` から書き始めます
  - 節より前の導入文は `00-lead.md` に書きます
  - `title.md` 以外の `.md` をファイル名の順に `title.md` の後ろにつなげて1章として組むので、節番号・図番号・柱は章の中で通しになります
  - 節の順番を入れ替えるときはファイル名の数字を変えます
- **フロントマター**
  - フロントマターは `title.md` の先頭にだけ書きます。本文のファイルには書きません
- **組まないファイル**
  - 名前が `_` で始まる `.md` (`_memo.md` など) は組まれません。下書きやメモに使えます
- **扉のない章**
  - `title.md` を置かなければ、扉なしで本文から始まります
  - そのときは、ファイル名の順で先頭になる本文ファイルにフロントマターを書きます
- **画像**
  - 章ディレクトリの `images/` に置き、原稿からは `./images/fig.png` のように書きます

章番号をディレクトリ名と違う番号にしたいときは、`title.md` のフロントマターで指定します。

```yaml
---
title: '章のタイトル'
html:
  data-chapter: 4
---
```

## 章扉（タイトルページ）

章ディレクトリの `title.md` に、`<div class="cover">` で囲んで書くと、その章の扉ページになります。
扉は右ページに置かれ、本文は次のページ（扉の裏）から始まります。

`title.md` の例：

```md
---
title: 'トランジスタを使った回路を作る'
link:   # Google Fonts を使うときだけ（PCに入っている書体なら不要）
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
```

本文は同じディレクトリに、節ごとのファイルで扉の続きとして書きます。
(下記は `01-introduction.md` の例。節の見出しは `##` で書きます)

```md
## はじめに

この章では……
```

- `<p class="cover-label">` が白い円の中の文字、`#` 見出しが真ん中の章タイトル、リストがその下の目次です
- 目次の番号はリストに書いた番号のまま出ます（`0.` から書けば 0 始まり）
  - 目次は手で書くので、節の名前を変えたら扉も直してください
- `<div>` の直後・`</div>` の直前と、各要素の間には空行を入れます (入れないと Markdown として読まれません)
- 目次が長いときは、章タイトルが自動で上に詰まって 1 ページに収まります

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
| `--cover-art-height` | `180mm` | 絵の高さ（幅は縦横比から決まる） |
| `--cover-art-bottom` | `9mm` | 仕上がり線の下端から絵の下端まで |

全章の既定値を変えるときは、`theme/book.css` の「8. 章扉」の `:root` を書き換えます。

### 書体の指定

書体名を `--cover-label-font: 'Reggae One';` のように書きます。見つからない書体はゴシックで組まれるので、PDFで書体が変わっているか確認してください。

- **PCに入っている書体**：名前を書くだけです (Macのヒラギノやモリサワなど)
- **Google Fonts**：上の例のように、その章のフロントマターの `link` にGoogle FontsのURLを書きます。ビルド時にネットにつながっている必要があります
- **フォントファイル**：`theme/fonts/` に置き、`theme/book.css` の「0. フォント」のところに `@font-face` を書きます。

  ```css
  @font-face { font-family: "Reggae One"; src: url("fonts/ReggaeOne-Regular.ttf"); }
  ```

### 扉絵の差し替え

- `theme/images/cover-art.svg` を同じ名前のファイルで上書きします
- 絵の左右中央が仕上がり線の右端に来るように置かれるので、左半分だけが紙面に載ります
- 線の色や太さはSVGの中で指定します

地の色・円・絵は、入稿用PDFでは塗り足し3mmの外側まで伸び、それより外は切り落とされます。

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

### 囲み記事

コラムや注意書き、チェックリストなどは `<div class="note">` で囲みます。

```md
<div class="note">

**入稿前のチェックリスト**

- 図がページの外にはみ出していないか
- 見出しがページの最終行に取り残されていないか

</div>
```

- 左端にアクセントカラーの線、背景に薄い色が付きます
- 中の段落は字下げしません
- 途中で改ページせず、入りきらなければ囲みごと次のページへ送られます
- `<div>` の直後・`</div>` の直前には空行を入れます（入れないと中身が Markdown として読まれません）

## 調整のヒント

- 判型を A5 にするなら `vivliostyle.config.js` の `size` と、`theme/book.css`・`theme/print.css` の `@page { size }` を変更します。
- 塗り足しの幅は `theme/print.css` の `bleed` で変えられます（同じファイルの `--bleed` も同じ値にします。章扉の地色をどこまで伸ばすかに使います）。
- 章扉の裏を白ページにして本文を右ページから始めたいときは、`theme/book.css` の `.cover` の `break-after: page` を `right` にします。背景色や画像を紙の端まで（断ち切りで）置くときは、仕上がり線の外側 3mm まで伸ばしておきます。
- 版面の余白（`@page` の `margin`）は仕上がり線から測られるので、トンボを付けても本文の位置は変わりません。
- フォントは `theme/book.css` 冒頭の `--serif` `--sans` `--mono` で指定します。PDF にはサブセットで埋め込まれます。
- 見出しに `clear: both` を指定すると、Vivliostyle 11.4 では `float: top` の図と干渉して本文が消えることがありました。回り込みの解除には `clear: right` / `left` を使ってください。
- 図の位置の微調整は、原稿を確定させてから前のページから順に行うのが鉄則です。
