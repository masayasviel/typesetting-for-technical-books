## プロジェクトの構成

このサンプルのファイル構成は次のとおりです。章ごとにディレクトリを分け、その中に章扉の原稿（`title.md`）と、節ごとに分けた本文の原稿、画像を置きます。章はディレクトリ名の順に並び、名前の先頭の数字がそのまま章番号になります。

```text:ディレクトリ構成
techbook/
├── vivliostyle.config.js   … 判型・出力先
├── lib/chapters.js         … 章ディレクトリを1章にまとめる
├── theme/
│   ├── book.css            … デザインはすべてここ
│   └── print.css           … 入稿用のトンボと塗り足し
└── manuscript/
    ├── 01-intro/           … 1章＝1ディレクトリ
    │   ├── title.md        … 章扉
    │   ├── 00-lead.md      … 節より前の導入文
    │   ├── 01-flow.md      … 1.1 全体の流れ
    │   ├── 02-structure.md … 1.2 プロジェクトの構成
    │   ├── 03-build.md     … 1.3 ビルドとプレビュー
    │   └── images/
    ├── 02-images/
    └── 03-linebreak/
```

本文は節ごとに1ファイルにしています。ファイルを分けても、`title.md`の後ろにファイル名の順でつなげてから組むので、節番号や図番号は章の中で通しになります。

設定ファイルでは判型や出力先を指定します。技術書典などの即売会ではB5判が主流なので、`JIS-B5`を指定しています。出力は2種類で、印刷所に入稿するトンボ付きのPDFと、電子版として配布するトンボなしのPDFを一度に書き出します。

```js:vivliostyle.config.js（抜粋）
const common = {
  title: 'CSS組版で作る技術同人誌',
  language: 'ja',
  size: 'JIS-B5',
  // manuscript/ の下の章ディレクトリを名前の順に並べる
  entry: chapterEntries('manuscript', { root }),
};
export default defineConfig([
  // 入稿用：トンボ＋塗り足し3mm（print.css）
  { ...common, theme: ['theme/book.css', 'theme/print.css'],
    output: 'output/book-print.pdf' },
  // 電子版：トンボなし
  { ...common, theme: 'theme/book.css',
    output: 'output/book-ebook.pdf' },
]);
```

トンボと塗り足しは`theme/print.css`の3行で指定しています。`bleed: 3mm`で仕上がり線の外側に上下左右3mmの塗り足しが付き、`marks: crop cross`で角トンボとセンタートンボが描かれます。

```css:theme/print.css
@page {
  size: 182mm 257mm;   /* 仕上がりサイズ（B5） */
  marks: crop cross;   /* 角トンボ＋センタートンボ */
  bleed: 3mm;          /* 塗り足し 上下左右3mm */
}
```
