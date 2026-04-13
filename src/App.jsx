import { useEffect, useMemo, useRef, useState } from 'react'
import { BACKGROUND_LIBRARY } from './Backgrounds/library.js'

const ASPECT_RATIOS = [
  { label: 'Auto', value: 'auto' },
  { label: '16:9', value: '16:9' },
  { label: '1:1', value: '1:1' },
  { label: '4:3', value: '4:3' },
  { label: '9:16', value: '9:16' },
]

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

function App() {
  const fileInputRef = useRef(null)
  const backgroundInputRef = useRef(null)
  const uploadObjectUrlRef = useRef('')
  const backgroundObjectUrlsRef = useRef([])
  const themeTransitionTimerRef = useRef(null)

  const [uploadedSrc, setUploadedSrc] = useState('')
  const [uploadedType, setUploadedType] = useState('none')
  const [uploadedMeta, setUploadedMeta] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [padding, setPadding] = useState(48)
  const [cornerRadius, setCornerRadius] = useState(12)
  const [shadowIntensity, setShadowIntensity] = useState(80)
  const [glassBorderEnabled, setGlassBorderEnabled] = useState(true)
  const [glassBorderStrength, setGlassBorderStrength] = useState(62)
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

  const previewRatio = aspectValueToRatio(aspectRatio, uploadedMeta)

  const previewBackgroundStyle = useMemo(() => {
    if (selectedBg.type === 'solid') return { backgroundColor: selectedBg.value }
    if (selectedBg.type === 'gradient') return { backgroundImage: gradientToCss(selectedBg.value) }

    return {
      backgroundImage: `url("${selectedBg.value}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }, [selectedBg])

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

  const renderCompositeBlob = async () => {
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
    const safeWidth = Math.max(1, width - padding * 2)
    const safeHeight = Math.max(1, height - padding * 2)
    const imageRatio = uploadedImage.width / uploadedImage.height
    const safeRatio = safeWidth / safeHeight

    let drawWidth = safeWidth
    let drawHeight = safeHeight
    if (imageRatio > safeRatio) drawHeight = safeWidth / imageRatio
    else drawWidth = safeHeight * imageRatio

    const x = (width - drawWidth) / 2
    const y = (height - drawHeight) / 2
    const radius = Math.min(cornerRadius, drawWidth / 2, drawHeight / 2)

    ctx.save()
    ctx.shadowColor = `rgba(0, 0, 0, ${Math.max(0, shadowIntensity / 150)})`
    ctx.shadowBlur = shadowIntensity * 1.1
    ctx.shadowOffsetY = shadowIntensity * 0.28
    ctx.beginPath()
    ctx.roundRect(x, y, drawWidth, drawHeight, radius)
    ctx.fillStyle = 'rgba(0,0,0,0.01)'
    ctx.fill()
    ctx.restore()

    ctx.save()
    ctx.beginPath()
    ctx.roundRect(x, y, drawWidth, drawHeight, radius)
    ctx.clip()
    ctx.drawImage(uploadedImage, x, y, drawWidth, drawHeight)
    ctx.restore()

    drawGlassBorderToCanvas(ctx, x, y, drawWidth, drawHeight, radius)

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

    const safeWidth = Math.max(1, width - padding * 2)
    const safeHeight = Math.max(1, height - padding * 2)
    const videoRatio = workingVideo.videoWidth / workingVideo.videoHeight
    const safeRatio = safeWidth / safeHeight

    let drawWidth = safeWidth
    let drawHeight = safeHeight
    if (videoRatio > safeRatio) drawHeight = safeWidth / videoRatio
    else drawWidth = safeHeight * videoRatio

    const x = (width - drawWidth) / 2
    const y = (height - drawHeight) / 2
    const radius = Math.min(cornerRadius, drawWidth / 2, drawHeight / 2)

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

      ctx.save()
      ctx.shadowColor = `rgba(0, 0, 0, ${Math.max(0, shadowIntensity / 150)})`
      ctx.shadowBlur = shadowIntensity * 1.1
      ctx.shadowOffsetY = shadowIntensity * 0.28
      ctx.beginPath()
      ctx.roundRect(x, y, drawWidth, drawHeight, radius)
      ctx.fillStyle = 'rgba(0,0,0,0.01)'
      ctx.fill()
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(x, y, drawWidth, drawHeight, radius)
      ctx.clip()
      ctx.drawImage(workingVideo, x, y, drawWidth, drawHeight)
      ctx.restore()

      drawGlassBorderToCanvas(ctx, x, y, drawWidth, drawHeight, radius)
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
      const blob = uploadedType === 'video' ? await renderCompositeVideoBlob() : await renderCompositeBlob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      const videoMeta = uploadedType === 'video' ? getVideoDownloadMeta(blob) : null
      anchor.download = uploadedType === 'video' ? videoMeta.filename : 'framedrop.png'
      anchor.click()
      URL.revokeObjectURL(url)
      setStatusMessage(uploadedType === 'video' ? `Downloaded ${videoMeta.label}.` : 'Downloaded framedrop.png.')
    } catch (error) {
      setStatusMessage(error.message || 'Download failed.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    const shareUrl =
      'https://x.com/intent/tweet?text=Made+with+FrameDrop+%F0%9F%96%A4&url=https://frame-drop-23.vercel.app'

    if (!uploadedSrc || uploadedType !== 'image') {
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
          <h1>FrameDrop</h1>
          <span>Screenshot Beautifier</span>
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
            disabled={!uploadedSrc || uploadedType !== 'image' || isCopying || isDownloading}
          >
            {isCopying ? 'Copying...' : 'Copy'}
          </button>
          <button type="button" className="solid-btn" onClick={handleDownload} disabled={!uploadedSrc || isCopying || isDownloading}>
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
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => {
            if (!uploadedSrc) fileInputRef.current?.click()
          }}
        >
          {uploadedSrc && (
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

          {!uploadedSrc && (
            <div className="upload-empty-state">
              <div className="upload-icon">+</div>
              <h3>Drop your screenshot or video here</h3>
              <p>Drag and drop, or click to upload</p>
              <span>PNG, JPG, WEBP, MP4, MOV, WEBM</span>
            </div>
          )}

          {uploadedSrc && uploadedType === 'image' && (
            <img
              src={uploadedSrc}
              alt="Uploaded preview"
              className="preview-image"
              style={{
                borderRadius: `${cornerRadius}px`,
                border: glassBorderEnabled
                  ? `${(1 + glassBorderStrength / 35).toFixed(2)}px solid rgba(255,255,255,${Math.min(
                      0.18 + glassBorderStrength / 320,
                      0.7,
                    )})`
                  : 'none',
                boxShadow: `0 ${Math.round(shadowIntensity * 0.35)}px ${Math.round(shadowIntensity * 0.95)}px rgba(0,0,0,${Math.max(
                  0,
                  shadowIntensity / 150,
                )})${glassBorderEnabled ? `, inset 0 1px 0 rgba(255,255,255,${Math.min(0.09 + glassBorderStrength / 500, 0.35)})` : ''}`,
                margin: `${padding}px`,
                maxWidth: `calc(100% - ${padding * 2}px)`,
                maxHeight: `calc(100% - ${padding * 2}px)`,
              }}
            />
          )}

          {uploadedSrc && uploadedType === 'video' && (
            <video
              src={uploadedSrc}
              className="preview-video"
              autoPlay
              loop
              muted
              controls
              playsInline
              style={{
                borderRadius: `${cornerRadius}px`,
                border: glassBorderEnabled
                  ? `${(1 + glassBorderStrength / 35).toFixed(2)}px solid rgba(255,255,255,${Math.min(
                      0.18 + glassBorderStrength / 320,
                      0.7,
                    )})`
                  : 'none',
                boxShadow: `0 ${Math.round(shadowIntensity * 0.35)}px ${Math.round(shadowIntensity * 0.95)}px rgba(0,0,0,${Math.max(
                  0,
                  shadowIntensity / 150,
                )})${glassBorderEnabled ? `, inset 0 1px 0 rgba(255,255,255,${Math.min(0.09 + glassBorderStrength / 500, 0.35)})` : ''}`,
                margin: `${padding}px`,
                maxWidth: `calc(100% - ${padding * 2}px)`,
                maxHeight: `calc(100% - ${padding * 2}px)`,
              }}
            />
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
