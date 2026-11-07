// @ts-check
import { defineConfig } from '@vivliostyle/cli';

// 全出力で共通の設定
const common = {
  title: 'CSS組版で作る技術同人誌',
  author: 'あなたの名前',
  language: 'ja',           // <html lang="ja"> になり、文節改行などが効く
  size: 'JIS-B5',           // 仕上がりサイズ 182 × 257 mm
  entry: [
    'manuscript/01-intro.md',
    'manuscript/02-images.md',
    'manuscript/03-linebreak.md',
  ],
  workspaceDir: '.vivliostyle',
  vfm: {
    hardLineBreaks: false,  // true にすると原稿の改行がそのまま <br> になる
  },
};

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
