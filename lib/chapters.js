// @ts-check
// 章ディレクトリを 1 章 = 1 つの HTML として組むための仕組み（vivliostyle.config.js から使う）。
//
//   manuscript/
//   ├── 01-intro/      … 章ディレクトリ。名前の順に並び、先頭の数字が章番号になる
//   │   ├── title.md   … 章扉。章のフロントマター（タイトル・Web フォントなど）もここに書く
//   │   ├── 00-lead.md … 本文。title.md 以外の .md はファイル名の順につなげる
//   │   ├── 01-flow.md   （節ごとに 1 ファイル）
//   │   └── images/
//   └── 02-images/
//
// 扉と本文を別々の HTML にすると、柱（章タイトル）や節番号・図番号が本文に引き継がれない。
// そこで、ディレクトリ内の .md をつなげてから 1 つの HTML に変換する。
import fs from 'node:fs';
import path from 'node:path';
import { VFM, readMetadata } from '@vivliostyle/cli';

const TITLE_FILE = 'title.md';

/**
 * 章ディレクトリの原稿ファイル。title.md が先頭、残りはファイル名の順。
 * 名前が _ や . で始まるファイル（下書きなど）は組まない。
 * @param {string} dir
 */
function chapterFiles(dir) {
  const names = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.md') && !/^[_.]/.test(d.name))
    .map((d) => d.name)
    .sort();
  if (names.includes(TITLE_FILE)) {
    names.splice(names.indexOf(TITLE_FILE), 1);
    names.unshift(TITLE_FILE);
  }
  return names.map((name) => path.join(dir, name));
}

/** 章の原稿をつなげた Markdown（ファイルの間には空行を入れる）
 * @param {string} dir */
function readChapter(dir) {
  return chapterFiles(dir)
    .map((file) => fs.readFileSync(file, 'utf8').replace(/^﻿/, '').trimEnd())
    .join('\n\n') + '\n';
}

/**
 * manuscript/ の下の章ディレクトリを、名前の順に Vivliostyle の entry にする。
 * .md を含まないディレクトリは無視する。
 * @param {string} manuscriptDir 原稿のディレクトリ（root からの相対パス）
 * @param {{ root: string }} options root は vivliostyle.config.js のあるディレクトリ
 */
export function chapterEntries(manuscriptDir, { root }) {
  const base = path.resolve(root, manuscriptDir);
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
    .flatMap((name) => {
      const dir = path.join(base, name);
      const [first] = chapterFiles(dir);
      if (!first) return [];
      const chapterNumber = /^\d+/.exec(name)?.[0];
      return [{
        // 先頭のファイル（ふつうは title.md）を章の代表にする。フロントマターはここから読む
        path: path.relative(root, first).split(path.sep).join('/'),
        // 章番号 <html data-chapter="1"> をディレクトリ名の数字から付ける。
        // フロントマターに html: data-chapter: を書けばそちらが優先
        documentMetadataReader: (/** @type {string} */ content) => {
          const metadata = readMetadata(content);
          const html = metadata.html ?? [];
          if (chapterNumber && !html.some((attr) => attr.name === 'data-chapter')) {
            metadata.html = [...html, { name: 'data-chapter', value: String(Number(chapterNumber)) }];
          }
          return metadata;
        },
        // 代表のファイルの代わりに、ディレクトリ内の原稿をつなげたものを VFM で変換する
        documentProcessor: (/** @type {any} */ options, /** @type {any} */ metadata) => {
          const processor = VFM(options, metadata);
          const process = processor.process.bind(processor);
          processor.process = (/** @type {any} */ file) =>
            process({ path: file.path, contents: readChapter(dir) });
          return processor;
        },
      }];
    });
}

/**
 * プレビュー（vivliostyle preview）用。章ディレクトリの原稿が保存されたら、その章を組み直させる。
 * Vivliostyle が見張っているのは代表のファイル（title.md）だけなので、その更新日時を新しくする。
 * 原稿ファイルや章ディレクトリを足したり消したりしたときは、設定ファイルの更新日時を新しくして、
 * 章の一覧から作り直させる。ファイルの中身は変えない。
 * @param {string} manuscriptDir
 * @param {{ root: string, configFile: string }} options
 */
export function watchChapters(manuscriptDir, { root, configFile }) {
  // 設定ファイルは読み直されるたびに実行されるので、見張りは 1 つだけにする
  const key = Symbol.for('typesetting-for-technical-books.watchChapters');
  const state = /** @type {Record<symbol, boolean>} */ (/** @type {unknown} */ (globalThis));
  if (state[key]) return;
  state[key] = true;

  const base = path.resolve(root, manuscriptDir);
  /** @type {Map<string, NodeJS.Timeout>} */
  const timers = new Map();
  /** 少し待ってから更新日時を新しくする（保存 1 回で通知が何度か来るため）
   * @param {string} file */
  const touch = (file) => {
    clearTimeout(timers.get(file));
    timers.set(file, setTimeout(() => {
      timers.delete(file);
      const now = new Date();
      try { fs.utimesSync(file, now, now); } catch { /* 消えていれば何もしない */ }
    }, 100));
  };

  const watcher = fs.watch(base, { recursive: true }, (event, filename) => {
    if (!filename) return;
    const parts = filename.toString().split(path.sep);
    if (parts.length !== 2 || !parts[1].endsWith('.md') || /^[_.]/.test(parts[1])) return;
    const dir = path.join(base, parts[0]);
    const file = path.join(dir, parts[1]);
    const [first] = fs.existsSync(dir) ? chapterFiles(dir) : [];
    if (event === 'change' && first && first !== file) touch(first);   // 本文を保存した
    else if (event === 'rename') touch(configFile);                    // 足した・消した・名前を変えた
  });
  watcher.unref();
}
