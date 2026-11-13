'use strict';
// 가족 사용 점검표. 질문 정의 → 화면 그리기 → 기기 안 저장 → 결과 글 만들기.

const FUN = ['1 별로', '2', '3 보통', '4', '5 아주 재미있음'];
const YN = ['예', '조금', '아니요'];

const FORMS = {
  baduk: {
    name: '바둑 첫걸음',
    questions: [
      { id: 'reach', type: 'text', label: '어디까지 했나요?', hint: '예: 1단원 5차시, 따내기 바둑 2판' },
      { id: 'alone', type: 'radio', label: '설명을 혼자 읽고 따라 했나요?', options: YN },
      { id: 'stuck', type: 'text', label: '막히거나 그만두고 싶었던 차시', hint: '차시 이름이나 번호, 없으면 비워요' },
      { id: 'words', type: 'text', label: '어려웠던 말', hint: '예: 활로, 단수' },
      { id: 'hint', type: 'radio', label: '힌트를 자주 눌렀나요?', options: ['거의 안 누름', '가끔', '자주'] },
      { id: 'ai', type: 'radio', label: '돌돌이와 둔 판', options: ['거의 이김', '반반', '거의 짐', '안 둬 봄'] },
      { id: 'ai_feel', type: 'radio', label: '돌돌이 세기는?', options: ['너무 쉬움', '알맞음', '너무 어려움', '모름'] },
      { id: 'sound', type: 'radio', label: '돌 놓는 소리와 진동', options: ['좋음', '소리가 큼', '소리가 작음', '껐음'] },
      { id: 'review', type: 'radio', label: '「틀린 문제 다시 풀기」를 써 봤나요?', options: ['써 봄', '못 찾음', '안 써 봄'] },
      { id: 'fun', type: 'radio', label: '재미', options: FUN },
      { id: 'again', type: 'radio', label: '내일 또 하고 싶나요?', options: YN },
      { id: 'memo', type: 'area', label: '그 밖에 하고 싶은 말', hint: '화면이 이상했던 곳, 바라는 것' },
    ],
  },
  art: {
    name: '명화 산책',
    questions: [
      { id: 'works', type: 'text', label: '본 그림', hint: '예: 씨름, 별이 빛나는 밤' },
      { id: 'wait', type: 'radio', label: '「먼저 보기」 기다리는 시간', options: ['알맞음', '길었음', '짧았음'] },
      { id: 'find', type: 'radio', label: '「찾아보기」 지점을 다 찾았나요?', options: ['혼자 다 찾음', '힌트 보고 찾음', '못 찾고 넘김'] },
      { id: 'cardlen', type: 'radio', label: '카드 글 길이', options: ['알맞음', '길었음', '더 읽고 싶었음'] },
      { id: 'words', type: 'text', label: '어려웠던 말', hint: '예: 원근법, 화첩' },
      { id: 'zoom', type: 'radio', label: '손가락으로 그림 확대가 잘 됐나요?', options: ['잘 됨', '가끔 안 됨', '안 됨'] },
      { id: 'best', type: 'text', label: '가장 좋았던 그림과 이유' },
      { id: 'fun', type: 'radio', label: '재미', options: FUN },
      { id: 'again', type: 'radio', label: '다른 그림도 보고 싶나요?', options: YN },
      { id: 'memo', type: 'area', label: '그 밖에 하고 싶은 말', hint: '보고 싶은 화가나 그림이 있으면 적어 주세요' },
    ],
  },
  guitar: {
    name: '여섯줄',
    questions: [
      { id: 'calib', type: 'radio', label: '「보정 도우미」를 끝까지 했나요?', options: ['끝까지 함', '중간에 멈춤', '안 해 봄'] },
      { id: 'tuner', type: 'radio', label: '튜너가 여섯 줄 이름을 맞게 보여 줬나요?', options: ['다 맞음', '일부 틀림', '잘 안 잡힘'] },
      { id: 'tuner_bad', type: 'text', label: '잘 안 잡힌 줄', hint: '예: 6번줄(가장 굵은 줄)' },
      { id: 'judge', type: 'radio', label: '맞게 쳤는데 틀렸다고 나온 적', options: ['거의 없음', '가끔', '자주'] },
      { id: 'judge_where', type: 'text', label: '그런 일이 있었던 레슨이나 코드', hint: '예: 4-2, C 코드' },
      { id: 'reach', type: 'text', label: '어디까지 했나요?', hint: '예: 2단계 레슨 3' },
      { id: 'place', type: 'radio', label: '연습한 곳', options: ['조용한 방', 'TV나 사람 소리 있음', '밖'] },
      { id: 'fun', type: 'radio', label: '재미', options: FUN },
      { id: 'memo', type: 'area', label: '그 밖에 하고 싶은 말' },
    ],
  },
};

