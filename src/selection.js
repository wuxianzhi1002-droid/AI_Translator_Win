import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';
const $=s=>document.querySelector(s); let output='';
async function init(){
await listen('selection-start',e=>{$('#source').textContent=e.payload;$('#result').textContent='';$('#status').textContent='正在翻译…';output=''});
await listen('selection-delta',e=>{output+=e.payload;$('#result').textContent=output});
await listen('selection-done',()=>$('#status').textContent='翻译完成');
await listen('selection-error',e=>$('#status').textContent='失败：'+e.payload);
$('#close').onclick=()=>getCurrentWindow().hide();
$('#pin').onclick=async()=>{const w=getCurrentWindow();await w.setAlwaysOnTop(!await w.isAlwaysOnTop())};
$('#copy').onclick=()=>invoke('write_clipboard_text',{text:output});
}
init().catch(error=>{$('#status').textContent='初始化失败：'+String(error)});
