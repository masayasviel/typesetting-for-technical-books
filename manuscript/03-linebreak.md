---
title: '改行と改ページを制御する'
html:
  data-chapter: 3   # 章番号
link:
  - rel: stylesheet
    href: 'https://fonts.googleapis.com/css2?family=Rampart+One&display=swap'
---

<div class="cover" style="--cover-label-font: 'Rampart One';">

<p class="cover-label">第三の素</p>

# 改行と改ページを制御する

1. 全体の設定（CSSに一度書くだけ）
2. 部分的な調整（原稿の中で指定する）
3. 改ページの制御

</div>

日本語の組版には、行頭に句読点を置かない、括弧が続いたら詰める、といった独特の約束事があります。CSSにはこれらを指定するプロパティがひととおり揃っていて、Vivliostyleで実際に使えます。この章では、テーマのCSSに一度書いておけば済む「全体の設定」と、原稿の中で個別に指定する「部分的な調整」に分けて説明します。

## 全体の設定（CSSに一度書くだけ）

### 禁則処理

`line-break: strict`を指定すると、句読点や閉じ括弧、小書きの仮名（「ゃ」「ッ」など）、長音記号が行頭に来ないように改行位置が調整されます。本文の要素にまとめて指定しておけば十分です。

### 約物の詰めと和欧間スペース

`text-spacing: auto`を指定すると、「（」や「」」などの約物が連続したときの空きが詰められ、和文と欧文・数字の間には四分アキが自動で入ります。原稿にスペースを手で入れる必要はありません。

<div class="compare">
<div class="demo">
<p class="label">text-spacing: none</p>
<p class="nospace">「CSS組版」（Web）で2025年の本。</p>
</div>
<div class="demo">
<p class="label">text-spacing: auto</p>
<p>「CSS組版」（Web）で2025年の本。</p>
</div>
</div>

### ぶら下げ

`hanging-punctuation: allow-end`を指定すると、行末に来た句読点を版面の外にはみ出させて組む「ぶら下げ」ができます。行の文字数が揃いやすくなる一方、版面の右端が不揃いに見えるので、好みで選んでください。このテーマでは指定していません。

### 見出しを文節で改行する

見出しが2行になるとき、単語の途中で改行されると読みにくくなります。`word-break: auto-phrase`を指定すると、Chromeが日本語を文節単位で区切って改行してくれます。`html`要素に`lang="ja"`が必要ですが、設定ファイルで`language: 'ja'`を指定していれば自動で付きます。

<div class="compare">
<div class="demo">
<p class="label">通常</p>
<p class="demo-h">ページフロートで図版の空白を確実になくす方法</p>
</div>
<div class="demo">
<p class="label">word-break: auto-phrase</p>
<p class="demo-h phrase">ページフロートで図版の空白を確実になくす方法</p>
</div>
</div>

## 部分的な調整（原稿の中で指定する）

### 改行させたくない語・改行してよい位置

製品名や数値と単位のように、途中で改行されたくない語は`<span class="nowrap">`で囲みます。逆に、長い複合語やファイル名で改行してよい位置は`<wbr>`で示します。

```md
<span class="nowrap">Vivliostyle CLI</span>を使うと、
src/components/<wbr>BookLayout/<wbr>Chapter.tsx のような
長いパスもきれいに折り返せます。
```

たとえば src/components/<wbr>BookLayout/<wbr>PageFloatContainer.tsx のような長いパスは指定した位置で折り返され、<span class="nowrap">Vivliostyle CLI</span>のような名前は行末に来ても途中で切れません。

### 強制的に改行する

Markdownでは、行末に`\`（またはスペース2つ）を置くと段落を分けずに改行できます。詩や住所、奥付のように行を揃えたい場所で使います。設定で`hardLineBreaks`を有効にすれば、原稿の改行がすべてそのまま反映されます。

<div class="noindent">

CSS組版で作る技術同人誌\
2026年11月7日　初版発行\
著者　あなたの名前

</div>

### 段落末尾の1文字を追い込む

段落の最後の行に1〜2文字だけが残ると見栄えが悪くなります。そういう段落は`<p class="tight">`で囲み、字間をわずかに詰めて前の行に追い込みます。Chromeの`text-wrap: pretty`も短い最終行を避けるように働くので、テーマ全体に指定しておくと手で直す箇所が減ります。

<div class="compare">
<div class="demo narrow">
<p class="label">そのまま</p>
<p class="body">段落の最後に一文字だけ残ると紙面がまばらに見えるので、字間を詰めて追い込みます。</p>
</div>
<div class="demo narrow">
<p class="label">class="tight"</p>
<p class="body tight">段落の最後に一文字だけ残ると紙面がまばらに見えるので、字間を詰めて追い込みます。</p>
</div>
</div>

### 長いURLやコードの折り返し

URLやコードは単語の区切りがないため、そのままでは版面からはみ出してしまいます。このテーマでは、本文中のインラインコードとリンクに`overflow-wrap: anywhere`を、コードブロックに`white-space: pre-wrap`を指定して、はみ出しそうなときだけ任意の位置で折り返すようにしています。

参考：https://docs.vivliostyle.org/ja/reference/supported-css-features/#css-page-floats-and-footnotes

```js:長い行を含むコード
const result = await build({ configPath: './vivliostyle.config.js', logLevel: 'info', bleed: '3mm', cropMarks: true });
```

## 改ページの制御

改ページには`break-before`、`break-after`、`break-inside`の三つのプロパティを使います。このテーマでは次のように指定しています。

- 章（`h1`）は必ず右ページ（奇数ページ）から始める：`break-before: right`
- 見出しの直後では改ページしない：`break-after: avoid`
- 図・表・囲み記事は途中で分割しない：`break-inside: avoid`
- 段落の先頭や末尾の1行だけが別のページに泣き別れないようにする：`orphans: 2; widows: 2`

これらを指定しておけば、ほとんどの改ページは自動でうまくいきます。それでも気になる箇所は、原稿の該当位置に`<div class="pagebreak"></div>`を置いて強制的に改ページします。

<div class="note">

**入稿前のチェックリスト**

- 図がページの外にはみ出していないか、キャプションと図が分かれていないか
- 見出しがページの最終行に取り残されていないか
- 段落末尾に1文字だけの行がないか
- 長いURLやコードが版面からはみ出していないか

</div>
