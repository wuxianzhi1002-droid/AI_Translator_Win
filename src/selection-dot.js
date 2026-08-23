import { invoke } from '@tauri-apps/api/core';

let opening = false;
const dot = document.querySelector('#dot');

async function openTranslation() {
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

dot.addEventListener('mouseenter', openTranslation);
dot.addEventListener('click', openTranslation);
