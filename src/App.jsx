import { useEffect, useMemo, useRef, useState } from 'react'
import { BACKGROUND_LIBRARY } from './Backgrounds/library.js'
import lightThemeLogo from '../light-logo.png'
import darkThemeLogo from '../dark-logo.png'

const ASPECT_RATIOS = [
  { label: 'Auto', value: 'auto' },
  { label: '16:9', value: '16:9' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '9:16', value: '9:16' },
]

const WINDOW_FRAME_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: 'macOS', value: 'macos' },
  { label: 'Windows', value: 'windows' },
]

const EDITOR_MODES = [
  { label: 'Media', value: 'media' },
  { label: 'Code', value: 'code' },
]

const CODE_CANVAS_MAX_HEIGHT = 30000

const DEFAULT_CODE_SNIPPET = `function FrameDropCard({ code }: { code: string }) {
  return (
    <div className="card">
      <pre>{code}</pre>
    </div>
  )
}

export default FrameDropCard`

const UNSPLASH_PRESET_BASE = [
  {
    label: 'Nature',
    urls: [
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Abstract',
    urls: [
      'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Architecture',
    urls: [
      'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Dark',
    urls: [
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Minimal',
    urls: [
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Space',
    urls: [
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Forest',
    urls: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Ocean',
    urls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'City',
    urls: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&h=1080&q=80&sat=-40',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Scenery',
    urls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'F1',
    urls: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Sunset',
    urls: [
      'https://images.unsplash.com/photo-1472120435266-53107fd0c44a?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&h=1080&q=80&sat=20',
    ],
  },
  {
    label: 'Clouds',
    urls: [
      'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Aesthetics',
    urls: [
      'https://images.unsplash.com/photo-1519606247872-0440aae9b827?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1493244040629-496f6d136cc3?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
  {
    label: 'Mountains',
    urls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=1920&h=1080&q=80',
      'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1920&h=1080&q=80',
    ],
  },
]

const SOLID_SWATCHES = ['#0b0d10', '#73a5ca', '#1f2937', '#334155', '#475569', '#e2e8f0', '#f8fafc', '#f4d35e', '#ff6b6b', '#546b41', '#DCCCAC', '#F45B26']

const GRADIENT_SWATCHES = [
  { angle: 135, stops: ['#0f2027', '#203a43', '#2c5364'] },
  { angle: 145, stops: ['#ff416c', '#ff4b2b'] },
  { angle: 120, stops: ['#396afc', '#2948ff'] },
  { angle: 135, stops: ['#11998e', '#38ef7d'] },
  { angle: 135, stops: ['#8e2de2', '#4a00e0'] },
  { angle: 150, stops: ['#f6d365', '#fda085'] },
]

const AI_PROMPT_CHIPS = [
  'Flower valley at golden hour',
  'Dark stormy ocean cliffs',
  'Minimal Japanese zen garden',
  'Neon city in the rain',
  'Soft pastel abstract waves',
  'Misty mountain sunrise',
]

const THEME_STORAGE_KEY = 'framedrop-theme'

function getInitialTheme() {
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function aspectValueToRatio(value, uploadedMeta) {
  if (value === 'auto') {
    if (uploadedMeta?.width && uploadedMeta?.height) return uploadedMeta.width / uploadedMeta.height
    return 16 / 9
  }

  const [w, h] = value.split(':').map(Number)
  return w / h
}

function gradientToCss(gradient) {
  return `linear-gradient(${gradient.angle}deg, ${gradient.stops.join(', ')})`
}

function buildKeylessPollinationsUrl(prompt, model = 'flux') {
  const seed = Math.floor(Math.random() * 1_000_000_000)
  const params = new URLSearchParams({
    width: '1920',
    height: '1080',
    model,
    nologo: 'true',
    seed: String(seed),
  })

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`
}

function buildGenPollinationsUrl(prompt, model = 'flux') {
  const seed = Math.floor(Math.random() * 1_000_000_000)
  const params = new URLSearchParams({
    width: '1920',
    height: '1080',
    model,
    nologo: 'true',
    seed: String(seed),
  })

  return `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params.toString()}`
}

function verifyImageUrl(url, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const timer = window.setTimeout(() => reject(new Error('Timed out waiting for image.')), timeoutMs)

    img.onload = () => {
      window.clearTimeout(timer)
      resolve(true)
    }

    img.onerror = () => {
      window.clearTimeout(timer)
      reject(new Error('Failed to load image URL.'))
    }

    img.src = url
  })
}

async function resolveFreeGeneratedImageUrl(prompt) {
  const candidates = [
    buildKeylessPollinationsUrl(prompt, 'flux'),
    buildGenPollinationsUrl(prompt, 'flux'),
    buildKeylessPollinationsUrl(prompt, 'turbo'),
  ]

  for (const candidate of candidates) {
    try {
      await verifyImageUrl(candidate)
      return candidate
    } catch {
      // Try next AI endpoint/model.
    }
  }

  throw new Error('All AI generation endpoints are currently unavailable.')
}

function loadImage(src, crossOrigin = true) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (crossOrigin) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Image failed to load'))
    img.src = src
  })
}

function isRemoteHttpUrl(src) {
  return /^https?:\/\//i.test(src)
}

async function loadBackgroundImage(src) {
  if (isRemoteHttpUrl(src)) {
    return await loadImage(src, true)
  }
  return await loadImage(src, false)
}

function loadVideoMeta(src) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () =>
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
      })
    video.onerror = () => reject(new Error('Video failed to load'))
    video.src = src
  })
}

function selectRecorderMimeType() {
  if (!window.MediaRecorder) return ''
  const candidates = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4;codecs=h264,aac',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ]
  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) || ''
}

function getVideoDownloadMeta(blob) {
  const type = blob.type || 'video/webm'
  if (type.includes('mp4')) return { filename: 'framedrop.mp4', label: 'framedrop.mp4' }
  return { filename: 'framedrop.webm', label: 'framedrop.webm' }
}

function drawImageCover(ctx, image, targetW, targetH) {
  const targetRatio = targetW / targetH
  const imageRatio = image.width / image.height

  let sx = 0
  let sy = 0
  let sWidth = image.width
  let sHeight = image.height

  if (imageRatio > targetRatio) {
    sWidth = image.height * targetRatio
    sx = (image.width - sWidth) / 2
  } else {
    sHeight = image.width / targetRatio
    sy = (image.height - sHeight) / 2
  }

  ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH)
}

function buildCanvasDimensions(aspect, uploadedMeta) {
  if (aspect === 'auto' && uploadedMeta?.width && uploadedMeta?.height) {
    const maxDimension = 2000
    const scale = Math.min(1, maxDimension / Math.max(uploadedMeta.width, uploadedMeta.height))
    return {
      width: Math.round(uploadedMeta.width * scale),
      height: Math.round(uploadedMeta.height * scale),
    }
  }

  if (aspect === '1:1') return { width: 1920, height: 1920 }
  if (aspect === '4:3') return { width: 1920, height: 1440 }
  if (aspect === '9:16') return { width: 1080, height: 1920 }
  return { width: 1920, height: 1080 }
}

function getCodeLayoutMetrics(codeText, contentWidth) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return {
      gutterWidth: Math.max(44, Math.min(72, contentWidth * 0.1)),
      textMaxWidth: Math.max(40, contentWidth - Math.max(44, Math.min(72, contentWidth * 0.1)) - 24),
      fontSize: Math.max(12, Math.min(24, contentWidth * 0.022)),
      lineHeight: Math.round(Math.max(12, Math.min(24, contentWidth * 0.022)) * 1.55),
      padTop: Math.max(14, contentWidth * 0.03),
      padBottom: 36,
      wrappedLinesBySource: codeText.split('\n').map((line) => [line]),
      contentHeight: 520,
    }
  }

  const gutterWidth = Math.max(44, Math.min(72, contentWidth * 0.1))
  const textMaxWidth = Math.max(40, contentWidth - gutterWidth - 24)
  const fontSize = Math.max(12, Math.min(24, contentWidth * 0.022))
  const lineHeight = Math.round(fontSize * 1.55)
  const padTop = Math.max(14, contentWidth * 0.03)
  const padBottom = 36

  ctx.font = `${fontSize}px SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
  const wrappedLinesBySource = codeText.split('\n').map((line) => wrapTextLine(ctx, line, textMaxWidth))
  const visualLineCount = wrappedLinesBySource.reduce((sum, line) => sum + line.length, 0)

  // Keep extra terminal space so descenders on the last painted line never clip.
  const contentHeight = Math.max(
    260,
    Math.ceil(padTop + padBottom + fontSize + Math.max(0, visualLineCount - 1) * lineHeight + lineHeight * 1.2),
  )

  return {
    gutterWidth,
    textMaxWidth,
    fontSize,
    lineHeight,
    padTop,
    padBottom,
    wrappedLinesBySource,
    contentHeight,
  }
}

function estimateCodeContentHeight(codeText, contentWidth) {
  return getCodeLayoutMetrics(codeText, contentWidth).contentHeight
}

function buildCodeCanvasDimensions(aspect, codeText, padding, frameStyle) {
  const base = buildCanvasDimensions(aspect, null)
  const titlebarHeight = getWindowTitlebarHeight(frameStyle)
  const contentWidth = Math.max(320, base.width - padding * 2)
  const contentHeight = estimateCodeContentHeight(codeText, contentWidth)
  const requiredHeight = Math.ceil(contentHeight + titlebarHeight + padding * 2)

  return {
    width: base.width,
    height: Math.min(CODE_CANVAS_MAX_HEIGHT, Math.max(base.height, requiredHeight)),
  }
}

function buildCodeMediaLayout(canvasWidth, canvasHeight, codeText, padding, cornerRadius, frameStyle) {
  const titlebarHeight = getWindowTitlebarHeight(frameStyle)
  const frameRadius = Math.min(cornerRadius + (frameStyle === 'none' ? 0 : 8), (canvasWidth - padding * 2) / 2)
  const maxContentWidth = Math.max(320, canvasWidth - padding * 2)
  const codeMetrics = getCodeLayoutMetrics(codeText, maxContentWidth)
  const contentHeight = codeMetrics.contentHeight
  const frameWidth = maxContentWidth
  const frameHeight = contentHeight + titlebarHeight
  const frameX = (canvasWidth - frameWidth) / 2
  const frameY = padding

  return {
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    frameRadius,
    titlebarHeight,
    mediaX: frameX,
    mediaY: frameY + titlebarHeight,
    mediaWidth: frameWidth,
    mediaHeight: contentHeight,
    mediaRadius: Math.min(cornerRadius, frameWidth / 2, contentHeight / 2),
    codeMetrics,
  }
}

function getWindowTitlebarHeight(frameStyle) {
  if (frameStyle === 'macos') return 52
  if (frameStyle === 'windows') return 50
  return 0
}

function buildMediaLayout(canvasWidth, canvasHeight, mediaRatio, padding, cornerRadius, frameStyle) {
  const safeWidth = Math.max(1, canvasWidth - padding * 2)
  const safeHeight = Math.max(1, canvasHeight - padding * 2)
  const titlebarHeight = getWindowTitlebarHeight(frameStyle)
  const contentMaxHeight = Math.max(1, safeHeight - titlebarHeight)
  const contentRatio = safeWidth / contentMaxHeight

  let contentWidth = safeWidth
  let contentHeight = contentMaxHeight
  if (mediaRatio > contentRatio) contentHeight = safeWidth / mediaRatio
  else contentWidth = contentMaxHeight * mediaRatio

  const frameWidth = contentWidth
  const frameHeight = contentHeight + titlebarHeight
  const frameX = (canvasWidth - frameWidth) / 2
  const frameY = (canvasHeight - frameHeight) / 2
  const frameRadius = Math.min(cornerRadius + (frameStyle === 'none' ? 0 : 8), frameWidth / 2, frameHeight / 2)

  return {
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    frameRadius,
    titlebarHeight,
    mediaX: frameX,
    mediaY: frameY + titlebarHeight,
    mediaWidth: contentWidth,
    mediaHeight: contentHeight,
    mediaRadius: Math.min(cornerRadius, contentWidth / 2, contentHeight / 2),
  }
}

function drawWindowChromeToCanvas(ctx, layout, frameStyle, shadowIntensity, colorTheme = 'dark') {
  const { frameX, frameY, frameWidth, frameHeight, frameRadius, titlebarHeight } = layout
  const isDark = colorTheme === 'dark'

  ctx.save()
  ctx.shadowColor = `rgba(0, 0, 0, ${Math.max(0, shadowIntensity / 150)})`
  ctx.shadowBlur = shadowIntensity * 1.15
  ctx.shadowOffsetY = shadowIntensity * 0.34
  ctx.beginPath()
  ctx.roundRect(frameX, frameY, frameWidth, frameHeight, frameRadius)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)'
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(frameX, frameY, frameWidth, frameHeight, frameRadius)
  ctx.clip()

  if (frameStyle === 'macos') {
    const bodyTop = isDark ? '#1e2127' : '#f7f8fb'
    const bodyBottom = isDark ? '#171a20' : '#eef1f5'
    const titleTop = isDark ? '#2a2f37' : '#f1f2f5'
    const titleBottom = isDark ? '#232833' : '#e3e6eb'
    const bodyGradient = ctx.createLinearGradient(frameX, frameY + titlebarHeight, frameX, frameY + frameHeight)
    bodyGradient.addColorStop(0, bodyTop)
    bodyGradient.addColorStop(1, bodyBottom)
    ctx.fillStyle = bodyGradient
    ctx.fillRect(frameX, frameY + titlebarHeight, frameWidth, frameHeight - titlebarHeight)

    const titleGradient = ctx.createLinearGradient(frameX, frameY, frameX, frameY + titlebarHeight)
    titleGradient.addColorStop(0, titleTop)
    titleGradient.addColorStop(1, titleBottom)
    ctx.fillStyle = titleGradient
    ctx.fillRect(frameX, frameY, frameWidth, titlebarHeight)

    const dotRadius = Math.max(5, titlebarHeight * 0.15)
    const dotY = frameY + titlebarHeight / 2
    const dotX = frameX + Math.max(16, titlebarHeight * 0.5)
    const dotGap = dotRadius * 2.9
    ;['#ff605c', '#ffbd44', '#00ca4e'].forEach((color, idx) => {
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.arc(dotX + idx * dotGap, dotY, dotRadius, 0, Math.PI * 2)
      ctx.fill()
    })
  } else {
    const bodyTop = isDark ? '#171d28' : '#f4f6fa'
    const bodyBottom = isDark ? '#131923' : '#e9edf4'
    const titleTop = isDark ? '#273247' : '#e8edf6'
    const titleBottom = isDark ? '#1e283a' : '#dbe3f0'
    const bodyGradient = ctx.createLinearGradient(frameX, frameY + titlebarHeight, frameX, frameY + frameHeight)
    bodyGradient.addColorStop(0, bodyTop)
    bodyGradient.addColorStop(1, bodyBottom)
    ctx.fillStyle = bodyGradient
    ctx.fillRect(frameX, frameY + titlebarHeight, frameWidth, frameHeight - titlebarHeight)

    const titleGradient = ctx.createLinearGradient(frameX, frameY, frameX, frameY + titlebarHeight)
    titleGradient.addColorStop(0, titleTop)
    titleGradient.addColorStop(1, titleBottom)
    ctx.fillStyle = titleGradient
    ctx.fillRect(frameX, frameY, frameWidth, titlebarHeight)

    const buttonSize = Math.max(10, titlebarHeight * 0.22)
    const buttonGap = Math.max(8, buttonSize * 0.35)
    const baseX = frameX + frameWidth - Math.max(16, titlebarHeight * 0.55)
    const centerY = frameY + titlebarHeight / 2
    ctx.strokeStyle = isDark ? '#d4dded' : '#4b5567'
    ctx.lineWidth = Math.max(1.4, buttonSize * 0.13)

    ctx.beginPath()
    ctx.moveTo(baseX - buttonSize * 2 - buttonGap * 2, centerY + buttonSize * 0.25)
    ctx.lineTo(baseX - buttonSize * 2 - buttonGap * 0.6, centerY + buttonSize * 0.25)
    ctx.stroke()

    ctx.strokeRect(baseX - buttonSize - buttonGap, centerY - buttonSize * 0.42, buttonSize * 0.9, buttonSize * 0.8)

    ctx.beginPath()
    ctx.moveTo(baseX, centerY - buttonSize * 0.42)
    ctx.lineTo(baseX + buttonSize * 0.8, centerY + buttonSize * 0.42)
    ctx.moveTo(baseX + buttonSize * 0.8, centerY - buttonSize * 0.42)
    ctx.lineTo(baseX, centerY + buttonSize * 0.42)
    ctx.stroke()
  }

  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(25, 28, 33, 0.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(frameX, frameY + titlebarHeight + 0.5)
  ctx.lineTo(frameX + frameWidth, frameY + titlebarHeight + 0.5)
  ctx.stroke()

  ctx.restore()
}

function wrapTextLine(ctx, line, maxWidth) {
  if (!line) return ['']
  if (ctx.measureText(line).width <= maxWidth) return [line]

  const chunks = []
  let current = ''

  for (const char of line) {
    const next = current + char
    if (ctx.measureText(next).width <= maxWidth) {
      current = next
      continue
    }

    if (current) chunks.push(current)
    current = char
  }

  if (current) chunks.push(current)
  return chunks.length ? chunks : ['']
}

function drawCodeContentToCanvas(ctx, x, y, width, height, codeText, options = {}) {
  const { colorTheme = 'dark', metrics: providedMetrics = null } = options
  const isDark = colorTheme === 'dark'
  const panelBg = isDark ? '#06080d' : '#f8fafc'
  const gutterBg = isDark ? '#0d121a' : '#ecf2ff'
  const textColor = isDark ? '#e6edf7' : '#1f2937'
  const lineColor = isDark ? '#8ea1bf' : '#52627a'
  const borderColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(18, 32, 53, 0.12)'

  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, width, height)
  ctx.clip()

  if (isDark) {
    const codeGradient = ctx.createLinearGradient(x, y, x + width, y)
    codeGradient.addColorStop(0, '#06080d')
    codeGradient.addColorStop(0.5, '#050912')
    codeGradient.addColorStop(1, '#06080d')
    ctx.fillStyle = codeGradient
  } else {
    ctx.fillStyle = panelBg
  }
  ctx.fillRect(x, y, width, height)

  const metrics = providedMetrics || getCodeLayoutMetrics(codeText, width)
  const gutterWidth = metrics.gutterWidth
  ctx.fillStyle = gutterBg
  ctx.fillRect(x, y, gutterWidth, height)

  ctx.strokeStyle = borderColor
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(x + gutterWidth + 0.5, y)
  ctx.lineTo(x + gutterWidth + 0.5, y + height)
  ctx.stroke()

  const fontSize = metrics.fontSize
  const lineHeight = metrics.lineHeight
  const padTop = metrics.padTop
  const textX = x + gutterWidth + 14
  const wrappedLinesBySource = metrics.wrappedLinesBySource

  ctx.font = `${fontSize}px SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
  ctx.textBaseline = 'alphabetic'

  let yCursor = y + padTop + fontSize
  let lineNumber = 1

  for (const wrapped of wrappedLinesBySource) {
    let firstChunk = true

    for (const chunk of wrapped) {
      if (firstChunk) {
        ctx.fillStyle = lineColor
        ctx.textAlign = 'right'
        ctx.fillText(String(lineNumber), x + gutterWidth - 10, yCursor)
      }

      ctx.fillStyle = textColor
      ctx.textAlign = 'left'
      ctx.fillText(chunk, textX, yCursor)
      yCursor += lineHeight
      firstChunk = false
    }

    lineNumber += 1
  }

  ctx.restore()
}

function App() {
  const fileInputRef = useRef(null)
  const backgroundInputRef = useRef(null)
  const uploadObjectUrlRef = useRef('')
  const backgroundObjectUrlsRef = useRef([])
  const themeTransitionTimerRef = useRef(null)

  const [uploadedSrc, setUploadedSrc] = useState('')
  const [uploadedType, setUploadedType] = useState('none')
  const [uploadedMeta, setUploadedMeta] = useState(null)
  const [editorMode, setEditorMode] = useState('media')
  const [codeSnippet, setCodeSnippet] = useState(DEFAULT_CODE_SNIPPET)
  const [isDragging, setIsDragging] = useState(false)
  const [padding, setPadding] = useState(48)
  const [cornerRadius, setCornerRadius] = useState(12)
  const [shadowIntensity, setShadowIntensity] = useState(80)
  const [glassBorderEnabled, setGlassBorderEnabled] = useState(true)
  const [glassBorderStrength, setGlassBorderStrength] = useState(62)
  const [windowFrameStyle, setWindowFrameStyle] = useState('macos')
  const [aspectRatio, setAspectRatio] = useState('auto')
  const [selectedBg, setSelectedBg] = useState(() => {
    const firstLocal = BACKGROUND_LIBRARY[0]?.url
    if (firstLocal) return { type: 'photo', value: firstLocal }
    return { type: 'solid', value: '#0a0a0a' }
  })
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiOpen, setAiOpen] = useState(false)
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false)
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isCopying, setIsCopying] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [customBackgrounds, setCustomBackgrounds] = useState([])
  const [failedLocal, setFailedLocal] = useState([])
  const [unsplashNonce, setUnsplashNonce] = useState(0)
  const [failedUnsplash, setFailedUnsplash] = useState([])
  const [theme, setTheme] = useState(getInitialTheme)
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false)
  const [themeTransitionTarget, setThemeTransitionTarget] = useState(theme)

  useEffect(() => {
    return () => {
      if (uploadObjectUrlRef.current) URL.revokeObjectURL(uploadObjectUrlRef.current)
      backgroundObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
      if (themeTransitionTimerRef.current) window.clearTimeout(themeTransitionTimerRef.current)
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const libraryPresets = BACKGROUND_LIBRARY
  const unsplashPresets = useMemo(
    () =>
      UNSPLASH_PRESET_BASE.map((item) => ({
        label: item.label,
        key: item.label.toLowerCase().replace(/\s+/g, '-'),
        url: item.urls[unsplashNonce % item.urls.length],
      })),
    [unsplashNonce],
  )

  const previewCanvasDimensions = useMemo(
    () =>
      editorMode === 'code'
        ? buildCodeCanvasDimensions(aspectRatio, codeSnippet, padding, windowFrameStyle)
        : buildCanvasDimensions(aspectRatio, uploadedMeta),
    [aspectRatio, uploadedMeta, editorMode, codeSnippet, padding, windowFrameStyle],
  )
  const previewRatio = previewCanvasDimensions.width / previewCanvasDimensions.height
  const previewMediaRatio = uploadedMeta?.width && uploadedMeta?.height ? uploadedMeta.width / uploadedMeta.height : null
  const previewLayout = useMemo(() => {
    if (editorMode === 'code') {
      return buildCodeMediaLayout(
        previewCanvasDimensions.width,
        previewCanvasDimensions.height,
        codeSnippet,
        padding,
        cornerRadius,
        windowFrameStyle,
      )
    }

    if (!previewMediaRatio) return null
    return buildMediaLayout(
      previewCanvasDimensions.width,
      previewCanvasDimensions.height,
      previewMediaRatio,
      padding,
      cornerRadius,
      windowFrameStyle,
    )
  }, [editorMode, previewMediaRatio, previewCanvasDimensions, codeSnippet, padding, cornerRadius, windowFrameStyle])

  const previewCodeSurfaceSrc = useMemo(() => {
    if (editorMode !== 'code' || !previewLayout) return ''

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(previewLayout.mediaWidth))
    canvas.height = Math.max(1, Math.round(previewLayout.mediaHeight))
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    drawCodeContentToCanvas(ctx, 0, 0, canvas.width, canvas.height, codeSnippet, {
      colorTheme: theme,
      metrics: previewLayout.codeMetrics,
    })

    return canvas.toDataURL('image/png')
  }, [editorMode, previewLayout, codeSnippet, theme])

  const previewBackgroundStyle = useMemo(() => {
    if (selectedBg.type === 'solid') return { backgroundColor: selectedBg.value }
    if (selectedBg.type === 'gradient') return { backgroundImage: gradientToCss(selectedBg.value) }

    return {
      backgroundImage: `url("${selectedBg.value}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }, [selectedBg])

  const previewBorderStyle = glassBorderEnabled
    ? `${(1 + glassBorderStrength / 35).toFixed(2)}px solid rgba(255,255,255,${Math.min(0.18 + glassBorderStrength / 320, 0.7)})`
    : 'none'

  const previewShadowStyle = `0 ${Math.round(shadowIntensity * 0.35)}px ${Math.round(shadowIntensity * 0.95)}px rgba(0,0,0,${Math.max(0, shadowIntensity / 150)})${
    glassBorderEnabled ? `, inset 0 1px 0 rgba(255,255,255,${Math.min(0.09 + glassBorderStrength / 500, 0.35)})` : ''
  }`

  const hasRenderablePreview = editorMode === 'code' || Boolean(uploadedSrc)

  const onPickFile = (file) => {
    if (!file || (!file.type.startsWith('image/') && !file.type.startsWith('video/'))) {
      setStatusMessage('Please upload an image or video file.')
      return
    }

    const objectUrl = URL.createObjectURL(file)

    const finalizeUpload = (type, meta, message) => {
      if (uploadObjectUrlRef.current) URL.revokeObjectURL(uploadObjectUrlRef.current)
      uploadObjectUrlRef.current = objectUrl
      setUploadedType(type)
      setUploadedSrc(objectUrl)
      setUploadedMeta(meta)
      setStatusMessage(message)
    }

    if (file.type.startsWith('image/')) {
      loadImage(objectUrl, false)
        .then((image) => {
          finalizeUpload('image', { width: image.width, height: image.height }, 'Image uploaded.')
        })
        .catch(() => {
          URL.revokeObjectURL(objectUrl)
          setStatusMessage('Could not read this image.')
        })
      return
    }

    loadVideoMeta(objectUrl)
      .then((meta) => {
        finalizeUpload('video', meta, 'Video uploaded.')
      })
      .catch(() => {
        URL.revokeObjectURL(objectUrl)
        setStatusMessage('Could not read this video.')
      })
  }

  const onFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) onPickFile(file)
  }

  useEffect(() => {
    const onPaste = (event) => {
      if (editorMode !== 'media') return

      const items = event.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (!item.type.startsWith('image/')) continue
        const file = item.getAsFile()
        if (!file) continue

        event.preventDefault()
        onPickFile(file)
        setStatusMessage('Image pasted from clipboard.')
        return
      }
    }

    window.addEventListener('paste', onPaste)
    return () => {
      window.removeEventListener('paste', onPaste)
    }
  }, [editorMode, onPickFile])

  const onBackgroundFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const hasImageMime = file.type.toLowerCase().startsWith('image/')
    const hasImageExtension = /\.(png|jpe?g|webp|gif|bmp|avif)$/i.test(file.name)

    if (!hasImageMime && !hasImageExtension) {
      setStatusMessage('Please upload an image file for background.')
      event.target.value = ''
      return
    }

    const objectUrl = URL.createObjectURL(file)
    const key = `uploaded-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    backgroundObjectUrlsRef.current.push(objectUrl)
    setCustomBackgrounds((prev) => [{ key, label: file.name, url: objectUrl }, ...prev].slice(0, 15))
    setSelectedBg({ type: 'photo', value: objectUrl })
    setStatusMessage('Background image uploaded.')
    event.target.value = ''
  }

  const onDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    if (editorMode !== 'media') return
    const file = event.dataTransfer.files?.[0]
    if (file) onPickFile(file)
  }

  const onGenerateBackground = async (prompt) => {
    const normalized = prompt.trim()
    if (!normalized) return

    setIsGenerating(true)
    setStatusMessage('Generating image...')

    try {
      const url = await resolveFreeGeneratedImageUrl(normalized)
      setSelectedBg({ type: 'photo', value: url })
      setStatusMessage('AI background generated.')
      setAiOpen(false)
    } catch {
      setStatusMessage('Real AI generation is rate-limited right now. Please retry in a moment.')
    } finally {
      setIsGenerating(false)
    }
  }

  const onSelectPhotoBackground = async (url, label = 'Background') => {
    try {
      await loadBackgroundImage(url)
      setSelectedBg({ type: 'photo', value: url })
    } catch {
      setStatusMessage(`Could not load ${label}. Try another image.`)
    }
  }

  const drawBackgroundToCanvas = async (ctx, width, height) => {
    if (selectedBg.type === 'solid') {
      ctx.fillStyle = selectedBg.value
      ctx.fillRect(0, 0, width, height)
      return null
    }

    if (selectedBg.type === 'gradient') {
      const angle = (selectedBg.value.angle * Math.PI) / 180
      const half = Math.hypot(width, height) / 2
      const cx = width / 2
      const cy = height / 2
      const x1 = cx - Math.cos(angle) * half
      const y1 = cy - Math.sin(angle) * half
      const x2 = cx + Math.cos(angle) * half
      const y2 = cy + Math.sin(angle) * half

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
      const step = 1 / (selectedBg.value.stops.length - 1)
      selectedBg.value.stops.forEach((stopColor, index) => {
        gradient.addColorStop(index * step, stopColor)
      })
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      return null
    }

    const backgroundImage = await loadBackgroundImage(selectedBg.value)
    drawImageCover(ctx, backgroundImage, width, height)
    return backgroundImage
  }

  const drawGlassBorderToCanvas = (ctx, x, y, width, height, radius) => {
    if (!glassBorderEnabled) return

    const alpha = 0.14 + glassBorderStrength / 320
    const outerLine = 1 + glassBorderStrength / 35

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(x, y, width, height, radius)
    ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.7)})`
    ctx.lineWidth = outerLine
    ctx.stroke()

    if (width > 6 && height > 6) {
      ctx.beginPath()
      ctx.roundRect(x + 1.5, y + 1.5, width - 3, height - 3, Math.max(0, radius - 1))
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(alpha * 0.65, 0.45)})`
      ctx.lineWidth = 1
      ctx.stroke()
    }
    ctx.restore()
  }

  const renderCodeCompositeBlob = async () => {
    const { width, height } = buildCodeCanvasDimensions(aspectRatio, codeSnippet, padding, windowFrameStyle)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported.')

    await drawBackgroundToCanvas(ctx, width, height)
    const layout = buildCodeMediaLayout(width, height, codeSnippet, padding, cornerRadius, windowFrameStyle)

    if (windowFrameStyle === 'none') {
      ctx.save()
      ctx.shadowColor = `rgba(0, 0, 0, ${Math.max(0, shadowIntensity / 150)})`
      ctx.shadowBlur = shadowIntensity * 1.1
      ctx.shadowOffsetY = shadowIntensity * 0.28
      ctx.beginPath()
      ctx.roundRect(layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight, layout.mediaRadius)
      ctx.fillStyle = 'rgba(0,0,0,0.01)'
      ctx.fill()
      ctx.restore()

      drawCodeContentToCanvas(ctx, layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight, codeSnippet, {
        colorTheme: theme,
        metrics: layout.codeMetrics,
      })
      drawGlassBorderToCanvas(ctx, layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight, layout.mediaRadius)
    } else {
      drawWindowChromeToCanvas(ctx, layout, windowFrameStyle, shadowIntensity, theme)
      drawCodeContentToCanvas(ctx, layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight, codeSnippet, {
        colorTheme: theme,
        metrics: layout.codeMetrics,
      })
      drawGlassBorderToCanvas(ctx, layout.frameX, layout.frameY, layout.frameWidth, layout.frameHeight, layout.frameRadius)
    }

    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Could not create output image.'))
      }, 'image/png')
    })
  }

  const renderCompositeBlob = async () => {
    if (editorMode === 'code') {
      return await renderCodeCompositeBlob()
    }

    if (!uploadedSrc || !uploadedMeta) throw new Error('Upload an image first.')
    if (uploadedType !== 'image') throw new Error('Copy is available for image uploads only.')

    const { width, height } = buildCanvasDimensions(aspectRatio, uploadedMeta)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported.')

    await drawBackgroundToCanvas(ctx, width, height)

    const uploadedImage = await loadImage(uploadedSrc, false)
    const imageRatio = uploadedImage.width / uploadedImage.height
    const layout = buildMediaLayout(width, height, imageRatio, padding, cornerRadius, windowFrameStyle)

    if (windowFrameStyle === 'none') {
      ctx.save()
      ctx.shadowColor = `rgba(0, 0, 0, ${Math.max(0, shadowIntensity / 150)})`
      ctx.shadowBlur = shadowIntensity * 1.1
      ctx.shadowOffsetY = shadowIntensity * 0.28
      ctx.beginPath()
      ctx.roundRect(layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight, layout.mediaRadius)
      ctx.fillStyle = 'rgba(0,0,0,0.01)'
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight, layout.mediaRadius)
      ctx.clip()
      ctx.drawImage(uploadedImage, layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight)
      ctx.restore()

      drawGlassBorderToCanvas(ctx, layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight, layout.mediaRadius)
    } else {
      drawWindowChromeToCanvas(ctx, layout, windowFrameStyle, shadowIntensity, theme)

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(layout.frameX, layout.frameY, layout.frameWidth, layout.frameHeight, layout.frameRadius)
      ctx.clip()
      ctx.drawImage(uploadedImage, layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight)
      ctx.restore()

      drawGlassBorderToCanvas(ctx, layout.frameX, layout.frameY, layout.frameWidth, layout.frameHeight, layout.frameRadius)
    }

    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Could not create output image.'))
      }, 'image/png')
    })
  }

  const renderCompositeVideoBlob = async () => {
    if (!uploadedSrc || !uploadedMeta || uploadedType !== 'video') throw new Error('Upload a video first.')
    if (!window.MediaRecorder) throw new Error('Video export is not supported in this browser.')

    const mimeType = selectRecorderMimeType()
    if (!mimeType) throw new Error('No supported video codec found for export.')

    const { width, height } = buildCanvasDimensions(aspectRatio, uploadedMeta)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported.')

    const workingVideo = document.createElement('video')
    workingVideo.src = uploadedSrc
    workingVideo.preload = 'auto'
    workingVideo.muted = true
    workingVideo.playsInline = true

    await new Promise((resolve, reject) => {
      workingVideo.onloadeddata = resolve
      workingVideo.onerror = () => reject(new Error('Could not load uploaded video for export.'))
    })

    const videoRatio = workingVideo.videoWidth / workingVideo.videoHeight
    const layout = buildMediaLayout(width, height, videoRatio, padding, cornerRadius, windowFrameStyle)

    let bgImage = null
    if (selectedBg.type === 'photo') bgImage = await loadBackgroundImage(selectedBg.value)

    const drawFrame = () => {
      if (selectedBg.type === 'solid') {
        ctx.fillStyle = selectedBg.value
        ctx.fillRect(0, 0, width, height)
      } else if (selectedBg.type === 'gradient') {
        const angle = (selectedBg.value.angle * Math.PI) / 180
        const half = Math.hypot(width, height) / 2
        const cx = width / 2
        const cy = height / 2
        const x1 = cx - Math.cos(angle) * half
        const y1 = cy - Math.sin(angle) * half
        const x2 = cx + Math.cos(angle) * half
        const y2 = cy + Math.sin(angle) * half
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
        const step = 1 / (selectedBg.value.stops.length - 1)
        selectedBg.value.stops.forEach((stopColor, index) => {
          gradient.addColorStop(index * step, stopColor)
        })
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      } else if (bgImage) {
        drawImageCover(ctx, bgImage, width, height)
      }

      if (windowFrameStyle === 'none') {
        ctx.save()
        ctx.shadowColor = `rgba(0, 0, 0, ${Math.max(0, shadowIntensity / 150)})`
        ctx.shadowBlur = shadowIntensity * 1.1
        ctx.shadowOffsetY = shadowIntensity * 0.28
        ctx.beginPath()
        ctx.roundRect(layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight, layout.mediaRadius)
        ctx.fillStyle = 'rgba(0,0,0,0.01)'
        ctx.fill()
        ctx.restore()

        ctx.save()
        ctx.beginPath()
        ctx.roundRect(layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight, layout.mediaRadius)
        ctx.clip()
        ctx.drawImage(workingVideo, layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight)
        ctx.restore()

        drawGlassBorderToCanvas(ctx, layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight, layout.mediaRadius)
      } else {
        drawWindowChromeToCanvas(ctx, layout, windowFrameStyle, shadowIntensity, theme)

        ctx.save()
        ctx.beginPath()
        ctx.roundRect(layout.frameX, layout.frameY, layout.frameWidth, layout.frameHeight, layout.frameRadius)
        ctx.clip()
        ctx.drawImage(workingVideo, layout.mediaX, layout.mediaY, layout.mediaWidth, layout.mediaHeight)
        ctx.restore()

        drawGlassBorderToCanvas(ctx, layout.frameX, layout.frameY, layout.frameWidth, layout.frameHeight, layout.frameRadius)
      }
    }

    const stream = canvas.captureStream(30)
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 })
    const chunks = []

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) chunks.push(event.data)
    }

    const recordingFinished = new Promise((resolve, reject) => {
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        const outputType = mimeType.split(';')[0] || 'video/webm'
        resolve(new Blob(chunks, { type: outputType }))
      }

      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop())
        reject(new Error('Failed while recording video export.'))
      }
    })

    await new Promise((resolve, reject) => {
      let rafId = 0

      const stopRecording = () => {
        if (rafId) cancelAnimationFrame(rafId)
        if (recorder.state !== 'inactive') recorder.stop()
        resolve()
      }

      const paint = () => {
        if (workingVideo.ended) {
          stopRecording()
          return
        }
        drawFrame()
        rafId = requestAnimationFrame(paint)
      }

      workingVideo.onended = stopRecording
      workingVideo.onerror = () => {
        if (rafId) cancelAnimationFrame(rafId)
        if (recorder.state !== 'inactive') recorder.stop()
        reject(new Error('Video playback failed during export.'))
      }

      try {
        recorder.start(100)
        workingVideo.currentTime = 0
        workingVideo.play().then(() => {
          paint()
        })
      } catch {
        reject(new Error('Could not start video export.'))
      }
    })

    return await recordingFinished
  }

  const handleCopy = async () => {
    setIsCopying(true)
    setStatusMessage('')

    try {
      const blob = await renderCompositeBlob()
      if (!window.ClipboardItem || !navigator.clipboard) {
        throw new Error('Clipboard API is not available in this browser.')
      }
      await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })])
      setStatusMessage('Copied PNG to clipboard.')
    } catch (error) {
      setStatusMessage(error.message || 'Copy failed.')
    } finally {
      setIsCopying(false)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    setStatusMessage('')

    try {
      const shouldExportVideo = editorMode === 'media' && uploadedType === 'video'
      const blob = shouldExportVideo ? await renderCompositeVideoBlob() : await renderCompositeBlob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      const videoMeta = shouldExportVideo ? getVideoDownloadMeta(blob) : null
      anchor.download = shouldExportVideo ? videoMeta.filename : 'framedrop.png'
      anchor.click()
      URL.revokeObjectURL(url)
      setStatusMessage(shouldExportVideo ? `Downloaded ${videoMeta.label}.` : 'Downloaded framedrop.png.')
    } catch (error) {
      setStatusMessage(error.message || 'Download failed.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    const shareUrl =
      'https://x.com/intent/tweet?text=Made+with+FrameDrop+%F0%9F%96%A4&url=https://frame-drop-23.vercel.app'

    if (editorMode === 'media' && (!uploadedSrc || uploadedType !== 'image')) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
      setStatusMessage('Opened X composer. Upload an image to include it in your post.')
      return
    }

    try {
      const blob = await renderCompositeBlob()
      if (!window.ClipboardItem || !navigator.clipboard) {
        throw new Error('Clipboard API not available.')
      }
      await navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })])
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
      setStatusMessage('Opened X composer. PNG copied, press Cmd+V in the post box to attach image.')
    } catch {
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
      setStatusMessage('Opened X composer. Could not auto-copy image, use Download and attach manually.')
    }
  }

  const handleRemoveUpload = () => {
    if (uploadObjectUrlRef.current) {
      URL.revokeObjectURL(uploadObjectUrlRef.current)
      uploadObjectUrlRef.current = ''
    }

    setUploadedSrc('')
    setUploadedType('none')
    setUploadedMeta(null)
    setStatusMessage('Upload removed. Add another file.')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setThemeTransitionTarget(nextTheme)
    setIsThemeTransitioning(true)
    setTheme(nextTheme)

    if (themeTransitionTimerRef.current) {
      window.clearTimeout(themeTransitionTimerRef.current)
    }

    themeTransitionTimerRef.current = window.setTimeout(() => {
      setIsThemeTransitioning(false)
    }, 520)
  }

  const panelLeft = (
    <>
      <div className="panel-header">
        <h2>Editor</h2>
        <p>Controls</p>
      </div>

      <div className="panel-section">
        <p className="section-title">Share Mode</p>
        <div className="chip-grid">
          {EDITOR_MODES.map((mode) => (
            <button
              key={mode.value}
              type="button"
              className={`chip ${editorMode === mode.value ? 'chip-active' : ''}`}
              onClick={() => setEditorMode(mode.value)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <p className="section-title">Aspect Ratio</p>
        <div className="chip-grid">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              type="button"
              className={`chip ${aspectRatio === ratio.value ? 'chip-active' : ''}`}
              onClick={() => setAspectRatio(ratio.value)}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <p className="section-title">Canvas Styles</p>

        <label className="slider-wrap">
          <div>
            <span>Padding</span>
            <strong>{padding}px</strong>
          </div>
          <input type="range" min="0" max="100" value={padding} onChange={(event) => setPadding(Number(event.target.value))} />
        </label>

        <label className="slider-wrap">
          <div>
            <span>Corner Radius</span>
            <strong>{cornerRadius}px</strong>
          </div>
          <input type="range" min="0" max="40" value={cornerRadius} onChange={(event) => setCornerRadius(Number(event.target.value))} />
        </label>

        <label className="slider-wrap">
          <div>
            <span>Shadow Intensity</span>
            <strong>{shadowIntensity}</strong>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={shadowIntensity}
            onChange={(event) => setShadowIntensity(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="panel-section">
        <p className="section-title">Frame Effects</p>
        <div className="chip-grid" style={{ marginBottom: '10px' }}>
          {WINDOW_FRAME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`chip ${windowFrameStyle === option.value ? 'chip-active' : ''}`}
              onClick={() => setWindowFrameStyle(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="chip-grid">
          <button
            type="button"
            className={`chip ${glassBorderEnabled ? 'chip-active' : ''}`}
            onClick={() => setGlassBorderEnabled((prev) => !prev)}
          >
            Glass Border
          </button>
        </div>

        {glassBorderEnabled && (
          <label className="slider-wrap" style={{ marginTop: '10px' }}>
            <div>
              <span>Glass Strength</span>
              <strong>{glassBorderStrength}</strong>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={glassBorderStrength}
              onChange={(event) => setGlassBorderStrength(Number(event.target.value))}
            />
          </label>
        )}
      </div>

      {editorMode === 'code' && (
        <div className="panel-section">
          <p className="section-title">Code Snippet</p>
          <textarea
            className="code-editor-input"
            value={codeSnippet}
            onChange={(event) => setCodeSnippet(event.target.value)}
            rows={12}
            spellCheck={false}
            placeholder="Paste your code here..."
          />
          <p className="status-line">Paste, edit, style background, then copy/download as image.</p>
        </div>
      )}
    </>
  )

  const panelRight = (
    <>
      <div className="panel-header">
        <h2>Library</h2>
        <p>Backgrounds</p>
      </div>

      <div className="panel-section">
        <div className="ai-header">
          <p className="section-title">Import Background</p>
        </div>
        <button type="button" className="ghost-btn" style={{ width: '100%' }} onClick={() => backgroundInputRef.current?.click()}>
          Upload Background
        </button>
      </div>

      {customBackgrounds.length > 0 && (
        <div className="panel-section">
          <p className="section-title">Your Uploads</p>
          <div className="swatch-grid scrollable-grid">
            {customBackgrounds.map((item) => {
              const active = selectedBg.type === 'photo' && selectedBg.value === item.url
              return (
                <button
                  key={item.key}
                  type="button"
                  className={`swatch ${active ? 'swatch-active' : ''}`}
                  title={item.label}
                  onClick={() => onSelectPhotoBackground(item.url, item.label)}
                >
                  <img src={item.url} alt={item.label} className="swatch-image" loading="lazy" />
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="panel-section">
        <div className="ai-header">
          <p className="section-title">Local Library</p>
        </div>
        <div className="swatch-grid scrollable-grid">
          {libraryPresets.map((item) => {
            const active = selectedBg.type === 'photo' && selectedBg.value === item.url
            const failed = failedLocal.includes(item.key)

            return (
              <button
                key={item.label}
                type="button"
                className={`swatch ${active ? 'swatch-active' : ''}`}
                title={item.label}
                onClick={() => onSelectPhotoBackground(item.url, item.label)}
              >
                {!failed && (
                  <img
                    src={item.url}
                    alt={`${item.label} preset`}
                    className="swatch-image"
                    loading="lazy"
                    onError={() => {
                      setFailedLocal((prev) => (prev.includes(item.key) ? prev : [...prev, item.key]))
                    }}
                  />
                )}
                {failed && <span className="swatch-fallback">{item.label.slice(0, 3).toUpperCase()}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="panel-section">
        <div className="ai-header">
          <p className="section-title">Unsplash</p>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              setFailedUnsplash([])
              setUnsplashNonce((prev) => prev + 1)
            }}
          >
            Refresh
          </button>
        </div>
        <div className="swatch-grid scrollable-grid">
          {unsplashPresets.map((item) => {
            const active = selectedBg.type === 'photo' && selectedBg.value === item.url
            const failed = failedUnsplash.includes(item.key)

            return (
              <button
                key={item.label}
                type="button"
                className={`swatch ${active ? 'swatch-active' : ''}`}
                title={item.label}
                onClick={() => onSelectPhotoBackground(item.url, item.label)}
              >
                {!failed && (
                  <img
                    src={item.url}
                    alt={`${item.label} preset`}
                    className="swatch-image"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setFailedUnsplash((prev) => (prev.includes(item.key) ? prev : [...prev, item.key]))
                    }}
                  />
                )}
                {failed && <span className="swatch-fallback">{item.label.slice(0, 3).toUpperCase()}</span>}
              </button>
            )
          })}
        </div>
      </div>

      <div className="panel-section">
        <p className="section-title">Solid Colors</p>
        <div className="swatch-grid">
          {SOLID_SWATCHES.map((color) => {
            const active = selectedBg.type === 'solid' && selectedBg.value === color
            return (
              <button
                key={color}
                type="button"
                className={`swatch ${active ? 'swatch-active' : ''}`}
                style={{ background: color }}
                title={color}
                onClick={() => setSelectedBg({ type: 'solid', value: color })}
              />
            )
          })}
        </div>
      </div>

      <div className="panel-section">
        <p className="section-title">Gradients</p>
        <div className="swatch-grid">
          {GRADIENT_SWATCHES.map((gradient, idx) => {
            const active =
              selectedBg.type === 'gradient' &&
              selectedBg.value.angle === gradient.angle &&
              selectedBg.value.stops.join(',') === gradient.stops.join(',')

            return (
              <button
                key={`${gradient.angle}-${idx}`}
                type="button"
                className={`swatch ${active ? 'swatch-active' : ''}`}
                style={{ backgroundImage: gradientToCss(gradient) }}
                onClick={() => setSelectedBg({ type: 'gradient', value: gradient })}
              />
            )
          })}
        </div>
      </div>

      <div className="panel-section">
        <div className="ai-header">
          <p className="section-title">Generate with AI</p>
          <button type="button" className="ghost-btn" onClick={() => setAiOpen(true)}>
            Open
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <img src={theme === 'dark' ? darkThemeLogo : lightThemeLogo} alt="FrameDrop logo" className="brand-mark" />
          <div className="brand-text">
            <span>Screenshot Beautifier</span>
          </div>
        </div>

        <div className="mobile-controls">
          <button type="button" className="ghost-btn" onClick={() => setLeftDrawerOpen(true)}>
            Controls
          </button>
          <button type="button" className="ghost-btn" onClick={() => setRightDrawerOpen(true)}>
            Backgrounds
          </button>
        </div>

        <div className="action-group">
          <button
            type="button"
            className="ghost-btn icon-btn theme-toggle"
            onClick={handleThemeToggle}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="theme-icon-stack" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="theme-icon theme-icon-sun">
                <circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="12" cy="5.8" r="0.9" fill="currentColor" />
                <circle cx="12" cy="18.2" r="0.9" fill="currentColor" />
                <circle cx="5.8" cy="12" r="0.9" fill="currentColor" />
                <circle cx="18.2" cy="12" r="0.9" fill="currentColor" />
                <circle cx="7.55" cy="7.55" r="0.9" fill="currentColor" />
                <circle cx="16.45" cy="7.55" r="0.9" fill="currentColor" />
                <circle cx="7.55" cy="16.45" r="0.9" fill="currentColor" />
                <circle cx="16.45" cy="16.45" r="0.9" fill="currentColor" />
              </svg>
              <svg
                viewBox="0 0 24 24"
                className="theme-icon theme-icon-moon"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"
                />
              </svg>
            </span>
          </button>
          <button type="button" className="ghost-btn" onClick={handleShare}>
            Share on X
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={handleCopy}
            disabled={(editorMode === 'media' && uploadedType !== 'image') || isCopying || isDownloading}
          >
            {isCopying ? 'Copying...' : 'Copy'}
          </button>
          <button
            type="button"
            className="solid-btn"
            onClick={handleDownload}
            disabled={(editorMode === 'media' && !uploadedSrc) || isCopying || isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      </header>

      <aside className="left-panel desktop-only">{panelLeft}</aside>
      <aside className="right-panel desktop-only">{panelRight}</aside>

      <main className="canvas-area">
        <div
          className={`canvas-frame ${isDragging ? 'dragging' : ''}`}
          style={{ ...previewBackgroundStyle, aspectRatio: String(previewRatio) }}
          onDragOver={(event) => {
            event.preventDefault()
            if (editorMode !== 'media') return
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => {
            if (editorMode === 'media' && !uploadedSrc) fileInputRef.current?.click()
          }}
        >
          {editorMode === 'media' && uploadedSrc && (
            <button
              type="button"
              className="upload-clear-btn"
              onClick={(event) => {
                event.stopPropagation()
                handleRemoveUpload()
              }}
              aria-label="Remove uploaded media"
              title="Remove"
            >
              x
            </button>
          )}

          {editorMode === 'media' && !uploadedSrc && (
            <div className="upload-empty-state">
              <div className="upload-icon">+</div>
              <h3>Drop your screenshot or video here</h3>
              <p>Drag and drop, or click to upload</p>
              <span>PNG, JPG, WEBP, MP4, MOV, WEBM</span>
            </div>
          )}

          {hasRenderablePreview && previewLayout && windowFrameStyle === 'none' && (
            <div
              className="preview-layer"
              style={{
                left: `${(previewLayout.mediaX / previewCanvasDimensions.width) * 100}%`,
                top: `${(previewLayout.mediaY / previewCanvasDimensions.height) * 100}%`,
                width: `${(previewLayout.mediaWidth / previewCanvasDimensions.width) * 100}%`,
                height: `${(previewLayout.mediaHeight / previewCanvasDimensions.height) * 100}%`,
                borderRadius: `${cornerRadius}px`,
                border: previewBorderStyle,
                boxShadow: previewShadowStyle,
              }}
            >
              {editorMode === 'code' ? (
                <img
                  src={previewCodeSurfaceSrc}
                  alt="Code preview"
                  className="preview-image fitted"
                  draggable={false}
                />
              ) : uploadedType === 'image' ? (
                <img src={uploadedSrc} alt="Uploaded preview" className="preview-image fitted" />
              ) : (
                <video src={uploadedSrc} className="preview-video fitted" autoPlay loop muted controls playsInline />
              )}
            </div>
          )}

          {hasRenderablePreview && previewLayout && windowFrameStyle !== 'none' && (
            <div
              className={`preview-window preview-window-${windowFrameStyle}`}
              style={{
                left: `${(previewLayout.frameX / previewCanvasDimensions.width) * 100}%`,
                top: `${(previewLayout.frameY / previewCanvasDimensions.height) * 100}%`,
                width: `${(previewLayout.frameWidth / previewCanvasDimensions.width) * 100}%`,
                height: `${(previewLayout.frameHeight / previewCanvasDimensions.height) * 100}%`,
                '--titlebar-height': `${(previewLayout.titlebarHeight / previewLayout.frameHeight) * 100}%`,
                '--titlebar-px': `${Math.max(36, previewLayout.titlebarHeight)}px`,
                '--window-radius': `${Math.min(cornerRadius + 8, 36)}px`,
                border: previewBorderStyle,
                boxShadow: previewShadowStyle,
              }}
            >
              <div className={`preview-window-titlebar ${windowFrameStyle === 'macos' ? 'macos' : 'windows'}`}>
                {windowFrameStyle === 'macos' ? (
                  <div className="window-controls-macos" aria-hidden="true">
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                ) : (
                  <div className="window-controls-windows" aria-hidden="true">
                    <span className="minimize" />
                    <span className="maximize" />
                    <span className="close" />
                  </div>
                )}
              </div>

              <div className="preview-window-content">
                {editorMode === 'code' ? (
                  <img
                    src={previewCodeSurfaceSrc}
                    alt="Code preview"
                    className="preview-image framed"
                    draggable={false}
                  />
                ) : uploadedType === 'image' ? (
                  <img src={uploadedSrc} alt="Uploaded preview" className="preview-image framed" />
                ) : (
                  <video src={uploadedSrc} className="preview-video framed" autoPlay loop muted controls playsInline />
                )}
              </div>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*,video/*" className="sr-only" onChange={onFileChange} />
          <input ref={backgroundInputRef} type="file" accept="image/*" className="sr-only" onChange={onBackgroundFileChange} />
        </div>
        {statusMessage && <p className="status-line">{statusMessage}</p>}
      </main>

      <div
        className={`drawer-overlay ${leftDrawerOpen || rightDrawerOpen || aiOpen ? 'open' : ''}`}
        onClick={() => {
          setLeftDrawerOpen(false)
          setRightDrawerOpen(false)
          setAiOpen(false)
        }}
      />

      <aside className={`mobile-drawer left ${leftDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-top">
          <h2>Controls</h2>
          <button type="button" className="ghost-btn" onClick={() => setLeftDrawerOpen(false)}>
            Close
          </button>
        </div>
        {panelLeft}
      </aside>

      <aside className={`mobile-drawer right ${rightDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-top">
          <h2>Backgrounds</h2>
          <button type="button" className="ghost-btn" onClick={() => setRightDrawerOpen(false)}>
            Close
          </button>
        </div>
        {panelRight}
      </aside>

      <aside className={`ai-drawer ${aiOpen ? 'open' : ''}`}>
        <div className="drawer-top">
          <h2>AI Background Generator</h2>
          <button type="button" className="ghost-btn" onClick={() => setAiOpen(false)}>
            Close
          </button>
        </div>

        <p className="ai-helper">Prompt chips</p>
        <div className="chip-list">
          {AI_PROMPT_CHIPS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="chip"
              disabled={isGenerating}
              onClick={() => {
                setAiPrompt(prompt)
                onGenerateBackground(prompt)
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        <label htmlFor="ai-prompt" className="ai-helper">
          Custom prompt
        </label>
        <textarea
          id="ai-prompt"
          value={aiPrompt}
          onChange={(event) => setAiPrompt(event.target.value)}
          placeholder="Describe your dream background..."
          rows={4}
        />

        <button
          type="button"
          className="solid-btn full-width"
          disabled={isGenerating || !aiPrompt.trim()}
          onClick={() => onGenerateBackground(aiPrompt)}
        >
          {isGenerating ? <span className="spinner" aria-label="Loading" /> : 'Generate'}
        </button>
      </aside>

      <div
        className={`theme-transition-layer ${themeTransitionTarget} ${isThemeTransitioning ? 'active' : ''}`}
        aria-hidden="true"
      />
    </div>
  )
}

export default App
