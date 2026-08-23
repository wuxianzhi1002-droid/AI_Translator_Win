import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { getCurrentWindow } from '@tauri-apps/api/window';

const $ = selector => document.querySelector(selector);
let settings, output = '', translating = false, autoTimer, lastSubmittedSource = '';

function optionList(element, items, selected) { element.replaceChildren(...items.map(item => { const option = new Option(item.display_name, item.id); option.selected = item.id === selected; return option; })); }
function flattenedModels() { return (settings?.providers || []).flatMap(provider => provider.models.map(model => ({ provider, model, label: `${provider.display_name} · ${model.display_name || model.api_name}` }))); }
function selectedModel() { return flattenedModels().find(entry => entry.model.id === settings.selected_model_id); }
function configurationReady() { return Boolean(settings?.selected_provider_id && settings?.selected_model_id && flattenedModels().length); }
function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text ?? ''; return div.innerHTML; }

function hydrate() {
  optionList($('#language'), settings.languages, settings.selected_language_id);
  optionList($('#addition'), settings.additions, settings.selected_addition_id);
  $('#auto-submit').checked = settings.auto_submit_enabled;
  $('#model-picker span').textContent = selectedModel()?.label || '请选择模型';
  $('#setup-overlay').hidden = configurationReady();
  $('#setup-message').textContent = settings.providers.length ? '请选择一个已经配置 API 密钥的模型。' : '尚未添加服务商、API 密钥和模型。';
  renderModelPicker();
  updateConfigurationState();
}

async function updateConfigurationState() {
  const entry = selectedModel();
  const hasKey = entry ? await invoke('has_api_key', { providerId: entry.provider.id }) : false;
  $('#setup-overlay').hidden = Boolean(entry && hasKey);
  if (entry && !hasKey) $('#setup-message').textContent = '当前服务商还没有 API 密钥，请在设置中补充。';
}

async function refreshClipboardSuggestion() {
  if ($('#source').value.trim()) return;
  try {
    const text = (await invoke('read_clipboard_text')).trim();
    if (text && text.length < 10000) { $('#clipboard-card span').textContent = text; $('#clipboard-card').hidden = false; }
  } catch (_) { /* 剪贴板暂时被其他程序占用时忽略 */ }
}

function renderModelPicker() {
  const root = $('#model-options'); root.innerHTML = '';
  if (!flattenedModels().length) { root.innerHTML = '<div class="empty-state"><b>尚无模型</b><span>请先在设置中添加服务商和模型。</span></div>'; return; }
  for (const provider of settings.providers) {
    if (!provider.models.length) continue;
    const group = document.createElement('section'); group.className = 'model-group'; group.innerHTML = `<h4>${escapeHtml(provider.display_name)}</h4>`;
    for (const model of provider.models) {
      const button = document.createElement('button'); button.className = `model-option${model.id === settings.selected_model_id ? ' selected' : ''}`;
      button.innerHTML = `<span><b>${escapeHtml(model.display_name || model.api_name)}</b><small>${escapeHtml(model.api_name)}</small></span><i>${model.id === settings.selected_model_id ? '✓' : ''}</i>`;
      button.onclick = async () => { settings.selected_provider_id = provider.id; settings.selected_model_id = model.id; await persistSelections(); $('#model-dialog').close(); };
      group.append(button);
    }
    root.append(group);
  }
}

async function persistSelections() {
  settings.selected_language_id = $('#language').value || null; settings.selected_addition_id = $('#addition').value || null; settings.auto_submit_enabled = $('#auto-submit').checked;
  await invoke('save_settings', { settings }); hydrate();
}

async function translate() {
  const source = $('#source').value.trim(), entry = selectedModel();
  if (translating || !source) return; if (!entry) { $('#setup-overlay').hidden = false; return; }
  translating = true; output = ''; lastSubmittedSource = source; $('#result').textContent = ''; $('#status').textContent = '◌ 正在翻译…'; $('#translate').classList.add('busy'); $('#stale').hidden = true;
  try { await invoke('start_translation', { source, providerId: entry.provider.id, modelId: entry.model.id, languageId: $('#language').value, additionId: $('#addition').value, target: 'main' }); }
  catch (error) { finishError(error); }
}
function finishError(error) { translating = false; $('#translate').classList.remove('busy'); $('#status').textContent = `⚠ ${String(error)}`; }

async function init() {
await listen('translation-delta', event => { output += event.payload; $('#result').textContent = output; });
await listen('translation-done', () => { translating = false; $('#translate').classList.remove('busy'); $('#status').textContent = ''; });
await listen('translation-error', event => finishError(event.payload));
await listen('settings-changed', async () => { settings = await invoke('load_settings'); hydrate(); });

$('#translate').onclick = translate;
$('#clear').onclick = () => { $('#source').value = ''; $('#result').textContent = ''; $('#status').textContent = ''; output = ''; $('#stale').hidden = true; };
$('#copy').onclick = () => output && invoke('write_clipboard_text', { text: output });
$('#pin').onclick = async () => { settings.always_on_top = !settings.always_on_top; await getCurrentWindow().setAlwaysOnTop(settings.always_on_top); await persistSelections(); };
$('#settings').onclick = $('#open-settings').onclick = $('#manage-models').onclick = () => invoke('open_settings_window');
$('#model-picker').onclick = () => $('#model-dialog').showModal();
document.querySelectorAll('.dialog-close').forEach(button => button.onclick = () => $('#model-dialog').close());
$('#language').onchange = $('#addition').onchange = persistSelections; $('#auto-submit').onchange = persistSelections;
$('#source').oninput = () => { $('#clipboard-card').hidden = true; $('#stale').hidden = !output || $('#source').value.trim() === lastSubmittedSource; clearTimeout(autoTimer); if ($('#auto-submit').checked && $('#source').value.trim()) autoTimer = setTimeout(translate, 7000); };
$('#clipboard-card').onclick = () => { $('#source').value = $('#clipboard-card span').textContent; $('#clipboard-card').hidden = true; $('#source').dispatchEvent(new Event('input')); };
document.addEventListener('keydown', event => { if (event.ctrlKey && event.key === 'Enter') translate(); if (event.key === 'Escape' && $('#model-dialog').open) $('#model-dialog').close(); });
window.addEventListener('focus', refreshClipboardSuggestion);

settings = await invoke("load_settings");
hydrate();

try {
  await getCurrentWindow().setAlwaysOnTop(settings.always_on_top);
} catch (error) {
  console.warn("设置窗口置顶失败：", error);
}

await refreshClipboardSuggestion();
