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
