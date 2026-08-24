import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';

const $ = selector => document.querySelector(selector);
const currentWindow = getCurrentWindow();
let settings;
let source = '';
let output = '';
let pinned = false;
let activeRequest = 0;
let opening = false;
let resizeTimer;

function setMode(mode) {
  document.body.className = mode === 'dot' ? 'dot-mode' : 'card-mode';
}

function fillSelect(select, items, selectedId) {
  select.innerHTML = '';
  for (const item of items) {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.display_name;
    select.append(option);
  }
  select.value = items.some(item => item.id === selectedId) ? selectedId : (items[0]?.id || '');
}

function lineCount(text) {
  return Math.max(1, String(text).split(/\r?\n/).length);
}

function charCount(text) {
  return Array.from(String(text)).length;
}

function scheduleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    invoke('resize_selection_popup', {
      sourceLen: charCount(source),
      resultLen: charCount(output),
      sourceLines: lineCount(source),
      resultLines: lineCount(output)
    }).catch(() => {});
  }, 90);
}

async function openFromDot() {
  if (opening) return;
  opening = true;
  try {
    await invoke('open_selection_popup');
  } catch (error) {
    console.warn('打开划词翻译失败：', error);
  } finally {
    opening = false;
  }
}

async function startTranslation() {
  const languageId = $('#language').value;
  const additionId = $('#addition').value;
  if (!languageId || !additionId) {
    $('#status').textContent = '请先在设置中配置语言和附加要求';
    return;
  }
  const requestId = ++activeRequest;
  output = '';
  $('#result').innerHTML = '<span class="placeholder">正在翻译…</span>';
  $('#status').textContent = '正在翻译…';
  scheduleResize();
  try {
    await invoke('translate_selection', { languageId, additionId, requestId });
  } catch (error) {
    if (requestId !== activeRequest) return;
    $('#status').textContent = '失败：' + String(error);
  }
}

async function setPinned(next) {
  pinned = next;
  $('#pin').classList.toggle('active', pinned);
  $('#pin').textContent = pinned ? '◆' : '◇';
  $('#pin').title = pinned ? '取消置顶' : '置顶';
  await invoke('set_selection_pinned', { pinned });
}

async function closePopup() {
  activeRequest++;
  pinned = false;
  await invoke('set_selection_pinned', { pinned: false });
  await currentWindow.hide();
}

async function init() {
  await listen('selection-dot-ready', () => {
    activeRequest++;
    pinned = false;
    opening = false;
    $('#pin').classList.remove('active');
    $('#pin').textContent = '◇';
    setMode('dot');
  });

  await listen('selection-start', async event => {
    source = String(event.payload || '');
    output = '';
    settings = await invoke('load_settings');
    fillSelect($('#language'), settings.languages || [], settings.selected_language_id);
    fillSelect($('#addition'), settings.additions || [], settings.selected_addition_id);
    $('#source').textContent = source;
    $('#result').innerHTML = '<span class="placeholder">正在翻译…</span>';
    $('#status').textContent = '';
    setMode('card');
    await startTranslation();
  });

  await listen('selection-delta', event => {
    const payload = event.payload || {};
    if (payload.requestId !== activeRequest) return;
    output += payload.delta || '';
    $('#result').textContent = output;
    scheduleResize();
  });

  await listen('selection-done', event => {
    if (event.payload?.requestId !== activeRequest) return;
    $('#status').textContent = '翻译完成';
    scheduleResize();
  });

  await listen('selection-error', event => {
    const payload = event.payload || {};
    if (payload.requestId !== activeRequest) return;
    $('#status').textContent = '失败：' + (payload.message || '未知错误');
  });

  $('#selection-dot').addEventListener('mouseenter', openFromDot);
  $('#selection-dot').addEventListener('click', openFromDot);
  $('#language').addEventListener('change', startTranslation);
  $('#addition').addEventListener('change', startTranslation);
  $('#settings').onclick = () => invoke('open_settings_window');
  $('#pin').onclick = () => setPinned(!pinned);
  $('#close').onclick = closePopup;
  $('#copy').onclick = async () => {
    if (!output) return;
    await invoke('write_clipboard_text', { text: output });
    $('#status').textContent = '已复制';
  };

  $('#drag-handle').addEventListener('mousedown', event => {
    if (event.button !== 0 || event.target.closest('button,select')) return;
    invoke('start_selection_drag').catch(() => {});
  });

  window.addEventListener('blur', () => {
    if (!pinned && document.body.classList.contains('card-mode')) {
      invoke('dismiss_selection_popup');
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePopup();
  });
  setMode('dot');
}

init().catch(error => {
  setMode('card');
  $('#status').textContent = '初始化失败：' + String(error);
});
