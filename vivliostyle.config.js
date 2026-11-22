// @ts-check
import { defineConfig } from '@vivliostyle/cli';
import { chapterEntries, chapterToc, watchChapters } from './lib/chapters.js';

const root = import.meta.dirname;
const configFile = import.meta.filename;

// 目次：まえがきの後ろに、各章のタイトルとページを並べる。title は目次の見出し。
// 目次がいらなければ const toc = false; にする
const toc = chapterToc('manuscript', { title: '目次' });

// 全出力で共通の設定
const common = {
  title: 'CSS組版で作る技術同人誌',
  author: 'あなたの名前',
  language: 'ja',           // <html lang="ja"> になり、文節改行などが効く
  size: 'JIS-B5',           // 仕上がりサイズ 182 × 257 mm
  // manuscript/ の下の章ディレクトリ（01-intro/ など）を名前の順に並べる。
  // 1 ディレクトリ = 1 章。title.md が章扉で、残りの .md はファイル名の順につなげて本文にする。
  // manuscript/preface.md（まえがき）があれば最初に、colophon.md（奥付）があれば最後に置き、まえがきの後ろに目次を置く
  entry: chapterEntries('manuscript', { root, toc }),
  toc,
  workspaceDir: '.vivliostyle',
  vfm: {
    hardLineBreaks: false,  // true にすると原稿の改行がそのまま <br> になる
  },
};

// プレビュー中に本文のファイルを保存したら、その章を組み直す
if (process.argv.slice(2).includes('preview')) {
  watchChapters('manuscript', { root, configFile });
}

export default defineConfig([
  // 1. 入稿用：B5 ＋ 上下左右 3mm の塗り足し ＋ トンボ
  {
    ...common,
    // トンボと塗り足し 3mm は theme/print.css で指定
    theme: ['theme/book.css', 'theme/print.css'],
    output: 'output/book-print.pdf',
  },
  // 2. 電子版：トンボなし（BOOTH などで配布する用）
  {
    ...common,
    theme: 'theme/book.css',
    output: 'output/book-ebook.pdf',
  },
]);
