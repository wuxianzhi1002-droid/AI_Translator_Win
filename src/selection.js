import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';

const $ = selector => document.querySelector(selector);
let output = '';
let pinned = false;

async function setPinned(next) {
  pinned = next;
  $('#pin').classList.toggle('active', pinned);
  $('#pin').title = pinned ? '取消置顶' : '保持窗口';
  await invoke('set_selection_pinned', { pinned });
}

async function closePopup() {
  pinned = false;
  await invoke('set_selection_pinned', { pinned: false });
  await getCurrentWindow().hide();
}

async function init() {
  await listen('selection-start', event => {
    $('#source').textContent = event.payload;
    $('#result').textContent = '';
    $('#status').textContent = '正在翻译…';
    output = '';
  });
  await listen('selection-delta', event => {
    output += event.payload;
    $('#result').textContent = output;
  });
  await listen('selection-done', () => {
    $('#status').textContent = '翻译完成';
  });
  await listen('selection-error', event => {
    $('#status').textContent = '失败：' + event.payload;
  });

  $('#close').onclick = closePopup;
  $('#pin').onclick = () => setPinned(!pinned);
  $('#copy').onclick = async () => {
    if (!output) return;
    await invoke('write_clipboard_text', { text: output });
    $('#status').textContent = '已复制';
  };

  window.addEventListener('blur', () => {
    if (!pinned) invoke('dismiss_selection_popup');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePopup();
  });
}

init().catch(error => {
  $('#status').textContent = '初始化失败：' + String(error);
});
