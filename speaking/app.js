import { t, language, translatePage, setLanguage } from '/speaking/i18n.js?v=0.1.291';
import { storyContext, appendImportedStories, buildSessionContext } from '/speaking/story-context.js';
import { readStoryFile } from '/speaking/story-import.js';
const $ = id => document.getElementById(id);
const storage = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(`mapkai-speaking:${key}`)) ?? fallback; } catch { return fallback; } },
  set(key, value) { try { localStorage.setItem(`mapkai-speaking:${key}`, JSON.stringify(value)); } catch {} },
};
let voice = storage.get('voice', 'Kore'), patience = storage.get('patience', 800), microphoneId = storage.get('microphone', '');
let configured = false, conversation = null, pending = false, stopping = false, muted = false, importing = false;
let preparing = true, switchingVoice = false;
let generation = 0, timer = null, connectionAbort = null, startedAt = 0;
let record = null, transcript = [];
const history = [];
const elapsed = ms => { const s = Math.floor(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; };
const scrollTo = element => element.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
function currentMaterials() { return storyContext({ title: '', story: $('story').value }); }
function updateMaterials() {
  try {
    const materials = currentMaterials();
    $('material-status').textContent = materials.size ? t(`${materials.size.toLocaleString()} 字背景，会在开始聊天时带入。`) : t('确认输入后开始聊，也可以直接跳过。');
    $('material-status').classList.remove('error');
  } catch (error) { $('material-status').textContent = t(error.message); $('material-status').classList.add('error'); }
}
$('story').addEventListener('input', updateMaterials);
$('story-files').onchange = async () => {
  const files = Array.from($('story-files').files);
  if (!files.length || importing || conversation || pending || stopping) return;
  if (files.length > 6) { $('import-status').textContent = t('每次最多导入 6 份文件。'); $('story-files').value = ''; return; }
  importing = true; setControls(); $('import-status').classList.remove('error');
  try {
    const documents = [];
    for (const file of files) {
      $('import-status').textContent = t(`正在读取 ${file.name}…`);
      documents.push({ name: file.name, text: await readStoryFile(file) });
    }
    $('story').value = appendImportedStories($('story').value, documents);
    $('import-status').textContent = t(`已导入 ${files.length} 份文件。可以修改下面的文字，然后直接开始聊天。`);
  } catch (error) {
    $('import-status').textContent = `${t(error.message || '读取失败，请换成文字文件。')} ${t('本次未修改原有资料。')}`;
    $('import-status').classList.add('error');
  } finally { importing = false; $('story-files').value = ''; updateMaterials(); setControls(); }
};
function notice(message, type = '') { $('notice').hidden = false; $('notice').textContent = t(message); $('notice').className = `notice ${type}`; }
async function syncConfig() {
  try {
    const response = await fetch('/api/speaking/config', { cache: 'no-store' });
    if (!response.ok) throw new Error();
    configured = (await response.json()).configured === true;
    if (!conversation && !pending && !stopping) { notice(configured ? '有背景就带上，没有就随机聊聊。' : '语音服务正在准备中，请稍后重试。', configured ? 'ready' : ''); $('notice').hidden = configured; }
  } catch { if (!conversation && !pending && !stopping) notice('暂时无法检查语音服务，请检查网络后刷新页面。', 'error'); }
}
$('open-setup').onclick = () => { $('voice').value = voice; $('patience').value = String(patience); $('setup-dialog').showModal(); };
$('close-setup').onclick = () => $('setup-dialog').close();
$('save-agent').onclick = () => { voice = $('voice').value; patience = Number($('patience').value); storage.set('voice', voice); storage.set('patience', patience); $('setup-dialog').close(); };
window.addEventListener('focus', () => { void syncConfig(); });
async function requestSession(signal) {
  const response = await fetch('/api/speaking/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}', signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || t('语音服务暂时不可用，请稍后再试。'));
  return result;
}
function setControls() {
  const active = Boolean(conversation) && !stopping && !pending;
  const locked = active || pending || stopping;
  $('studio').classList.toggle('chat-focused', !preparing);
  $('new-chat').hidden = locked || preparing;
  $('start').hidden = $('skip').hidden = locked;
  $('start').disabled = $('skip').disabled = importing;
  $('start').textContent = t('确认输入并 Process');
  $('stop').hidden = !locked && !(record?.ended && !record.reviewRequested && transcript.length); $('stop').disabled = stopping;
  $('stop').textContent = t(pending ? '取消连接' : stopping ? '正在结束…' : '结束聊天');
  $('live-settings').hidden = !active;
  $('live-level').disabled = $('live-voice').disabled = switchingVoice || !active;
  $('mute').hidden = !active; $('open-setup').disabled = locked;
  ['story','story-files','learner-name','level','boundaries','microphone-select'].forEach(id => { $(id).disabled = locked || importing; });
  document.querySelectorAll('[data-message]').forEach(button => { button.disabled = !active || switchingVoice; });
  $('message').disabled = $('send').disabled = !active || switchingVoice;
  $('download').disabled = !transcript.length && !history.length;
}
function addTurn(source, text, eventId, kind) {
  if (!text || !record) return;
  const existing = eventId != null ? transcript.find(turn => turn.eventId === eventId && turn.source === source) : null;
  if (existing) { existing.text = String(text); if (kind) existing.kind = kind; }
  else transcript.push({ source, text: String(text), eventId, kind: kind || 'speech', at: Math.max(0, Date.now() - record.startedAt) });
  renderTranscript();
}
function turnElement(turn) {
  const row = document.createElement('div'); row.className = `turn ${turn.source === 'user' ? 'user' : 'ai'} ${turn.kind === 'control' ? 'control' : ''}`;
  const label = document.createElement('strong'); label.textContent = turn.kind === 'control' ? t('对话引导') : turn.source === 'user' ? 'YOU' : 'KAI · AI';
  const time = document.createElement('time'); time.textContent = elapsed(turn.at); label.append(time);
  const content = document.createElement('p'); content.textContent = turn.text; row.append(label, content); return row;
}
function renderTranscript() {
  const target = $('transcript');
  const nearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 90;
  target.replaceChildren(...transcript.map(turnElement));
  if (!transcript.length) { const empty = document.createElement('p'); empty.className = 'empty'; empty.textContent = t('你们的对话会出现在这里。'); target.append(empty); }
  if (nearBottom) target.scrollTop = target.scrollHeight;
  $('download').disabled = !transcript.length && !history.length;
}
function paragraph(text, className = '') { const p = document.createElement('p'); p.textContent = text; p.className = className; return p; }
function list(items, className = '') { const ul = document.createElement('ul'); ul.className = className; for (const text of items) { const li = document.createElement('li'); li.textContent = text; ul.append(li); } return ul; }
function summaryElements(summary) {
  const content = document.createElement('div');
  content.append(paragraph(summary.overview, 'summary-overview'), list(summary.topics, 'summary-topics'));
  const grid = document.createElement('div'); grid.className = 'summary-grid';
  for (const [key, title] of [['communication','表达与交流'],['depth','观点的深度']]) {
    const section = document.createElement('section'); section.className = 'review-section';
    const heading = document.createElement('h3'); heading.textContent = t(title); section.append(heading, paragraph(summary[key].assessment));
    for (const evidence of summary[key].evidence) { const quote = document.createElement('blockquote'); quote.textContent = evidence; section.append(quote); }
    section.append(list(summary[key].suggestions)); grid.append(section);
  }
  content.append(grid);
  const next = document.createElement('section'); next.className = 'review-section review-next'; const heading = document.createElement('h3'); heading.textContent = t('下一次可以试试'); next.append(heading, list(summary.nextSteps)); content.append(next); return content;
}
function renderSummary() {
  $('summary-panel').hidden = !record?.reviewRequested;
  $('summary-panel').setAttribute('aria-busy', String(record?.summaryState === 'loading'));
  $('summary-status').textContent = record?.summaryState === 'loading' ? t('正在回看这次对话，整理内容、表达和思考深度…') : record?.summaryState === 'error' ? record.error : record?.summary ? t('根据本次对话记录生成。') : t('还没有可总结的发言，聊几句再来看看。');
  $('summary-status').classList.toggle('error', record?.summaryState === 'error');
  $('retry-summary').hidden = record?.summaryState !== 'error';
  $('summary-content').replaceChildren(...(record?.summary ? [summaryElements(record.summary)] : []));
}
function renderHistory() {
  $('session-history').hidden = !history.length; $('history-content').replaceChildren();
  for (const previous of [...history].reverse()) {
    const details = document.createElement('details'); details.className = 'history-session';
    const title = document.createElement('summary'); title.textContent = new Date(previous.startedAt).toLocaleString(language === 'en' ? 'en-GB' : 'zh-CN'); details.append(title);
    const turns = document.createElement('div'); turns.className = 'transcript'; turns.append(...previous.turns.map(turnElement)); details.append(turns);
    if (previous.summary) details.append(summaryElements(previous.summary));
    else if (previous.reviewRequested) {
      details.append(paragraph(previous.summaryState === 'loading' ? t('正在生成总结…') : previous.error || t('还没有可总结的发言，聊几句再来看看。')));
      if (previous.summaryState === 'error') { const retry = document.createElement('button'); retry.className = 'text-button'; retry.textContent = t('重新生成总结'); retry.onclick = () => { void summarize(previous); }; details.append(retry); }
    }
    $('history-content').append(details);
  }
}
async function summarize(target) {
  if (target.summaryState === 'loading') return;
  const turns = target.turns.filter(turn => turn.kind !== 'control').map(({ source, text }) => ({ source: source === 'user' ? 'user' : 'ai', text }));
  if (!turns.length) return;
  target.summaryState = 'loading'; target.error = ''; target.controller = new AbortController();
  renderSummary(); renderHistory();
  try {
    const response = await fetch('/api/speaking/summary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ language: target.language, turns }), signal: AbortSignal.any([target.controller.signal, AbortSignal.timeout(65000)]) });
    const result = await response.json();
    if (!response.ok || !result.summary) throw new Error(result.error || t('总结暂时无法生成。记录还在，可以重试。'));
    target.summary = result.summary; target.summaryState = 'complete';
  } catch (error) { target.summaryState = 'error'; target.error = error.name === 'TimeoutError' ? t('总结生成超时。记录还在，可以重试。') : error.message || t('总结暂时无法生成。记录还在，可以重试。'); }
  finally { target.controller = null; renderSummary(); renderHistory(); }
}
function finishRecord(requestReview = false) {
  if (!record || record.reviewRequested) return;
  record.ended = true; record.reviewRequested = requestReview; record.duration = Math.max(0, Date.now() - record.startedAt);
  renderSummary(); setControls();
  if (requestReview && transcript.length) { void summarize(record); scrollTo($('summary-panel')); }
}
$('retry-summary').onclick = () => { if (record) void summarize(record); };
function resetCall(message = '聊天已停止，记录已保留。点击结束聊天后生成总结。') {
  clearInterval(timer); timer = null; conversation = null; pending = false; stopping = false; muted = false;
  if (!transcript.length) preparing = true;
  $('mute').textContent = t('静音'); $('mute').setAttribute('aria-pressed', 'false'); $('mic-monitor').hidden = true; $('mic-level').value = 0;
  $('orb').className = 'orb'; $('call-status').textContent = t(message); if (!$('notice').classList.contains('error')) notice(message); setControls();
}
async function stop(message, requestReview = false) {
  if (stopping) return;
  stopping = true; pending = false; clearInterval(timer); setControls();
  const current = conversation;
  try { if (current) await current.endSession(); }
  catch { notice('关闭连接时出现问题；如麦克风指示仍亮着，请关闭此页面。', 'error'); }
  finally { generation++; connectionAbort?.abort(); connectionAbort = null; resetCall(requestReview ? '对话已结束。记录已保留，下面会整理本次总结。' : message); finishRecord(requestReview); }
}
function connectionError(error) {
  if (error?.name === 'NotAllowedError') return t('麦克风权限被拒绝。请在浏览器地址栏允许麦克风后重试。');
  if (error?.name === 'NotFoundError') return t('没有找到可用麦克风，请连接麦克风后重试。');
  return error?.message && /Google|免费|密钥|连接|语音|网络/.test(error.message) ? t(error.message) : t('语音尚未连通。请检查网络或稍后重试。');
}
async function start(skipBackground = false) {
  if (pending || conversation || stopping || importing) return;
  if (!configured) { void syncConfig(); notice('语音服务暂未就绪，请稍后再试。', 'error'); return; }
  let materials;
  try { materials = skipBackground ? { items: [], size: 0 } : currentMaterials(); if (!skipBackground && !materials.items.length) throw new Error('请先输入背景或话题，也可以点击右边跳过。'); }
  catch (error) { notice(error.message, 'error'); $('story').focus(); return; }
  preparing = false;
  $('live-level').value = $('level').value; $('live-voice').value = voice; $('live-settings-status').textContent = '';
  const token = ++generation; connectionAbort = new AbortController(); pending = true; setControls();
  $('orb').className = 'orb connecting'; $('call-status').textContent = t('正在连接声音，请允许麦克风…');
  let created, audioContexts;
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone unavailable');
    audioContexts = { output: new AudioContext({ sampleRate: 24000 }), input: new AudioContext({ sampleRate: 16000 }) };
    for (const context of Object.values(audioContexts)) void context.resume().catch(() => {});
    connectionAbort.signal.addEventListener('abort', () => { for (const context of Object.values(audioContexts)) void context.close().catch(() => {}); }, { once: true });
    const { Conversation } = await import('/speaking/gemini.js?v=0.1.291');
    const promptResponse = await fetch('/speaking/agent-prompt.txt?v=0.1.291');
    if (!promptResponse.ok) throw new Error(t('陪练说明加载失败，请刷新页面。'));
    let prompt = await promptResponse.text();
    const context = buildSessionContext({ name: $('learner-name').value.trim(), level: $('level').value, mode: materials.items.length ? 'podcast' : 'open', scenario: 'A relaxed, curious conversation with open-ended questions', focus: '', boundaries: $('boundaries').value.trim(), minutes: null }, materials);
    prompt = prompt.replace('{{session_context}}', () => context);
    const choices = ['a small moment that changed how you see something', 'something you are curious to learn', 'a place you would enjoy exploring and why', 'a recent everyday choice', 'what makes a conversation memorable', 'something you changed your mind about', 'a simple thing you enjoy', 'an idea you would like to try'];
    if (!materials.items.length) prompt += `\nOpening inspiration for this call: ${choices[crypto.getRandomValues(new Uint32Array(1))[0] % choices.length]}. Ask one accessible open-ended question; do not assume the event happened.`;
    prompt += language === 'en' ? '\nThe interface language is English. Do not assume the learner speaks Chinese. Use English unless they use or request another language.' : '\nThe interface language is Chinese. Speak English by default; brief Chinese support is welcome if the learner needs it.';
    if (token !== generation) return;
    if (record?.turns.length) history.push(record);
    record = { id: crypto.randomUUID(), startedAt: Date.now(), language, turns: [], summary: null, summaryState: '', ended: false };
    transcript = record.turns; renderTranscript(); renderSummary(); renderHistory(); $('timer').textContent = '00:00';
    const signal = connectionAbort.signal;
    created = await Conversation.startSession({
      onMicrophone: state => {
        if (token !== generation) return;
        $('mic-monitor').hidden = false;
        if (state.device) { $('mic-device').textContent = t(`正在使用：${t(state.device)}`); void refreshMicrophones(); }
        $('mic-level').value = state.level;
        $('mic-status').textContent = state.waiting ? t('麦克风已开启，等待收音…') : state.quiet ? t('暂未检测到声音。说话时若音量条不动，请结束对话后，在语音设置中切换麦克风。') : state.level > 0.04 ? t('已检测到声音') : t('麦克风已开启，可以直接说话');
      }, microphoneId, audioContexts, onStatus: message => { if (token === generation) $('call-status').textContent = t(message); },
      createToken: () => requestSession(signal), renewToken: () => requestSession(signal), prompt, voice, patience, signal, level: $('level').value,
      openingMessage: materials.items.length ? 'Greet me briefly and ask one easy question connected to my background notes. Follow my answer naturally, one question at a time.' : 'There are no background notes for this conversation. Greet me briefly and start with one friendly open-ended question inspired by the opening suggestion. Do not ask me to upload notes or give a topic first.',
      onConversationCreated: instance => { if (token === generation) conversation = instance; },
      onMessage: event => { if (token === generation) addTurn(event.source, event.message, event.event_id); },
      onModeChange: ({ mode }) => { if (token !== generation) return; $('orb').className = `orb ${mode}`; $('call-status').textContent = mode === 'speaking' ? t('Kai 正在说话，你随时可以开口。') : muted ? t('麦克风已静音，你仍可以打字。') : t('在听，慢慢说。'); },
      onDisconnect: details => { if (token !== generation || stopping) return; generation++; if (details?.reason === 'error') notice('语音连接中断，请检查网络、语音服务状态。', 'error'); resetCall(); finishRecord(); },
      onError: () => { if (token !== generation || stopping) return; notice('连接出现问题，请检查网络后重试。', 'error'); void stop('连接已结束，可以重试。'); },
    });
    if (token !== generation) { await created.endSession(); return; }
    conversation = created; pending = false; startedAt = Date.now(); record.startedAt = startedAt;
    $('orb').className = 'orb listening'; $('call-status').textContent = t('在听，慢慢说。');
    notice('语音已连接 · 停顿后 Kai 会自动回答 · 可以随时结束', 'ready'); setControls(); scrollTo(document.querySelector('.conversation-panel'));
    timer = setInterval(() => { $('timer').textContent = elapsed(Date.now() - startedAt); }, 1000);
  } catch (error) { if (token !== generation) return; notice(connectionError(error), 'error'); await stop('尚未建立语音连接。准备好后再试一次。'); }
}
$('live-level').onchange = () => {
  if (!conversation || pending || stopping || switchingVoice) return;
  try {
    conversation.updateDifficulty($('live-level').value);
    $('level').value = $('live-level').value;
    $('live-settings-status').textContent = t('难度已调整，从下一次回答开始生效。');
  } catch { $('live-level').value = $('level').value; $('live-settings-status').textContent = t('暂时无法调整，请稍后再试。'); }
};
$('live-voice').onchange = async () => {
  if (!conversation || pending || stopping || switchingVoice) return;
  const nextVoice = $('live-voice').value, token = generation, current = conversation;
  if (nextVoice === voice) return;
  switchingVoice = true; setControls(); $('mic-level').value = 0;
  $('live-settings-status').textContent = t('正在切换声音，聊天记录会保留，请稍等…');
  try {
    await current.switchVoice(nextVoice);
    if (token !== generation) return;
    voice = nextVoice; storage.set('voice', voice); $('voice').value = voice;
    $('live-settings-status').textContent = t('声音已切换，可以继续聊。');
  } catch {
    $('live-voice').value = voice;
    if (token === generation) notice('声音切换未完成。记录已保留，可以重新开始聊天。', 'error');
  } finally { switchingVoice = false; setControls(); }
};
$('new-chat').onclick = () => { preparing = true; setControls(); scrollTo(document.querySelector('.background-panel')); $('story').focus(); };
$('start').onclick = () => { void start(false); }; $('skip').onclick = () => { void start(true); };
$('stop').onclick = () => { void stop(undefined, !pending); };
$('mute').onclick = () => {
  if (!conversation || pending) return;
  muted = !muted; conversation.setMicMuted(muted); $('mic-level').value = 0;
  $('mic-status').textContent = muted ? t('麦克风已静音') : t('麦克风已开启，可以直接说话');
  $('mute').textContent = muted ? t('取消静音') : t('静音'); $('mute').setAttribute('aria-pressed', String(muted));
  $('call-status').textContent = muted ? t('麦克风已静音，你仍可以打字。') : t('麦克风已开启，在听。');
};
function sendMessage(text, kind = 'speech') {
  if (!conversation || pending || stopping || !text) return false;
  try { const eventId = conversation.sendUserMessage(text); addTurn('user', text, eventId, kind); return true; }
  catch { notice('这条消息未能发送，请重试或重新连接。', 'error'); return false; }
}
document.querySelectorAll('[data-message]').forEach(button => { button.onclick = () => sendMessage(button.dataset.message, 'control'); });
$('message-form').onsubmit = event => { event.preventDefault(); if (sendMessage($('message').value.trim())) $('message').value = ''; };
function summaryText(summary) { return summary ? [summary.overview, summary.topics.join(' · '), ...['communication','depth'].flatMap(key => [t(key === 'communication' ? '表达与交流' : '观点的深度'), summary[key].assessment, ...summary[key].evidence, ...summary[key].suggestions]), t('下一次可以试试'), ...summary.nextSteps].join('\n\n') : ''; }
$('download').onclick = () => {
  const records = [...history, ...(record ? [record] : [])];
  const content = records.map(item => ['MapKAI Speaking · ' + new Date(item.startedAt).toLocaleString(), '', ...item.turns.map(turn => `[${elapsed(turn.at)}] ${turn.kind === 'control' ? 'Prompt' : turn.source === 'user' ? 'You' : 'Kai (AI)'}: ${turn.text}\n`), summaryText(item.summary) || t('总结尚未生成。')].join('\n')).join('\n\n──────────\n\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = `mapkai-speaking-${new Date().toISOString().slice(0,10)}.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
};
window.addEventListener('pagehide', () => { generation++; connectionAbort?.abort(); if (conversation) void conversation.endSession(); for (const item of [...history, record]) item?.controller?.abort(); });
translatePage(document.documentElement.lang.startsWith('en') ? 'en' : 'zh');
document.querySelectorAll('[data-language]').forEach(button => { button.onclick = () => { setLanguage(button.dataset.language); setControls(); updateMaterials(); renderTranscript(); renderSummary(); renderHistory(); void refreshMicrophones(); }; });
setControls(); updateMaterials(); void syncConfig();
async function refreshMicrophones() {
  if (!navigator.mediaDevices?.enumerateDevices) return;
  try {
    const devices = (await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === 'audioinput' && device.deviceId && !['default','communications'].includes(device.deviceId));
    const select = $('microphone-select'); select.replaceChildren(new Option(t('自动选择实体麦克风'), ''));
    devices.forEach((device,i) => select.add(new Option(device.label || t(`麦克风 ${i+1}`), device.deviceId)));
    if (microphoneId && !devices.some(device => device.deviceId === microphoneId)) select.add(new Option(t('之前选择的麦克风已断开，请重新选择'), microphoneId));
    select.value = microphoneId;
  } catch {}
}
$('microphone-select').onchange = () => { microphoneId = $('microphone-select').value; storage.set('microphone', microphoneId); };
navigator.mediaDevices?.addEventListener('devicechange', refreshMicrophones); void refreshMicrophones();
