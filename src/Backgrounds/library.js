const localImages = import.meta.glob('./*.png', { eager: true, import: 'default' })

function toKey(fileName) {
  return fileName
    .toLowerCase()
    .replace(/\.png$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toLabel(fileName) {
  return fileName.replace(/\.png$/i, '')
}

export const BACKGROUND_LIBRARY = Object.entries(localImages)
  .map(([path, url]) => {
    const fileName = path.split('/').pop() || path
    return {
      key: toKey(fileName),
      label: toLabel(fileName),
      url,
    }
  })
  .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }))
