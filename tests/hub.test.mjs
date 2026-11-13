import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

for (const page of ['index.html', 'checklist.html']) {
  test(page + ': noindex, 한국어, manifest', () => {
    const html = read(page);
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
    assert.match(html, /<html lang="ko">/);
    assert.match(html, /rel="manifest"/);
  });
  test(page + ': 외부 스크립트·글꼴·추적 없음', () => {
    const html = read(page);
    assert.doesNotMatch(html, /<script[^>]+src="https?:/);
    assert.doesNotMatch(html, /<link[^>]+href="https?:/);
    assert.doesNotMatch(html, /googletagmanager|analytics|gtag/);
  });
}

test('앱 카드 세 개가 배포 주소와 있는 아이콘을 가리킨다', () => {
  const html = read('index.html');
  for (const url of ['https://irun20000-eng.github.io/baduk-guide/', 'https://irun20000-eng.github.io/guitar-lesson/', 'https://myeonghwa-sanchaek.vercel.app/']) {
    assert.ok(html.includes(`href="${url}"`), url);
  }
  for (const m of html.matchAll(/src="(icons\/[^"]+)"/g)) assert.ok(existsSync(new URL('../' + m[1], import.meta.url)), m[1]);
});

test('manifest 아이콘 파일이 있다', () => {
  const man = JSON.parse(read('manifest.webmanifest'));
  for (const i of man.icons) assert.ok(existsSync(new URL('../' + i.src, import.meta.url)), i.src);
});

test('점검표: 세 앱 탭과 폼이 짝이 맞고 질문 id가 겹치지 않는다', () => {
  const html = read('checklist.html');
  const js = read('checklist.js');
  for (const id of ['baduk', 'art', 'guitar']) {
    assert.ok(html.includes(`id="tab-${id}"`) && html.includes(`id="form-${id}"`), id);
    assert.ok(js.includes(`  ${id}: {`), id);
  }
  const blocks = js.split(/\n  (?=baduk|art|guitar): \{/).slice(1);
  for (const b of blocks) {
    const ids = [...b.matchAll(/\{ id: '([a-z_]+)'/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test('점검표 질문에 학교·학번·점수·실명을 묻는 말이 없다', () => {
  const js = read('checklist.js');
  const labels = [...js.matchAll(/label: '([^']+)'/g), ...js.matchAll(/hint: '([^']+)'/g)].map((m) => m[1]);
  assert.ok(labels.length > 20);
  for (const l of labels) assert.doesNotMatch(l, /학교|학번|점수|성적|실명|전화|주소/, l);
});
