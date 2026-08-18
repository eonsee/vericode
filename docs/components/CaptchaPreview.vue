<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  placeholder?: string
}>()

const b64Input = ref('')
const answerInput = ref('')
const status = ref('')
const statusType = ref<'success' | 'error' | ''>('')
const previewHtml = ref('<span class="preview-placeholder">等待粘贴验证码 ...</span>')
const hasImage = ref(false)

function setStatus(msg: string, type: 'success' | 'error' | '' = '') {
  status.value = msg
  statusType.value = type
}

function smartParse(raw: string): string | null {
  let s = raw.trim()
  if (!s) return null

  if (/^data:image\/\w+;base64,/.test(s)) {
    return s
  }

  if (s.startsWith('{') && s.includes('"img"')) {
    try {
      const obj = JSON.parse(s)
      if (obj.img) {
        if (obj.uuid) {
          setStatus('UUID: ' + obj.uuid, 'success')
        }
        s = obj.img
      }
    } catch (e) {}
  }

  let mime = 'image/gif'
  if (s.startsWith('iVBOR')) mime = 'image/png'
  else if (s.startsWith('/9j/')) mime = 'image/jpeg'
  else if (s.startsWith('R0lGOD')) mime = 'image/gif'

  return 'data:' + mime + ';base64,' + s
}

function renderImg() {
  const url = smartParse(b64Input.value)
  if (!url) {
    previewHtml.value = '<span class="preview-error">未检测到有效内容</span>'
    hasImage.value = false
    setStatus('请粘贴 base64 或 data URI', 'error')
    return
  }

  const img = new Image()
  img.src = url
  img.alt = '验证码'
  img.onload = () => {
    previewHtml.value = img.outerHTML
    hasImage.value = true
    setStatus('渲染成功 · 请在下方填入答案', 'success')
  }
  img.onerror = () => {
    previewHtml.value = '<span class="preview-error">图片加载失败，请检查 base64 是否完整</span>'
    hasImage.value = false
    setStatus('无法解析，可能是格式不支持或内容截断', 'error')
  }
  previewHtml.value = '<span class="preview-placeholder">加载中 ...</span>'
  hasImage.value = false
}

function onTextareaKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    renderImg()
  }
}

function onTextareaPaste() {
  setTimeout(renderImg, 300)
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    b64Input.value = text
    renderImg()
  } catch (e) {
    setStatus('无法读取剪贴板，请手动 Ctrl+V 粘贴', 'error')
  }
}

function clearAll() {
  b64Input.value = ''
  answerInput.value = ''
  previewHtml.value = '<span class="preview-placeholder">等待粘贴验证码 ...</span>'
  hasImage.value = false
  setStatus('')
}

function copyAnswer() {
  const val = answerInput.value.trim()
  if (!val) {
    setStatus('请先在下方输入答案', 'error')
    return
  }
  navigator.clipboard.writeText(val).then(() => {
    setStatus('已复制答案："' + val + '"', 'success')
  }).catch(() => {
    setStatus('复制失败，请手动复制', 'error')
  })
}
</script>

<template>
  <div class="captcha-tool">
    <div class="captcha-card">
      <div class="tip">
        <strong>粘贴方式（任选一种）：</strong><br />
        ① 从 Bruno 响应里复制 <code>img</code> 的值（纯 base64），自动识别格式<br />
        ② 直接粘贴 <code>data:image/gif;base64,...</code> 完整字符串<br />
        ③ 粘贴整段 <code>{"img":"...","uuid":"..."}</code> JSON，自动提取<br />
        粘贴后按 <b>Ctrl + Enter</b> 或点击按钮即可显示
      </div>

      <textarea
        v-model="b64Input"
        class="captcha-textarea"
        :placeholder="placeholder || '在此粘贴 base64 或 data URI ...'"
        spellcheck="false"
        @keydown="onTextareaKeydown"
        @paste="onTextareaPaste"
      ></textarea>

      <div class="captcha-btns">
        <button class="captcha-btn captcha-btn-primary" @click="renderImg">显示验证码</button>
        <button class="captcha-btn captcha-btn-secondary" @click="pasteFromClipboard">从剪贴板粘贴</button>
        <button class="captcha-btn captcha-btn-danger" @click="clearAll">清空</button>
      </div>

      <div class="captcha-status" :class="statusType" v-if="status">{{ status }}</div>

      <div class="captcha-preview" :class="{ 'has-image': hasImage }" v-html="previewHtml"></div>

      <div class="answer-bar">
        <span class="answer-label">验证码答案</span>
        <input
          v-model="answerInput"
          class="captcha-answer-input"
          placeholder="看图后输入答案 ..."
          spellcheck="false"
        />
        <button class="captcha-btn captcha-btn-primary answer-copy-btn" @click="copyAnswer">复制</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tip {
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 16px;
  line-height: 1.9;
}

.tip code {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  padding: 1px 6px;
  border-radius: 4px;
  font-family: 'JetBrains Mono', Consolas, monospace;
  font-size: 12px;
  font-weight: 500;
}

.tip b {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.captcha-btns {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.preview-placeholder {
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.preview-error {
  color: #ef4444;
  font-size: 13px;
}

.answer-bar {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.answer-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  font-weight: 500;
}

.captcha-answer-input {
  flex: 1;
  padding: 9px 14px;
  background: var(--vp-input-bg-color);
  border: 1px solid var(--vp-input-border-color);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
}

.captcha-answer-input::placeholder {
  color: var(--vp-input-placeholder-color);
}

.captcha-answer-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.answer-copy-btn {
  white-space: nowrap;
}
</style>
