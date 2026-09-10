import { useEffect, useState } from 'react'
import { readDemoAuthed, subscribeDemoAuth, writeDemoAuthed } from '../patterns/authDemo'

/** 演示鉴权：登录页写入 session（预览区有内存兜底），壳层据此跳转 `/login` ↔ `/` */
export function useDemoAuth() {
  const [isAuthed, setIsAuthed] = useState(readDemoAuthed)

  useEffect(() => {
    const refresh = () => setIsAuthed(readDemoAuthed())
    const unsub = subscribeDemoAuth(refresh)
    window.addEventListener('storage', refresh)
    refresh()
    return () => {
      unsub()
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return {
    isAuthed,
    onLogout: () => writeDemoAuthed(false),
  }
}
