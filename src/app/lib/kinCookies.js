'use client'


const COOKIE_NAME = 'selectedKin'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export const setSelectedKin = (kin) => {
  if (typeof window === 'undefined') return
  if (!kin?.id) throw new Error('setSelectedKin: Missing kin.id')

  const encoded = encodeURIComponent(JSON.stringify(kin))
  document.cookie = `${COOKIE_NAME}=${encoded}; path=/; max-age=${MAX_AGE}; samesite=lax`

  // trigger sync across tabs + reactivity
  localStorage.setItem('kinListener', Date.now())
}

export const getSelectedKin = () => {
  if (typeof window === 'undefined') return null

  const raw = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))

  if (!raw) return null

  try {
    return JSON.parse(decodeURIComponent(raw.split('=')[1]))
  } catch {
    return null
  }
}

export const removeSelectedKin = () => {
  if (typeof window === 'undefined') return

  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; samesite=lax`
  localStorage.setItem('kinListener', Date.now())

  // Cleanup the key entirely afterwards (optional but clean)
  setTimeout(() => {
    localStorage.removeItem('kinListener')
  }, 100)
}