const KEY = 'ddalkkak-checklist-v1';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
let saved = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch { /* 저장 공간 없음 */ } };

function el(tag, attrs = {}, ...kids) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') n.textContent = v; else n.setAttribute(k, v);
  }
  for (const k of kids) if (k) n.append(k);
  return n;
}

function renderForm(appId) {
  const def = FORMS[appId];
  const form = document.getElementById('form-' + appId);
  form.replaceChildren(el('h2', { text: def.name + ' 점검' }));
  def.questions.forEach((q) => {
    const name = appId + '-' + q.id;
    if (q.type === 'radio') {
      const box = el('div', { class: 'choices' });
      q.options.forEach((o) => {
        box.append(el('label', {}, el('input', { type: 'radio', name, value: o }), document.createTextNode(' ' + o)));
      });
      form.append(el('fieldset', { class: 'q' }, el('legend', { text: q.label }), box));
    } else {
      const id = 'f-' + name;
      const lab = el('label', { for: id, text: q.label });
      if (q.hint) lab.append(document.createTextNode(' '), el('small', { text: q.hint }));
      const input = q.type === 'area'
        ? el('textarea', { id, name, maxlength: '500' })
        : el('input', { type: 'text', id, name, maxlength: '120' });
      form.append(el('div', { class: 'q' }, lab, input));
    }
  });
  restore(form);
}

function restore(form) {
  for (const f of form.elements) {
    if (!f.name) continue;
    const v = saved[f.name];
    if (v === undefined) continue;
    if (f.type === 'radio') f.checked = f.value === v; else f.value = v;
  }
}

function onInput(e) {
  const f = e.target;
  if (!f.name) return;
  if (f.type === 'radio' && !f.checked) return;
  saved[f.name] = f.value;
  save();
}

function currentApp() {
  return document.querySelector('[role=tab][aria-selected=true]').id.replace('tab-', '');
}

function buildText(appId) {
  const def = FORMS[appId];
  const lines = [`[가족 사용 점검] ${def.name}`];
  const who = [saved.nick, saved.grade, saved.device].filter(Boolean).join(' / ');
  if (who) lines.push('- 사용자: ' + who);
  lines.push('- 날짜: ' + new Date().toLocaleDateString('ko-KR'));
  let answered = 0;
  def.questions.forEach((q) => {
    const v = (saved[appId + '-' + q.id] || '').trim();
    if (!v) return;
    answered += 1;
    lines.push(`- ${q.label} → ${v}`);
  });
  return { text: lines.join('\n'), answered };
}

async function copyResult() {
  const appId = currentApp();
  const { text, answered } = buildText(appId);
  const status = document.getElementById('status');
  if (!answered) { status.textContent = '아직 고른 답이 없어요.'; return; }
  const out = document.getElementById('out');
  out.value = text;
  try {
    await navigator.clipboard.writeText(text);
    out.hidden = true;
    status.textContent = `복사했어요 (${answered}개 답). 대화창에 붙여 넣어 주세요.`;
  } catch {
    out.hidden = false;
    out.select();
    status.textContent = '자동 복사가 안 돼요. 아래 글을 길게 눌러 복사해 주세요.';
  }
}

function resetApp() {
  const appId = currentApp();
  if (!confirm(FORMS[appId].name + ' 점검표를 비울까요?')) return;
  Object.keys(saved).filter((k) => k.startsWith(appId + '-')).forEach((k) => delete saved[k]);
  save();
  renderForm(appId);
  document.getElementById('status').textContent = '비웠어요.';
}

function selectTab(btn) {
  document.querySelectorAll('[role=tab]').forEach((t) => {
    const on = t === btn;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
  });
  document.getElementById('status').textContent = '';
  document.getElementById('out').hidden = true;
}

Object.keys(FORMS).forEach(renderForm);
restore(document.getElementById('who'));
document.addEventListener('input', onInput);
document.addEventListener('change', onInput);
document.querySelectorAll('[role=tab]').forEach((t, i, all) => {
  t.tabIndex = i === 0 ? 0 : -1;
  t.addEventListener('click', () => selectTab(t));
  t.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = all[(i + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length];
    selectTab(next); next.focus();
  });
});
document.querySelectorAll('form').forEach((f) => f.addEventListener('submit', (e) => e.preventDefault()));
document.getElementById('copy').addEventListener('click', copyResult);
document.getElementById('reset').addEventListener('click', resetApp);
const hash = location.hash.replace('#', '');
if (FORMS[hash]) selectTab(document.getElementById('tab-' + hash));
